import React, { useState } from 'react'
import './Login.css';
import PropTypes from 'prop-types';

export default function Login( { setToken } ) {

  //'Password must be 8-20 characters with at least 1 number, 1 uppercase letter, 1 lowercase letter, 1 special character (!@#$%^&*), and no spaces',
    
    const [usernameLogin, setLoginUserName] = useState('');
    const [passwordLogin, setLoginPassword] = useState('');
    const [usernameSignup, setSignupUserName] = useState('');
    const [passwordSignup, setSignupPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);

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
        try {
            const response = await loginUser();
    
            if (!response.success) {
                // Handle server errors
                setError(response.error);
                return;
            } else{
                setToken(response);
            }
            
        } catch (error) {
            // Handle network errors
            setError('other error occurred during login');
        }
      }

    const handleSubmitSignup = async e => {
        e.preventDefault();
        try {
            const response = await SignupUser();
    
            if (!response.success) {
                // Handle server errors
                setError(response.error);
                return;
            } else{
                setToken(response);
            }    

        } catch (error) {
            // Handle network errors
            setError('other error occurred during signup');
        }
    }
    
  const handleToggleForm = () => {
    setIsLoginFormVisible(!isLoginFormVisible);
  };

  return (
    <div>
      <div className='logo-container'>
        <div className='logo'>
          <img src="/GoodEatsLogo2.png"/>
        </div>
      </div>
      <div className="login-wrapper">
        <h1>{isLoginFormVisible ? 'Please Log In' : 'Create an Account'}</h1>
      </div>
      <div className='login-wrapper'>
        {isLoginFormVisible ? (
          <form onSubmit={handleSubmitLogin}>
            <div className='cred-boxes'>
                    <label>
                        <p>Username</p>
                        <input type="text" onChange={e => setLoginUserName(e.target.value)} style={{ borderColor: 'black' }}/>
                         
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="text" onChange={e => setLoginPassword(e.target.value)}  style={{ borderColor: 'black' }}/>
              
                    </label>
                    
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                    {/* <small className="password-requirement">
                Password must be 8-20 characters with at least 1 number, 1 uppercase letter, 1 lowercase letter, 1 special character (!@#$%^&*), and no spaces
              </small> */}
              </div>
          </form>
        ) : (
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
        )}
        </div>
        <div className='error-wrapper'>
        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        </div>
        <div className='login-wrapper'>
        {isLoginFormVisible ? (
          <p className="signup-link" onClick={handleToggleForm}>
            Don't have an Account? Sign Up
          </p>
        ) : (
          <p className="signup-link" onClick={handleToggleForm}>
            Back to Login
          </p>
        )}
        </div>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};