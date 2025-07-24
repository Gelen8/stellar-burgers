import { expect, test, describe } from '@jest/globals';
import { orderBurger, orderReducer, TOrderState } from '../orderSlice';

const mockOrder = ['123', '321'];

const mockNewOrderResponce = {
  success: true,
  name: "Экзо-плантаго флюоресцентный био-марсианский бургер",
    order: {
      ingredients: ['123', '321'],
        _id: "688127aad5ca38001cffbf20",
        status: "done",
        name: "Экзо-плантаго флюоресцентный био-марсианский бургер",
        createdAt: "2025-07-24T12:31:38.030Z",
        updatedAt: "2025-07-24T12:32:36.481Z",
        number: 85064
    }
};

describe('тесты для orderSlice', () => {
  describe('тесты для редьюсера', () => {
    const initialState: TOrderState = {
      orderModalData: null,
      orderRequest: false,
      error: null
    };
    const requestId = 'test-request-id';

    test('вызов экшена "order/orderBurger/pending"', () => {
      const state = orderReducer(
        initialState,
        orderBurger.pending(requestId, mockOrder)
      );

      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    test('вызов экшена "order/orderBurger/fulfilled"', () => {
      const state = orderReducer(initialState, orderBurger.fulfilled(mockNewOrderResponce, requestId, mockOrder));

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockNewOrderResponce.order);
      expect(state.error).toBeNull();
    });

    test('вызов экшена "order/orderBurger/rejected"', () => {
      const state = orderReducer(initialState,orderBurger.rejected(new Error('Ошибка заказа'),requestId, mockOrder));

      expect(state.error).toBe('Ошибка заказа');
    });
  });
});
