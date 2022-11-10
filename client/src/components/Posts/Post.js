import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Comments from '../Comments/Comments';
import Navigation from '../Navigation';

const PostDiv = styled.div`
  margin-top: 5px;
  padding: 5px;
  border: 0.5px solid gray;
  border-radius: 5px;
  width: 40vw;
  margin: auto;
  .postInfo {
    display: flex;
    justify-content: space-between;
  }
`;
const ImagePlaceholder = styled.div`
  width: 100%;
  height: 500px;
`;
function Post(props) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [date, setDate] = useState();
  const [post, setPost] = useState(null);
  const postRef = useRef(null);
  const params = useParams();
  const loggedInUser = useSelector(({ loggedInUser }) => loggedInUser);
  const [isPostDeleted, setIsPostDeleted] = useState(false);

  useEffect(() => {
    if (props.post) {
      setPost(props.post);
    } else {
      axios
        .get(`http://localhost:5000/posts/post/${params.postUuid}`)
        .then((res) => {
          setPost(res.data);
          console.log(post);
          setIsCommentVisible(true);
        });
    }
  }, []);

  useEffect(() => {
    if (post) {
      setDate(new Date(post.createdAt));
    } else if (post === false) {
      setIsPostDeleted(true);
    }
  }, [post]);

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
      await axios.delete(
        `http://localhost:5000/posts/postUnlike/${post.uuid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      e.target.innerHTML = 'Like';
      if (+e.target.parentElement.previousSibling.textContent === 1) {
        e.target.parentElement.previousSibling.textContent = undefined;
      } else {
        e.target.parentElement.previousSibling.textContent =
          +e.target.parentElement.previousSibling.textContent - 1;
      }
    }
  };

  const deletePost = async (e) => {
    e.preventDefault();
    await axios.delete(
      `http://localhost:5000/posts/post/delete/${post.uuid || props.post.uuid}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    setIsPostDeleted(true);
  };

  return (
    <>
      {!isPostDeleted ? (
        <>
          {params.postUuid && <Navigation />}
          <PostDiv id={post ? post.uuid : null} ref={postRef}>
            {post && (
              <>
                <div className="postInfo">
                  <div>{`${post.user.first_name} ${post.user.last_name}`}</div>
                  <div>
                    {date &&
                      `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}
        ${date.getHours()}:${
                        date.getMinutes() < 10
                          ? '0' + date.getMinutes()
                          : date.getMinutes()
                      }`}
                  </div>
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
                <span>
                  {post.postLikes.length > 0 && post.postLikes.length}
                </span>

                <div>
                  {loggedInUser.isLoggedIn && (
                    <button onClick={handleLikeClick}>
                      {post.postLikes.length > 0 &&
                      post.postLikes.filter(
                        (likes) => likes.userUuid === loggedInUser.uuid
                      ).length > 0
                        ? 'Unlike'
                        : 'Like'}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsCommentVisible(true);
                    }}
                  >
                    Comment
                  </button>
                  {loggedInUser.isLoggedIn &&
                    post.user.uuid === loggedInUser.uuid && (
                      <button onClick={deletePost}>Delete</button>
                    )}
                  <Comments
                    isVisible={isCommentVisible}
                    postUuid={post.uuid}
                    postDistanceFromLeft={
                      postRef.current.getBoundingClientRect().left
                    }
                    commentUuid={params.commentUuid && params.commentUuid}
                  />
                </div>
              </>
            )}
          </PostDiv>
        </>
      ) : params.postUuid && isPostDeleted ? (
        <>
          {params.postUuid && <Navigation />}
          <h1>This post does't exist anymore</h1>
        </>
      ) : null}
    </>
  );
}

export default Post;
