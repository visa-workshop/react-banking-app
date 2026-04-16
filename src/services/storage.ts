import type { Transaction, Recipient } from '../context/AppContext';

const STORAGE_KEY = 'banking_app_state';

export interface PersistedState {
  user: { email: string; name: string } | null;
  balance: number;
  transactions: Transaction[];
  recipients: Recipient[];
  monthlyBudget: number;
}

const initialTransactions: Transaction[] = [
  {
    id: 't1',
    icon: 'coffee',
    name: 'Coffee',
    amount: 3.25,
    category: 'Coffee',
    date: '2026-04-16',
    time: '15:34',
    currencySymbol: '\u20ac',
    color: 'purple',
  },
  {
    id: 't2',
    icon: 'hotel',
    name: 'Hotel booking',
    amount: 323.26,
    category: 'Hotel',
    date: '2026-04-16',
    time: '12:21',
    currencySymbol: '\u20ac',
    color: 'yellow',
  },
  {
    id: 't3',
    icon: 'sync',
    name: 'Subscription payment',
    amount: 9.99,
    category: 'Subscriptions',
    date: '2026-04-16',
    time: '11:46',
    currencySymbol: '\u20ac',
    color: 'orange',
  },
  {
    id: 't4',
    icon: 'water',
    name: 'Water bill',
    amount: 54.21,
    category: 'Bills',
    date: '2026-04-16',
    time: '10:51',
    currencySymbol: '\u20ac',
    color: 'gray',
  },
  {
    id: 't5',
    icon: 'water',
    name: 'Supermarket',
    amount: 78.12,
    category: 'Groceries',
    date: '2026-04-16',
    time: '09:14',
    currencySymbol: '\u20ac',
    color: 'red',
  },
  {
    id: 't6',
    icon: 'local_activity',
    name: 'Tickets',
    amount: 78.12,
    category: 'Entertainment',
    date: '2026-04-16',
    time: '09:14',
    currencySymbol: '\u20ac',
    color: 'blue',
  },
  {
    id: 't7',
    icon: 'bolt',
    name: 'Electricity bill',
    amount: 43.55,
    category: 'Bills',
    date: '2026-04-16',
    time: '07:33',
    currencySymbol: '\u20ac',
    color: 'green',
  },
  {
    id: 't8',
    icon: 'coffee',
    name: 'Latte',
    amount: 4.5,
    category: 'Coffee',
    date: '2026-04-15',
    time: '16:20',
    currencySymbol: '\u20ac',
    color: 'purple',
  },
  {
    id: 't9',
    icon: 'sync',
    name: 'Netflix',
    amount: 15.99,
    category: 'Subscriptions',
    date: '2026-04-15',
    time: '08:00',
    currencySymbol: '\u20ac',
    color: 'orange',
  },
  {
    id: 't10',
    icon: 'water',
    name: 'Groceries',
    amount: 62.35,
    category: 'Groceries',
    date: '2026-04-15',
    time: '14:10',
    currencySymbol: '\u20ac',
    color: 'red',
  },
  {
    id: 't11',
    icon: 'local_activity',
    name: 'Cinema',
    amount: 12.0,
    category: 'Entertainment',
    date: '2026-04-14',
    time: '20:30',
    currencySymbol: '\u20ac',
    color: 'blue',
  },
  {
    id: 't12',
    icon: 'coffee',
    name: 'Espresso',
    amount: 2.8,
    category: 'Coffee',
    date: '2026-04-14',
    time: '09:15',
    currencySymbol: '\u20ac',
    color: 'purple',
  },
  {
    id: 't13',
    icon: 'bolt',
    name: 'Gas bill',
    amount: 67.89,
    category: 'Bills',
    date: '2026-04-13',
    time: '10:00',
    currencySymbol: '\u20ac',
    color: 'green',
  },
  {
    id: 't14',
    icon: 'water',
    name: 'Farmer market',
    amount: 34.2,
    category: 'Groceries',
    date: '2026-04-13',
    time: '11:45',
    currencySymbol: '\u20ac',
    color: 'red',
  },
  {
    id: 't15',
    icon: 'hotel',
    name: 'Airbnb',
    amount: 189.0,
    category: 'Hotel',
    date: '2026-04-12',
    time: '15:00',
    currencySymbol: '\u20ac',
    color: 'yellow',
  },
  {
    id: 't16',
    icon: 'sync',
    name: 'Spotify',
    amount: 9.99,
    category: 'Subscriptions',
    date: '2026-04-12',
    time: '08:00',
    currencySymbol: '\u20ac',
    color: 'orange',
  },
  {
    id: 't17',
    icon: 'local_activity',
    name: 'Concert tickets',
    amount: 45.0,
    category: 'Entertainment',
    date: '2026-04-11',
    time: '19:00',
    currencySymbol: '\u20ac',
    color: 'blue',
  },
  {
    id: 't18',
    icon: 'coffee',
    name: 'Cappuccino',
    amount: 3.9,
    category: 'Coffee',
    date: '2026-04-11',
    time: '08:30',
    currencySymbol: '\u20ac',
    color: 'purple',
  },
  {
    id: 't19',
    icon: 'water',
    name: 'Weekly groceries',
    amount: 95.6,
    category: 'Groceries',
    date: '2026-04-10',
    time: '10:20',
    currencySymbol: '\u20ac',
    color: 'red',
  },
  {
    id: 't20',
    icon: 'bolt',
    name: 'Internet bill',
    amount: 39.99,
    category: 'Bills',
    date: '2026-04-10',
    time: '09:00',
    currencySymbol: '\u20ac',
    color: 'green',
  },
];

const initialRecipients: Recipient[] = [
  { id: 1, name: 'Sarah Johnson', initials: 'SJ', color: 'blue', accountInfo: 'IBAN ...4521' },
  { id: 2, name: 'Mike Peters', initials: 'MP', color: 'purple', accountInfo: 'IBAN ...8834' },
  { id: 3, name: 'Emma Wilson', initials: 'EW', color: 'red', accountInfo: 'IBAN ...2290' },
  { id: 4, name: 'James Brown', initials: 'JB', color: 'green', accountInfo: 'IBAN ...6617' },
  { id: 5, name: 'Lisa Chen', initials: 'LC', color: 'orange', accountInfo: 'IBAN ...3345' },
];

export const defaultState: PersistedState = {
  user: null,
  balance: 1325.5,
  transactions: initialTransactions,
  recipients: initialRecipients,
  monthlyBudget: 2000,
};

export function loadState(): PersistedState {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return defaultState;
    }
    return JSON.parse(serialized) as PersistedState;
  } catch {
    return defaultState;
  }
}

export function saveState(state: PersistedState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}
