import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Comments from '../Comments/Comments';

const PostDiv = styled.div`
  margin-top: 5px;
  padding: 5px;
  border: 0.5px solid gray;
  border-radius: 5px;
  .postInfo {
    display: flex;
    justify-content: space-between;
  }
`;
const ImagePlaceholder = styled.div`
  width: 100%;
  height: 500px;
`;
function Post({ post }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const date = new Date(post.createdAt);
  const loggedInUser = useSelector(({ loggedInUser }) => loggedInUser);
  const [isCommentVisible, setIsCommentVisible] = useState(false);

  const handleLikeClick = async (e) => {
    const body = {
      userUuid: loggedInUser.uuid,
      postUuid: post.uuid,
    };
    if (e.target.innerHTML === 'Like') {
      await axios.post('http://localhost:5000/posts/postLike', body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      e.target.innerHTML = 'Unlike';
      e.target.parentElement.previousSibling.textContent =
        +e.target.parentElement.previousSibling.textContent + 1;
    } else {
      await axios.delete('http://localhost:5000/posts/postUnlike', {
        data: body,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      e.target.innerHTML = 'Like';
      if (+e.target.parentElement.previousSibling.textContent === 1) {
        e.target.parentElement.previousSibling.textContent = undefined;
      } else {
        e.target.parentElement.previousSibling.textContent =
          +e.target.parentElement.previousSibling.textContent - 1;
      }
    }
  };

  return (
    <PostDiv id={post.uuid}>
      <div className="postInfo">
        <div>{`${post.user.first_name} ${post.user.last_name}`}</div>
        <div>{`${date.getFullYear()}.${date.getMonth()}.${date.getDate()}
        ${date.getHours()}:${
          date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        }`}</div>
      </div>
      <>{post.text && <div>{post.text}</div>}</>
      <>
        {post.imageURL && !isImageLoaded && (
          <ImagePlaceholder></ImagePlaceholder>
        )}
        {post.imageURL && (
          <img
            src={`http://localhost:5000/${post.imageURL}`}
            alt=""
            style={{ width: '100%' }}
            onLoad={() => setIsImageLoaded(true)}
          />
        )}
      </>
      <span>{post.postLikes.length > 0 && post.postLikes.length}</span>
      {loggedInUser.isLoggedIn && (
        <div>
          <button onClick={handleLikeClick}>
            {post.postLikes.length > 0 &&
            post.postLikes.filter(
              (likes) => likes.userUuid === loggedInUser.uuid
            ).length > 0
              ? 'Unlike'
              : 'Like'}
          </button>
          <button
            onClick={() => {
              setIsCommentVisible(true);
            }}
          >
            Comment
          </button>
          <Comments isVisible={isCommentVisible} postUuid={post.uuid} />
        </div>
      )}
    </PostDiv>
  );
}

export default Post;
