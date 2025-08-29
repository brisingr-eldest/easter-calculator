import { calculateEaster } from './easter.js';

const $ = id => document.getElementById(id);

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
  const diffDays = Math.round((t1 - t0) / (24 * 60 * 60 * 1000)); // positive => in the future

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

  // same calendar year
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

  // different year but adjacent
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

  // generic older or future year
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
  if (t === 'future') return 'will be Easter';
  return '';
}

function onYearInput(e) {
  const y = parseInt(e.target.value, 10);
  if (Number.isNaN(y) || y < 1583) {
    output.textContent = "Pick any year after 1582.";
    tenseField.textContent = '';
    return;
  }

  const easterDate = calculateEaster(y);
  const { msg, tense } = compareDate(easterDate);
  output.textContent = msg;
  tenseField.textContent = tenseSetter(tense);
}

// attach events if elements exist
if (yearInput) {
  yearInput.addEventListener('input', onYearInput);
  // initialize with current year
  yearInput.value = new Date().getFullYear();
  const todayEaster = calculateEaster(new Date().getFullYear());
  const initial = compareDate(todayEaster);
  tenseField.textContent = tenseSetter(initial.tense);
  output.textContent = initial.msg;
}
