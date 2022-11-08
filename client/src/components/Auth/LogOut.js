import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetUser } from '../../reducers/loggedInUser';

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
