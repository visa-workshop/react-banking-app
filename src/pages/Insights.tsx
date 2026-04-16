import { useEffect, useMemo, useState } from 'react';

import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';
import CategoryBreakdown from '../components/Insights/CategoryBreakdown';
import BudgetProgress from '../components/Insights/BudgetProgress';
import SpendingTrend from '../components/Insights/SpendingTrend';
import TopCategories from '../components/Insights/TopCategories';
import { useAppContext } from '../context/AppContext';
import { useScreenLoadMonitor } from '../hooks/useScreenLoadMonitor';
import { Sentry } from '../sentry';

const SIMULATED_LOAD_DELAY_MS = 2000;

const Insights: React.FC = () => {
  const { transactions, monthlyBudget } = useAppContext();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const setLoadComplete = useScreenLoadMonitor({
    screenName: 'Insights',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoaded(true);
    }, SIMULATED_LOAD_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      setLoadComplete();
    }
  }, [isDataLoaded, setLoadComplete]);

  // Check if user is approaching budget limit
  const budgetStatus = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlySpent = transactions
      .filter((txn) => {
        const txnDate = new Date(txn.date);
        return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
      })
      .reduce((sum, txn) => sum + txn.amount, 0);

    const percentage = monthlyBudget > 0 ? (monthlySpent / monthlyBudget) * 100 : 0;

    return { spent: monthlySpent, percentage };
  }, [transactions, monthlyBudget]);

  useEffect(() => {
    if (isDataLoaded && budgetStatus.percentage >= 90) {
      Sentry.captureMessage('User approaching budget limit', {
        level: 'info',
        extra: {
          spent: budgetStatus.spent,
          budget: monthlyBudget,
          percentage: budgetStatus.percentage,
        },
      });
    }
  }, [isDataLoaded, budgetStatus, monthlyBudget]);

  if (!isDataLoaded) {
    return (
      <Layout>
        <Divider />
        <h1 className='title no-select'>Insights</h1>
        <div className='flex flex-h-center flex-v-center' style={{ minHeight: '200px' }}>
          <p>Loading insights...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Divider />

      <h1 className='title no-select'>Insights</h1>

      <BudgetProgress transactions={transactions} budget={monthlyBudget} />

      <Divider />

      <CategoryBreakdown transactions={transactions} />

      <Divider />

      <SpendingTrend transactions={transactions} />

      <Divider />

      <TopCategories transactions={transactions} />

      <Divider />
    </Layout>
  );
};

export default Insights;
