import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Auth/Login';
import Main from './components/Main';
import Register from './components/Auth/Register';
import { initializeUser } from './reducers/loggedInUser';
import Post from './components/Posts/Post';
import SearchPage from './components/SearchUsers/SearchPage';
import User from './components/Users/User';

function App() {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(({ loggedInUser }) => loggedInUser);

  useEffect(() => {
    dispatch(initializeUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/register"
          element={!loggedInUser.isInitialized ? <Main /> : <Register />}
        />
        <Route
          path="/login"
          element={!loggedInUser.isInitialized ? <Main /> : <Login />}
        />
        <Route path="/post/:postUuid/comment/:commentUuid" element={<Post />} />
        <Route path="/post/:postUuid" element={<Post />} />
        <Route path="/search/:searchString" element={<SearchPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/user/:userUuid" element={<User />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;
