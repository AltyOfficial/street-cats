import React, { useState, useEffect } from 'react';
import { Avatar, Button, Modal } from '@material-ui/core';

import './Post.css'


const BASE_URL = 'http://127.0.0.1/'


function Post({ post, authToken, user }) {

  const [image, setImage] = useState('');
  const cat_feeded = post.feeded == true
  const djangoDate = post.pub_date
  const newDate = djangoDate.slice(0, 10).replace('-', '.').replace('-', '.')
  const [openProfile, setOpenProfile] = useState(false);
  const [openUpdateProfile, setopenUpdateProfile] = useState(false);
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  var isAuthor = false
  var isUserProfile = false

  if (user == null) {
    isAuthor = false
  } else {
    isAuthor = post.author.id == user.id
  }

  if (user == null) {
    isUserProfile = false
  } else if (profile == null) {
    isUserProfile = false
  } else {
    isUserProfile = profile.username == user.username
  }

  const handleDelete = (event) => {
    event?.preventDefault();

    const requestOptions = {
      method: 'DELETE',
      headers: new Headers ({
        'Authorization': 'Token ' + authToken,
      })
    }

    fetch(BASE_URL + 'api/v1/posts/' + post.id, requestOptions)
      .then(response => {
        if (response.ok) {
          window.location.reload()
        }
        throw response
      })
      .catch(error => {
        console.log(error);
      })
  }

  const updateProfile = (event) => {
    event?.preventDefault();

    const json_string = JSON.stringify({
      username: username,
      email:email
    })

    const requestOptions = {
      method: 'PATCH',
      body: json_string,
      headers: new Headers ({
        'Authorization': 'Token ' + authToken,
        'Content-Type': 'application/json; charset=UTF-8'
      })
    }

    fetch(BASE_URL + 'api/users/' + user.id + '/', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .catch(error => {
        console.log(error);
        alert(error);
      })

  }

  const uploadImage = async (e) => {
    const file = e.target.files[0]
    const base64 = await base64Convertion(file)
    setImage(base64)
    console.log(base64)
  }

  const base64Convertion = (file) => {
    return new Promise((resolve, reject) => {

      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      // fileReader.onerror((error) => {
      //   reject(error);
      // });

    });
  }

  const updateProfilePicture = (event) => {
    event?.preventDefault();

    if (image != '') {

      const json_string = JSON.stringify({
        'picture': image
      })

      const requestOptions = {
        method: 'PATCH',
        body: json_string,
        headers: new Headers ({
          'Authorization': 'Token ' + authToken,
          'Content-Type': 'application/json'
        })
      }

      fetch(BASE_URL + 'api/users/' + 'change_profile_picture/', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        window.location.reload()
        window.scrollTo(0, 0)
      })
      .catch(error => {
        console.log(error);
        alert(error);
      })

    }

  }

  const upvote = (event) => {

    const requestOptions = {
      method: 'POST',
      headers: new Headers ({
        'Authorization': 'Token ' + authToken,
        'Content-Type': 'application/json'
      })
    }

    fetch(BASE_URL + 'api/v1/posts/' + post.id + '/upvote/', requestOptions)
  }

  const downvote = (event) => {

    const requestOptions = {
      method: 'POST',
      headers: new Headers ({
        'Authorization': 'Token ' + authToken,
        'Content-Type': 'application/json'
      })
    }

    fetch(BASE_URL + 'api/v1/posts/' + post.id + '/downvote/', requestOptions)
  }

  const follow = (event) => {

    const requestOptions = {
      method: 'POST',
      headers: new Headers ({
        'Authorization': 'Token ' + authToken,
        'Content-Type': 'application/json'
      })
    }

    fetch(BASE_URL + 'api/users/' + profile.id + '/follow/', requestOptions)
    .then(response => {
      if (response.ok) {
        window.location.reload()
      }
      throw response
    })
  }


  const unfollow = (event) => {

    const requestOptions = {
      method: 'DELETE',
      headers: new Headers ({
        'Authorization': 'Token ' + authToken,
        'Content-Type': 'application/json'
      })
    }

    fetch(BASE_URL + 'api/users/' + profile.id + '/follow/', requestOptions)
    .then(response => {
      if (response.ok) {
        window.location.reload()
      }
      throw response
    })
  }

  const getProfile = (user_id) => {
    const requestOptions = {
      method: 'GET',
      headers: new Headers ({
        'Authorization': 'Token ' + authToken
      })
    }

    fetch(BASE_URL + 'api/users/' + user_id + '/', requestOptions)
      .then(response => {
        const json = response.json()
        console.log(json)
        if (response.ok) {
          return json
        }
        throw response
      })
      .then(data => {
        setProfile(data);
      })
      .catch(error => {
        console.log(error);
    })
  }

  return (
    <div className='post'>

      {user ? (

        <Modal open={openUpdateProfile} onClose={() => setopenUpdateProfile(false)}>

        <div className="Auth-form-container">
          <form className="Auth-form">
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Update Profile</h3>
              <text>Please fill both username and email fields once again. I don't know how to do it properly. Changes will work only when you relogin into your account. Sorry for the inconvenience</text>
              <div className="form-group mt-3">
                <label>Username.&nbsp;&nbsp;</label><text className='text-color-and-size'>Current username is "{user.username}"</text>
                <input
                  type="text"
                  className="form-control mt-1"
                  placeholder="username"
                  // value={user.username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label>Email.&nbsp;&nbsp;</label><text className='text-color-and-size'>Current email is "{user.email}"</text>
                <input
                  type="email"
                  className="form-control mt-1"
                  placeholder="email"
                  // value={user.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label>Upload profile picture.&nbsp;&nbsp;</label>
                <input type='file' className='post_variable' onChange={(e) => {
                  uploadImage(e)
                }}/>
              </div>
              <div className="d-grid gap-2 mt-3">
                <button type="submit" className="btn btn-primary" onClick={() => {updateProfile(); updateProfilePicture()}}>
                  Submit
                </button>
              </div>
              <p className="text-center mt-2">
                <a href="#">Change password</a>
              </p>
            </div>
          </form>
        </div>

        </Modal>

        ) : (
          <div></div>
          )
      }

      <Modal open={openProfile} onClose={() => setOpenProfile(false)}>
        <div className="profile-container">
          <div className="profile-config">
            {profile ? (
              <div>
                <div className='post_header'>
                  <Avatar alt='user-picture' src={profile.profile.picture}/>
                  <div className='post_headerInfo'>
                    <h3>{profile.username}</h3>
                    <h6>Registered {profile.profile.created.slice(0, 10).replace('-', '.').replace('-', '.')}</h6>
                  </div>
                </div>
                {isUserProfile ? (
                  <div className='profileInfo'>
                    <button
                      className='post_updateProfile'
                      onClick={() => {setopenUpdateProfile(true)}}
                    >Update Profile</button>
                  </div>
                  ) : (
                  <div></div>
                  )
                }
                <p></p>
                <div className='profileInfo'>
                  Email:&nbsp;&nbsp;<h5>{ profile.email }</h5>
                </div>
                <div className='profileInfo'>
                  Followers:&nbsp;&nbsp;<h5>{ profile.profile.followers }</h5>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <a href="javascript:void(0)" onClick={follow}>follow</a>
                  &nbsp;/&nbsp;
                  <a href="javascript:void(0)" onClick={unfollow}>unfollow</a>
                </div>
                <hr></hr>
                <p></p>
                <div className='profileInfo'>
                  All meeted cats:&nbsp;&nbsp;<h5>{ profile.profile.cats_meeted }</h5>
                </div>
                <div className='profileInfo'>
                  All feeded cats:&nbsp;&nbsp;<h5>{ profile.profile.cats_feeded }</h5>
                </div>
                <p></p>
              </div>
              ) : (
              <div>
                <h5 className='profileInfo'>You need to login to view profiles</h5>
              </div>
              )
            }
          </div>
        </div>
      </Modal>

      <div className='post_header'>
        <Avatar
          alt='user-picture'
          src={post.author.profile.picture}
        />
        <div className='post_headerInfo'>
          <div className='post_captionButton'>
            <a href="javascript:void(0)"><h3 onClick={() => {setOpenProfile(true); getProfile(post.author.id)}}>{post.author.username}</h3></a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            {isAuthor ? (
                <button className='post_deleteButton' onClick={handleDelete}>Delete</button>
              ) : (
                <div></div>
              )
            }
          </div>
          <h6>{ newDate }</h6>
        </div>
      </div>

      <img className='post_image' src={post.image}/>
      <div>
        <h4 className='post_title'>{post.caption}</h4>
      </div>
      <div className='post_rating'>
        <h6 className='post_ratingText'>rating: {post.rating}</h6>
        <div className='post_ratingRating'>
          <a href="" onClick={upvote}>upvote</a>
          &nbsp;/&nbsp;
          <a href="" onClick={downvote}>downvote</a>
        </div>
      </div>
      <div className='post_info'>
        <h6 className='post_ratingText'>meeted at {post.meeted_at}</h6>
        <h6>season: {post.season}</h6>
        {cat_feeded ? (
            <h6 className='post_ratingRating'>cat is feeded</h6>
          ) : (
            <h6 className='post_ratingRating'>cat is not feeded</h6>
          )
        }
      </div>
      <h5 className='post_title'>{post.text}</h5>

    </div>
  )
}


export default Post;
