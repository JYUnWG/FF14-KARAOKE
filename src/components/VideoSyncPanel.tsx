import { useState } from "react";
import type { YouTubePlayerHandle } from "./YouTubePlayer";
import { extractYouTubeVideoId, extractYouTubeStartTime, parseTimeInput, formatYouTubeUrl } from "../utils/youtube";
import { formatTime } from "../utils/time";

type SyncMode = "manual" | "youtube";

interface VideoSyncPanelProps {
  videoId: string | null;
  videoStartTime: number;
  syncMode: SyncMode;
  currentTime: number;
  playerHandle: YouTubePlayerHandle | null;
  onVideoIdChange: (videoId: string | null) => void;
  onVideoStartTimeChange: (time: number) => void;
  onSyncModeChange: (mode: SyncMode) => void;
}

export function VideoSyncPanel({
  videoId,
  videoStartTime,
  syncMode,
  currentTime,
  playerHandle,
  onVideoIdChange,
  onVideoStartTimeChange,
  onSyncModeChange,
}: VideoSyncPanelProps) {
  const [urlInput, setUrlInput] = useState("");
  const [startTimeInput, setStartTimeInput] = useState("");

  const handleUrlSubmit = () => {
    const id = extractYouTubeVideoId(urlInput);
    if (id) {
      onVideoIdChange(id);
      const t = extractYouTubeStartTime(urlInput);
      if (t !== null) {
        onVideoStartTimeChange(t);
        setStartTimeInput(String(t));
      }
      setUrlInput("");
    }
  };

  const handleStartTimeSubmit = () => {
    const parsed = parseTimeInput(startTimeInput);
    if (parsed !== null) {
      onVideoStartTimeChange(parsed);
    }
  };

  const handleSetCurrentAsStart = () => {
    if (playerHandle) {
      const t = Math.floor(playerHandle.getCurrentTime());
      onVideoStartTimeChange(t);
      setStartTimeInput(String(t));
    }
  };

  const handleClear = () => {
    onVideoIdChange(null);
    onSyncModeChange("manual");
    setUrlInput("");
    setStartTimeInput("");
  };

  const videoCurrentTime = playerHandle ? Math.floor(playerHandle.getCurrentTime()) : 0;

  return (
    <div className="space-y-4">
      {!videoId && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
            placeholder="Paste YouTube URL..."
            className="h-10 flex-1 rounded border border-white/10 bg-surface-800 px-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-aether-500"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="h-10 rounded bg-aether-500 px-4 text-sm font-bold text-surface-950 transition hover:bg-aether-400"
          >
            Load
          </button>
        </div>
      )}

      {videoId && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={formatYouTubeUrl(videoId)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded border border-white/10 bg-surface-800 px-3 text-xs font-bold text-slate-300 transition hover:border-white/20 hover:text-slate-100"
            >
              Open on YouTube
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button
              type="button"
              onClick={handleClear}
              className="h-9 rounded border border-white/10 bg-surface-800 px-3 text-xs font-bold text-slate-400 transition hover:border-ember-500/50 hover:text-ember-400"
            >
              Clear video
            </button>
          </div>

          <div className="rounded border border-white/10 bg-surface-850/70 p-3 space-y-2">
            <p className="text-xs font-bold uppercase text-slate-400">Pull Start (video time)</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={startTimeInput}
                onChange={(e) => setStartTimeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStartTimeSubmit()}
                placeholder="e.g. 222 or 03:42"
                className="h-9 flex-1 rounded border border-white/10 bg-surface-800 px-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-aether-500"
              />
              <button
                type="button"
                onClick={handleStartTimeSubmit}
                className="h-9 rounded border border-aether-500/50 bg-aether-500/10 px-3 text-xs font-bold text-aether-400 transition hover:bg-aether-500/20"
              >
                Set
              </button>
            </div>
            <button
              type="button"
              onClick={handleSetCurrentAsStart}
              disabled={!playerHandle}
              className="h-8 rounded border border-white/10 bg-surface-800 px-3 text-[11px] font-bold text-slate-300 transition hover:border-white/20 disabled:opacity-40"
            >
              Set current video time as pull start
            </button>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Video time</p>
                <p className="font-mono text-sm font-bold text-slate-200">{formatTime(videoCurrentTime)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Pull start</p>
                <p className="font-mono text-sm font-bold text-aether-400">{formatTime(videoStartTime)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Timeline</p>
                <p className="font-mono text-sm font-bold text-amber-300">{formatTime(currentTime)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSyncModeChange("manual")}
          className={`h-9 rounded px-3 text-xs font-bold transition ${
            syncMode === "manual"
              ? "border border-aether-500 bg-aether-500/20 text-aether-400"
              : "border border-white/10 bg-surface-800 text-slate-400 hover:border-white/20"
          }`}
        >
          Manual
        </button>
        <button
          type="button"
          onClick={() => videoId && onSyncModeChange("youtube")}
          disabled={!videoId}
          className={`h-9 rounded px-3 text-xs font-bold transition ${
            syncMode === "youtube"
              ? "border border-aether-500 bg-aether-500/20 text-aether-400"
              : "border border-white/10 bg-surface-800 text-slate-400 hover:border-white/20 disabled:opacity-40"
          }`}
        >
          YouTube Sync
        </button>
        {!videoId && (
          <span className="text-[11px] text-slate-500">Paste a YouTube URL to enable sync</span>
        )}
      </div>
    </div>
  );
}
