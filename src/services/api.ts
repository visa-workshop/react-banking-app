/**
 * Mock API service that simulates backend calls with delays.
 * processTransfer randomly fails ~20% of the time to preserve Sentry demo.
 */

function simulateDelay(): Promise<void> {
  const delay = 500 + Math.random() * 1000; // 500-1500ms
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function fetchBalance(balance: number): Promise<number> {
  await simulateDelay();
  return balance;
}

export interface TransactionData {
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

export async function fetchTransactions(
  transactions: TransactionData[]
): Promise<TransactionData[]> {
  await simulateDelay();
  return transactions;
}

export async function processTransfer(
  recipientId: number,
  amount: number
): Promise<{ success: boolean; transactionId: string }> {
  await simulateDelay();

  // ~20% failure rate
  if (Math.random() < 0.2) {
    throw new Error(
      `Transfer failed: unable to process payment of \u20ac${amount.toFixed(2)} to recipient #${recipientId}. Gateway timeout after 30000ms.`
    );
  }

  return {
    success: true,
    transactionId: `txn_${Date.now()}`,
  };
}

export async function addFunds(
  amount: number
): Promise<{ success: boolean; transactionId: string }> {
  await simulateDelay();
  return {
    success: true,
    transactionId: `txn_${Date.now()}`,
  };
}
