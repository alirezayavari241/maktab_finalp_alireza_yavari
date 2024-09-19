import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: '',
  isAuthenticated: false,
};

const authSlicereducer  = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = '';
    },
    loginSuccess: (state) => {
      state.loading = false;
      state.isAuthenticated = true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure } = authSlice.actions;
export default authSlicereducer;
