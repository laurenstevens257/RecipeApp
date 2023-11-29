import React, { useState } from 'react'
import './Login.css';
import PropTypes from 'prop-types';

export default function Login( { setToken } ) {
    
    const [usernameLogin, setLoginUserName] = useState('');
    const [passwordLogin, setLoginPassword] = useState('');
    const [usernameSignup, setSignupUserName] = useState('');
    const [passwordSignup, setSignupPassword] = useState('');
    const [error, setError] = useState('');

    async function loginUser() {
        return fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              username: usernameLogin,
              password: passwordLogin
          })
        })
          .then(data => data.json())
       }

    async function SignupUser() {
        return fetch('http://localhost:8080/signup', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameSignup,
                password: passwordSignup
            })
        })
            .then(data => data.json())
    }

    const handleSubmitLogin = async e => {
        e.preventDefault();
        const token = await loginUser();
        setToken(token);
      }

      const handleSubmitSignup = async e => {
        e.preventDefault();
        try {
            const response = await SignupUser();
    
            if (!response.success) {
                // Handle server errors
                setError('Signup failed: ' + response.statusText);
                return;
            } else{
                setToken(response);
            }
    
            const data = await response.json();
    
        } catch (error) {
            // Handle network errors
            setError('other error occurred during signup');
        }
    }
    

    return(
        <div>
            <div className="login-wrapper">
                <h1>Please Log In</h1>
                <form onSubmit={handleSubmitLogin}>
                    <label>
                        <p>Username</p>
                        <input type="text" onChange={e => setLoginUserName(e.target.value)}/>
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password" onChange={e => setLoginPassword(e.target.value)}/>
                    </label>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>

                <h1>Or Sign Up</h1>
                <form onSubmit={handleSubmitSignup}>
                    <label>
                        <p>Username</p>
                        <input type="text" onChange={e => setSignupUserName(e.target.value)}/>
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password" onChange={e => setSignupPassword(e.target.value)}/>
                    </label>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }

