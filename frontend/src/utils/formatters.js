/**
 * Formatting Utilities
 * Shared helpers for race durations, deltas, and tire compound display labels.
 */

/**
 * Formats a duration in seconds into `MMm SS.SSs` format.
 * @param {number | null | undefined} totalSeconds
 * @returns {string}
 */
export function formatRaceTime(totalSeconds) {
  if (totalSeconds === null || totalSeconds === undefined || Number.isNaN(totalSeconds)) {
    return '-';
  }
  const mins = Math.floor(totalSeconds / 60);
  const secs = (totalSeconds % 60).toFixed(2);
  return `${mins}m ${secs.padStart(5, '0')}s`;
}

/**
 * Formats a duration in seconds into compact `MMm SSs` format for chart axes.
 * @param {number | null | undefined} totalSeconds
 * @returns {string}
 */
export function formatShortRaceTime(totalSeconds) {
  if (totalSeconds === null || totalSeconds === undefined || Number.isNaN(totalSeconds)) {
    return '-';
  }
  const mins = Math.floor(totalSeconds / 60);
  const secs = (totalSeconds % 60).toFixed(0);
  return `${mins}m ${secs}s`;
}

/**
 * Formats a race duration into `Hh MMm SS.Ss` format for full-race telemetry comparison.
 * @param {number | null | undefined} totalSeconds
 * @returns {string}
 */
export function formatFullRaceDuration(totalSeconds) {
  if (totalSeconds === null || totalSeconds === undefined || Number.isNaN(totalSeconds)) {
    return '-';
  }
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = (totalSeconds % 60).toFixed(1);
  return `${hours}h ${mins}m ${secs}s`;
}

/**
 * Formats a scalar value in seconds with fixed decimal precision.
 * @param {number | null | undefined} seconds
 * @param {number} [decimals=2]
 * @returns {string}
 */
export function formatSeconds(seconds, decimals = 2) {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds)) {
    return '-';
  }
  return `${Number(seconds).toFixed(decimals)}s`;
}
