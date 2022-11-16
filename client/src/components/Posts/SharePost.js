import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { setInitializePosts } from '../../reducers/posts';
import Post from './Post';

const StyledShare = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0px;
  top: 0px;
  background-color: rgba(0, 0, 0, 0.2);
  & > div {
    position: absolute;
    z-index: 1;
    background-color: rgba(100, 100, 100, 1);
    width: 50vw;
    min-height: 20vh;
    top: 20vh;
    left: 25vw;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  div > button {
    position: absolute;
    right: 5px;
    top: 5px;
  }
  div > form {
    display: flex;
    width: 100%;
  }
  div > form > textarea {
    width: 100%;
  }
  & > div > div {
    padding: 1em 2em;
  }
`;

function SharePost({
  setIsSharing,
  post,
  currFeed,
  shareCount,
  setShareCount,
}) {
  const dispatch = useDispatch();
  const closeSharePost = (e) => {
    e.preventDefault();
    setIsSharing(false);
  };
  const sharePost = (e) => {
    e.preventDefault();
    const body = { postUuid: post.uuid };
    if (post.uuid) {
      axios.post(`http://localhost:5000/posts/post/share`, body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setShareCount(++shareCount);
      dispatch(setInitializePosts(currFeed));
    }
  };
  return (
    <StyledShare>
      <div>
        <button onClick={closeSharePost}>X</button>
        <div>
          <form>
            <textarea
              name="shareText"
              id="shareText"
              cols="70"
              rows="5"
              placeholder="Share text"
            />
            <input type="submit" value="Share" onClick={sharePost} />
          </form>
          <Post post={post} isSharing={true} />
        </div>
      </div>
    </StyledShare>
  );
}

export default SharePost;
