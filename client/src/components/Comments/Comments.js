import React, { useEffect, useState } from 'react';
import CreateComment from './CreateComment';
import Comment from './Comment';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

function Comments(props) {
  const [comments, setComments] = useState(null);
  const [mainComment, setMainComment] = useState(false);
  const params = useParams();
  const loggedInUser = useSelector(({ loggedInUser }) => loggedInUser);

  useEffect(() => {
    if (params.postUuid && params.commentUuid) {
      axios
        .get(
          `http://localhost:5000/comments/commentByUuid/${params.commentUuid}`
        )
        .then((res) => setMainComment(res.data));
    }
    if (props.commentUuid) {
      axios
        .get(
          `http://localhost:5000/comments/commentsByComment/${props.commentUuid}/1`
        )
        .then((res) => setComments(res.data));
    } else if (props.postUuid) {
      axios
        .get(
          `http://localhost:5000/comments/commentsByPost/${props.postUuid}/1`
        )
        .then((res) => {
          if (typeof res.data !== 'string') setComments(res.data);
        });
    }
  }, [params.commentUuid]);

  useEffect(() => {
    if (params.postUuid && params.commentUuid) {
      axios
        .get(
          `http://localhost:5000/comments/commentsByComment/${props.commentUuid}/1`
        )
        .then((res) => setComments(res.data));
    }
  }, [props.commentUuid]);

  useEffect(() => {
    if (props.updateReplies) {
      axios
        .get(
          `http://localhost:5000/comments/commentsByComment/${props.commentUuid}/${comments.commentCurrPage}`
        )
        .then((res) => setComments(res.data));
    }
  }, [props.updateReplies, props.deletedComment]);

  const loadMoreComments = (e) => {
    e.preventDefault();
    if (props.postUuid) {
      axios
        .get(
          `http://localhost:5000/comments/commentsByPost/${props.postUuid}/${
            comments.commentCurrPage + 1
          }`
        )
        .then((res) => {
          if (typeof res.data !== 'string') setComments(res.data);
        });
    } else if (props.commentUuid) {
      axios
        .get(
          `http://localhost:5000/comments/commentsByComment/${
            props.commentUuid
          }/${comments.commentCurrPage + 1}`
        )
        .then((res) => setComments(res.data));
    }
  };

  return (
    <div style={{ display: props.isVisible ? 'block' : 'none' }}>
      {props.postUuid && loggedInUser.isLoggedIn && !params.postUuid && (
        <CreateComment
          isVisible={props.isVisible}
          postUuid={props.postUuid}
          setComments={setComments}
          comments={comments}
        />
      )}
      {comments &&
        props.isReplyToMain &&
        comments.commentTotalPages > comments.commentCurrPage && (
          <button
            onClick={loadMoreComments}
            style={{ position: 'relative', left: '25px', marginRight: '25px' }}
          >
            load more comments
          </button>
        )}
      {console.log(mainComment)}
      {params.postUuid && params.commentUuid && mainComment === null && (
        <h1>This comment has been removed</h1>
      )}
      {mainComment && !props.isReplyToMain ? (
        <Comment
          isMainComment={true}
          comment={mainComment}
          postUuid={props.postUuid || props.replyPostUuid}
          comments={comments}
          setComments={setComments}
          postDistanceFromLeft={props.postDistanceFromLeft}
        />
      ) : comments && comments.comments ? (
        comments.comments.map((comment) => {
          return (
            <Comment
              comment={comment}
              key={comment.uuid}
              postUuid={props.postUuid || props.replyPostUuid}
              comments={comments}
              setComments={setComments}
              postDistanceFromLeft={props.postDistanceFromLeft}
              isNextCommentRedirect={props.isNextCommentRedirect}
            />
          );
        })
      ) : null}
    </div>
  );
}

export default Comments;
