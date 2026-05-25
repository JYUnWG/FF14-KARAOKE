import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export interface YouTubePlayerHandle {
  getCurrentTime: () => number;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number) => void;
}

interface YouTubePlayerProps {
  videoId: string;
  onReady?: (handle: YouTubePlayerHandle) => void;
  onStateChange?: (state: number) => void;
  onError?: () => void;
}

let apiLoading = false;
let apiLoaded = false;
const apiCallbacks: (() => void)[] = [];

function loadYouTubeAPI(): Promise<void> {
  if (apiLoaded) return Promise.resolve();

  return new Promise((resolve) => {
    apiCallbacks.push(resolve);

    if (apiLoading) return;
    apiLoading = true;

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);

    window.onYouTubeIframeAPIReady = () => {
      apiLoaded = true;
      apiCallbacks.forEach((cb) => cb());
      apiCallbacks.length = 0;
    };
  });
}

export function YouTubePlayer({ videoId, onReady, onStateChange, onError }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const onReadyRef = useRef(onReady);
  const onStateChangeRef = useRef(onStateChange);
  const onErrorRef = useRef(onError);

  onReadyRef.current = onReady;
  onStateChangeRef.current = onStateChange;
  onErrorRef.current = onError;

  const destroyPlayer = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeAPI().then(() => {
      if (cancelled || !containerRef.current) return;

      destroyPlayer();

      const el = document.createElement("div");
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(el);

      playerRef.current = new window.YT.Player(el, {
        videoId,
        playerVars: {
          autoplay: 0,
          enablejsapi: 1,
          origin: window.location.origin,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            if (cancelled) return;
            const handle: YouTubePlayerHandle = {
              getCurrentTime: () => playerRef.current?.getCurrentTime() ?? 0,
              playVideo: () => playerRef.current?.playVideo(),
              pauseVideo: () => playerRef.current?.pauseVideo(),
              seekTo: (seconds: number) => playerRef.current?.seekTo(seconds, true),
            };
            onReadyRef.current?.(handle);
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            if (cancelled) return;
            onStateChangeRef.current?.(event.data);
          },
          onError: () => {
            if (cancelled) return;
            onErrorRef.current?.();
          },
        },
      });
    });

    return () => {
      cancelled = true;
      destroyPlayer();
    };
  }, [videoId, destroyPlayer]);

  return (
    <div className="aspect-video w-full min-w-0 overflow-hidden rounded-lg bg-black">
      <div ref={containerRef} className="h-full w-full [&>div]:h-full [&>div]:w-full [&>iframe]:h-full [&>iframe]:w-full" />
    </div>
  );
}
