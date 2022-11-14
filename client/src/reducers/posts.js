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

export const setInitializePosts = (route) => {
  return async (dispatch) => {
    const posts = {};
    let postsData;
    if (route === 'allPosts' || route.includes('userPosts')) {
      postsData = await axios.get(`http://localhost:5000/posts/${route}/1`);
    } else {
      postsData = await axios.get(`http://localhost:5000/posts/${route}/1`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    }
    posts.posts = postsData.data.posts;
    posts.page = 1;
    posts.totalPages = postsData.data.pages;
    dispatch(setPosts(posts));
  };
};

export const setPostsPagination = ({ posts, route }) => {
  return async (dispatch) => {
    const updatedPosts = {};
    let postsData;
    if (route === 'allPosts' || route.includes('userPosts')) {
      postsData = await axios.get(
        `http://localhost:5000/posts/${route}/${posts.page + 1}`
      );
    } else {
      postsData = await axios.get(
        `http://localhost:5000/posts/${route}/${posts.page + 1}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    }
    updatedPosts.posts = postsData.data.posts;
    updatedPosts.page = Math.ceil(posts.posts.length / 10);
    updatedPosts.totalPages = postsData.data.pages;
    dispatch(setPosts(updatedPosts));
  };
};
