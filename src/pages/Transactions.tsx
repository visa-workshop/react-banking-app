import { useEffect } from 'react';

// components
import Layout from '../components/Layout/Layout';
import History from '../components/History/History';
import Divider from '../components/Divider/Divider';
import { useScreenLoadMonitor } from '../hooks/useScreenLoadMonitor';

const Transactions: React.FC = () => {
  const setLoadComplete = useScreenLoadMonitor({ screenName: 'Transactions' });

  useEffect(() => {
    setLoadComplete();
  }, [setLoadComplete]);

  return (
    <Layout>
      <Divider />

      <h1 className='title no-select'>Transactions</h1>

      <History detailed date='May 6' dateBalance='-€127.78' />

      <Divider />

      <History detailed date='May 5' dateBalance='-€970.23' />

      <Divider />
    </Layout>
  );
};

export default Transactions;
