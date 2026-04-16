import { useMemo } from 'react';

import type { Transaction } from '../../context/AppContext';

interface IProps {
  transactions: Transaction[];
  budget: number;
}

const BudgetProgress: React.FC<IProps> = ({ transactions, budget }) => {
  const { spent, percentage, colorClass } = useMemo(() => {
    // Calculate current month spending
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlySpent = transactions
      .filter((txn) => {
        const txnDate = new Date(txn.date);
        return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
      })
      .reduce((sum, txn) => sum + txn.amount, 0);

    const pct = budget > 0 ? (monthlySpent / budget) * 100 : 0;

    let color = 'budget-green';
    if (pct >= 90) {
      color = 'budget-red';
    } else if (pct >= 70) {
      color = 'budget-yellow';
    }

    return { spent: monthlySpent, percentage: Math.min(pct, 100), colorClass: color };
  }, [transactions, budget]);

  return (
    <div className='insights-card'>
      <h3 className='insights-card-title text-shadow'>Monthly Budget</h3>
      <div className='budget-amounts'>
        <span className='budget-spent'>{`\u20ac${spent.toFixed(2)}`}</span>
        <span className='budget-total'>{` / \u20ac${budget.toFixed(2)}`}</span>
      </div>
      <div className='budget-bar-bg'>
        <div className={`budget-bar-fill ${colorClass}`} style={{ width: `${percentage}%` }} />
      </div>
      <p className='budget-percentage text-shadow'>{percentage.toFixed(0)}% of budget used</p>
    </div>
  );
};

export default BudgetProgress;
