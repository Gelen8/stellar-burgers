import { getUserApi, loginUserApi, logoutApi, TLoginData } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { getCookie } from 'src/utils/cookie';

export const login = createAsyncThunk('user/login', async (data: TLoginData) =>
  loginUserApi(data)
);

export const logout = createAsyncThunk('user/logaut', async () => logoutApi());

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((user) => dispatch(setUser(user)))
        .finally(() => dispatch(setIsAuthChecked(true)));
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  selectors: {
    selectUser: (state) => state.user
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export const { selectUser } = userSlice.selectors;

export const { setIsAuthChecked, setUser } = userSlice.actions;