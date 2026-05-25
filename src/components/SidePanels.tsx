import type { Job, TimelineEvent } from "../types";
import { formatTime, sortEventsByTime } from "../utils/time";

interface SidePanelsProps {
  events: TimelineEvent[];
  selectedJob: Job;
  currentTime: number;
  onSeek: (time: number) => void;
}

interface CompactPanelProps {
  title: string;
  events: TimelineEvent[];
  currentTime: number;
  emptyText: string;
  onSeek: (time: number) => void;
}

function CompactPanel({ title, events, currentTime, emptyText, onSeek }: CompactPanelProps) {
  return (
    <section className="panel rounded-lg">
      <div className="border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-black uppercase text-slate-300">{title}</h2>
      </div>
      <div className="max-h-72 overflow-y-auto p-2">
        {events.length === 0 ? (
          <p className="px-2 py-4 text-sm text-slate-500">{emptyText}</p>
        ) : (
          events.map((event) => {
            const isPast = event.time < currentTime;

            return (
              <button
                key={`${title}-${event.id}`}
                type="button"
                onClick={() => onSeek(event.time)}
                className={`mb-2 w-full rounded border border-white/10 bg-surface-850/70 p-3 text-left transition hover:border-white/20 hover:bg-surface-800 ${
                  isPast ? "opacity-45" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-black text-aether-300">
                    {formatTime(event.time)}
                  </span>
                  <span className="badge bg-white/10 text-slate-400">{event.type}</span>
                </div>
                <p className="mt-2 text-sm font-black text-slate-100">{event.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                  {event.description}
                </p>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}

export function SidePanels({ events, selectedJob, currentTime, onSeek }: SidePanelsProps) {
  const sortedEvents = sortEventsByTime(events);
  const bossTimeline = sortedEvents.filter((event) => event.type === "boss");
  const myJobActions =
    selectedJob === "ALL"
      ? []
      : sortedEvents.filter((event) => event.jobs.includes(selectedJob));
  const partyMitigation = sortedEvents.filter((event) =>
    ["mitigation", "healer", "tank"].includes(event.type),
  );
  const notes = sortedEvents.filter((event) => event.type === "note");

  return (
    <aside className="grid gap-4">
      <CompactPanel
        title="Boss Timeline"
        events={bossTimeline}
        currentTime={currentTime}
        emptyText="沒有 boss 事件"
        onSeek={onSeek}
      />
      <CompactPanel
        title="My Job Actions"
        events={myJobActions}
        currentTime={currentTime}
        emptyText={selectedJob === "ALL" ? "選擇職業後顯示相關事件" : "沒有此職業事件"}
        onSeek={onSeek}
      />
      <CompactPanel
        title="Party Mitigation"
        events={partyMitigation}
        currentTime={currentTime}
        emptyText="沒有減傷或坦補事件"
        onSeek={onSeek}
      />
      <CompactPanel
        title="Notes"
        events={notes}
        currentTime={currentTime}
        emptyText="沒有備註"
        onSeek={onSeek}
      />
    </aside>
  );
}
