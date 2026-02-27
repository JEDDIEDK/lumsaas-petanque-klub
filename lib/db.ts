/* eslint-disable @typescript-eslint/no-explicit-any */
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

type UserRow = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  passwordHash: string;
  role: string;
  createdAt: string;
};

type SessionRow = {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
};

type EventRow = {
  id: number;
  date: string;
  startTime: string;
  type: string;
  note: string | null;
  createdAt: string;
};

type AttendanceRow = {
  id: number;
  eventId: number;
  userId: string;
  status: string;
  comment: string | null;
  updatedAt: string;
};

type DbFile = {
  users: UserRow[];
  sessions: SessionRow[];
  events: EventRow[];
  attendances: AttendanceRow[];
  counters: { events: number; attendance: number };
};

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

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

const emptyDb = (): DbFile => ({
  users: [],
  sessions: [],
  events: [],
  attendances: [],
  counters: { events: 0, attendance: 0 }
});

const readDb = async (): Promise<DbFile> => {
  await mkdir(DB_DIR, { recursive: true });
  try {
    const raw = await readFile(DB_FILE, "utf8");
    return JSON.parse(raw) as DbFile;
  } catch {
    const init = emptyDb();
    await writeFile(DB_FILE, JSON.stringify(init, null, 2), "utf8");
    return init;
  }
};

const writeDb = async (data: DbFile) => {
  await writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf8");
};

const toDateUser = (u: UserRow) => ({ ...u, createdAt: new Date(u.createdAt) });
const toDateSession = (s: SessionRow) => ({ ...s, expiresAt: new Date(s.expiresAt), createdAt: new Date(s.createdAt) });
const toDateEvent = (e: EventRow) => ({ ...e, date: new Date(e.date), createdAt: new Date(e.createdAt) });
const toDateAttendance = (a: AttendanceRow) => ({ ...a, updatedAt: new Date(a.updatedAt) });

export const db = {
  user: {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      const data = await readDb();
      const hit = data.users.find((u) => (where.email ? u.email === where.email : u.id === where.id));
      return hit ? toDateUser(hit) : null;
    },
    count: async () => {
      const data = await readDb();
      return data.users.length;
    },
    create: async ({ data: input }: { data: Omit<UserRow, "id" | "createdAt"> }) =>
      withLock(async () => {
        const data = await readDb();
        const row: UserRow = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
        data.users.push(row);
        await writeDb(data);
        return toDateUser(row);
      }),
    upsert: async ({
      where,
      update,
      create
    }: {
      where: { email: string };
      update: Partial<Omit<UserRow, "id" | "createdAt" | "email">> & { name?: string; passwordHash?: string; role?: string };
      create: Omit<UserRow, "id" | "createdAt">;
    }) =>
      withLock(async () => {
        const data = await readDb();
        const idx = data.users.findIndex((u) => u.email === where.email);
        if (idx >= 0) {
          const merged = { ...data.users[idx], ...update };
          data.users[idx] = merged;
          await writeDb(data);
          return toDateUser(merged);
        }
        const row: UserRow = { ...create, id: randomUUID(), createdAt: new Date().toISOString() };
        data.users.push(row);
        await writeDb(data);
        return toDateUser(row);
      }),
    findMany: async ({ orderBy, take }: { orderBy?: { createdAt: "desc" | "asc" }; take?: number } = {}) => {
      const data = await readDb();
      let users = [...data.users];
      if (orderBy?.createdAt) {
        users.sort((a, b) => (orderBy.createdAt === "desc" ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt)));
      }
      if (take) users = users.slice(0, take);
      return users.map(toDateUser);
    }
  },
  session: {
    create: async ({ data: input }: { data: Omit<SessionRow, "id" | "createdAt"> }) =>
      withLock(async () => {
        const data = await readDb();
        const row: SessionRow = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
        data.sessions.push(row);
        await writeDb(data);
        return toDateSession(row);
      }),
    findUnique: async ({ where, include }: { where: { token: string }; include?: { user?: boolean } }) => {
      const data = await readDb();
      const row = data.sessions.find((s) => s.token === where.token);
      if (!row) return null;
      const session = toDateSession(row) as any;
      if (include?.user) {
        const user = data.users.find((u) => u.id === row.userId);
        session.user = user ? toDateUser(user) : null;
      }
      return session;
    },
    deleteMany: async ({ where }: { where: { token?: string } }) =>
      withLock(async () => {
        const data = await readDb();
        const before = data.sessions.length;
        data.sessions = data.sessions.filter((s) => (where.token ? s.token !== where.token : false));
        await writeDb(data);
        return { count: before - data.sessions.length };
      }),
    delete: async ({ where }: { where: { token: string } }) =>
      withLock(async () => {
        const data = await readDb();
        data.sessions = data.sessions.filter((s) => s.token !== where.token);
        await writeDb(data);
        return { ok: true };
      })
  },
  event: {
    findMany: async ({ where, orderBy, take }: any = {}) => {
      const data = await readDb();
      let rows = [...data.events];
      if (where?.date?.gte) {
        const min = new Date(where.date.gte).getTime();
        rows = rows.filter((e) => new Date(e.date).getTime() >= min);
      }
      if (orderBy) {
        const sorts = Array.isArray(orderBy) ? orderBy : [orderBy];
        rows.sort((a, b) => {
          for (const s of sorts) {
            const [key, dir] = Object.entries(s)[0] as [string, "asc" | "desc"];
            const av = (a as any)[key];
            const bv = (b as any)[key];
            if (av === bv) continue;
            if (dir === "asc") return av > bv ? 1 : -1;
            return av < bv ? 1 : -1;
          }
          return 0;
        });
      }
      if (take) rows = rows.slice(0, take);
      return rows.map(toDateEvent);
    },
    count: async () => {
      const data = await readDb();
      return data.events.length;
    },
    createMany: async ({ data: rows }: { data: Omit<EventRow, "id" | "createdAt">[] }) =>
      withLock(async () => {
        const data = await readDb();
        for (const input of rows) {
          data.counters.events += 1;
          data.events.push({ ...input, id: data.counters.events, createdAt: new Date().toISOString() });
        }
        await writeDb(data);
        return { count: rows.length };
      }),
    create: async ({ data: input }: { data: Omit<EventRow, "id" | "createdAt"> }) =>
      withLock(async () => {
        const data = await readDb();
        data.counters.events += 1;
        const row: EventRow = { ...input, id: data.counters.events, createdAt: new Date().toISOString() };
        data.events.push(row);
        await writeDb(data);
        return toDateEvent(row);
      }),
    update: async ({ where, data: patch }: { where: { id: number }; data: Partial<Omit<EventRow, "id" | "createdAt">> }) =>
      withLock(async () => {
        const data = await readDb();
        const idx = data.events.findIndex((e) => e.id === where.id);
        if (idx < 0) throw new Error("Event not found");
        const merged = { ...data.events[idx], ...patch };
        data.events[idx] = merged;
        await writeDb(data);
        return toDateEvent(merged);
      }),
    delete: async ({ where }: { where: { id: number } }) =>
      withLock(async () => {
        const data = await readDb();
        data.events = data.events.filter((e) => e.id !== where.id);
        data.attendances = data.attendances.filter((a) => a.eventId !== where.id);
        await writeDb(data);
        return { ok: true };
      })
  },
  attendance: {
    findMany: async ({ where, include, orderBy }: any = {}) => {
      const data = await readDb();
      let rows = [...data.attendances];
      if (where?.userId) rows = rows.filter((a) => a.userId === where.userId);
      if (where?.eventId?.in) rows = rows.filter((a) => where.eventId.in.includes(a.eventId));
      if (orderBy?.updatedAt) {
        rows.sort((a, b) => (orderBy.updatedAt === "desc" ? b.updatedAt.localeCompare(a.updatedAt) : a.updatedAt.localeCompare(b.updatedAt)));
      }
      const mapped = rows.map(toDateAttendance) as any[];
      if (include?.user) {
        return mapped.map((r) => {
          const u = data.users.find((x) => x.id === r.userId);
          return { ...r, user: u ? toDateUser(u) : { id: r.userId, name: "Ukendt medlem", email: "", phone: null, passwordHash: "", role: "member", createdAt: new Date(0) } };
        });
      }
      return mapped;
    },
    upsert: async ({
      where,
      update,
      create
    }: {
      where: { eventId_userId: { eventId: number; userId: string } };
      update: Partial<Omit<AttendanceRow, "id" | "eventId" | "userId">>;
      create: Omit<AttendanceRow, "id" | "updatedAt">;
    }) =>
      withLock(async () => {
        const data = await readDb();
        const key = where.eventId_userId;
        const idx = data.attendances.findIndex((a) => a.eventId === key.eventId && a.userId === key.userId);
        if (idx >= 0) {
          const merged = { ...data.attendances[idx], ...update, updatedAt: new Date().toISOString() };
          data.attendances[idx] = merged;
          await writeDb(data);
          return toDateAttendance(merged);
        }
        data.counters.attendance += 1;
        const row: AttendanceRow = {
          ...create,
          id: data.counters.attendance,
          updatedAt: new Date().toISOString()
        };
        data.attendances.push(row);
        await writeDb(data);
        return toDateAttendance(row);
      })
  }
};
