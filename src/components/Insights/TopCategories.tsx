import { useMemo } from 'react';

import type { Transaction } from '../../context/AppContext';

interface IProps {
  transactions: Transaction[];
}

interface CategoryRank {
  category: string;
  amount: number;
  percentage: number;
  icon: string;
}

const categoryIconMap: Record<string, string> = {
  Coffee: 'coffee',
  Hotel: 'hotel',
  Subscriptions: 'sync',
  Bills: 'bolt',
  Groceries: 'local_grocery_store',
  Entertainment: 'local_activity',
  Transfer: 'send',
};

const TopCategories: React.FC<IProps> = ({ transactions }) => {
  const ranked = useMemo((): CategoryRank[] => {
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
        icon: categoryIconMap[category] || 'category',
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  return (
    <div className='insights-card'>
      <h3 className='insights-card-title text-shadow'>Top Categories</h3>
      <div className='top-categories-list'>
        {ranked.map((cat, index) => (
          <div key={cat.category} className='top-category-item'>
            <span className='top-category-rank'>{index + 1}</span>
            <span className='material-symbols-outlined top-category-icon'>{cat.icon}</span>
            <div className='top-category-details'>
              <span className='top-category-name'>{cat.category}</span>
              <div className='top-category-bar-bg'>
                <div className='top-category-bar-fill' style={{ width: `${cat.percentage}%` }} />
              </div>
            </div>
            <div className='top-category-values'>
              <span className='top-category-amount'>{`\u20ac${cat.amount.toFixed(2)}`}</span>
              <span className='top-category-pct'>{cat.percentage.toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCategories;
