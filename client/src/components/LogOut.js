import React from 'react';
import { useDispatch } from 'react-redux';
import { resetUser } from '../reducers/loggedInUser';
import { useNavigate } from 'react-router-dom';

function LogOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(resetUser());
    navigate('/');
  };
  return <button onClick={handleClick}>LogOut</button>;
}

export default LogOut;
