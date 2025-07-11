import { getFeedsApi, getOrdersApi } from '@api';
import {
  Action,
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const loadFeeds = createAsyncThunk('feed/loadFeets', async () =>
  getFeedsApi()
);

export const loadProfileOrders = createAsyncThunk(
  'feed/loadProfileOrders',
  async () => getOrdersApi()
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
  reducers: {},
  selectors: {
    selectProfileOrders: (state) => state.profileOrders,
    selectOrders: (state) => state.orders,
    selectFeed: (state) => state.feed,
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
      })
      .addCase(loadProfileOrders.fulfilled, (state, action) => {
        state.profileOrders = action.payload;
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
  selectLoading,
  selectError
} = feedSlice.selectors;

export const selectOrderByNumber = createSelector(
  feedSlice.selectors.selectOrders,
  (state, number) => number,
  (orders: TOrder[], number: string) =>
    orders.find((order) => order.number.toString() === number)
);
