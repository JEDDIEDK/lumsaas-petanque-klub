import { clsx, type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const getSeasonFromDate = (date: Date = new Date()) => `${date.getFullYear()}`;

export const fmtDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("da-DK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

export const fmtTime = (timeStr: string) => timeStr.slice(0, 5);
