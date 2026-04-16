import { useEffect, useState } from 'react';
import { apiGet } from '../api/client';

// components
import Layout from '../components/Layout/Layout';
import Balance from '../components/Balance/Balance';
import Actions from '../components/Actions/Actions';
import History from '../components/History/History';
import Widgets from '../components/Widgets/Widgets';
import Divider from '../components/Divider/Divider';

interface BalanceData {
  balance: number;
  currency: string;
  currency_symbol: string;
}

const Home: React.FC = () => {
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiGet<BalanceData>('/api/user/balance')
      .then((data) => {
        setBalanceData(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Layout>
      {isLoading ? (
        <div className='balance flex flex-col flex-v-center flex-h-center'>
          <p className='text-shadow'>Loading...</p>
        </div>
      ) : (
        <Balance
          balance={balanceData?.balance ?? 0}
          currency={balanceData?.currency ?? ''}
          currencySymbol={balanceData?.currency_symbol ?? ''}
        />
      )}

      <Actions />

      <Divider />

      <History />

      <Divider />

      <Widgets />

      <Divider />
    </Layout>
  );
};

export default Home;
