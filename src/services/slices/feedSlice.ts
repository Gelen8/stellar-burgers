import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { Action, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const loadFeeds = createAsyncThunk('feed/loadFeeds', getFeedsApi);

export const loadProfileOrders = createAsyncThunk(
  'feed/loadProfileOrders',
  getOrdersApi
);

export const loadOrderByNumber = createAsyncThunk(
  'feed/loadOrderByNumber',
  getOrderByNumberApi
);

interface RejectedAction extends Action {
  error: Error;
}

function isRejectedAction(action: Action): action is RejectedAction {
  return action.type.endsWith('rejected');
}

function isPendingAction(action: Action): action is Action {
  return action.type.endsWith('pending');
}

type TFeedState = {
  profileOrders: TOrder[];
  orders: TOrder[];
  orderData: TOrder | null;
  feed: {
    total: number;
    totalToday: number;
  };
  loading: boolean;
  error: string | null;
};

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

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orderData = null;
    }
  },
  selectors: {
    selectProfileOrders: (state) => state.profileOrders,
    selectOrders: (state) => state.orders,
    selectFeed: (state) => state.feed,
    selectOrderData: (state) => state.orderData,
    selectLoading: (state) => state.loading,
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.feed.total = action.payload.total;
        state.feed.totalToday = action.payload.totalToday;
        state.error = null;
      })
      .addCase(loadProfileOrders.fulfilled, (state, action) => {
        state.profileOrders = action.payload;
        state.error = null;
      })
      .addCase(loadOrderByNumber.fulfilled, (state, action) => {
        state.orderData = action.payload.orders[0];
        state.error = null;
      })
      .addMatcher(isRejectedAction, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Ошибка загрузки';
      })
      .addMatcher(isPendingAction, (state) => {
        state.loading = true;
        state.error = null;
      });
  }
});

export const {
  selectProfileOrders,
  selectOrders,
  selectFeed,
  selectOrderData,
  selectLoading,
  selectError
} = feedSlice.selectors;

export const { clearOrderData } = feedSlice.actions;
