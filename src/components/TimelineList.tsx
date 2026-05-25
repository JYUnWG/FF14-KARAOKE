import { useEffect, useRef } from "react";
import type { Job, TimelineEvent } from "../types";
import { formatTime, isUpcoming, sortEventsByTime } from "../utils/time";

interface TimelineListProps {
  events: TimelineEvent[];
  activeEventId?: string;
  currentTime: number;
  leadTimeOffset: number;
  selectedJob: Job;
  onSeek: (time: number) => void;
}

const typeBadgeClass: Record<TimelineEvent["type"], string> = {
  boss: "bg-rose-300/20 text-rose-200",
  party: "bg-sky-300/20 text-sky-200",
  tank: "bg-blue-300/20 text-blue-200",
  healer: "bg-emerald-300/20 text-emerald-200",
  dps: "bg-violet-300/20 text-violet-200",
  mitigation: "bg-amber-300/20 text-amber-200",
  note: "bg-slate-300/20 text-slate-200",
};

const severityDotClass: Record<TimelineEvent["severity"], string> = {
  info: "bg-aether-400",
  warning: "bg-amber-300",
  danger: "bg-ember-500",
};

export function TimelineList({
  events,
  activeEventId,
  currentTime,
  leadTimeOffset,
  selectedJob,
  onSeek,
}: TimelineListProps) {
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const sortedEvents = sortEventsByTime(events);

  useEffect(() => {
    if (!activeEventId) {
      return;
    }

    rowRefs.current[activeEventId]?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }, [activeEventId]);

  return (
    <section className="panel overflow-hidden rounded-lg">
      <div className="border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-black uppercase text-slate-300">Timeline</h2>
      </div>

      <div className="max-h-[38rem] overflow-y-auto p-2">
        {sortedEvents.map((event) => {
          const isActive = event.id === activeEventId;
          const upcoming = isUpcoming(event, currentTime, leadTimeOffset);
          const isPast = event.time < currentTime && !isActive;
          const jobMatched = selectedJob !== "ALL" && event.jobs.includes(selectedJob);

          return (
            <button
              key={event.id}
              ref={(element) => {
                rowRefs.current[event.id] = element;
              }}
              type="button"
              onClick={() => onSeek(event.time)}
              className={`mb-2 grid w-full grid-cols-[4.5rem_1fr] gap-3 rounded border p-3 text-left transition ${
                isActive
                  ? "border-aether-500/80 bg-aether-500/10 shadow-active"
                  : upcoming
                    ? "border-amber-300/50 bg-amber-300/10"
                    : "border-white/10 bg-surface-850/70 hover:border-white/20 hover:bg-surface-800"
              } ${isPast ? "opacity-45" : "opacity-100"} ${
                jobMatched ? "ring-1 ring-aether-400/70" : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <span className={`mt-1 h-2 w-2 rounded-full ${severityDotClass[event.severity]}`} />
                <span className="font-mono text-sm font-black text-slate-300">
                  {formatTime(event.time)}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`badge ${typeBadgeClass[event.type]}`}>{event.type}</span>
                  {upcoming && !isActive && (
                    <span className="badge bg-amber-300/20 text-amber-200">upcoming</span>
                  )}
                  {event.duration !== undefined && (
                    <span className="font-mono text-[11px] font-bold text-slate-500">
                      {event.duration}s
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-base font-black text-slate-100">{event.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">{event.description}</p>
                {event.jobs.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {event.jobs.map((job) => (
                      <span
                        key={job}
                        className={`badge ${
                          selectedJob === job
                            ? "bg-aether-500/20 text-aether-300"
                    : "bg-white/10 text-slate-400"
                        }`}
                      >
                        {job}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
