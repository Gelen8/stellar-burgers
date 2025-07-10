import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';

type TIngredientsItems = {
  bun: TConstructorIngredient | null;
  ingredients: Array<TConstructorIngredient>;
};

type TConstructorState = {
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
    }
  },
  selectors: {
    selectConstructorItems: (state) => state.constructorItems
  }
});

export const { selectConstructorItems } = constructorSlice.selectors;

export const { addItems, removeItem } = constructorSlice.actions;
