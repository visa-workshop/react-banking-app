import { useMemo } from 'react';

// components
import Layout from '../components/Layout/Layout';
import History from '../components/History/History';
import Divider from '../components/Divider/Divider';
import { useAppContext } from '../context/AppContext';

const Transactions: React.FC = () => {
  const { transactions } = useAppContext();

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, typeof transactions> = {};
    for (const txn of transactions) {
      const dateKey = txn.date;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(txn);
    }

    // Sort dates descending
    const sortedDates = Object.keys(groups).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    return sortedDates.map((date) => {
      const items = groups[date];
      const totalSpent = items.reduce((sum, t) => sum + t.amount, 0);
      const dateObj = new Date(date + 'T00:00:00');
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      return {
        date: formattedDate,
        dateBalance: `-\u20ac${totalSpent.toFixed(2)}`,
        items,
      };
    });
  }, [transactions]);

  return (
    <Layout>
      <Divider />

      <h1 className='title no-select'>Transactions</h1>

      {groupedTransactions.map((group, index) => (
        <div key={group.date}>
          <History detailed date={group.date} dateBalance={group.dateBalance} items={group.items} />
          {index < groupedTransactions.length - 1 && <Divider />}
        </div>
      ))}

      <Divider />
    </Layout>
  );
};

export default Transactions;
