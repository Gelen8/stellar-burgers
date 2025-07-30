import { expect, test, describe } from '@jest/globals';
import {
  ingredientsReducer,
  loadIngredients,
  TIngredientsState
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }
];

describe('тесты для ingredientsSlice', () => {
  describe('тесты редьюсера', () => {
    const initialState: TIngredientsState = {
      ingredients: [],
      loading: false,
      error: null
    };
    const requestId = 'test-request-id';

    test('вызов экшена "ingredients/loadIngredients/pending"', () => {
      const state = ingredientsReducer(
        initialState,
        loadIngredients.pending(requestId)
      );

      expect(state.loading).toBe(true);
    });

    test('вызов экшена "ingredients/loadIngredients/fulfilled"', () => {
      const state = ingredientsReducer(
        initialState,
        loadIngredients.fulfilled(mockIngredients, requestId)
      );

      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    test('вызов экшена "ingredients/loadIngredients/rejected"', () => {
      const state = ingredientsReducer(
        initialState,
        loadIngredients.rejected(
          new Error('Ошибка загрузки ингридиентов'),
          requestId
        )
      );

      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual([]);
      expect(state.error).toBe('Ошибка загрузки ингридиентов');
    });
  });
});
