const DAYS_DICT = {
  Sunday: 'Sunday',
  Monday: 'Monday',
  Tuesday: 'Tuesday',
  Wednesday: 'Wednesday',
  Thursday: 'Thursday',
  Friday: 'Friday',
  Saturday: 'Saturday',
}
const DAYS = Object.values(DAYS_DICT); // ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function getDayIndex(day) {
  return DAYS.map(day => day.toLowerCase()).indexOf(day.toLowerCase());
}

function getDayValue(index) {
  return DAYS[index];
}


export {
  DAYS,
  getDayIndex,
  getDayValue,
  DAYS_DICT
}