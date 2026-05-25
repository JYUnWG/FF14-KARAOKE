export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  const patterns = [
    /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export function extractYouTubeStartTime(url: string): number | null {
  if (!url) return null;
  const match = url.match(/[?&]t=(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

export function parseTimeInput(input: string): number | null {
  if (!input) return null;
  const trimmed = input.trim();

  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10);
  }

  const mmss = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (mmss) {
    return parseInt(mmss[1], 10) * 60 + parseInt(mmss[2], 10);
  }

  const hhmmss = trimmed.match(/^(\d{1,2}):(\d{2}):(\d{2})$/);
  if (hhmmss) {
    return (
      parseInt(hhmmss[1], 10) * 3600 +
      parseInt(hhmmss[2], 10) * 60 +
      parseInt(hhmmss[3], 10)
    );
  }

  return null;
}

export function formatYouTubeUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function buildEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}
