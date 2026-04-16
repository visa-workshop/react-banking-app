import { useEffect, useState } from 'react';
import { apiGet } from '../api/client';

// components
import Layout from '../components/Layout/Layout';
import History from '../components/History/History';
import Divider from '../components/Divider/Divider';

interface Transaction {
  id: number;
  icon: string;
  name: string;
  time: string;
  amount: number;
  color: string;
  currency_symbol: string;
  date: string;
}

interface GroupedTransactions {
  date: string;
  transactions: Transaction[];
  dateBalance: string;
}

const Transactions: React.FC = () => {
  const [groups, setGroups] = useState<GroupedTransactions[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiGet<Transaction[]>('/api/transactions')
      .then((data) => {
        const grouped = new Map<string, Transaction[]>();
        data.forEach((tx) => {
          const existing = grouped.get(tx.date) ?? [];
          existing.push(tx);
          grouped.set(tx.date, existing);
        });

        const result: GroupedTransactions[] = [];
        grouped.forEach((transactions, date) => {
          const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
          const symbol = transactions[0]?.currency_symbol ?? '€';
          result.push({
            date,
            transactions,
            dateBalance: `-${symbol}${totalAmount.toFixed(2)}`,
          });
        });

        setGroups(result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <Divider />
        <h1 className='title no-select'>Transactions</h1>
        <div className='flex flex-h-center flex-v-center' style={{ minHeight: '200px' }}>
          <p>Loading transactions...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Divider />

      <h1 className='title no-select'>Transactions</h1>

      {groups.map((group, index) => (
        <div key={group.date}>
          <History
            detailed
            date={group.date}
            dateBalance={group.dateBalance}
            transactions={group.transactions.map((tx) => ({
              id: tx.id,
              icon: tx.icon,
              name: tx.name,
              time: tx.time,
              amount: tx.amount,
              color: tx.color,
              currencySymbol: tx.currency_symbol,
            }))}
          />
          {index < groups.length - 1 && <Divider />}
        </div>
      ))}

      <Divider />
    </Layout>
  );
};

export default Transactions;
