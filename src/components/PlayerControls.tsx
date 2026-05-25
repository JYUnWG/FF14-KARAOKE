import type { LeadTimeOffset, PlaybackRate } from "../types";
import { formatTime } from "../utils/time";

const playbackRates: PlaybackRate[] = [0.5, 1, 1.5, 2];
const leadTimeOptions: LeadTimeOffset[] = [0, 1, 3, 5, 10];

interface PlayerControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  playbackRate: PlaybackRate;
  leadTimeOffset: LeadTimeOffset;
  onPlayPause: () => void;
  onRestart: () => void;
  onSeek: (time: number) => void;
  onPlaybackRateChange: (rate: PlaybackRate) => void;
  onLeadTimeOffsetChange: (offset: LeadTimeOffset) => void;
}

export function PlayerControls({
  currentTime,
  duration,
  isPlaying,
  playbackRate,
  leadTimeOffset,
  onPlayPause,
  onRestart,
  onSeek,
  onPlaybackRateChange,
  onLeadTimeOffsetChange,
}: PlayerControlsProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="panel rounded-lg p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPlayPause}
              className="h-11 rounded bg-aether-500 px-5 text-sm font-black text-surface-950 transition hover:bg-aether-400"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="h-11 rounded border border-white/10 bg-surface-800 px-4 text-sm font-bold text-slate-200 transition hover:border-white/25 hover:bg-surface-700"
            >
              Restart
            </button>
          </div>

          <div className="font-mono text-lg font-bold text-slate-100">
            {formatTime(currentTime)}
            <span className="mx-2 text-slate-600">/</span>
            <span className="text-slate-400">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <input
            aria-label="Timeline progress"
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={(event) => onSeek(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-700 accent-aether-500"
            style={{
              background: `linear-gradient(90deg, #53d6c7 ${progress}%, rgba(255,255,255,0.12) ${progress}%)`,
            }}
          />
          <div className="flex justify-between font-mono text-[11px] text-slate-500">
            <span>00:00</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-slate-400">Speed</p>
            <div className="grid grid-cols-4 gap-2">
              {playbackRates.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => onPlaybackRateChange(rate)}
                  className={`h-10 rounded border text-sm font-bold transition ${
                    playbackRate === rate
                      ? "border-aether-500 bg-aether-500/20 text-aether-400"
                    : "border-white/10 bg-surface-800 text-slate-300 hover:border-white/20"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-slate-400">Lead</p>
            <div className="grid grid-cols-5 gap-2">
              {leadTimeOptions.map((offset) => (
                <button
                  key={offset}
                  type="button"
                  onClick={() => onLeadTimeOffsetChange(offset)}
                  className={`h-10 rounded border text-sm font-bold transition ${
                    leadTimeOffset === offset
                      ? "border-amber-300 bg-amber-300/20 text-amber-200"
                    : "border-white/10 bg-surface-800 text-slate-300 hover:border-white/20"
                  }`}
                >
                  {offset}s
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
