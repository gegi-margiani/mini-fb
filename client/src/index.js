import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import loggedInUserReducer from './reducers/loggedInUser';
import authenticationErrorReducer from './reducers/authenticationError';
import postsReducer from './reducers/posts';

const store = configureStore({
  reducer: {
    loggedInUser: loggedInUserReducer,
    authenticationError: authenticationErrorReducer,
    posts: postsReducer,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
