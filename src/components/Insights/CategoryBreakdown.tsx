import { useMemo } from 'react';

import type { Transaction } from '../../context/AppContext';

interface IProps {
  transactions: Transaction[];
}

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

const categoryColorMap: Record<string, string> = {
  Coffee: '#8852f6',
  Hotel: '#ffca0c',
  Subscriptions: '#ff571d',
  Bills: '#3e4649',
  Groceries: '#f42d53',
  Entertainment: '#0a56ea',
  Transfer: '#4ed34e',
};

const CategoryBreakdown: React.FC<IProps> = ({ transactions }) => {
  const categories = useMemo((): CategoryData[] => {
    const totals: Record<string, number> = {};
    for (const txn of transactions) {
      const cat = txn.category || 'Other';
      totals[cat] = (totals[cat] || 0) + txn.amount;
    }

    const total = Object.values(totals).reduce((sum, v) => sum + v, 0);

    return Object.entries(totals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        color: categoryColorMap[category] || '#999999',
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const conicGradient = useMemo(() => {
    const stops = categories.reduce<{ cumulative: number; parts: string[] }>(
      (acc, cat) => {
        const start = acc.cumulative;
        const end = start + cat.percentage;
        acc.parts.push(`${cat.color} ${start}% ${end}%`);
        return { cumulative: end, parts: acc.parts };
      },
      { cumulative: 0, parts: [] }
    );
    return `conic-gradient(${stops.parts.join(', ')})`;
  }, [categories]);

  return (
    <div className='insights-card'>
      <h3 className='insights-card-title text-shadow'>Spending by Category</h3>
      <div className='category-breakdown-content'>
        <div className='donut-chart' style={{ background: conicGradient }}>
          <div className='donut-hole' />
        </div>
        <div className='category-legend'>
          {categories.map((cat) => (
            <div key={cat.category} className='legend-item'>
              <span className='legend-dot' style={{ backgroundColor: cat.color }} />
              <span className='legend-label'>{cat.category}</span>
              <span className='legend-value'>{cat.percentage.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;
