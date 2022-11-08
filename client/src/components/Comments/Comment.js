import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Comments from './Comments';
import CreateComment from './CreateComment';

function Comment({ comment, postUuid }) {
  const loggedInUser = useSelector(({ loggedInUser }) => loggedInUser);
  const [isReplyFormVisible, setIsReplyFormVisible] = useState(false);
  const [isRepliesVisible, setIsRepliesVisible] = useState(false);
  const likesRef = useRef(null);

  const handleLikeClick = async (e) => {
    const body = {
      userUuid: loggedInUser.uuid,
      commentUuid: comment.uuid,
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

  return (
    <div
      id={comment.uuid}
      style={{ position: 'relative', left: '15px', marginRight: '15px' }}
    >
      <div>{comment.content}</div>
      <div>
        <span ref={likesRef}>
          {comment.commentLikes &&
            comment.commentLikes.length > 0 &&
            comment.commentLikes.length}
        </span>

        {loggedInUser.isLoggedIn && (
          <div>
            <div>
              <button onClick={handleLikeClick}>
                {comment.commentLikes &&
                comment.commentLikes.length > 0 &&
                comment.commentLikes.filter(
                  (likes) => likes.userUuid === loggedInUser.uuid
                ).length > 0
                  ? 'Unlike'
                  : 'Like'}
              </button>

              <button
                onClick={() => {
                  setIsReplyFormVisible(true);
                }}
              >
                Reply to comment
              </button>
              {comment.CommentReplies && comment.CommentReplies.length > 0 && (
                <button onClick={() => setIsRepliesVisible(true)}>
                  Load Replies
                </button>
              )}
            </div>
            {isRepliesVisible && (
              <Comments
                isVisible={isRepliesVisible}
                commentUuid={comment.uuid}
                replyPostUuid={postUuid}
              />
            )}
            <CreateComment
              isVisible={isReplyFormVisible}
              postUuid={postUuid}
              replyCommentUuid={comment.uuid}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
