import React, {useState} from 'react';
import axios from 'axios';
import { Button, Modal, makeStyles, Input } from '@material-ui/core';

import './PostCreation.css'


const BASE_URL = 'http://127.0.0.1/'


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

      <div className="Auth-form-container">
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Create Post</h3>
            <div className="form-group mt-3">
              <label>Caption</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="caption"
                onChange={(event) => setCaption(event.target.value)}
                value={caption}
              />
            </div>
            <div className="form-group mt-3">
              <label>Text</label>
              <textarea
                type="text"
                className="form-control mt-1"
                placeholder="text"
                rows='3'
                onChange={(event) => setText(event.target.value)}
                value={text}
              />
            </div>
            <div className="form-group mt-3">
              <label>Did you feed the cat?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Yes&nbsp;</label>
              <input
                type="checkbox"
                className="form-check-input"
                onChange={handleChangeFeeded}
                value={feeded}
              />
            </div>
            <div className="form-group mt-3">
              <label>Year season when you met the cat</label>
              <select onChange={(event) => setSeason(event.target.value)} defaultValue={'DEFAULT'} className='form-select' aria-label="Default select example">
                <option value="DEFAULT" disabled>Season</option>
                <option value="Summer">Summer</option>
                <option value="Autumn">Autumn</option>
                <option value="Winter">Winter</option>
                <option value="Spring">Spring</option>
              </select>
            </div>
            <div className="form-group mt-3">
              <label>Type of place where you met the cat</label>
                <select onChange={(event) => setMeetedAt(event.target.value)} defaultValue={'DEFAULT'} className='form-select'>
                <option value="DEFAULT" disabled>Place</option>
                <option value="Outdoors">Outdoors</option>
                <option value="Indoors">Indoors</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
            <div className="form-group mt-3">
              <label for="formFile" class="form-label">Image</label>
              <input type='file' className='form-control' id="formFile" onChange={(e) => {
                uploadImage(e)
              }}/>
            </div>
            <br></br>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary" onClick={createPost}>
                Create Post
              </button>
            </div>
          </div>
        </form>
      </div>

    </div>
  )
}
  
  
  export default PostCreation;