import React, { useState, useEffect } from 'react';
import { Avatar, Button, Modal } from '@material-ui/core';

import './Post.css'


const BASE_URL = 'http://localhost:8000/'


function Post({ post, authToken, userId }) {

  const cat_feeded = post.feeded == true
  const djangoDate = post.pub_date
  const newDate = djangoDate.slice(0, 10).replace('-', '.').replace('-', '.')
  const [openProfile, setOpenProfile] = useState(false);
  const [profile, setProfile] = useState(null);
  const isAuthor = post.author.id == userId


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

    fetch(BASE_URL + 'api/users/' + profile.username + '/follow/', requestOptions)
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

    fetch(BASE_URL + 'api/users/' + profile.username + '/follow/', requestOptions)
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
                <h5>No</h5>
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
