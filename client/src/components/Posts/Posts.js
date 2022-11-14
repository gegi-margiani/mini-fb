import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import CreatePost from './CreatePost';
import { setPostsPagination, setInitializePosts } from '../../reducers/posts';
import Post from './Post';
import useOnScreen from '../../hooks/useOnScreen';
import axios from 'axios';

const PostsDiv = styled.div`
  width: 40vw;
  margin: auto;
  .posts {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
`;
const FeedDiv = styled.div`
  display: flex;
  justify-content: center;
  button {
    padding: 0px 15px;
  }
`;
function Posts() {
  const posts = useSelector(({ posts }) => posts);
  const loggedInUser = useSelector(({ loggedInUser }) => loggedInUser);
  const dispatch = useDispatch();
  const postsDivRef = useRef(null);
  const isOnScreen = useOnScreen(postsDivRef);

  useEffect(() => {
    dispatch(setInitializePosts());
    axios
      .get('http://localhost:5000/posts/followedPosts/1', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => console.log(res.data));
  }, []);

  useEffect(() => {
    if (isOnScreen && posts.totalPages > posts.page)
      dispatch(setPostsPagination(posts));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnScreen]);

  return (
    <PostsDiv>
      {loggedInUser.isLoggedIn && <CreatePost />}
      <FeedDiv>
        <button>All</button>
        <button>Followed</button>
      </FeedDiv>
      <div ref={postsDivRef} className="posts">
        {posts.posts &&
          posts.posts.map((post) => {
            return <Post post={post} key={post.uuid} id={post.uuid} />;
          })}
      </div>
    </PostsDiv>
  );
}

export default Posts;
