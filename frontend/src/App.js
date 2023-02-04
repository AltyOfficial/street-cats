import "bootstrap/dist/css/bootstrap.min.css";
import React, {useState, useEffect} from 'react';
import { Button, Modal, makeStyles, Input } from '@material-ui/core'

import './App.css';

import Post from './Post.js'
import PostCreation from './PostCreation.js'
import Profile from './Profile.js'


const BASE_URL = 'http://127.0.0.1:8000/'


function App() {

  let base64code = '';

  const onChange = (e) => {
    const files = e.target.Files
    const file = files[0]
    getBase64(file)
  }

  const onLoad = (fileString) => {
    this.base64code = fileString
  }

  const getBase64 = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      onLoad(reader.result);
    }
    console.log(reader.result);
  }

  const [posts, setPosts] = useState([]);
  const [openLogIn, setOpenLogIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [followingProfiles, setfollowingProfiles] = useState([]);
  const [openFollowing, setOpenFollowing] = useState(false);
  const [openPostCreation, setOpenPostCreation] = useState(false);
  const followingEmpty = followingProfiles.length != 0

  useEffect(() => {
    setAuthToken(localStorage.getItem('authToken'));
    setUsername(localStorage.getItem('username'));
    setUser(JSON.parse(localStorage.getItem('user')));
  }, [])

  useEffect(() => {
    fetch(BASE_URL + 'api/v1/posts/')
      .then(response => {
        const json = response.json()
        if (response.ok) {
          return json
        }
        throw response
      })
      .then(data => {
        setPosts(data.results)
      })
      .catch(error => {
        console.log(error);
      })
  }, []);

  const logIn = (event) => {
    event?.preventDefault();
    
    let formData = new FormData();
    formData.append('username', username)
    formData.append('password', password)
    setUsername(username)

    const requestOptions = {
      method: 'POST',
      body: formData
    }

    fetch(BASE_URL + 'api/auth/token/login/', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        setAuthToken(data.auth_token)
        window.localStorage.setItem('username', username)
        window.localStorage.setItem('authToken', data.auth_token)
        get_user(data.auth_token);
      })
      .catch(error => {
        console.log(error);
        alert(error);
      })

    setOpenLogIn(false);
  }

  const signUp = (event) => {
    event?.preventDefault();

    const json_string = JSON.stringify({
      username: username,
      email:email,
      password: password
    })

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json_string
    }

    fetch(BASE_URL + 'api/users/', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        logIn();
      })
      .catch(error => {
        console.log(error);
        alert(error);
      })

    setOpenSignUp(false)
  }

  const signOut = (event) => {
    event?.preventDefault();
    
    const requestOptions = {
      method: 'POST',
      headers: new Headers ({
        'Authorization': 'Token ' + authToken
      })
    }

    fetch(BASE_URL + 'api/auth/token/logout/', requestOptions)
      .catch(error => {
        console.log(error);
        alert(error);
      })

    setUser(null);
    window.localStorage.removeItem('username')
    window.localStorage.removeItem('authToken')
    window.localStorage.removeItem('user')
    setAuthToken(null)
    setUsername('')
  }

  const fetchProfiles = () => {
    console.log(followingEmpty)
    console.log(authToken)
    
    const requestOptions = {
      method: 'GET',
      headers: new Headers ({
        'Authorization': 'Token ' + authToken,
        'Content-Type': 'application/json'
      })
    }

    fetch(BASE_URL + 'api/users/subscriptions/', requestOptions)
    .then(response => {
      const json = response.json();
      if (response.ok) {
        return json;
      }
      throw response
    })
    .then(data => {
      console.log(followingEmpty)
      setfollowingProfiles(data);
      console.log(followingEmpty)
      console.log(followingProfiles)
    })
    .catch(error => {
      console.log(error);
    })
  }

  const get_user = (authToken) => {

    const requestOptions = {
      method: 'GET',
      headers: new Headers ({
        'Authorization': 'Token ' + authToken
      })
    }

    fetch(BASE_URL + 'api/users/me/', requestOptions)
      .then(response => {
        const json = response.json()
        console.log(json)
        if (response.ok) {
          return json
        }
        throw response
      })
      .then(data => {
        setUser(data);
        window.localStorage.setItem('user', JSON.stringify(data));
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <div className='app'>

      <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>

        <div className="Auth-form-container">
          <form className="Auth-form">
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Sign Up</h3>
              <div className="text-center">
                Already registered?{" "}
                <span className="link-primary" onClick={() =>  {setOpenSignUp(false); setOpenLogIn(true)}}>
                  Log In
                </span>
              </div>
              <div className="form-group mt-3">
                <label>Username</label>
                <input
                  type="email"
                  className="form-control mt-1"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control mt-1"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control mt-1"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="d-grid gap-2 mt-3">
                <button type="submit" className="btn btn-primary" onClick={signUp}>
                  Submit
                </button>
              </div>
              <br></br>
            </div>
          </form>
        </div>
      
      </Modal>

      <Modal open={openLogIn} onClose={() => setOpenLogIn(false)}>

        <div className="Auth-form-container">
          <form className="Auth-form">
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Log In</h3>
              <div className="text-center">
                Not registered yet?{" "}
                <span className="link-primary" onClick={() =>  {setOpenLogIn(false); setOpenSignUp(true)}}>
                  Sign Up
                </span>
              </div>
              <div className="form-group mt-3">
                <label>Username</label>
                <input
                  type="email"
                  className="form-control mt-1"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control mt-1"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="d-grid gap-2 mt-3">
                <button type="submit" className="btn btn-primary" onClick={logIn}>
                  Submit
                </button>
              </div>
              <br></br>
            </div>
          </form>
        </div>

      </Modal>

      <Modal open={openPostCreation} onClose={() => setOpenPostCreation(false)}>
        {
          authToken ? (
            <PostCreation
              authToken={authToken}
              BASE_URL={BASE_URL}
            />
          ) : (
            <h3></h3>
          )
        }
      </Modal>

      <Modal open={openFollowing} onClose={() => setOpenFollowing(false)}  className='modal-body'>

        {followingEmpty ? (
            <div className="followingContent">
              <div className="followingContainer">
                {
                  followingProfiles.map(profile => (
                    <Profile profile={profile} authToken={authToken} BASE_URL={BASE_URL}/>
                  ))
                }
              </div>
            </div>
          ) : (
            <div className="followingNoneContainer">
              <div className="followingNoneContent">
                <h3 className="followingNoneContentText">Your follow list is empty</h3>
              </div>
            </div>
          )
        }

      </Modal>

      <div className='app_header'>
        <img className='app_headerLogo'
          alt='StreetCats Logo'
          src={BASE_URL + 'media/StreetCatsLogo.svg'}
        />
        <div>
          <button className='followingButton' onClick={() => {fetchProfiles(); setOpenFollowing(true)}}>Your following users</button>
        </div>
        <div className='app_headerRightMenu'>
          {authToken ? (
            <div className="app_headerRightMenuLoggedIn">
              <Button onClick={() => signOut()}>Logout</Button>
              <h5 className="app_headerRightMenuUsername">{ username }</h5>
            </div>
            ) : (
              <div>
                <Button variant='text' onClick={() => setOpenLogIn(true)}>Log In</Button>
                |
                <Button variant='text' onClick={() => setOpenSignUp(true)}>Sign Up</Button>
              </div>
            )
          }
        </div>
      </div>
      
      <div className="app_post_creation">
        {
          authToken ? (
            <button className='postCreateButton' onClick={() => setOpenPostCreation(true)}>Create Post</button>
          ) : (
            <h3></h3>
          )
        }
      </div>
      
      <div className="app_posts">
        {
          posts.map(post => (
            <Post post={post} authToken={authToken} user={user} BASE_URL={BASE_URL} />
          ))
        }
      </div>

    </div>
  );
}

export default App;
