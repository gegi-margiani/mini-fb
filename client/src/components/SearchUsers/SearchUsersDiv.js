import React from 'react';
import styled from 'styled-components';

const UsersDiv = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  gap: 5px;
`;

const SearchNavigationDiv = styled.div`
  display: flex;
`;
function SearchUsersDiv({
  searchResult,
  distanceFromLeft,
  currPage,
  setCurrPage,
}) {
  return (
    <UsersDiv style={{ left: `${distanceFromLeft}px` }}>
      {typeof searchResult === 'string' ? (
        <p>{searchResult}</p>
      ) : (
        searchResult.users.map((user) => {
          return (
            <div key={user.uuid} id={user.uuid}>
              <img
                src={`http://localhost:5000/${user.profile_picture_URL}`}
                alt="profile"
                style={{ width: '35px', borderRadius: '50%' }}
              />
              <span>
                {user.first_name} {user.last_name}
              </span>
            </div>
          );
        })
      )}
      {currPage && (
        <SearchNavigationDiv>
          {currPage !== 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrPage(1);
              }}
            >
              1
            </button>
          )}
          {currPage - 1 > 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrPage(currPage - 1);
              }}
            >
              {currPage - 1}
            </button>
          )}
          <button
            style={{
              backgroundColor: 'gray',
              border: '0px',
              borderRadius: '5px',
            }}
          >
            {currPage}
          </button>
          {currPage + 1 < searchResult.allPages && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrPage(currPage + 1);
              }}
            >
              {currPage + 1}
            </button>
          )}
          {currPage !== searchResult.allPages && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrPage(searchResult.allPages);
              }}
            >
              {searchResult.allPages}
            </button>
          )}
        </SearchNavigationDiv>
      )}
    </UsersDiv>
  );
}

export default SearchUsersDiv;
