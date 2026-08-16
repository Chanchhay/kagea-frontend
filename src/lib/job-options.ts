/**
 * `jobType`, `workMode`, and `experienceLevel` are plain strings in the API —
 * the spec defines no enum for them. These are the values the frontend sends;
 * confirm them against the backend before relying on filtering, and change them
 * here only (the public job filters read the same lists).
 */

export const workModeOptions = [
  { value: "ONSITE", label: "On-site" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "REMOTE", label: "Remote" },
] as const;

export const jobTypeOptions = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "TEMPORARY", label: "Temporary" },
] as const;

export const experienceLevelOptions = [
  { value: "ENTRY", label: "Entry level" },
  { value: "JUNIOR", label: "Junior" },
  { value: "MID", label: "Mid level" },
  { value: "SENIOR", label: "Senior" },
  { value: "LEAD", label: "Lead" },
] as const;

/** Common Cambodian hiring locations used by recruiter job forms. */
export const locationOptions = [
  { value: "Banteay Meanchey", label: "Banteay Meanchey" },
  { value: "Battambang", label: "Battambang" },
  { value: "Kampong Cham", label: "Kampong Cham" },
  { value: "Kampong Chhnang", label: "Kampong Chhnang" },
  { value: "Kampong Speu", label: "Kampong Speu" },
  { value: "Kampong Thom", label: "Kampong Thom" },
  { value: "Kampot", label: "Kampot" },
  { value: "Kandal", label: "Kandal" },
  { value: "Kep", label: "Kep" },
  { value: "Koh Kong", label: "Koh Kong" },
  { value: "Kratie", label: "Kratie" },
  { value: "Mondulkiri", label: "Mondulkiri" },
  { value: "Oddar Meanchey", label: "Oddar Meanchey" },
  { value: "Pailin", label: "Pailin" },
  { value: "Phnom Penh", label: "Phnom Penh" },
  { value: "Preah Sihanouk", label: "Preah Sihanouk" },
  { value: "Preah Vihear", label: "Preah Vihear" },
  { value: "Pursat", label: "Pursat" },
  { value: "Prey Veng", label: "Prey Veng" },
  { value: "Ratanakiri", label: "Ratanakiri" },
  { value: "Siem Reap", label: "Siem Reap" },
  { value: "Stung Treng", label: "Stung Treng" },
  { value: "Svay Rieng", label: "Svay Rieng" },
  { value: "Takeo", label: "Takeo" },
  { value: "Tboung Khmum", label: "Tboung Khmum" },
] as const;

export const NOT_SPECIFIED = "none";

/** Prepends a "not specified" choice so optional selects can be cleared. */
export function withNotSpecified(
  options: readonly { value: string; label: string }[],
) {
  return [{ value: NOT_SPECIFIED, label: "Not specified" }, ...options];
}
