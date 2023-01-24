import React, {useState} from 'react';
import axios from 'axios';
import { Button, Modal, makeStyles, Input } from '@material-ui/core';

import './PostCreation.css'


const BASE_URL = 'http://localhost:8000/'


function PostCreation({authToken}) {

  const [caption, setCaption] = useState('');
  const [text, setText] = useState('');
  const [season, setSeason] = useState('');
  const [feeded, setFeeded] = useState(false);
  const [meetedAt, setMeetedAt] = useState('');
  const [image, setImage] = useState('');

  const handleChangeFeeded = event => {

    if (event.target.checked) {
      console.log('✅ Checkbox is checked');
    } else {
      console.log('⛔️ Checkbox is NOT checked');
    }
    setFeeded(current => !current);

  };

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

  const createPost = (imageUrl) => {

    const json_string = JSON.stringify({
      'caption': caption,
      'text': text,
      'season': season,
      'feeded': feeded,
      'meeted_at': meetedAt,
      'image': image
    })

    const requestOptions = {
      method: 'POST',
      headers: new Headers ({
        'Authorization': 'Token ' + authToken,
        'Content-Type': 'application/json'
      }),
      body: json_string
    }

    fetch(BASE_URL + 'api/v1/posts/', requestOptions)
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



  return (
    <div className='post_creation'>

      <input
        type='text'
        id='fileInput'
        placeholder='enter the title'
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <input
        type='text'
        className='post_variable'
        id='fileInput'
        placeholder='enter the text'
        onChange={(event) => setText(event.target.value)}
        value={text}
      />
      <div className='post_creation'>
        <h6 className='post_variable'>Did you feed the cat?</h6>
        <input
          type="checkbox"
          className='post_variable'
          onChange={handleChangeFeeded}
          value={feeded}
        />
      </div>
      <select onChange={(event) => setSeason(event.target.value)} defaultValue={'DEFAULT'} className='post_variable'>
        <option value="DEFAULT" disabled>Season</option>
        <option value="Summer">Summer</option>
        <option value="Autumn">Autumn</option>
        <option value="Winter">Winter</option>
        <option value="Spring">Spring</option>
      </select>
      <select onChange={(event) => setMeetedAt(event.target.value)} defaultValue={'DEFAULT'} className='post_variable'>
        <option value="DEFAULT" disabled>Place where you met the cat</option>
        <option value="Outdoors">Outdoors</option>
        <option value="Indoors">Indoors</option>
        <option value="Mixed">Mixed</option>
      </select>
      <input type='file' className='post_variable' onChange={(e) => {
        uploadImage(e)
      }}/>
      <Button className='imageUploadButton' onClick={createPost}>
        Create Post
      </Button>
    </div>
  )
}
  
  
  export default PostCreation;