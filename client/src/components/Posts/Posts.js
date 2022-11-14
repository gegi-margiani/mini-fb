import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import CreatePost from './CreatePost';
import { setPostsPagination, setInitializePosts } from '../../reducers/posts';
import Post from './Post';
import useOnScreen from '../../hooks/useOnScreen';
import { useParams } from 'react-router-dom';

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
  const { userUuid } = useParams();
  const dispatch = useDispatch();
  const postsDivRef = useRef(null);
  const { isOnScreen, setIsOnScreen } = useOnScreen(postsDivRef);
  const [currFeed, setCurrFeed] = useState();

  useEffect(() => {
    if (currFeed) {
      setIsOnScreen(false);
      dispatch(setInitializePosts(currFeed));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currFeed]);

  useEffect(() => {
    if (isOnScreen && posts.totalPages > posts.page)
      dispatch(setPostsPagination({ posts, route: currFeed }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnScreen]);

  useEffect(() => {
    if (window.location.href !== 'http://localhost:3000/') {
      setCurrFeed(`userPosts/${userUuid}`);
    } else if (loggedInUser.isLoggedIn === true) {
      setCurrFeed('followedPosts');
    } else if (loggedInUser.isInitialized) {
      setCurrFeed('allPosts');
    }
  }, [loggedInUser]);

  return (
    <PostsDiv>
      {((loggedInUser.isLoggedIn &&
        loggedInUser.uuid &&
        window.location.href === 'http://localhost:3000/') ||
        (window.location.href !== 'http://localhost:3000/' &&
          userUuid === loggedInUser.uuid)) && (
        <>
          <CreatePost currFeed={currFeed} />
          {window.location.href === 'http://localhost:3000/' && (
            <FeedDiv>
              <button
                onClick={() => {
                  setCurrFeed('allPosts');
                }}
              >
                All
              </button>
              <button
                onClick={() => {
                  setCurrFeed('followedPosts');
                }}
              >
                Followed
              </button>
            </FeedDiv>
          )}
        </>
      )}

      <div ref={postsDivRef} className="posts">
        {currFeed && (
          <>
            {posts.posts &&
              posts.posts.map((post) => {
                return <Post post={post} key={post.uuid} id={post.uuid} />;
              })}
          </>
        )}
      </div>
    </PostsDiv>
  );
}

export default Posts;
