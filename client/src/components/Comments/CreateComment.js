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
  const loggedInUser = useSelector((loggedInUser) => loggedInUser);
  const handleClick = async (e) => {
    e.preventDefault();
    const body = {
      userUuid: loggedInUser.uuid,
      postUuid: props.postUuid,
      content: commentRef.current.value,
    };
    console.log(props.replyCommentUuid);
    if (props.replyCommentUuid) {
      body.replyToUuid = props.replyCommentUuid;
    }
    await axios.post('http://localhost:5000/comments', body, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
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
