"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { clearSession, createSession, requireAdmin, requireAuth } from "@/lib/auth";

const toQuery = (params: Record<string, string>) =>
  new URLSearchParams(params).toString();

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    redirect(`/login?${toQuery({ mode: "login", error: "Bruger findes ikke.", email })}`);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    redirect(`/login?${toQuery({ mode: "login", error: "Forkert password.", email })}`);
  }

  await createSession(user.id);
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function registerMember(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim() || null;
  const password = String(formData.get("password") || "");

  if (!name || !email || password.length < 6) {
    redirect(
      `/login?${toQuery({
        mode: "register",
        error: "Udfyld navn, email og password (min 6 tegn).",
        name,
        email,
        phone: phone || ""
      })}`
    );
  }

  const exists = await db.user.findUnique({ where: { email } });
  if (exists) {
    redirect(
      `/login?${toQuery({
        mode: "register",
        error: "Email er allerede oprettet.",
        name,
        email,
        phone: phone || ""
      })}`
    );
  }

  const hash = await bcrypt.hash(password, 10);
  const usersCount = await db.user.count();

  const user = await db.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash: hash,
      role: usersCount === 0 ? "admin" : "member"
    }
  });

  await createSession(user.id);
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  await clearSession();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function changeOwnPassword(formData: FormData) {
  try {
    const user = await requireAuth();
    const currentPassword = String(formData.get("currentPassword") || "");
    const newPassword = String(formData.get("newPassword") || "");

    if (newPassword.length < 6) {
      return { ok: false, message: "Nyt kodeord skal være mindst 6 tegn." };
    }

    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (!dbUser) return { ok: false, message: "Bruger ikke fundet." };

    const valid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
    if (!valid) return { ok: false, message: "Nuværende kodeord er forkert." };

    const hash = await bcrypt.hash(newPassword, 10);
    await db.user.upsert({
      where: { email: dbUser.email },
      update: { passwordHash: hash },
      create: {
        email: dbUser.email,
        name: dbUser.name,
        phone: dbUser.phone,
        passwordHash: hash,
        role: dbUser.role
      }
    });

    return { ok: true, message: "Kodeord opdateret." };
  } catch {
    return { ok: false, message: "Kunne ikke opdatere kodeord." };
  }
}

export async function adminResetPassword(formData: FormData) {
  try {
    await requireAdmin();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const newPassword = String(formData.get("newPassword") || "");

    if (!email || newPassword.length < 6) {
      return { ok: false, message: "Email og nyt kodeord (min. 6 tegn) er påkrævet." };
    }

    const dbUser = await db.user.findUnique({ where: { email } });
    if (!dbUser) return { ok: false, message: "Bruger ikke fundet." };

    const hash = await bcrypt.hash(newPassword, 10);
    await db.user.upsert({
      where: { email },
      update: { passwordHash: hash },
      create: {
        email: dbUser.email,
        name: dbUser.name,
        phone: dbUser.phone,
        passwordHash: hash,
        role: dbUser.role
      }
    });

    revalidatePath("/dashboard/admin");
    return { ok: true, message: `Kodeord nulstillet for ${email}.` };
  } catch {
    return { ok: false, message: "Kunne ikke nulstille kodeord." };
  }
}
