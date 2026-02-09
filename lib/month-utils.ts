/**
 * Month mapping utilities for handling different month formats
 */

// Indonesian month names
export const MONTH_NAMES_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

// Month number to name mapping (1-12 to name)
export const MONTH_NUMBER_TO_NAME: Record<string, string> = {
  "1": "Januari",
  "2": "Februari",
  "3": "Maret",
  "4": "April",
  "5": "Mei",
  "6": "Juni",
  "7": "Juli",
  "8": "Agustus",
  "9": "September",
  "10": "Oktober",
  "11": "November",
  "12": "Desember",
  "01": "Januari",
  "02": "Februari",
  "03": "Maret",
  "04": "April",
  "05": "Mei",
  "06": "Juni",
  "07": "Juli",
  "08": "Agustus",
  "09": "September",
};

// Month name to number mapping (name to 1-12)
export const MONTH_NAME_TO_NUMBER: Record<string, string> = {
  Januari: "1",
  Februari: "2",
  Maret: "3",
  April: "4",
  Mei: "5",
  Juni: "6",
  Juli: "7",
  Agustus: "8",
  September: "9",
  Oktober: "10",
  November: "11",
  Desember: "12",
};

// Month name to padded number (name to 01-12)
export const MONTH_NAME_TO_PADDED: Record<string, string> = {
  Januari: "01",
  Februari: "02",
  Maret: "03",
  April: "04",
  Mei: "05",
  Juni: "06",
  Juli: "07",
  Agustus: "08",
  September: "09",
  Oktober: "10",
  November: "11",
  Desember: "12",
};

/**
 * Convert month name to number format
 * @param monthName - Indonesian month name (e.g., "Januari")
 * @param padded - Whether to pad with zero (e.g., "01" vs "1")
 * @returns Month number as string
 */
export function monthNameToNumber(monthName: string, padded: boolean = false): string {
  if (padded) {
    return MONTH_NAME_TO_PADDED[monthName] || monthName;
  }
  return MONTH_NAME_TO_NUMBER[monthName] || monthName;
}

/**
 * Convert month number to name
 * @param monthNumber - Month as number string (e.g., "1", "01")
 * @returns Indonesian month name
 */
export function monthNumberToName(monthNumber: string): string {
  return MONTH_NUMBER_TO_NAME[monthNumber] || monthNumber;
}

/**
 * Normalize month value for database query
 * Tries to detect the format and convert accordingly
 * @param month - Month in any format
 * @returns Normalized month value
 */
export function normalizeMonthForDB(month: string): string {
  // If it's already a number, return as is
  if (/^\d{1,2}$/.test(month)) {
    return month;
  }

  // If it's a month name, try to convert to number
  // First try unpadded, then padded based on what's in the DB
  return monthNameToNumber(month, false);
}
