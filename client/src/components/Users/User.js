import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Navigation from '../Navigation';
import CreatePost from '../Posts/CreatePost';

function User() {
  const [user, setUser] = useState(null);
  const [userFollowers, setUserFollowers] = useState(null);
  const loggedInUser = useSelector(({ loggedInUser }) => loggedInUser);
  const { userUuid } = useParams();
  const inputFilePickerRef = useRef(null);
  useEffect(() => {
    if (userUuid) {
      axios
        .get(`http://localhost:5000/users/user/full-info/${userUuid}`)
        .then((res) => {
          if (res.data) {
            setUser(res.data);
            setUserFollowers(res.data.followedBy);
          } else {
            setUser(`User doesn't exist`);
          }
        });
    }
  }, []);

  const handleFollow = async (e) => {
    e.preventDefault();
    const body = {
      userUuid: user.uuid,
    };
    const follow = await axios.post(
      `http://localhost:5000/users/follow`,
      body,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if (follow.data === 'User followed.')
      setUserFollowers([...userFollowers, { followerUuid: loggedInUser.uuid }]);
  };

  const handleUnfollow = async (e) => {
    e.preventDefault();
    const body = {
      userUuid: user.uuid,
    };
    const unfollow = await axios.delete(
      `http://localhost:5000/users/unfollow`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: body,
      }
    );
    if (unfollow.data === 'User unfollowed.') {
      setUserFollowers(
        userFollowers.filter(
          (follower) => follower.followerUuid !== loggedInUser.uuid
        )
      );
    }
  };

  const pickProfilePicture = (e) => {
    e.preventDefault();
    inputFilePickerRef.current.click();
  };

  const uploadProfilePicture = async (e) => {
    e.preventDefault();
    const body = {
      image: inputFilePickerRef.current.files[0],
    };
    const profilePictureURL = await axios.put(
      `http://localhost:5000/users/user/update-profile-picture`,
      body,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    setUser({ ...user, profile_picture_URL: profilePictureURL.data });
  };

  return user && typeof user !== 'string' ? (
    <div>
      <Navigation />
      <div>
        <img
          src={`http://localhost:5000/${user.profile_picture_URL}`}
          alt="profile"
          style={{ width: '70px', height: '70px' }}
        />
        <span>
          {user.first_name} {user.last_name}
        </span>
        <div>
          {userFollowers &&
            userFollowers.length > 0 &&
            `${userFollowers.length} Followers`}
        </div>
        {user.uuid === loggedInUser.uuid && (
          <div>
            <input
              type="file"
              name="profile"
              hidden={true}
              ref={inputFilePickerRef}
              onChange={uploadProfilePicture}
            />
            <button onClick={pickProfilePicture}>change profile picture</button>
          </div>
        )}
        {user.uuid !== loggedInUser.uuid &&
        userFollowers &&
        (userFollowers.length === 0 ||
          !userFollowers.filter(
            (follower) => follower.followerUuid === loggedInUser.uuid
          )) ? (
          <button onClick={handleFollow}>Follow</button>
        ) : user.uuid !== loggedInUser.uuid &&
          userFollowers &&
          userFollowers.filter(
            (follower) => follower.followerUuid === loggedInUser.uuid
          ) ? (
          <button onClick={handleUnfollow}>UnFollow</button>
        ) : null}
      </div>
      <div>
        {user.uuid === loggedInUser.uuid && <CreatePost />}
        {/* display user's posts */}
      </div>
    </div>
  ) : (
    <div>
      <h1>{user}</h1>
    </div>
  );
}

export default User;
