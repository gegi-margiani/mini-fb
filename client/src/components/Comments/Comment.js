import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Comments from './Comments';
import CreateComment from './CreateComment';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';

const CommentDiv = styled.div`
  position: relative;
  left: 25px;
  margin-right: 25px;
  border-radius: 5px;
`;

function Comment(props) {
  const loggedInUser = useSelector(({ loggedInUser }) => loggedInUser);
  const [isReplyFormVisible, setIsReplyFormVisible] = useState(() => {
    if (props.isMainComment) {
      return true;
    } else {
      return false;
    }
  });
  const [isRepliesVisible, setIsRepliesVisible] = useState(() => {
    if (props.isMainComment) {
      return true;
    } else {
      return false;
    }
  });
  const likesRef = useRef(null);
  const [updateReplies, setUpdateReplies] = useState(false);
  const navigate = useNavigate();
  const commentRef = useRef(null);
  const params = useParams();

  const handleLikeClick = async (e) => {
    const body = {
      userUuid: loggedInUser.uuid,
      commentUuid: props.comment.uuid,
    };
    if (e.target.innerHTML === 'Like') {
      await axios.post('http://localhost:5000/comments/commentLike', body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      e.target.innerHTML = 'Unlike';
      likesRef.current.textContent = +likesRef.current.textContent + 1;
    } else {
      await axios.delete(
        `http://localhost:5000/comments/commentUnlike/${props.comment.uuid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      e.target.innerHTML = 'Like';
      if (+likesRef.current.textContent === 1) {
        likesRef.current.textContent = undefined;
      } else {
        likesRef.current.textContent = +likesRef.current.textContent - 1;
      }
    }
  };

  const [isNextCommentRedirect, setIsNextCommentRedirect] = useState(false);
  const navigateByReplyChainLen = (len) => {
    const distanceFromLeft = Math.floor(
      (commentRef.current.getBoundingClientRect().left -
        props.postDistanceFromLeft) /
        27
    );
    if (params.commentUuid) {
      if (distanceFromLeft - 1 >= len) {
        navigate(`/post/${props.postUuid}/comment/${props.comment.uuid}`);
      } else if (distanceFromLeft >= len) {
        setIsNextCommentRedirect(true);
      }
    } else if (distanceFromLeft >= len) {
      navigate(`/post/${props.postUuid}/comment/${props.comment.uuid}`);
    } else if (distanceFromLeft + 1 >= len) {
      setIsNextCommentRedirect(true);
    }
  };

  const [isCommentDeleted, setIsCommentDeleted] = useState(false);
  const deleteComment = async (e) => {
    e.preventDefault();
    const res = await axios.delete(
      `http://localhost:5000/comments/comment/delete/${props.comment.uuid}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if (res.data) {
      setIsCommentDeleted(true);
    } else {
      setIsCommentDeleted(false);
    }
  };
  return (
    !isCommentDeleted && (
      <CommentDiv
        id={props.comment.uuid}
        style={{ borderLeft: isReplyFormVisible ? '2px solid gray' : null }}
        ref={commentRef}
      >
        <div id={props.comment.user.uuid}>
          {props.comment.user.first_name} {props.comment.user.last_name}
        </div>
        <div>{props.comment.content}</div>
        <div>
          <span ref={likesRef}>
            {props.comment.commentLikes &&
              props.comment.commentLikes.length > 0 &&
              props.comment.commentLikes.length}
          </span>
          <div>
            <div>
              {loggedInUser.isLoggedIn && (
                <>
                  <button onClick={handleLikeClick}>
                    {props.comment.commentLikes &&
                    props.comment.commentLikes.length > 0 &&
                    props.comment.commentLikes.filter(
                      (likes) => likes.userUuid === loggedInUser.uuid
                    ).length > 0
                      ? 'Unlike'
                      : 'Like'}
                  </button>
                  {!props.isMainComment && (
                    <button
                      onClick={(e) => {
                        navigateByReplyChainLen(3);
                        setIsReplyFormVisible(true);
                        setIsRepliesVisible(true);
                      }}
                    >
                      Reply{props.isNextCommentRedirect && '(Redirect)'}
                    </button>
                  )}
                  {props.comment.user.uuid === loggedInUser.uuid && (
                    <button onClick={deleteComment}>Delete</button>
                  )}
                </>
              )}
            </div>
            {(updateReplies || isRepliesVisible) && (
              <>
                <Comments
                  postDistanceFromLeft={props.postDistanceFromLeft}
                  isReplyToMain={true}
                  isVisible={isRepliesVisible}
                  commentUuid={props.comment.uuid}
                  replyPostUuid={props.postUuid}
                  updateReplies={updateReplies}
                  isNextCommentRedirect={isNextCommentRedirect}
                />
              </>
            )}
            {!isRepliesVisible &&
              props.comment.commentReplies &&
              props.comment.commentReplies.length > 0 && (
                <button
                  onClick={() => {
                    navigateByReplyChainLen(3);
                    setIsRepliesVisible(true);
                    setIsReplyFormVisible(true);
                  }}
                >
                  Load Replies{props.isNextCommentRedirect && '(Redirect)'}
                </button>
              )}
            {(loggedInUser.isLoggedIn || props.isMainComment) && (
              <CreateComment
                isVisible={isReplyFormVisible}
                postUuid={props.postUuid}
                replyCommentUuid={props.comment.uuid}
                setComments={props.setComments}
                comments={props.comments}
                comment={props.comment}
                setIsRepliesVisible={setIsRepliesVisible}
                setUpdateReplies={setUpdateReplies}
              />
            )}
          </div>
        </div>
      </CommentDiv>
    )
  );
}

export default Comment;
