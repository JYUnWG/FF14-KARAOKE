import type { TimelineEvent } from "../types";

export const formatTime = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

export const clampTime = (seconds: number, duration: number): number =>
  Math.min(Math.max(seconds, 0), duration);

export const sortEventsByTime = (events: TimelineEvent[]): TimelineEvent[] =>
  [...events].sort((a, b) => a.time - b.time);

export const getActiveEvent = (
  events: TimelineEvent[],
  currentTime: number,
): TimelineEvent | undefined => {
  const sortedEvents = sortEventsByTime(events);

  return sortedEvents.reduce<TimelineEvent | undefined>((activeEvent, event) => {
    if (event.time <= currentTime) {
      return event;
    }

    return activeEvent;
  }, undefined);
};

export const getNextEvent = (
  events: TimelineEvent[],
  currentTime: number,
): TimelineEvent | undefined =>
  sortEventsByTime(events).find((event) => event.time > currentTime);

export const isWithinLeadWindow = (
  event: TimelineEvent,
  currentTime: number,
  leadTimeOffset: number,
): boolean =>
  event.time > currentTime && currentTime >= event.time - leadTimeOffset;

export const isUpcoming = (
  event: TimelineEvent,
  currentTime: number,
  leadTimeOffset: number,
): boolean =>
  event.time > currentTime &&
  (event.time <= currentTime + 10 || isWithinLeadWindow(event, currentTime, leadTimeOffset));
