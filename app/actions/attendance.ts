"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { AttendanceStatus } from "@/lib/types";

export async function saveAttendance(input: {
  eventId: number;
  status: AttendanceStatus;
  comment?: string;
}) {
  const user = await requireAuth();

  await db.attendance.upsert({
    where: { eventId_userId: { eventId: input.eventId, userId: user.id } },
    update: {
      status: input.status,
      comment: input.comment?.trim() || null
    },
    create: {
      eventId: input.eventId,
      userId: user.id,
      status: input.status,
      comment: input.comment?.trim() || null
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/spilledage");
  return { ok: true, message: "Status gemt." };
}
