import { calculateEaster } from './easter.js';

const $ = id => document.getElementById(id);

// DOM element IDs from your example
const yearInput = $('year-input');
const output = $('output');
const tenseField = $('tense-field');

function compareDate(dateObj) {
  if (!(dateObj instanceof Date)) {
    throw new TypeError('compareDate expects a Date');
  }

  const compYear = dateObj.getFullYear();
  const compDay = dateObj.getDate();
  const readableMonth = dateObj.toLocaleDateString('default', { month: 'long' });

  const today = new Date();
  const t0 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const t1 = Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  const diffDays = Math.round((t1 - t0) / (24 * 60 * 60 * 1000)); // positive => future

  let msg;
  let tense;

  if (diffDays === 0) {
    msg = `Today, ${readableMonth} ${compDay}, ${compYear} is Easter!`;
    tense = 'present';
    return { msg, tense };
  }

  if (diffDays === 1) {
    msg = `Tomorrow, ${readableMonth} ${compDay}, ${compYear} is Easter!`;
    tense = 'future';
    return { msg, tense };
  }

  if (diffDays === -1) {
    msg = `Yesterday, ${readableMonth} ${compDay}, ${compYear} was Easter!`;
    tense = 'past';
    return { msg, tense };
  }

  const thisYear = today.getFullYear();
  if (compYear === thisYear) {
    if (diffDays < 0) {
      msg = `This year, Easter was on ${readableMonth} ${compDay}.`;
      tense = 'past';
    } else {
      msg = `This year, Easter will be on ${readableMonth} ${compDay}.`;
      tense = 'future';
    }
    return { msg, tense };
  }

  if (compYear === thisYear - 1) {
    msg = `Last year, Easter was on ${readableMonth} ${compDay}.`;
    tense = 'past';
    return { msg, tense };
  }
  if (compYear === thisYear + 1) {
    msg = `Next year, Easter will be on ${readableMonth} ${compDay}.`;
    tense = 'future';
    return { msg, tense };
  }

  if (compYear < thisYear) {
    msg = `In ${compYear}, Easter was on ${readableMonth} ${compDay}.`;
    tense = 'past';
  } else {
    msg = `In ${compYear}, Easter will be on ${readableMonth} ${compDay}.`;
    tense = 'future';
  }
  return { msg, tense };
}

function tenseSetter(t) {
  if (t === 'past') return 'was Easter';
  if (t === 'present') return 'is Easter';
  if (t === 'future') return 'will Easter be';
  return '';
}

function updateUIForYear(year) {
  const easterDate = calculateEaster(year);
  const { msg, tense } = compareDate(easterDate);
  if (output) output.textContent = msg;
  if (tenseField) tenseField.textContent = tenseSetter(tense);
}

function onYearInput(e) {
  const raw = String(e.target.value || '').trim();
  if (raw === '') return; // user is editing/backspacing — don't change the question

  const y = parseInt(raw, 10);
  if (Number.isNaN(y) || y < 1583) {
    // invalid or out of Gregorian range — do not update UI
    return;
  }

  updateUIForYear(y);
}

if (yearInput) {
  yearInput.addEventListener('input', onYearInput);

  yearInput.addEventListener('blur', () => {
    if (yearInput.value.trim() === '') {
      const currentYear = new Date().getFullYear();
      yearInput.value = currentYear;
      updateUIForYear(currentYear);
    }
  });

  // initialize with current year
  const currentYear = new Date().getFullYear();
  yearInput.value = currentYear;
  updateUIForYear(currentYear);
}

document.addEventListener('keydown', e => {
  // only react to number keys 0–9
  if (e.key >= '0' && e.key <= '9') {
    if (document.activeElement !== yearInput) {
      e.preventDefault(); // prevent typing elsewhere
      yearInput.focus();
      yearInput.value = e.key; // start fresh with the typed digit
      // trigger input handler so UI updates
      yearInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
});

yearInput.focus();