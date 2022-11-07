import React from 'react';
import { Link } from 'react-router-dom';

function AuthNavigation() {
  return (
    <div>
      {(window.location.pathname === '/register' ||
        window.location.pathname === '/login') && <Link to="/">Main</Link>}
      {window.location.pathname !== '/register' && (
        <Link to="/register">Register</Link>
      )}
      {window.location.pathname !== '/login' && <Link to="/login">Log In</Link>}
    </div>
  );
}

export default AuthNavigation;
