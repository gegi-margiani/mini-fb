import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../reducers/loggedInUser';
import { useNavigate } from 'react-router-dom';
import AuthNavigation from './AuthNavigation';
import { setError } from '../../reducers/authenticationError';

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

function Register() {
  const firstNameInputRef = useRef(null);
  const lastNameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const passwordConfirmInputRef = useRef(null);

  const dispatch = useDispatch();
  const registrationError = useSelector(
    ({ authenticationError }) => authenticationError
  );

  const loggedInUser = useSelector(({ loggedInUser }) => loggedInUser);
  let navigate = useNavigate();
  useEffect(() => {
    if (loggedInUser.isLoggedIn) navigate('/');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      first_name: firstNameInputRef.current.value,
      last_name: lastNameInputRef.current.value,
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
      password_confirm: passwordConfirmInputRef.current.value,
    };
    const response = await axios.post('http://localhost:5000/users', body);
    if (typeof response.data === 'string') {
      dispatch(setError({ error: response.data }));
    } else {
      const logInBody = {
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value,
      };
      const user = await axios.post(
        'http://localhost:5000/users/signIn',
        logInBody
      );
      const userInfo = {
        first_name: user.data.first_name,
        last_name: user.data.last_name,
        email: user.data.email,
        uuid: user.data.uuid,
        isLoggedIn: true,
      };
      dispatch(setUser(userInfo));
      localStorage.setItem('token', user.data.token);
    }
  };
  return (
    <>
      <AuthNavigation />
      <Form>
        <div>
          <label htmlFor="firstName">First Name*: </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            ref={firstNameInputRef}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name*: </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            ref={lastNameInputRef}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email*: </label>
          <input
            type="email"
            name="email"
            id="email"
            ref={emailInputRef}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password*: </label>
          <input
            type="password"
            name="password"
            id="password"
            ref={passwordInputRef}
            required
          />
        </div>
        <div>
          <label htmlFor="passwordConfirm">Confirm Password*: </label>
          <input
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            ref={passwordConfirmInputRef}
            required
          />
        </div>
        <Error>{registrationError}</Error>
        <input type="button" value="Register" onClick={handleSubmit} />
      </Form>
    </>
  );
}

export default Register;
