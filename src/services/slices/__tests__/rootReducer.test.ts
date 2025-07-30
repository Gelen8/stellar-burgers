import { rootReducer, RootState } from '../../store';
import { expect, test, describe, jest } from '@jest/globals';

jest.mock('nanoid', () => ({ nanoid: () => '123' }));

const expectedState: RootState = {
  ingredients: {
    ingredients: [],
    loading: false,
    error: null
  },
  burgerConstructor: {
    constructorItems: {
      bun: null,
      ingredients: []
    }
  },
  feed: {
    profileOrders: [],
    orders: [],
    orderData: null,
    feed: {
      total: 0,
      totalToday: 0
    },
    loading: false,
    error: null
  },
  order: {
    orderModalData: null,
    orderRequest: false,
    error: null
  },
  user: {
    user: null,
    isAuthChecked: false,
    error: ''
  }
};

describe('тесты rootReducer', () => {
  test('возвращает дефолтный стейт, когда передаем пустое событие', () => {
    const result = rootReducer(undefined, { type: 'UNKNOWN-ACTION' });
    expect(result).toEqual(expectedState);
  });
});
