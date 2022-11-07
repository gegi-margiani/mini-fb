import React, { useState } from 'react';
import styled from 'styled-components';

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
  return (
    <PostDiv>
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
    </PostDiv>
  );
}

export default Post;
