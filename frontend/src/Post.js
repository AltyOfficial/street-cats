import React, { useState, useEffect } from 'react';
import { Avatar, Button } from '@material-ui/core';

import './Post.css'


const BASE_URL = 'http://localhost:8000/'


function Post({ post }) {

  const [rating, setRating] = useState(null);

  return (
    <div className='post'>

      <div className='post_header'>
        <Avatar
          alt='user-picture'
          src={BASE_URL + 'media/' + post.author.picture}
        />
        <div className='post_headerInfo'>
          <h3>{post.author.username}</h3>
        </div>
      </div>

      <img className='post_image' src={post.image}/>
      <h4 className='post_title'>{post.caption}</h4>

    </div>
  )
}


export default Post;
