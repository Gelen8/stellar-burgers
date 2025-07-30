import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { nanoid } from 'nanoid';

type TIngredientsItems = {
  bun: TConstructorIngredient | null;
  ingredients: Array<TConstructorIngredient>;
};

export type TConstructorState = {
  constructorItems: TIngredientsItems;
};

const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addItems: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        action.payload.type === 'bun'
          ? (state.constructorItems.bun = action.payload)
          : state.constructorItems.ingredients.push(action.payload);
      },
      prepare: (ingredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    moveItem: (state, action: { payload: { from: number; to: number } }) => {
      const [movedIngredient] = state.constructorItems.ingredients.splice(
        action.payload.from,
        1
      );
      state.constructorItems.ingredients.splice(
        action.payload.to,
        0,
        movedIngredient
      );
    },
    resetConstructorData: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    }
  },
  selectors: {
    selectConstructorItems: (state) => state.constructorItems
  }
});

export const { selectConstructorItems } = constructorSlice.selectors;

export const { addItems, removeItem, resetConstructorData, moveItem } =
  constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
