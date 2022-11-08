import React, { useEffect, useState } from 'react';
import CreateComment from './CreateComment';
import Comment from './Comment';
import axios from 'axios';

function Comments(props) {
  const [comments, setComments] = useState(null);
  useEffect(() => {
    if (props.postUuid) {
      axios
        .get(`http://localhost:5000/comments/commentsByPost/${props.postUuid}`)
        .then((res) => {
          if (typeof res.data !== 'string') setComments(res.data);
        });
    } else if (props.commentUuid) {
      axios
        .get(
          `http://localhost:5000/comments/commentsByComment/${props.commentUuid}`
        )
        .then((res) => setComments(res.data));
    }
  }, []);

  const loadMoreComments = (e) => {
    e.preventDefault();
  };

  return (
    <div style={{ display: props.isVisible ? 'block' : 'none' }}>
      {props.postUuid && (
        <CreateComment isVisible={props.isVisible} postUuid={props.postUuid} />
      )}
      {comments &&
        comments.comments.map((comment, i) => {
          return (
            <Comment
              comment={comment}
              key={comment.uuid}
              postUuid={props.postUuid || props.replyPostUuid}
            />
          );
        })}
      {comments &&
        comments.commentCount >
          comments.commentCountShow * comments.commentCurrPage && (
          <button onClick={loadMoreComments}>load more comments</button>
        )}
    </div>
  );
}

export default Comments;
