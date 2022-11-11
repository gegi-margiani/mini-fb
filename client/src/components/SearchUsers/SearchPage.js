import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SearchUsersDiv from './SearchUsersDiv';
import Navigation from '../Navigation';

function SearchPage() {
  const [searchResult, setSearchResult] = useState(null);
  const searchRef = useRef(null);
  const params = useParams();
  const [currPage, setCurrPage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (params.searchString) {
      axios
        .get(`http://localhost:5000/users/search/${params.searchString}/1`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setCurrPage(false);
          setSearchResult(res.data);
        });
    } else {
      setCurrPage(false);
      setSearchResult(null);
    }
  }, [params.searchString]);

  useEffect(() => {
    if (currPage) {
      axios
        .get(
          `http://localhost:5000/users/search/${params.searchString}/${currPage}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        .then((res) => {
          setSearchResult(res.data);
        });
    }
  }, [currPage]);

  useEffect(() => {
    if (searchResult && typeof searchResult !== 'string') {
      setCurrPage(1);
    }
  }, [searchResult]);

  const handleClick = async (e) => {
    e.preventDefault();
    navigate(`/search/${searchRef.current.value}`);
  };

  return (
    <div>
      <Navigation />
      <input type="text" placeholder="Search People" ref={searchRef} />
      <input type="button" value="Search" onClick={handleClick} />
      {searchResult && (
        <SearchUsersDiv
          searchResult={searchResult}
          distanceFromLeft={searchRef.current.getBoundingClientRect().left}
          currPage={currPage}
          setCurrPage={setCurrPage}
        />
      )}
    </div>
  );
}

export default SearchPage;
