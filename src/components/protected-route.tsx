import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthChecked, selectUser } from '../services/slices/userSlice';
import { useSelector } from '../services/store';
import { Preloader } from '@ui';

type TProtectedProps = {
  onlyUnAuth: boolean;
  component: React.JSX.Element;
};
const Protected = ({
  onlyUnAuth,
  component
}: TProtectedProps): React.JSX.Element => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  return component;
};

export const OnlyAuth = ({
  component
}: {
  component: React.JSX.Element;
}): React.JSX.Element => <Protected onlyUnAuth={false} component={component} />;
export const OnlyUnAuth = ({
  component
}: {
  component: React.JSX.Element;
}): React.JSX.Element => <Protected onlyUnAuth component={component} />;
