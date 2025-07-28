import { expect, test, describe } from '@jest/globals';
import {
  login,
  logout,
  register,
  TUserState,
  updateUser,
  userReducer
} from '../userSlice';

const mockLoginData = {
  email: 'test@yandex.ru',
  password: 'test'
};

const mockRegisterData = {
  email: 'test@yandex.ru',
  name: 'Helen',
  password: 'test'
};

const mockAuthResponse = {
  success: true,
  refreshToken: 'test',
  accessToken: 'test',
  user: {
    email: 'test@yandex.ru',
    name: 'Helen'
  }
};

const mockLogoutResponse = {
  success: true
};

describe('тесты для userSlice', () => {
  describe('тесты для редьюсера', () => {
    const initialState: TUserState = {
      user: null,
      isAuthChecked: false,
      error: ''
    };
    const requestId = 'test-request-id';

    describe('тесты экшенов Success', () => {
      test('вызов экшена "user/login/fulfilled"', () => {
        const state = userReducer(
          initialState,
          login.fulfilled(mockAuthResponse, requestId, mockLoginData)
        );

        expect(state.user).toEqual(mockAuthResponse.user);
        expect(state.isAuthChecked).toBe(true);
        expect(state.error).toBe('');
      });

      test('вызов экшена "user/logout/fulfilled"', () => {
        const state = userReducer(
          initialState,
          logout.fulfilled(mockLogoutResponse, requestId)
        );

        expect(state.user).toBeNull;
        expect(state.error).toBe('');
      });

      test('вызов экшена "user/register/fulfilled"', () => {
        const state = userReducer(
          initialState,
          register.fulfilled(mockAuthResponse, requestId, mockRegisterData)
        );

        expect(state.user).toEqual(mockAuthResponse.user);
        expect(state.error).toBe('');
      });

      test('вызов экшена "user/updateUser/fulfilled"', () => {
        const state = userReducer(
          initialState,
          updateUser.fulfilled(mockAuthResponse, requestId, mockRegisterData)
        );

        expect(state.user).toEqual(mockAuthResponse.user);
        expect(state.error).toBe('');
      });
    });

    describe('тесты экшенов Failed', () => {
      test('вызов экшена "user/login/rejected"', () => {
        const state = userReducer(
          initialState,
          login.rejected(
            new Error('Ошибка авторизации'),
            requestId,
            mockLoginData
          )
        );

        expect(state.error).toBe('Ошибка авторизации');
      });

      test('вызов экшена "user/logout/rejected"', () => {
        const state = userReducer(
          initialState,
          logout.rejected(new Error('Ошибка'), requestId)
        );

        expect(state.error).toBe('Ошибка');
      });

      test('вызов экшена "user/register/rejected"', () => {
        const state = userReducer(
          initialState,
          register.rejected(
            new Error('Ошибка регистрации'),
            requestId,
            mockRegisterData
          )
        );

        expect(state.error).toBe('Ошибка регистрации');
      });

      test('вызов экшена "user/updateUser/rejected"', () => {
        const state = userReducer(
          initialState,
          updateUser.rejected(
            new Error('Ошибка обновления данных'),
            requestId,
            mockRegisterData
          )
        );

        expect(state.error).toBe('Ошибка обновления данных');
      });
    });
  });
});
