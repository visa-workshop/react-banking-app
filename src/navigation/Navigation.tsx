import { Routes, Route } from 'react-router-dom';

// components
import Add from '../pages/Add';
import Home from '../pages/Home';
import Cards from '../pages/Cards';
import Signin from '../pages/Signin';
import Profile from '../pages/Profile';
import Savings from '../pages/Savings';
import SendMoney from '../pages/SendMoney';
import Insights from '../pages/Insights';
import Transactions from '../pages/Transactions';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';

const Navigation: React.FC = () => (
  <Routes>
    <Route path='/' element={<Signin />} />
    <Route
      path='/add'
      element={
        <PrivateRoute>
          <Add />
        </PrivateRoute>
      }
    />
    <Route
      path='/home'
      element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      }
    />
    <Route
      path='/cards'
      element={
        <PrivateRoute>
          <Cards />
        </PrivateRoute>
      }
    />
    <Route
      path='/profile'
      element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      }
    />
    <Route
      path='/savings'
      element={
        <PrivateRoute>
          <Savings />
        </PrivateRoute>
      }
    />
    <Route
      path='/send'
      element={
        <PrivateRoute>
          <SendMoney />
        </PrivateRoute>
      }
    />
    <Route
      path='/insights'
      element={
        <PrivateRoute>
          <Insights />
        </PrivateRoute>
      }
    />
    <Route
      path='/transactions'
      element={
        <PrivateRoute>
          <Transactions />
        </PrivateRoute>
      }
    />
  </Routes>
);

export default Navigation;
