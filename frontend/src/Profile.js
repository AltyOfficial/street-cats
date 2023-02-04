import React, { useState, useEffect } from 'react';
import { Avatar, Button, Modal } from '@material-ui/core';

import './Profile.css'


function Profile({ profile, authToken, BASE_URL }) {

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

  return (
    <div>
      <div className='profile-header'>
        <Avatar alt='user-picture' src={profile.profile.picture}/>
        <div className='profile-headerInfo'>
          <h3>{profile.username}</h3>
          <h6>Registered {profile.profile.created.slice(0, 10).replace('-', '.').replace('-', '.')}</h6>
        </div>
      </div>
      <div className='profileInfo'>
        Email:&nbsp;&nbsp;<h5>{ profile.email }</h5>
      </div>
      <div className='profileInfo'>
        Followers:&nbsp;&nbsp;<h5>{ profile.profile.followers }</h5>
        &nbsp;/&nbsp;
        <a href="javascript:void(0)" onClick={unfollow}>unfollow</a>
      </div>
      {profile.profile.following_you ? (
            <div className='profileInfo'>
              <h6 className='text-follows-true'>This user also follows you</h6>
            </div>
          ) : (
            <div className='profileInfo'>
              <h6 className='text-follows-false'>This user doesn't follow you</h6>
            </div>
          )
        }
      <hr></hr>
      <p></p>
      <div className='profileInfo'>
        All meeted cats:&nbsp;&nbsp;<h5>{ profile.profile.cats_meeted }</h5>
      </div>
      <div className='profileInfo'>
        All feeded cats:&nbsp;&nbsp;<h5>{ profile.profile.cats_feeded }</h5>
      </div>
      <p></p>
      <hr></hr>
    </div>
  
  )
}


export default Profile;
