import type { Job, LeadTimeOffset } from "../types";

interface ShareParams {
  videoId: string | null;
  videoStartTime: number | null;
  selectedJob: Job;
  leadTimeOffset: LeadTimeOffset;
}

export function buildShareUrl(params: ShareParams): string {
  const base = `${window.location.origin}${window.location.pathname}`;
  const searchParams = new URLSearchParams();

  if (params.videoId) searchParams.set("v", params.videoId);
  if (params.videoStartTime !== null) searchParams.set("start", String(params.videoStartTime));
  if (params.selectedJob !== "ALL") searchParams.set("job", params.selectedJob);
  if (params.leadTimeOffset !== 5) searchParams.set("offset", String(params.leadTimeOffset));

  const qs = searchParams.toString();
  return qs ? `${base}?${qs}` : base;
}

export function readShareParams(): Partial<ShareParams> {
  const searchParams = new URLSearchParams(window.location.search);
  const result: Partial<ShareParams> = {};

  const v = searchParams.get("v");
  if (v) result.videoId = v;

  const start = searchParams.get("start");
  if (start) {
    const parsed = parseInt(start, 10);
    if (!isNaN(parsed)) result.videoStartTime = parsed;
  }

  const job = searchParams.get("job");
  if (job) result.selectedJob = job as Job;

  const offset = searchParams.get("offset");
  if (offset) {
    const parsed = parseInt(offset, 10);
    if (!isNaN(parsed)) result.leadTimeOffset = parsed as LeadTimeOffset;
  }

  return result;
}
