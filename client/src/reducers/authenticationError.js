import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const authenticationErrorSlice = createSlice({
  name: 'authenticationError',
  initialState,
  reducers: {
    setError(state, action) {
      const error = action.payload.error;
      if (error) {
        return error;
      } else {
        return null;
      }
    },
  },
});

export const { setError } = authenticationErrorSlice.actions;
export default authenticationErrorSlice.reducer;
