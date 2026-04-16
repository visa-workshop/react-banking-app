import { Link } from 'react-router-dom';

// components
import HistoryLine from './HistoryLine';
import { useAppContext } from '../../context/AppContext';
import type { Transaction } from '../../context/AppContext';

// interfaces
interface IProps {
  date?: string;
  detailed?: boolean;
  dateBalance?: string;
  items?: Transaction[];
}

const History: React.FC<IProps> = ({
  date = undefined,
  detailed = false,
  dateBalance = undefined,
  items = undefined,
}) => {
  const { transactions } = useAppContext();

  // Use provided items or fall back to context transactions (for home page, show first 7)
  const displayItems = items || transactions.slice(0, 7);

  return (
    <>
      {detailed && (
        <div className='history-header flex flex-v-center flex-space-between'>
          <span className='text-shadow no-select date'>{date}</span>
          <span className='text-shadow no-select amount flex flex-end'>{dateBalance}</span>
        </div>
      )}
      <div className='history'>
        {displayItems.map((item) => (
          <HistoryLine
            key={item.id}
            item={{
              id: typeof item.id === 'string' ? parseInt(item.id.replace(/\D/g, ''), 10) || 0 : 0,
              icon: item.icon,
              time: item.time,
              name: item.name,
              amount: item.amount,
              color: item.color || 'gray',
              currencySymbol: item.currencySymbol,
            }}
          />
        ))}
        {!detailed && (
          <Link to='/transactions' className='history-line bottom flex flex-v-center flex-h-center'>
            See all
            <span className='material-symbols-outlined'>keyboard_arrow_right</span>
          </Link>
        )}
      </div>
    </>
  );
};

export default History;
