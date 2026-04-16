import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

import { loadState, saveState, clearState, defaultState } from '../services/storage';
import * as api from '../services/api';
import { Sentry } from '../sentry';

// Types
export interface Transaction {
  id: string;
  icon: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  time: string;
  currencySymbol: string;
  color: string;
}

export interface Recipient {
  id: number;
  name: string;
  initials: string;
  color: string;
  accountInfo: string;
}

interface AppState {
  user: { email: string; name: string } | null;
  balance: number;
  transactions: Transaction[];
  recipients: Recipient[];
  monthlyBudget: number;
  loading: boolean;
}

type AppAction =
  | { type: 'SIGN_IN'; payload: { email: string; name: string } }
  | { type: 'SIGN_OUT' }
  | { type: 'SET_BALANCE'; payload: number }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'PREPEND_TRANSACTION'; payload: Transaction }
  | { type: 'DEDUCT_BALANCE'; payload: number }
  | { type: 'ADD_BALANCE'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean };

interface AppContextValue extends AppState {
  sendMoney: (recipientId: number, amount: number) => Promise<void>;
  addMoney: (amount: number) => Promise<void>;
  signIn: (email: string) => void;
  signOut: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// Icon/category color map
const categoryColors: Record<string, string> = {
  Coffee: 'purple',
  Hotel: 'yellow',
  Subscriptions: 'orange',
  Bills: 'gray',
  Groceries: 'red',
  Entertainment: 'blue',
  Transfer: 'green',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SIGN_IN':
      return { ...state, user: action.payload };
    case 'SIGN_OUT':
      return { ...defaultState, loading: false };
    case 'SET_BALANCE':
      return { ...state, balance: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'PREPEND_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'DEDUCT_BALANCE':
      return { ...state, balance: state.balance - action.payload };
    case 'ADD_BALANCE':
      return { ...state, balance: state.balance + action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const persisted = loadState();
  const [state, dispatch] = useReducer(appReducer, {
    ...persisted,
    loading: false,
  });

  // Persist state on changes (skip loading flag)
  useEffect(() => {
    saveState({
      user: state.user,
      balance: state.balance,
      transactions: state.transactions,
      recipients: state.recipients,
      monthlyBudget: state.monthlyBudget,
    });
  }, [state.user, state.balance, state.transactions, state.recipients, state.monthlyBudget]);

  const signIn = useCallback((email: string) => {
    const name = email.split('@')[0].replace(/[._]/g, ' ');
    dispatch({ type: 'SIGN_IN', payload: { email, name } });
    Sentry.setUser({ email });
  }, []);

  const signOut = useCallback(() => {
    clearState();
    dispatch({ type: 'SIGN_OUT' });
    Sentry.setUser(null);
  }, []);

  const sendMoney = useCallback(
    async (recipientId: number, amount: number) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        await api.processTransfer(recipientId, amount);

        const recipient = state.recipients.find((r) => r.id === recipientId);
        const recipientName = recipient ? recipient.name : `Recipient #${recipientId}`;

        dispatch({ type: 'DEDUCT_BALANCE', payload: amount });
        dispatch({
          type: 'PREPEND_TRANSACTION',
          payload: {
            id: `txn_${Date.now()}`,
            icon: 'send',
            name: `Transfer to ${recipientName}`,
            amount,
            category: 'Transfer',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            currencySymbol: '\u20ac',
            color: categoryColors['Transfer'] || 'green',
          },
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.recipients]
  );

  const addMoney = useCallback(async (amount: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await api.addFunds(amount);

      dispatch({ type: 'ADD_BALANCE', payload: amount });
      dispatch({
        type: 'PREPEND_TRANSACTION',
        payload: {
          id: `txn_${Date.now()}`,
          icon: 'add_circle',
          name: 'Added funds',
          amount,
          category: 'Transfer',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          currencySymbol: '\u20ac',
          color: 'green',
        },
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const value: AppContextValue = {
    ...state,
    sendMoney,
    addMoney,
    signIn,
    signOut,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
