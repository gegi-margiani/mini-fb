import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setError } from '../reducers/authenticationError';
import { setUser } from '../reducers/loggedInUser';
import { useNavigate } from 'react-router-dom';
import AuthNavigation from './AuthNavigation';

const Form = styled.form`
  display: grid;
  justify-content: center;
  gap: 5px;
  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
const Error = styled.div`
  color: red;
`;

function Login() {
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const dispatch = useDispatch();
  const loginError = useSelector(
    ({ authenticationError }) => authenticationError
  );

  const loggedInUser = useSelector(({ loggedInUser }) => loggedInUser);
  let navigate = useNavigate();
  useEffect(() => {
    if (loggedInUser.isLoggedIn) navigate('/');
  }, []);

  const handleSubmit = async (e) => {
    const body = {
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
    };
    e.preventDefault();
    const response = await axios.post(
      'http://localhost:5000/users/signIn',
      body
    );
    if (typeof response.data === 'string') {
      dispatch(setError({ error: response.data }));
    } else {
      const userInfo = {
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
        uuid: response.data.uuid,
        isLoggedIn: true,
      };
      dispatch(setUser(userInfo));
      localStorage.setItem('token', response.data.token);
    }
  };

  return (
    <>
      <AuthNavigation />
      <Form>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            name="email"
            id="email"
            ref={emailInputRef}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            ref={passwordInputRef}
            required
          />
        </div>
        <Error>{loginError}</Error>
        <input type="button" value="Log In" onClick={handleSubmit} />
      </Form>
    </>
  );
}

export default Login;
