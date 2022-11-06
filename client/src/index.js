import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import loggedInUserReducer from './reducers/loggedInUser';
import authenticationErrorReducer from './reducers/authenticationError';

const store = configureStore({
  reducer: {
    loggedInUser: loggedInUserReducer,
    authenticationError: authenticationErrorReducer,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
