import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { JobFilter } from "./components/JobFilter";
import { NowPanel } from "./components/NowPanel";
import { PlayerControls } from "./components/PlayerControls";
import { SidePanels } from "./components/SidePanels";
import { TimelineList } from "./components/TimelineList";
import { VideoSyncPanel } from "./components/VideoSyncPanel";
import { YouTubePlayer } from "./components/YouTubePlayer";
import type { YouTubePlayerHandle } from "./components/YouTubePlayer";
import { demoTimeline } from "./data/demoTimeline";
import type { Job, LeadTimeOffset, PlaybackRate } from "./types";
import { buildShareUrl, readShareParams } from "./utils/share";
import { formatYouTubeUrl } from "./utils/youtube";
import { clampTime, getActiveEvent, getNextEvent } from "./utils/time";

type SyncMode = "manual" | "youtube";

function App() {
  const { encounterName, duration, events } = demoTimeline;

  const shareParams = useMemo(() => readShareParams(), []);

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);
  const [leadTimeOffset, setLeadTimeOffset] = useState<LeadTimeOffset>(
    shareParams.leadTimeOffset ?? 5,
  );
  const [selectedJob, setSelectedJob] = useState<Job>(shareParams.selectedJob ?? "ALL");
  const [syncMode, setSyncMode] = useState<SyncMode>("manual");
  const [videoId, setVideoId] = useState<string | null>(shareParams.videoId ?? null);
  const [videoStartTime, setVideoStartTime] = useState(shareParams.videoStartTime ?? 0);
  const [playerHandle, setPlayerHandle] = useState<YouTubePlayerHandle | null>(null);
  const [embedError, setEmbedError] = useState(false);
  const [copied, setCopied] = useState(false);

  const frameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const syncIntervalRef = useRef<number | null>(null);

  const activeEvent = useMemo(() => getActiveEvent(events, currentTime), [events, currentTime]);
  const nextEvent = useMemo(() => getNextEvent(events, currentTime), [events, currentTime]);

  const seekTo = useCallback(
    (time: number) => {
      const clamped = clampTime(time, duration);
      setCurrentTime(clamped);
      if (syncMode === "youtube" && playerHandle) {
        playerHandle.seekTo(videoStartTime + clamped);
      }
    },
    [duration, syncMode, playerHandle, videoStartTime],
  );

  const restart = useCallback(() => {
    setCurrentTime(0);
    if (syncMode === "youtube" && playerHandle) {
      playerHandle.seekTo(videoStartTime);
    } else {
      setIsPlaying(false);
    }
  }, [syncMode, playerHandle, videoStartTime]);

  const handlePlayPause = useCallback(() => {
    if (syncMode === "youtube" && playerHandle) {
      if (isPlaying) {
        playerHandle.pauseVideo();
      } else {
        playerHandle.playVideo();
      }
    } else {
      setIsPlaying((p) => !p);
    }
  }, [syncMode, playerHandle, isPlaying]);

  // Manual mode timer
  useEffect(() => {
    if (syncMode !== "manual" || !isPlaying) {
      lastTickRef.current = null;
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      return;
    }

    const tick = (timestamp: number) => {
      if (lastTickRef.current === null) {
        lastTickRef.current = timestamp;
      }

      const deltaSeconds = ((timestamp - lastTickRef.current) / 1000) * playbackRate;
      lastTickRef.current = timestamp;

      setCurrentTime((previousTime) => {
        const nextTime = clampTime(previousTime + deltaSeconds, duration);
        if (nextTime >= duration) {
          setIsPlaying(false);
        }
        return nextTime;
      });

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [duration, isPlaying, playbackRate, syncMode]);

  // YouTube sync mode polling
  useEffect(() => {
    if (syncMode !== "youtube" || !playerHandle) {
      if (syncIntervalRef.current !== null) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
      return;
    }

    syncIntervalRef.current = window.setInterval(() => {
      const videoTime = playerHandle.getCurrentTime();
      const timelineTime = videoTime - videoStartTime;

      if (timelineTime < 0) {
        setCurrentTime(0);
      } else if (timelineTime > duration) {
        setCurrentTime(duration);
      } else {
        setCurrentTime(timelineTime);
      }
    }, 250);

    return () => {
      if (syncIntervalRef.current !== null) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [syncMode, playerHandle, videoStartTime, duration]);

  const handleYTStateChange = useCallback((state: number) => {
    // YT.PlayerState: PLAYING=1, PAUSED=2, ENDED=0
    if (state === 1) {
      setIsPlaying(true);
    } else if (state === 2 || state === 0) {
      setIsPlaying(false);
    }
  }, []);

  const handleYTReady = useCallback((handle: YouTubePlayerHandle) => {
    setPlayerHandle(handle);
    setEmbedError(false);
  }, []);

  const handleYTError = useCallback(() => {
    setEmbedError(true);
  }, []);

  const handleCopyShareLink = useCallback(() => {
    const url = buildShareUrl({ videoId, videoStartTime, selectedJob, leadTimeOffset });
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [videoId, videoStartTime, selectedJob, leadTimeOffset]);

  const handleSyncModeChange = useCallback((mode: SyncMode) => {
    setSyncMode(mode);
    if (mode === "manual") {
      setIsPlaying(false);
    }
  }, []);

  const timelineStatus =
    syncMode === "youtube" && playerHandle
      ? playerHandle.getCurrentTime() - videoStartTime < 0
        ? "waiting"
        : currentTime >= duration
          ? "ended"
          : null
      : null;

  return (
    <main className="min-h-screen px-4 py-5 text-slate-100 md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[92rem] flex-col gap-5">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-aether-400">Raid Timeline Player</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-50 md:text-4xl">
              {encounterName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="h-9 rounded border border-white/10 bg-surface-800 px-3 text-xs font-bold text-slate-300 transition hover:border-aether-500/50 hover:text-aether-400"
            >
              {copied ? "Copied!" : "Copy share link"}
            </button>
            <JobFilter selectedJob={selectedJob} onChange={setSelectedJob} />
          </div>
        </header>

        {/* Video + Now/Next layout */}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-4">
            {videoId && !embedError && (
              <YouTubePlayer
                videoId={videoId}
                onReady={handleYTReady}
                onStateChange={handleYTStateChange}
                onError={handleYTError}
              />
            )}

            {videoId && embedError && (
              <div className="flex flex-col items-center gap-3 rounded-lg border border-ember-500/30 bg-ember-500/5 p-6">
                <p className="text-sm text-slate-300">
                  If embedding is blocked, open the source video on YouTube and use manual mode.
                </p>
                <a
                  href={formatYouTubeUrl(videoId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded bg-ember-500 px-4 text-sm font-bold text-white transition hover:bg-ember-400"
                >
                  Open video on YouTube
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            <VideoSyncPanel
              videoId={videoId}
              videoStartTime={videoStartTime}
              syncMode={syncMode}
              currentTime={currentTime}
              playerHandle={playerHandle}
              onVideoIdChange={setVideoId}
              onVideoStartTimeChange={setVideoStartTime}
              onSyncModeChange={handleSyncModeChange}
            />

            {timelineStatus === "waiting" && (
              <div className="rounded border border-amber-300/30 bg-amber-300/5 px-4 py-2 text-center text-sm font-bold text-amber-300">
                Waiting for pull...
              </div>
            )}
            {timelineStatus === "ended" && (
              <div className="rounded border border-slate-400/30 bg-slate-400/5 px-4 py-2 text-center text-sm font-bold text-slate-400">
                Timeline ended
              </div>
            )}
          </div>

          <NowPanel
            activeEvent={activeEvent}
            nextEvent={nextEvent}
            currentTime={currentTime}
            leadTimeOffset={leadTimeOffset}
          />
        </div>

        <PlayerControls
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          playbackRate={playbackRate}
          leadTimeOffset={leadTimeOffset}
          onPlayPause={handlePlayPause}
          onRestart={restart}
          onSeek={seekTo}
          onPlaybackRateChange={setPlaybackRate}
          onLeadTimeOffsetChange={setLeadTimeOffset}
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <TimelineList
            events={events}
            activeEventId={activeEvent?.id}
            currentTime={currentTime}
            leadTimeOffset={leadTimeOffset}
            selectedJob={selectedJob}
            onSeek={seekTo}
          />
          <SidePanels
            events={events}
            selectedJob={selectedJob}
            currentTime={currentTime}
            onSeek={seekTo}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
