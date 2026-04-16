// components
import Layout from '../components/Layout/Layout';
import Balance from '../components/Balance/Balance';
import Actions from '../components/Actions/Actions';
import History from '../components/History/History';
import Widgets from '../components/Widgets/Widgets';
import Divider from '../components/Divider/Divider';
import { useAppContext } from '../context/AppContext';

const Home: React.FC = () => {
  const { balance } = useAppContext();

  return (
    <Layout>
      <Balance balance={balance} currency='EURO' currencySymbol='€' />

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
