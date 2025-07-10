import { getFeedsApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const loadFeeds = createAsyncThunk('feet/loadFeets', async () =>
  getFeedsApi()
);

type TFeedState = {
  orders: TOrder[];
  feed: {
    total: number;
    totalToday: number;
  };
  loading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
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
    selectOrders: (state) => state.orders,
    selectFeed: (state) => state.feed
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.feed.total = action.payload.total;
        state.feed.totalToday = action.payload.totalToday;
      })
      .addCase(loadFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Ошибка загрузки';
      });
  }
});

export const { selectOrders, selectFeed } = feedSlice.selectors;

export const selectOrderByNumber = createSelector(
  feedSlice.selectors.selectOrders,
  (state, number) => number,
  (orders: TOrder[], number: string) =>
    orders.find((order) => order.number.toString() === number)
);
