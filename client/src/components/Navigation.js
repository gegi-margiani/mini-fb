import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LogOut from './Auth/LogOut';
import AuthNavigation from './Auth/AuthNavigation';
import SearchUsers from './SearchUsers/SearchUsers';

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
            {!window.location.href.includes('http://localhost:3000/search') && (
              <SearchUsers />
            )}
          </div>
          <LogOut />
        </NavDiv>
      ) : (
        <NavDiv>
          {!window.location.href.includes('http://localhost:3000/search') && (
            <SearchUsers />
          )}
          <Link to="/">Main</Link>
          <AuthNavigation />
        </NavDiv>
      )}
    </div>
  );
}

export default Navigation;
