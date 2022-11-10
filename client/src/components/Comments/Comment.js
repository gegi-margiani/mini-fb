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
      await axios.delete('http://localhost:5000/comments/commentUnlike', {
        data: body,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      e.target.innerHTML = 'Like';
      if (+likesRef.current.textContent === 1) {
        likesRef.current.textContent = undefined;
      } else {
        likesRef.current.textContent = +likesRef.current.textContent - 1;
      }
    }
  };
  const navigateByReplyChainLen = (len) => {
    const distanceFromLeft = Math.floor(
      (commentRef.current.getBoundingClientRect().left -
        props.postDistanceFromLeft) /
        27
    );
    if (params.commentUuid) {
      if (distanceFromLeft - 1 >= len) {
        navigate(`/post/${props.postUuid}/comment/${props.comment.uuid}`);
      }
    } else if (distanceFromLeft >= len) {
      navigate(`/post/${props.postUuid}/comment/${props.comment.uuid}`);
    }
  };

  return (
    <CommentDiv
      id={props.comment.uuid}
      style={{ borderLeft: isReplyFormVisible ? '2px solid gray' : null }}
      ref={commentRef}
    >
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
                    Reply to comment
                  </button>
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
              />
            </>
          )}
          {props.children && props.children}
          {!isRepliesVisible &&
            props.comment.CommentReplies &&
            props.comment.CommentReplies.length > 0 && (
              <button
                onClick={() => {
                  navigateByReplyChainLen(3);
                  setIsRepliesVisible(true);
                  setIsReplyFormVisible(true);
                }}
              >
                Load Replies
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
  );
}

export default Comment;
