import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LogOut from './Auth/LogOut';
import SearchPeople from './SearchPeople';
import AuthNavigation from './Auth/AuthNavigation';

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
          <div>
            <Link to="/">Main</Link>
            <SearchPeople />
          </div>
          <LogOut />
        </NavDiv>
      ) : (
        <NavDiv>
          <SearchPeople />
          <Link to="/">Main</Link>
          <AuthNavigation />
        </NavDiv>
      )}
    </div>
  );
}

export default Navigation;
