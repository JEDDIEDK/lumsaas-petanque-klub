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
  const count = await db.event.count();
  if (count > 0) return;

  const base = new Date();
  const makeDate = (days: number) => addDays(new Date(base.toDateString()), days).toISOString().slice(0, 10);

  await db.event.createMany({
    data: [
      { date: makeDate(2), startTime: "14:00", type: "Træning", note: "Nye spillere velkomne" },
      { date: makeDate(6), startTime: "10:00", type: "Lørdagsspil", note: "Social turnering" },
      { date: makeDate(9), startTime: "14:00", type: "Træning", note: "Kasteøvelser" },
      { date: makeDate(13), startTime: "14:00", type: "Træning", note: "Hygge og spil" }
    ]
  });
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
