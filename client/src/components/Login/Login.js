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

    async function loginUser(credentials) {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to log in');
      }
      return response.json();
    }

    async function signupUser(credentials) {
      const response = await fetch('http://localhost:8080/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sign up');
      }
      return response.json();
    }

    const handleSubmitLogin = async e => {
      e.preventDefault();
      try {
        const response = await loginUser({
          username: usernameLogin,
          password: passwordLogin
        });
        setToken(response);
      } catch (error) {
        setError(error.message);
      }
    }

    const handleSubmitSignup = async e => {
      e.preventDefault();
      try {
        const response = await signupUser({
          username: usernameSignup,
          password: passwordSignup
        });
        setToken(response);
      } catch (error) {
        setError(error.message);
      }
    }
    
  const handleToggleForm = () => {
    setIsLoginFormVisible(!isLoginFormVisible);
  };

  return (
    <div>
      <div className='logo-container'>
        <div className='logo'>
          <img src="/GoodEatsLogo2.png" alt="It was either this or GrEats."/>
        </div>
      </div>
      <div className="login-wrapper">
        <h1>{isLoginFormVisible ? 'Please Log In' : 'Create an Account'}</h1>
        {isLoginFormVisible ? (
          <form onSubmit={handleSubmitLogin}>
            <div className='cred-boxes'>
                    <label>
                        <p>Username</p>
                        <input type="text" onChange={e => setLoginUserName(e.target.value)} style={{ borderColor: 'black' }}/>
                         
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password" onChange={e => setLoginPassword(e.target.value)}  style={{ borderColor: 'black' }}/>
              
                    </label>
                    
                    <div>
                        <button type="submit">Submit</button>
                    </div>
              </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitSignup}>
                                <label>
                        <p>Username</p>
                        <input type="text" onChange={e => setSignupUserName(e.target.value)} style={{ borderColor: 'black' }}/>
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password" onChange={e => setSignupPassword(e.target.value)} style={{ borderColor: 'black' }}/>
                    </label>
                    <small className="password-requirement">
                Password must be 8-20 characters with at least 1 number, 1 uppercase letter, 1 lowercase letter, 1 special character (!@#$%^&*), and no spaces
              </small>
                    <div>
                <button type="submit">Submit</button>
                </div> 
          </form>
        )}
        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        {isLoginFormVisible ? (
          <p className="signup-link" onClick={handleToggleForm}>
            Don't have an Account? Sign Up
          </p>
        ) : (
          <p className="signup-link" onClick={handleToggleForm}>
            Already Have An Account?
          </p>
        )}
      </div>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};