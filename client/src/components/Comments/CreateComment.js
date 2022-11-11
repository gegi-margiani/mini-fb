import axios from 'axios';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: row;
`;

function CreateComment(props) {
  const commentRef = useRef(null);
  const loggedInUser = useSelector(({ loggedInUser }) => loggedInUser);
  const handleClick = async (e) => {
    e.preventDefault();
    const body = {
      userUuid: loggedInUser.uuid,
      postUuid: props.postUuid,
      content: commentRef.current.value,
    };
    if (props.replyCommentUuid) {
      body.replyToUuid = props.replyCommentUuid;
    }
    const comment = await axios.post('http://localhost:5000/comments', body, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const newComment = {
      uuid: comment.data.uuid,
      content: comment.data.content,
      createdAt: comment.data.createdAt,
      user: {
        first_name: loggedInUser.first_name,
        last_name: loggedInUser.last_name,
        uuid: loggedInUser.uuid,
        profile_picture_URL: loggedInUser.profile_picture_URL,
      },
      commentLikes: [],
      commentReplies: [],
    };
    if (props.replyCommentUuid) {
      body.replyToUuid = props.replyCommentUuid;

      props.setUpdateReplies({
        ...props.comment,
        commentReplies: [...props.comment.commentReplies, newComment],
      });
      const commentsCopy = props.comments;
      const index = commentsCopy.comments.findIndex(
        (comment) => comment.uuid === props.replyCommentUuid
      );
      if (index > 0)
        commentsCopy.comments[index].commentReplies.push(newComment);
      props.setComments({ ...commentsCopy });
      props.setIsRepliesVisible(true);
    } else {
      if (!props.comments) {
        props.setComments({
          commentCurrPage: 1,
          commentTotalPages: 1,
          comments: [newComment],
        });
      } else {
        const commentsCopy = props.comments;
        commentsCopy.comments.unshift(newComment);
        props.setComments({ ...commentsCopy });
      }
    }
  };

  return (
    <>
      <Form style={{ display: props.isVisible ? 'flex' : 'none' }}>
        <textarea
          style={{ width: '100%' }}
          rows="2"
          placeholder="Post text"
          name="post comment"
          ref={commentRef}
        ></textarea>
        <button onClick={handleClick}>Post</button>
      </Form>
    </>
  );
}

export default CreateComment;
