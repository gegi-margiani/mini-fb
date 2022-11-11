import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

let initialState = { isLoading: true };

const getCurrentState = (state) => {
  try {
    return JSON.parse(JSON.stringify(state));
  } catch (e) {
    return null;
  }
};

// const path = currState.allPosts.posts.getpostbyuuidhere.comments

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action) {
      return action.payload;
    },
    setAllPosts(state, action) {
      state.allPosts = action.payload;
    },
  },
});

export const { setPosts, setAllPosts } = postsSlice.actions;
export default postsSlice.reducer;

export const setInitializeAllPosts = () => {
  return async (dispatch) => {
    const posts = {};
    posts.allPosts = {};
    const allPostsData = await axios.get(
      `http://localhost:5000/posts/allPosts/1`
    );
    posts.allPosts.posts = allPostsData.data.posts;
    posts.allPosts.page = 1;
    posts.allPosts.totalPages = allPostsData.data.pages;
    // if (localStorage.getItem('token')) {
    //   const friendsPosts = await axios.get(
    //     `http://localhost:5000/posts/friendsPosts`
    //   );
    //   if (friendsPosts) {
    //     posts.friendsPosts.posts = friendsPosts;
    //     posts.friendsPosts.page = 1;
    //   }
    // }
    dispatch(setPosts(posts));
  };
};

export const setAllPostsPagination = (posts) => {
  return async (dispatch) => {
    const allPosts = {};
    const allPostsData = await axios.get(
      `http://localhost:5000/posts/allPosts/${posts.allPosts.page + 1}`
    );
    allPosts.posts = allPostsData.data.posts;
    allPosts.page = Math.ceil(allPosts.posts.length / 10);
    allPosts.totalPages = allPostsData.data.pages;
    dispatch(setAllPosts(allPosts));
  };
};

export const setInitializeFollowedPosts = () => {
  return async (dispatch) => {
    const posts = {};
    posts.allPosts = {};
    const allPostsData = await axios.get(
      `http://localhost:5000/posts/allPosts/1`
    );
    posts.allPosts.posts = allPostsData.data.posts;
    posts.allPosts.page = 1;
    posts.allPosts.totalPages = allPostsData.data.pages;
    // if (localStorage.getItem('token')) {
    //   const friendsPosts = await axios.get(
    //     `http://localhost:5000/posts/friendsPosts`
    //   );
    //   if (friendsPosts) {
    //     posts.friendsPosts.posts = friendsPosts;
    //     posts.friendsPosts.page = 1;
    //   }
    // }
    dispatch(setPosts(posts));
  };
};

// export const setFriendsPostsPagination = (pages) => {
//   return async (dispatch) => {
//     if (localStorage.getItem('token')) {
//       //check token's validity
//       const posts = {};
//       const friendsPosts = await axios.get(
//         `http://localhost:5000/posts/friendsPosts`
//       );
//       if (friendsPosts) {
//         posts.friendsPosts.posts = friendsPosts;
//         posts.friendsPosts.page += 1;
//         dispatch(setPosts(posts));
//       }
//     }
//   };
// };
