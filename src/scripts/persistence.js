import Store from 'electron-store';

const PROJECTS_FILE = 'projects';
const INTERVAL_FILE = 'intervals';

function getIntervalStore() {
  return new Store({name: INTERVAL_FILE, defaults: {intervals: []}});
}

export function getAllIntervals() {
  const store = getIntervalStore();
  return store.get('intervals')
}

export function saveInterval(interval) {
  const store = getIntervalStore();
  const allIntervals = getAllIntervals();
  allIntervals.push(interval);
  store.set('intervals', allIntervals);
}
