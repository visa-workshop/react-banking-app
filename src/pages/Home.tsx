import { useEffect } from 'react';

// components
import Layout from '../components/Layout/Layout';
import Balance from '../components/Balance/Balance';
import Actions from '../components/Actions/Actions';
import History from '../components/History/History';
import Widgets from '../components/Widgets/Widgets';
import Divider from '../components/Divider/Divider';
import { useScreenLoadMonitor } from '../hooks/useScreenLoadMonitor';

const Home: React.FC = () => {
  const setLoadComplete = useScreenLoadMonitor({ screenName: 'Home' });

  useEffect(() => {
    setLoadComplete();
  }, [setLoadComplete]);

  return (
    <Layout>
      <Balance balance={1325.5} currency='EURO' currencySymbol='€' />

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
