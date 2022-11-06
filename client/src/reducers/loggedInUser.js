import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

let initialState = { isInitialized: false, isLoggedIn: false };

const loggedInUserSlice = createSlice({
  name: 'loggedInUser',
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    resetUser(state, action) {
      localStorage.removeItem('token');
      return { isInitialized: true, isLoggedIn: false };
      //destroy JWT token on backend if possible
    },
  },
});

export const { setUser, resetUser } = loggedInUserSlice.actions;
export default loggedInUserSlice.reducer;

export const initializeUser = () => {
  return async (dispatch) => {
    let user;
    if (localStorage.getItem('token')) {
      const userData = await axios.get(
        `http://localhost:5000/users/user/ByToken`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (typeof userData.data !== 'string') {
        user = { ...userData.data, isLoggedIn: true };
      } else {
        localStorage.removeItem('token');
        user = { isInitialized: true, isLoggedIn: false };
      }
    } else {
      user = { isInitialized: true, isLoggedIn: false };
    }
    dispatch(setUser(user));
  };
};
