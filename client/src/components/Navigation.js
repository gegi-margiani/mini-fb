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
const StyledDiv = styled.div`
  display: flex;
  a > img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
  a {
    display: flex;
    align-items: center;
    text-decoration: none;
  }
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
          <StyledDiv>
            {loggedInUser.isLoggedIn && (
              <Link to={`/user/${loggedInUser.uuid}`}>
                <span>
                  {loggedInUser.first_name} {loggedInUser.last_name}
                </span>
                <img
                  src={`http://localhost:5000/${loggedInUser.profile_picture_URL}`}
                  alt="profile"
                  style={{ width: '35px' }}
                />
              </Link>
            )}
            <LogOut />
          </StyledDiv>
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
