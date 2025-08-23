/**
 * Calculate Gregorian Easter Sunday for a given year.
 * 
 * Algorithm: Anonymous Gregorian Computus
 * Source: based on rules from the Gregorian calendar reform (1582).
 * 
 * Easter Sunday = first Sunday after the "Paschal Full Moon"
 * (the first ecclesiastical full moon on or after March 21, the spring equinox).
 */


const $ = id => document.getElementById(id);


const yearInput = $('year-input');
const output = $('output');
const tenseField = $('tense-field');


function calculateEaster(y) {

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

  m = Math.floor((a + (11 * h) + (22 * 1)) / 451);  // 'm' bounds the previous calculation to March 22–April 25 (inclusive). The first half (a + (11 * h) + (22 * l)) builds a "test number" to compare against a chosen constant (451).




  // 7. Month and Day calculation

  // Finally, these calculations are used to turn the result of the previous calculations into a real calendar date for the current year.

  month = Math.floor((h + l - (7 * m) + 114) / 31); // Using the offset of 114 to get the result into the correct range, the previous calculations are tested to see in which month Easter should fall: 3 for March or 4 for April.
  day = ((h + l - (7 * m) + 114) % 31) + 1;         // Using a very similar calculation and again the offset of 114, the previous calculations are tested to see on which day Easter should fall.



  return [y, month, day];
}


function compareDate(jahr, monat, tag) {
  const compDate = new Date(Number(jahr), Number(monat) - 1, Number(tag));
  const compYear = compDate.getFullYear();
  const compMonth = compDate.getMonth() + 1;
  const compDay = compDate.getDate();

  const readableMonth = `${compDate.toLocaleDateString('default', { month: 'long' })}`;

  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  let msg;
  let tense;

  if (compYear < year) {
    if (compYear === year - 1) {
      msg = `Last year, Easter was on ${readableMonth} ${compDay}.`;
      tense = `past`;
      return [msg, tense];
    }

    msg = `In ${compYear}, Easter was on ${readableMonth} ${compDay}.`;
    tense = `past`;
    return [msg, tense];

  } else if (compYear === year) {

    if (compMonth === month && compDay === day) {
      msg = `Today, ${readableMonth} ${compDay}, ${compYear} is Easter!`;
      tense = `present`;
      return [msg, tense];

    } else if (compMonth === month && compDay === day + 1) {
      msg = `Tomorrow, ${readableMonth} ${compDay}, ${compYear} is Easter!`;
      tense = `future`;
      return [msg, tense];

    } else if (compMonth === month && compDay === day - 1) {
      msg = `Yesterday, ${readableMonth} ${compDay}, ${compYear} was Easter!`;
      tense = `past`;
      return [msg, tense];

    } else if (compMonth < month || (compMonth === month && compDay < day)) {
      msg = `This year, Easter was on ${readableMonth} ${compDay}.`;
      tense = `past`;
      return [msg, tense];

    } else {
      msg = `This year, Easter will be on ${readableMonth} ${compDay}.`;
      tense = `future`;
      return [msg, tense];
    }

  } else {

    if (compYear === year + 1) {
      msg = `Next year, Easter will be on ${readableMonth} ${compDay}.`;
      tense = `future`;
      return [msg, tense];
    }

    msg = `In ${compYear}, Easter will be on ${readableMonth} ${compDay}.`;
    tense = `future`;
    return [msg, tense];
  }
}

function tenseSetter(t) {
  let tenseWord;

  if (t === 'past') tenseWord = 'was Easter';
  if (t === 'present') tenseWord = 'is Easter';
  if (t === 'future') tenseWord = 'will Easter be';

  return tenseWord;
}

yearInput.addEventListener('input', () => {
  const y = parseInt(yearInput.value, 10);

  if (isNaN(y) || y < 1583) {
    output.textContent = "Pick any year after 1582.";
    return;
  }

  const easterDate = calculateEaster(y);
  const msg = compareDate(...easterDate)[0];
  const tenseWord = tenseSetter(compareDate(...easterDate)[1]);
  output.textContent = msg;
  tenseField.textContent = tenseWord;
});

yearInput.value = new Date().getFullYear();
tenseField.textContent = tenseSetter(compareDate(...calculateEaster(new Date().getFullYear()))[1]);
output.textContent = compareDate(...calculateEaster(new Date().getFullYear()))[0];