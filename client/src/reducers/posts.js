import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

let initialState = { isLoading: true };

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action) {
      return action.payload;
    },
  },
});

export const { setPosts } = postsSlice.actions;
export default postsSlice.reducer;

export const setInitializePosts = () => {
  return async (dispatch) => {
    const posts = {};
    const postsData = await axios.get(`http://localhost:5000/posts/allPosts/1`);
    posts.posts = postsData.data.posts;
    posts.page = 1;
    posts.totalPages = postsData.data.pages;
    dispatch(setPosts(posts));
  };
};

export const setPostsPagination = (posts) => {
  return async (dispatch) => {
    const updatedPosts = {};
    const postsData = await axios.get(
      `http://localhost:5000/posts/allPosts/${posts.page + 1}`
    );
    updatedPosts.posts = postsData.data.posts;
    updatedPosts.page = Math.ceil(posts.posts.length / 10);
    updatedPosts.totalPages = postsData.data.pages;
    dispatch(setPosts(updatedPosts));
  };
};
