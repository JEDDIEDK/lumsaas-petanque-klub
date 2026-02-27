import { addDays } from "date-fns";
import { db } from "@/lib/db";
import { getSeasonFromDate } from "@/lib/utils";
import type { AnnouncementType, EventType, GalleryImage, MatchType, RankingRow } from "@/lib/types";

export const getUpcomingEvents = async (limit = 10): Promise<EventType[]> => {
  const rows = await db.event.findMany({
    where: { date: { gte: new Date(new Date().toDateString()) } },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
    take: limit
  });

  return rows.map((e) => ({
    id: e.id,
    date: e.date.toISOString().slice(0, 10),
    start_time: e.startTime,
    type: e.type,
    note: e.note,
    created_at: e.createdAt.toISOString()
  }));
};

export const ensureSeedEvents = async () => {
  const upcoming = await db.event.findMany({
    where: { date: { gte: new Date(new Date().toDateString()) } },
    orderBy: [{ date: "asc" }]
  });
  if (upcoming.length >= 6) return;

  const base = new Date(new Date().toDateString());
  const existingDates = new Set(upcoming.map((e) => e.date.toISOString().slice(0, 10)));
  const templates = [
    { offset: 2, startTime: "14:00", type: "Træning", note: "Nye spillere velkomne" },
    { offset: 6, startTime: "10:00", type: "Lørdagsspil", note: "Social turnering" },
    { offset: 9, startTime: "14:00", type: "Træning", note: "Kasteøvelser" },
    { offset: 13, startTime: "14:00", type: "Træning", note: "Hygge og spil" },
    { offset: 16, startTime: "10:00", type: "Lørdagsspil", note: "Åben træning" },
    { offset: 20, startTime: "14:00", type: "Træning", note: "Teknik og hygge" },
    { offset: 23, startTime: "14:00", type: "Træning", note: "Fri makkertrækning" },
    { offset: 27, startTime: "10:00", type: "Lørdagsspil", note: "Social runde" }
  ];

  const toCreate = templates
    .map((t) => ({ ...t, date: addDays(base, t.offset).toISOString().slice(0, 10) }))
    .filter((t) => !existingDates.has(t.date))
    .slice(0, Math.max(0, 6 - upcoming.length))
    .map(({ date, startTime, type, note }) => ({ date, startTime, type, note }));

  if (toCreate.length) {
    await db.event.createMany({ data: toCreate });
  }
};

export const getLatestAnnouncements = async (_limit = 5): Promise<AnnouncementType[]> => {
  void _limit;
  return [];
};

export const getGalleryImages = async (_limit = 24): Promise<GalleryImage[]> => {
  void _limit;
  return [];
};

export const getMatchesBySeason = async (
  _season?: string,
  _includePending = false
): Promise<MatchType[]> => {
  void _season;
  void _includePending;
  return [];
};

export const getRankingForSeason = async (_season?: string): Promise<RankingRow[]> => {
  void _season;
  return [];
};

export const getNextDefaultEvents = () =>
  [1, 8, 15, 22].map((offset) => ({
    date: addDays(new Date(), offset).toISOString().slice(0, 10),
    type: "Træning",
    start_time: "14:00",
    season: getSeasonFromDate()
  }));
