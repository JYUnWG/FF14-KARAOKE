import type { TimelineEvent } from "../types";
import { formatTime } from "../utils/time";

interface NowPanelProps {
  activeEvent?: TimelineEvent;
  nextEvent?: TimelineEvent;
  currentTime: number;
  leadTimeOffset: number;
}

const severityClass = {
  info: "border-aether-500/50 bg-aether-500/10",
  warning: "border-amber-300/50 bg-amber-300/10",
  danger: "border-ember-500/60 bg-ember-500/10 shadow-danger",
};

export function NowPanel({
  activeEvent,
  nextEvent,
  currentTime,
  leadTimeOffset,
}: NowPanelProps) {
  const nextDelta = nextEvent ? Math.max(0, nextEvent.time - currentTime) : undefined;
  const nextIsWarning =
    nextEvent !== undefined &&
    leadTimeOffset > 0 &&
    currentTime >= nextEvent.time - leadTimeOffset;

  return (
    <section
      className={`panel rounded-lg border p-5 ${
        activeEvent ? severityClass[activeEvent.severity] : "border-white/10"
      }`}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase text-aether-400">Now</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm font-bold text-slate-400">
              {activeEvent ? formatTime(activeEvent.time) : "--:--"}
            </span>
            {activeEvent && (
              <span className="badge bg-white/10 text-slate-200">{activeEvent.type}</span>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-normal text-slate-50 md:text-5xl">
            {activeEvent?.title ?? "準備開始"}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
            {activeEvent?.description ?? "按下播放後，排軸會依戰鬥時間推進。"}
          </p>
          {activeEvent && activeEvent.jobs.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {activeEvent.jobs.map((job) => (
                <span key={job} className="badge bg-aether-500/20 text-aether-300">
                  {job}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="rounded border border-white/10 bg-surface-950/70 p-4">
          <p className="text-xs font-black uppercase text-slate-400">Next</p>
          {nextEvent ? (
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xl font-black text-slate-100">
                  -{Math.ceil(nextDelta ?? 0)}s
                </span>
                <span
                  className={`badge ${
                    nextIsWarning ? "bg-amber-300/20 text-amber-200" : "bg-white/10 text-slate-300"
                  }`}
                >
                  {formatTime(nextEvent.time)}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-50">{nextEvent.title}</h2>
              <p className="text-sm leading-6 text-slate-400">{nextEvent.description}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">已無後續事件</p>
          )}
        </div>
      </div>
    </section>
  );
}
