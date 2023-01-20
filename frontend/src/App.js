import "bootstrap/dist/css/bootstrap.min.css";
import React, {useState, useEffect} from 'react';
import { Button, Modal, makeStyles, Input } from '@material-ui/core'

import './App.css';

import PostCreation from './PostCreation.js'


const BASE_URL = 'http://localhost:8000/'


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    position: 'absolute',
    width: 400,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}))


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

  const classes = useStyles();
  const [modalStyle, setModalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [openLogIn, setOpenLogIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    setAuthToken(localStorage.getItem('authToken'));
    setUsername(localStorage.getItem('username'));
  }, [])

  const logIn = (event) => {
    
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
      })
      .catch(error => {
        console.log(error);
        alert(error);
      })
    
    setOpenLogIn(false);
  }

  const signUp = (event) => {

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

    window.localStorage.removeItem('username')
    window.localStorage.removeItem('authToken')
    setAuthToken(null)
    setUsername('')
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
              <p className="text-center mt-2">
                Forgot <a href="#">password?</a>
              </p>
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
              <p className="text-center mt-2">
                Forgot <a href="#">password?</a>
              </p>
            </div>
          </form>
        </div>

      </Modal>

      <div className='app_header'>
        <img className='app_headerLogo'
          alt='InstagramClone Logo'
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png'
        />
        <div className='app_headerMiddleMenu'>
          <Button variant='text'>Posts</Button>
          <Button variant='text'>Bands</Button>
        </div>
        <div className='app_headerRightMenu'>
          {authToken ? (
              <Button onClick={() => signOut()}>Logout</Button>
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

      {
        authToken ? (
          <PostCreation
            authToken={authToken}
          />
        ) : (
          <h3>You need to log in to upload</h3>
        )
      }

    </div>
  );
}

export default App;
