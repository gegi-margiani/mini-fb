import axios from 'axios';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setInitializeAllPosts } from '../../reducers/posts';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
`;

function CreatePost() {
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const dispatch = useDispatch();

  const handleClick = async (e) => {
    let body = {
      text: textRef.current.value,
      image: imageRef.current.files[0],
    };
    await axios.post('http://localhost:5000/posts/post', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    dispatch(setInitializeAllPosts());
  };

  return (
    <>
      <Form>
        <textarea
          cols="50"
          rows="5"
          placeholder="Post text"
          name="post text"
          ref={textRef}
        ></textarea>
        <input type="file" name="image" ref={imageRef} />
        <input type="button" value="Post" onClick={handleClick} />
      </Form>
    </>
  );
}

export default CreatePost;
