import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  loadProfileOrders,
  selectProfileOrders
} from '../../services/slices/feedSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadProfileOrders());
  }, []);

  const orders: TOrder[] = useSelector(selectProfileOrders);

  return <ProfileOrdersUI orders={orders} />;
};
