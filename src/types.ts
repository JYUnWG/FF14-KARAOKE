export type TimelineEventType =
  | "boss"
  | "party"
  | "tank"
  | "healer"
  | "dps"
  | "mitigation"
  | "note";

export type Severity = "info" | "warning" | "danger";

export type Job =
  | "ALL"
  | "PLD"
  | "WAR"
  | "DRK"
  | "GNB"
  | "WHM"
  | "SCH"
  | "AST"
  | "SGE"
  | "MNK"
  | "DRG"
  | "NIN"
  | "SAM"
  | "RPR"
  | "BRD"
  | "MCH"
  | "DNC"
  | "BLM"
  | "SMN"
  | "RDM"
  | "PCT"
  | "VPR";

export interface TimelineEvent {
  id: string;
  time: number;
  title: string;
  description: string;
  type: TimelineEventType;
  jobs: Exclude<Job, "ALL">[];
  severity: Severity;
  duration?: number;
}

export interface EncounterTimeline {
  encounterName: string;
  duration: number;
  events: TimelineEvent[];
}

export type PlaybackRate = 0.5 | 1 | 1.5 | 2;
export type LeadTimeOffset = 0 | 1 | 3 | 5 | 10;
