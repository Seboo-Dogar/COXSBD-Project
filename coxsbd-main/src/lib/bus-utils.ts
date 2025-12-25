import { TimeSlot } from "@/types/Bus";

export const inTimeSlot = (time: string, slot: TimeSlot): boolean => {
  const hour = parseInt(time.split(":")[0]);
  if (slot === "morning") return hour >= 6 && hour < 12;
  if (slot === "afternoon") return hour >= 12 && hour < 17;
  if (slot === "evening") return hour >= 17 && hour < 21;
  return hour >= 21 || hour < 6;
};

export const parseDurationToMinutes = (dur: string): number => {
  const [h, m] = dur.replace("h", "").replace("m", "").split(" ").map(Number);
  return (h || 0) * 60 + (m || 0);
};

export const getHour = (time: string): number => parseInt(time.split(":")[0]);