/**
 * Converts a non-strict time string into seconds.
 *
 * The number of colons decides how the segments are read:
 * - `"h:m:s"` (2 colons) - hours, minutes, seconds
 * - `"m:s"`   (1 colon)  - minutes, seconds
 * - `"s"`     (0 colons) - seconds
 *
 * Segments may be empty, zero-padded or decimal; an empty segment counts as `0`.
 *
 * @param timeString - Time such as `"2:2:2"`, `"02:00"`, `"::0.2"` or `""`.
 * @returns The total number of seconds.
 * @throws {TypeError} If a segment is not a number, or more than 2 colons are given.
 *
 * @example
 * timeToSeconds("2:2:2"); // => 7322
 * timeToSeconds("0.2:");  // => 12
 * timeToSeconds("::");    // => 0
 */
declare function timeToSeconds(timeString: string): number;

export = timeToSeconds;
