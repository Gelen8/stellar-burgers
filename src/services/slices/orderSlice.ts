import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const orderBurger = createAsyncThunk(
  'order/orderBurger',
  async (data: string[]) => orderBurgerApi(data)
);

type TOrderState = {
  orderModalData: TOrder | null;
  orderRequest: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderModalData: null,
  orderRequest: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderRequest: (state) => state.orderRequest
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.error = action.error?.message || 'Ошибка загрузки';
      });
  }
});

export const { selectOrderModalData, selectOrderRequest } =
  orderSlice.selectors;

export const { resetOrderModalData } = orderSlice.actions;
