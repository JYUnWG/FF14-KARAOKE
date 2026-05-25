import type { Job } from "../types";

const jobs: Job[] = [
  "ALL",
  "PLD",
  "WAR",
  "DRK",
  "GNB",
  "WHM",
  "SCH",
  "AST",
  "SGE",
  "MNK",
  "DRG",
  "NIN",
  "SAM",
  "RPR",
  "BRD",
  "MCH",
  "DNC",
  "BLM",
  "SMN",
  "RDM",
  "PCT",
  "VPR",
];

interface JobFilterProps {
  selectedJob: Job;
  onChange: (job: Job) => void;
}

export function JobFilter({ selectedJob, onChange }: JobFilterProps) {
  return (
    <label className="flex min-w-40 flex-col gap-2 text-xs font-semibold uppercase text-slate-400">
      Job
      <select
        value={selectedJob}
        onChange={(event) => onChange(event.target.value as Job)}
        className="h-11 rounded border border-white/10 bg-surface-800 px-3 text-sm font-bold text-slate-100 outline-none transition focus:border-aether-500"
      >
        {jobs.map((job) => (
          <option key={job} value={job}>
            {job}
          </option>
        ))}
      </select>
    </label>
  );
}
