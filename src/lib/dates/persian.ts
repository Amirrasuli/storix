const ISO_DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MILLISECONDS_PER_DAY = 86_400_000;

const persianDateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  dateStyle: "long",
  timeZone: "UTC",
});

const persianDateTimeFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  dateStyle: "medium",
  timeStyle: "short",
});

const persianRelativeFormatter = new Intl.RelativeTimeFormat("fa", {
  numeric: "auto",
});

/**
 * Parses a stored `YYYY-MM-DD` value without shifting it across time zones.
 */
export function parseIsoDateOnly(value: string): Date {
  const match = ISO_DATE_ONLY_PATTERN.exec(value);

  if (!match) {
    throw new RangeError(`Invalid ISO date-only value: ${value}`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new RangeError(`Invalid calendar date: ${value}`);
  }

  return date;
}

/**
 * Formats a stored Gregorian `YYYY-MM-DD` value in the Persian calendar.
 * Stored values stay Gregorian; only presentation changes.
 */
export function formatCalendarDate(value: string): string {
  return persianDateFormatter.format(parseIsoDateOnly(value));
}

/**
 * Formats an ISO 8601 timestamp in the Persian calendar and local time.
 */
export function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Invalid timestamp: ${value}`);
  }

  return persianDateTimeFormatter.format(date);
}

/**
 * Calculates a display-only relative age from an invoice date.
 * The relative phrase is never persisted.
 */
export function formatRelativeAge(
  invoiceDate: string,
  now: Date = new Date(),
): string {
  const invoice = parseIsoDateOnly(invoiceDate);
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const differenceInDays = Math.round(
    (invoice.getTime() - todayUtc) / MILLISECONDS_PER_DAY,
  );
  const absoluteDays = Math.abs(differenceInDays);

  if (absoluteDays < 30) {
    return persianRelativeFormatter.format(differenceInDays, "day");
  }

  if (absoluteDays < 365) {
    return persianRelativeFormatter.format(
      Math.trunc(differenceInDays / 30),
      "month",
    );
  }

  return persianRelativeFormatter.format(
    Math.trunc(differenceInDays / 365),
    "year",
  );
}
