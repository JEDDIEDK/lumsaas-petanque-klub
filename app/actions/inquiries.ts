"use server";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Inquiry } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

let lock: Promise<void> = Promise.resolve();

const withLock = async <T>(fn: () => Promise<T>): Promise<T> => {
  const prev = lock;
  let release!: () => void;
  lock = new Promise<void>((res) => {
    release = res;
  });
  await prev;
  try {
    return await fn();
  } finally {
    release();
  }
};

const readInquiries = async (): Promise<Inquiry[]> => {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(INQUIRIES_FILE, "utf8");
    return JSON.parse(raw) as Inquiry[];
  } catch {
    return [];
  }
};

const writeInquiries = async (rows: Inquiry[]) => {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(INQUIRIES_FILE, JSON.stringify(rows, null, 2), "utf8");
};

export async function submitInquiry(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, message: "Udfyld venligst navn, e-mail og besked." };
  }
  if (!email.includes("@")) {
    return { ok: false, message: "Indtast en gyldig e-mailadresse." };
  }

  try {
    await withLock(async () => {
      const rows = await readInquiries();
      const nextId = rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
      rows.push({
        id: nextId,
        name,
        email,
        phone: phoneRaw || null,
        message,
        created_at: new Date().toISOString()
      });
      await writeInquiries(rows);
    });
    return { ok: true, message: "Tak for din forespørgsel. Vi vender tilbage snarest." };
  } catch {
    return { ok: false, message: "Der opstod en fejl ved afsendelse. Prøv igen." };
  }
}
