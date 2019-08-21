import Store from 'electron-store';

const INTERVAL_FILE = 'intervals';
const PAYMENT_FILE = 'payments';

function getIntervalStore() {
  return new Store({name: INTERVAL_FILE, defaults: {intervals: []}});
}

function getPaymentStore() {
  return new Store({name: PAYMENT_FILE, defaults: {payments: []}});
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

export function getAllPayments() {
  const store = getPaymentStore();
  return store.get('payments')
}

export function savePayment(payment) {
  const store = getPaymentStore();
  const allPayments = getAllPayments();
  allPayments.push(payment);
  store.set('payments', allPayments);
}
