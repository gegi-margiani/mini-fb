import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LogOut from './LogOut';
import SearchPeople from './SearchPeople';

const NavDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

function Navigation() {
  const loggedInUser = useSelector(({ loggedInUser }) => loggedInUser);
  return (
    <div>
      {!loggedInUser.isInitialized ? (
        <NavDiv>
          <SearchPeople />
          <Link to="/">Main</Link>
          <LogOut />
        </NavDiv>
      ) : (
        <NavDiv>
          <SearchPeople />
          <Link to="/">Main</Link>
          <div>
            <Link to="/register">Register</Link>
            <Link to="/login">Log In</Link>
          </div>
        </NavDiv>
      )}
    </div>
  );
}

export default Navigation;
