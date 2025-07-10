import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const orderBurger = createAsyncThunk(
  'order/orderBurger',
  async (data: string[]) => orderBurgerApi(data)
);

type TOrderState = {
  data: string[];
  orderModalData: TOrder | null;
  orderRequest: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  data: [],
  orderModalData: null,
  orderRequest: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<string[]>) => {
      state.data = action.payload;
    }
  },
  selectors: {
    selectData: (state) => state.data,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderRequest: (state) => state.orderRequest
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        (state.orderRequest = false),
          (state.orderModalData = action.payload.order);
      });
  }
});

export const { selectData, selectOrderModalData, selectOrderRequest } =
  orderSlice.selectors;

export const { setData } = orderSlice.actions;
