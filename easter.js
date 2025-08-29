/**
 * @file easter.js
 * @description
 * Utilities for calculating the date of Easter Sunday (Gregorian calendar).
 *
 * This module provides a clean API for computing Easter using the Computus algorithm.
 * - Accepts a Gregorian year (≥ 1583).
 * - Returns the Easter date as a `[year, month, day]` tuple.
 * - Used as a base utility that can be imported into projects needing holiday logic, liturgical calendars, or date-based calculations.
 *
 * References:
 * - Computus (Easter date calculation): https://en.wikipedia.org/wiki/Computus
 */

/**
 * Calculate Gregorian Easter Sunday for a given year.
 * 
 * Algorithm: Anonymous Gregorian Computus
 * Source: based on rules from the Gregorian calendar reform (1582).
 * 
 * Easter Sunday = first Sunday after the "Paschal Full Moon"
 * (the first ecclesiastical full moon on or after March 21, the spring equinox).
 */

/**
 * Calculates the Gregorian Easter date for a given year using the Computus algorithm.
 *
 * - Valid for Gregorian calendar years (≥ 1583).
 * - Based on a sequence of modular arithmetic steps involving the Metonic cycle,
 *   leap year corrections, the epact (moon age), weekday alignment, and final adjustments.
 * - Returns the result as a tuple `[year, month, day]`.
 *
 * @function calculateEasterYMD
 * @param {number} y The Gregorian year (must be an integer ≥ 1583).
 * @returns {[number, number, number]} A tuple containing `[year, month, day]` where `month` is `3` (March) or `4` (April).
 * @throws {TypeError} If `y` is not an integer.
 * @throws {RangeError} If `y < 1583` (Gregorian reform start).
 *
 * @example
 * calculateEasterYMD(2024); // → [2024, 3, 31]
 * calculateEasterYMD(2025); // → [2025, 4, 20]
 */
export function calculateEasterYMD(y) {
  // Guard: algorithm valid for Gregorian calendar years (>= 1583)
  if (typeof y !== 'number' || !Number.isInteger(y)) {
    throw new TypeError('year must be an integer');
  }
  if (y < 1583) {
    throw new RangeError('Gregorian Easter is defined for years >= 1583');
  }

  // 1. The Golden Number (Metonic Cycle)

  // The moon's phases realign with calendar dates every nineteen years.
  // This cycle is called the Metonic Cycle.
  // The error of this calculation is only about 2 hours per cycle.

  const mc = 19;        // 'mc' is the Metonic Cycle constant
  const a = y % mc;  // 'a' is the "Golden Number", describing where in the cycle the year falls.




  // 2. Century-based values

  // These numbers are needed for leap year corrections.
  // Leap years happen every fourth year, except for "century years" (e.g. 1700, 1800, etc.)
  // unless those century years are divisible by 400 (e.g. 2000, 2400, etc.).

  const b = Math.floor(y / 100); // 'b' is the "century number".
  const c = y % 100;             // 'c' is the year within the century.




  // 3. Leap year corrections

  // These calculations are needed to correct for the drift that would occur due to leap years.

  const d = Math.floor(b / 4);            // 'd' is the number of leap cantury years that have occurred among centuries.
  const e = b % 4;                        // 'e' is the number of centuries since the last leap century.
  const f = Math.floor((b + 8) / 25);     // 'f' is the approximation of how many "century years" have been skipped as leap years since the calendar reform. 
  const g = Math.floor((b - f + 1) / 3);  // 'g' is the adjustment needed for the lunar cycle drift that happens when accounting for leap years.




  // 4. The Epact (Moon age)

  // The epact is the moon's "age" on March 21, that is, the days since the previous new moon.
  // Knowing the moon's age on March 21 allows for the prediction of the next full mooon.

  const h = ((mc * a) + b - d - g + 15) % 30; // 'h' calculates the Epact by using the moon's contribution according to the Metonic Cycle (mc * a), the century correction (+ b), the leap year correction (- d), the Gregorian moon correction (- g), and anchoring to the spring equinox (March 21) using the constant 15. Then it is reduced to be within a lunar month (% 30).




  // 5. Weekday corrections

  // These calculations are needed to correct the result of previous calculations into the right weekday (Sunday).
  // Note: traditionally, the letter 'j' is omitted from these calculations, stemming from their first publication in Latin.

  const i = Math.floor(c / 4);                    // 'i' is the number of leap years that ahve occured in this century.
  const k = c % 4;                                // 'k' is the number of years since the last leap year.
  const l = (32 + (2 * e) + (2 * i) - h - k) % 7; // 'l' calculates the shift needed to set the calculation on Sunday. 32 is the base offset, chosen so the calculations do not return negative numbers or incorrect placements of Easter. (2 * e) and (2 * l) adjust the calculation based on leap years at the century and year-within-century levels. (- h) the moon's age and (- k) the years since the last leap year are adjusted for. (% 7) reduces the calculation to the day of the week.




  // 6. Final correction

  // Rarely, the combindation of the moon cyclce (a), epact (h), and weekday correction (l) can push the Easter calculation too far.
  // This calculation detects and corrects edge cases when the other calculations would otherwise set the date of Easter to March 21 or April 26.

  const m = Math.floor((a + (11 * h) + (22 * l)) / 451);  // 'm' bounds the previous calculation to March 22–April 25 (inclusive). The first half (a + (11 * h) + (22 * l)) builds a "test number" to compare against a chosen constant (451).




  // 7. Month and Day calculation

  // Finally, these calculations are used to turn the result of the previous calculations into a real calendar date for the current year.

  const month = Math.floor((h + l - (7 * m) + 114) / 31); // Using the offset of 114 to get the result into the correct range, the previous calculations are tested to see in which month Easter should fall: 3 for March or 4 for April.
  const day = ((h + l - (7 * m) + 114) % 31) + 1;         // Using a very similar calculation and again the offset of 114, the previous calculations are tested to see on which day Easter should fall.

  return [y, month, day];
}


/**
 * Calculates the date of Easter Sunday in the Gregorian calendar for a given year.
 *
 * @param {number} year - The Gregorian calendar year (>= 1583).
 * @returns {Date} JavaScript Date object set to Easter Sunday of that year.
 */
export function calculateEaster(year) {
  const [y, month, day] = calculateEasterYMD(year);
  return new Date(Number(y), Number(month) - 1, Number(day));
}