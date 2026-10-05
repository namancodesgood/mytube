const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumSignificantDigits: 3,
});

// "4550000" -> "4.55M", the way YouTube shortens views and subscribers
export const formatTotalCount = (count: string) =>
  compactNumber.format(Number(count));

const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "always" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["week", 7 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
  ["second", 1],
];

// ISO timestamp -> "16 years ago"
export const getFormattedTime = (timestamp: string, now = Date.now()) => {
  const seconds = Math.max(0, (now - Date.parse(timestamp)) / 1000 || 0);
  const [unit, size] =
    UNITS.find(([, length]) => seconds >= length) ?? UNITS[UNITS.length - 1];
  return relativeTime.format(-Math.floor(seconds / size), unit);
};

// ISO 8601 duration ("PT1H2M3S", "P1DT1M") -> seconds
export const getDurationSeconds = (duration: string) => {
  const [days = 0, hours = 0, minutes = 0, seconds = 0] = (
    duration.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/) ?? []
  )
    .slice(1)
    .map((part) => Number(part) || 0);
  return ((days * 24 + hours) * 60 + minutes) * 60 + seconds;
};

// ISO 8601 duration -> "3:33" or "1:02:03"; "" when there is no length (live streams are "P0D")
export const getFormattedDuration = (duration: string) => {
  const total = getDurationSeconds(duration);
  const hours = Math.floor(total / 3600);
  const minutes = String(Math.floor((total % 3600) / 60));
  const seconds = String(total % 60).padStart(2, "0");

  if (!total) return "";

  return hours
    ? `${hours}:${minutes.padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`;
};

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

// search.list returns titles HTML-escaped ("Don&#39;t") -> plain text
export const decodeHtml = (text: string) =>
  text.replace(/&(#x?[\da-f]+|[a-z]+);/gi, (entity, code: string) =>
    code.startsWith("#")
      ? String.fromCodePoint(Number(code.slice(1).replace(/^x/i, "0x")))
      : ENTITIES[code] ?? entity
  );
