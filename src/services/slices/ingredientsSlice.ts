import { getIngredientsApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const loadIngredients = createAsyncThunk(
  'ingredients/loadIngredients',
  async () => getIngredientsApi()
);

type TIngredientsState = {
  ingredients: Array<TIngredient>;
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIngredientsLoading: (state) => state.loading,
    selectIngredientsError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(loadIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Ошибка загрузки';
      });
  }
});

export const {
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} = ingredientsSlice.selectors;

export const selectIngredientById = createSelector(
  ingredientsSlice.selectors.selectIngredients,
  (state, _id) => _id,
  (ingredients: TIngredient[], id: string) =>
    ingredients.find((ingredient) => ingredient._id === id)
);
