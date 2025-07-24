import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { Action, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { getCookie } from '../../utils/cookie';

export const login = createAsyncThunk('user/login', loginUserApi);

export const logout = createAsyncThunk('user/logout', logoutApi);

export const register = createAsyncThunk('user/register', registerUserApi);

export const updateUser = createAsyncThunk('user/updateUser', updateUserApi);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((user) => dispatch(setUser(user.user)))
        .finally(() => dispatch(setIsAuthChecked(true)));
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);

interface RejectedAction extends Action {
  error: Error;
}

function isRejectedAction(action: Action): action is RejectedAction {
  return action.type.endsWith('rejected');
}

export type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  error: string;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  error: ''
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
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.error = '';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.error = '';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.error = '';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.error = '';
      })
      .addMatcher(isRejectedAction, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export const { selectUser, selectIsAuthChecked, selectUserError } =
  userSlice.selectors;

export const { setIsAuthChecked, setUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
