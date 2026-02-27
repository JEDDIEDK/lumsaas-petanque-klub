"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function createOrUpdateEvent(formData: FormData) {
  await requireAdmin();

  const idRaw = String(formData.get("id") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const startTime = String(formData.get("start_time") || "").trim();
  const type = String(formData.get("type") || "").trim();
  const note = String(formData.get("note") || "").trim() || null;

  if (!date || !startTime || !type) return;

  if (idRaw) {
    await db.event.update({
      where: { id: Number(idRaw) },
      data: {
        date,
        startTime,
        type,
        note
      }
    });
  } else {
    await db.event.create({
      data: {
        date,
        startTime,
        type,
        note
      }
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/spilledage");
  revalidatePath("/dashboard/admin");
}

export async function deleteEvent(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await db.event.delete({ where: { id } });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/spilledage");
  revalidatePath("/dashboard/admin");
}
