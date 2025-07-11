import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  resetConstructorData,
  selectConstructorItems
} from '../../services/slices/constructorSlice';
import {
  orderBurger,
  selectOrderModalData,
  selectOrderRequest,
  resetOrderModalData
} from '../../services/slices/orderSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectUser } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  // const constructorItems = {
  //   bun: {
  //     price: 0
  //   },
  //   ingredients: []
  // };

  // const orderRequest = false;

  // const orderModalData = null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const userData = useSelector(selectUser);

  const dataOrder: string[] = [];
  constructorItems.bun && dataOrder.push(constructorItems.bun._id);
  constructorItems.ingredients.forEach((ingredient) =>
    dataOrder.push(ingredient._id)
  );

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    } else if (userData) {
      console.log('Ты авторизован');
      dispatch(orderBurger(dataOrder));
    } else {
      console.log('Ты не авторизован');
      navigate('/login');
    }
  };
  const closeOrderModal = () => {
    dispatch(resetOrderModalData());
    dispatch(resetConstructorData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
