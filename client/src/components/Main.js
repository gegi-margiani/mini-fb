import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import Posts from './Posts';

function Main() {
  const loggedInUser = useSelector(({ loggedInUser }) => loggedInUser);
  let navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, []);

  return (
    <>
      <Navigation />
      <Posts />
    </>
  );
}

export default Main;
