import axios from 'axios';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const Form = styled.form`
  width: 30vw; //remove later
  display: flex;
  flex-direction: column;
`;

function CreatePost() {
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const loggedInUser = useSelector(({ loggedInUser }) => loggedInUser);

  const handleClick = async (e) => {
    let body = {
      text: textRef.current.value,
      image: imageRef.current.files[0],
      userUuid: loggedInUser.uuid,
    };
    const post = await axios.post('http://localhost:5000/posts/post', body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log(post);
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
