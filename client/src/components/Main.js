import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import Posts from './Posts';

function Main() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navigation />
      <Posts />
    </>
  );
}

export default Main;
