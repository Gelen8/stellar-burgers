import { expect, test, describe } from '@jest/globals';
import {
  feedReducer,
  loadFeeds,
  loadOrderByNumber,
  loadProfileOrders,
  TFeedState
} from '../feedSlice';

const mockFeeds = {
  success: true,
  orders: [
    {
      _id: '6882045d57906c001dc505f2',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0940',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Флюоресцентный люминесцентный метеоритный бургер',
      createdAt: '2025-07-24T10:01:01.834Z',
      updatedAt: '2025-07-24T10:01:02.645Z',
      number: 85055
    }
  ],
  total: 1138,
  totalToday: 1
};

const mockProfileOrders = [
  {
    _id: '6881eb7bd4faaf001b6e6b1d',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa0941'
    ],
    status: 'done',
    name: 'Флюоресцентный люминесцентный био-марсианский бургер',
    createdAt: '2025-07-24T08:14:51.495Z',
    updatedAt: '2025-07-24T08:14:52.223Z',
    number: 85052
  },
  {
    _id: '6881eb57d4faaf001b6e6b1c',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa0943',
      '643d69a5c3f7b9001cfa0942',
      '643d69a5c3f7b9001cfa0944',
      '643d69a5c3f7b9001cfa0945',
      '643d69a5c3f7b9001cfa0945',
      '643d69a5c3f7b9001cfa0943',
      '643d69a5c3f7b9001cfa0942'
    ],
    status: 'done',
    name: 'Флюоресцентный антарианский space традиционный-галактический spicy бургер',
    createdAt: '2025-07-24T08:14:15.009Z',
    updatedAt: '2025-07-24T08:14:15.773Z',
    number: 85051
  }
];

const mockOrder = {
  success: true,
  orders: [
    {
      _id: '6882045d57906c001dc505f2',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0940',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Флюоресцентный люминесцентный метеоритный бургер',
      createdAt: '2025-07-24T10:01:01.834Z',
      updatedAt: '2025-07-24T10:01:02.645Z',
      number: 85055
    }
  ]
};

describe('тесты для feedSlice', () => {
  describe('тесты для редьюсера', () => {
    const initialState: TFeedState = {
      profileOrders: [],
      orders: [],
      orderData: null,
      feed: {
        total: 0,
        totalToday: 0
      },
      loading: false,
      error: null
    };

    const requestId = 'test-request-id';

    describe('тесты экшенов Request', () => {
      test('вызов экшена "feed/loadFeeds/pending"', () => {
        const state = feedReducer(initialState, loadFeeds.pending(requestId));

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      test('вызов экшена "feed/loadProfileOrders/pending"', () => {
        const state = feedReducer(
          initialState,
          loadProfileOrders.pending(requestId)
        );

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      test('вызов экшена "feed/loadOrderByNumber/pending"', () => {
        const state = feedReducer(
          initialState,
          loadOrderByNumber.pending(requestId, 85055)
        );

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });
    });

    describe('тесты экшенов Failed', () => {
      test('вызов экшена "feed/loadFeeds/rejected"', () => {
        const state = feedReducer(
          initialState,
          loadFeeds.rejected(new Error('Ошибка загрузки данных'), requestId)
        );

        expect(state.loading).toBe(false);
        expect(state.error).toBe('Ошибка загрузки данных');
      });

      test('вызов экшена "feed/loadProfileOrders/rejected"', () => {
        const state = feedReducer(
          initialState,
          loadProfileOrders.rejected(
            new Error('Ошибка загрузки данных'),
            requestId
          )
        );

        expect(state.loading).toBe(false);
        expect(state.error).toBe('Ошибка загрузки данных');
      });

      test('вызов экшена "feed/loadOrderByNumber/rejected"', () => {
        const state = feedReducer(
          initialState,
          loadOrderByNumber.rejected(
            new Error('Ошибка загрузки данных'),
            requestId,
            85055
          )
        );

        expect(state.loading).toBe(false);
        expect(state.error).toBe('Ошибка загрузки данных');
      });
    });

    describe('тесты экшенов Success', () => {
      test('вызов экшена "feed/loadFeeds/fulfilled"', () => {
        const state = feedReducer(
          initialState,
          loadFeeds.fulfilled(mockFeeds, requestId)
        );

        expect(state.loading).toBe(false);
        expect(state.orders).toEqual(mockFeeds.orders);
        expect(state.feed.total).toEqual(mockFeeds.total);
        expect(state.feed.totalToday).toEqual(mockFeeds.totalToday);
        expect(state.error).toBeNull();
      });

      test('вызов экшена "feed/loadProfileOrders/fulfilled"', () => {
        const state = feedReducer(
          initialState,
          loadProfileOrders.fulfilled(mockProfileOrders, requestId)
        );

        expect(state.profileOrders).toEqual(mockProfileOrders);
        expect(state.error).toBeNull();
      });

      test('вызов экшена "ffeed/loadOrderByNumber/fulfilled"', () => {
        const state = feedReducer(
          initialState,
          loadOrderByNumber.fulfilled(mockOrder, requestId, 85055)
        );

        expect(state.orderData).toEqual(mockOrder.orders[0]);
        expect(state.error).toBeNull();
      });
    });
  });
});
