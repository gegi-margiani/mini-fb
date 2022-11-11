import React, { useRef, useState } from 'react';
import axios from 'axios';
import SearchUsersDiv from './SearchUsersDiv';
import { useNavigate } from 'react-router-dom';
function SearchUsers() {
  const [searchResult, setSearchResult] = useState(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    if (e.target.value) {
      const res = await axios.get(
        `http://localhost:5000/users/search/${e.target.value}/1`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSearchResult(res.data);
    } else {
      setSearchResult(null);
    }
  };
  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/search/${searchRef.current.value}`);
  };
  return (
    <>
      <div style={{ display: 'inline-block' }}>
        <input
          type="text"
          placeholder="Search People"
          ref={searchRef}
          onChange={handleChange}
        />
        <input type="button" value="Search" onClick={handleClick} />
      </div>
      {searchResult && (
        <SearchUsersDiv
          searchResult={searchResult}
          distanceFromLeft={searchRef.current.getBoundingClientRect().left}
        />
      )}
    </>
  );
}

export default SearchUsers;
