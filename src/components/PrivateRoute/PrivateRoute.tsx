import { Navigate } from 'react-router-dom';

import { useAppContext } from '../../context/AppContext';

interface IProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<IProps> = ({ children }) => {
  const { user } = useAppContext();

  if (!user) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
