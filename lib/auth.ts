import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const SESSION_COOKIE = "lpk_session";
const SESSION_DAYS = 30;

export const createSession = async (userId: string) => {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await db.session.create({
    data: { token, userId, expiresAt: expiresAt.toISOString() }
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt
  });
};

export const clearSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { token } });
  }
  cookieStore.delete(SESSION_COOKIE);
};

export const getUser = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const session = await db.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session) return null;
    if (session.expiresAt < new Date()) {
      await db.session.delete({ where: { token } }).catch(() => undefined);
      cookieStore.delete(SESSION_COOKIE);
      return null;
    }

    return session.user;
  } catch {
    return null;
  }
};

export const requireAuth = async () => {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
};

export const requireAdmin = async () => {
  const user = await requireAuth();
  if (user.role !== "admin") redirect("/dashboard");
  return user;
};
