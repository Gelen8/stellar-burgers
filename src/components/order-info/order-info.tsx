import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import {
  selectOrderByNumber,
  selectOrders
} from '../../services/slices/feedSlice';
import { useParams } from 'react-router-dom';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  // const orderData = {
  //   createdAt: '',
  //   ingredients: [],
  //   _id: '',
  //   status: '',
  //   name: '',
  //   updatedAt: 'string',
  //   number: 0
  // };
  const { number } = useParams();
  console.log(number);
  console.log('Тип number:', typeof number);
  const orders = useSelector(selectOrders);
  console.log(orders);
  console.log('Тип order.number:', typeof orders[0]?.number);
  const orderData = useSelector((state) => selectOrderByNumber(state, number));
  console.log(orderData);
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  console.log(ingredients);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
