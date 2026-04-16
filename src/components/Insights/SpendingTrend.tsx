import { useMemo } from 'react';

import type { Transaction } from '../../context/AppContext';

interface IProps {
  transactions: Transaction[];
}

interface DayData {
  label: string;
  amount: number;
}

const SpendingTrend: React.FC<IProps> = ({ transactions }) => {
  const days = useMemo((): DayData[] => {
    const result: DayData[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });

      const dayTotal = transactions
        .filter((txn) => txn.date === dateStr)
        .reduce((sum, txn) => sum + txn.amount, 0);

      result.push({ label: dayLabel, amount: dayTotal });
    }

    return result;
  }, [transactions]);

  const maxAmount = useMemo(() => {
    const max = Math.max(...days.map((d) => d.amount));
    return max > 0 ? max : 1;
  }, [days]);

  return (
    <div className='insights-card'>
      <h3 className='insights-card-title text-shadow'>Last 7 Days</h3>
      <div className='spending-trend-chart'>
        {days.map((day) => (
          <div key={day.label} className='trend-bar-container'>
            <div className='trend-bar-wrapper'>
              <div className='trend-bar' style={{ height: `${(day.amount / maxAmount) * 100}%` }} />
            </div>
            <span className='trend-label'>{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingTrend;
