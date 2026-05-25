import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { JobFilter } from "./components/JobFilter";
import { NowPanel } from "./components/NowPanel";
import { PlayerControls } from "./components/PlayerControls";
import { SidePanels } from "./components/SidePanels";
import { TimelineList } from "./components/TimelineList";
import { demoTimeline } from "./data/demoTimeline";
import type { Job, LeadTimeOffset, PlaybackRate } from "./types";
import { clampTime, getActiveEvent, getNextEvent } from "./utils/time";

function App() {
  const { encounterName, duration, events } = demoTimeline;
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);
  const [leadTimeOffset, setLeadTimeOffset] = useState<LeadTimeOffset>(5);
  const [selectedJob, setSelectedJob] = useState<Job>("ALL");
  const frameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const activeEvent = useMemo(() => getActiveEvent(events, currentTime), [events, currentTime]);
  const nextEvent = useMemo(() => getNextEvent(events, currentTime), [events, currentTime]);

  const seekTo = useCallback(
    (time: number) => {
      setCurrentTime(clampTime(time, duration));
    },
    [duration],
  );

  const restart = useCallback(() => {
    setCurrentTime(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      lastTickRef.current = null;
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      return;
    }

    const tick = (timestamp: number) => {
      // requestAnimationFrame gives stable elapsed time, so playback rate stays smooth.
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
  }, [duration, isPlaying, playbackRate]);

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
          <JobFilter selectedJob={selectedJob} onChange={setSelectedJob} />
        </header>

        <NowPanel
          activeEvent={activeEvent}
          nextEvent={nextEvent}
          currentTime={currentTime}
          leadTimeOffset={leadTimeOffset}
        />

        <PlayerControls
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          playbackRate={playbackRate}
          leadTimeOffset={leadTimeOffset}
          onPlayPause={() => setIsPlaying((playing) => !playing)}
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
