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

/** Display names for the API's `JobPostSectionType`, used as default headings. */
export const sectionTypeLabels = {
  DESCRIPTION: "Description",
  REQUIREMENT_RESPONSIBILITY: "Requirements & responsibilities",
  BENEFIT: "Benefits",
  QUALIFICATION: "Qualifications",
  NICE_TO_HAVE: "Nice to have",
  ABOUT_ROLE: "About the role",
} as const;

export const sectionTypes = Object.keys(
  sectionTypeLabels,
) as (keyof typeof sectionTypeLabels)[];

/** Substrings that place a freely written heading into a section type. */
const sectionTypeKeywords: [string, keyof typeof sectionTypeLabels][] = [
  ["requirement", "REQUIREMENT_RESPONSIBILITY"],
  ["responsib", "REQUIREMENT_RESPONSIBILITY"],
  ["what you'll do", "REQUIREMENT_RESPONSIBILITY"],
  ["benefit", "BENEFIT"],
  ["perk", "BENEFIT"],
  ["we offer", "BENEFIT"],
  ["qualification", "QUALIFICATION"],
  ["you'll need", "QUALIFICATION"],
  ["nice to have", "NICE_TO_HAVE"],
  ["bonus", "NICE_TO_HAVE"],
  ["plus", "NICE_TO_HAVE"],
  ["about", "ABOUT_ROLE"],
  ["description", "DESCRIPTION"],
];

/**
 * Picks a `sectionType` for a heading the recruiter wrote themselves.
 *
 * The API demands one of six types per section, but nothing in the app renders
 * by type — headings are shown verbatim. So recruiters write whatever heading
 * they want and the type is inferred here rather than asked for, falling back
 * to the neutral `ABOUT_ROLE` for headings that match nothing.
 */
export function deriveSectionType(
  title: string,
): keyof typeof sectionTypeLabels {
  const heading = title.trim().toLowerCase();

  const exact = sectionTypes.find(
    (type) => sectionTypeLabels[type].toLowerCase() === heading,
  );
  if (exact) return exact;

  const keyword = sectionTypeKeywords.find(([term]) => heading.includes(term));
  return keyword ? keyword[1] : "ABOUT_ROLE";
}

export const NOT_SPECIFIED = "none";

/** Prepends a "not specified" choice so optional selects can be cleared. */
export function withNotSpecified(
  options: readonly { value: string; label: string }[],
) {
  return [{ value: NOT_SPECIFIED, label: "Not specified" }, ...options];
}
