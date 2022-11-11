import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import CreatePost from './CreatePost';
import {
  setAllPostsPagination,
  setInitializeAllPosts,
} from '../../reducers/posts';
import Post from './Post';
import useOnScreen from '../../hooks/useOnScreen';

const PostsDiv = styled.div`
  width: 40vw;
  margin: auto;
  .posts {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
`;

function Posts() {
  const posts = useSelector(({ posts }) => posts);
  const loggedInUser = useSelector(({ loggedInUser }) => loggedInUser);
  const dispatch = useDispatch();
  const postsDivRef = useRef(null);
  const isOnScreen = useOnScreen(postsDivRef);

  useEffect(() => {
    dispatch(setInitializeAllPosts());
  }, []);

  useEffect(() => {
    if (isOnScreen && posts.allPosts.totalPages > posts.allPosts.page)
      dispatch(setAllPostsPagination(posts));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnScreen]);

  return (
    <PostsDiv>
      {loggedInUser.isLoggedIn && <CreatePost />}

      <div ref={postsDivRef} className="posts">
        {posts.allPosts &&
          posts.allPosts.posts.map((post) => {
            return <Post post={post} key={post.uuid} id={post.uuid} />;
          })}
      </div>
    </PostsDiv>
  );
}

export default Posts;
