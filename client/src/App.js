import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Login from './components/Login';
import Main from './components/Main';
import Register from './components/Register';
import { initializeUser } from './reducers/loggedInUser';

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
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;
