import React, { useState } from 'react'
import './Login.css';
import PropTypes from 'prop-types';


async function loginUser(credentials) {
    return fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
}

// async function SignupUser(credentials) {
//   return fetch('http://localhost:8080/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(credentials)
//   })
//     .then(data => data.json())
// }



export default function Login( { setToken } ) {
    const [usernameLogin, setLoginUserName] = useState();
    const [passwordLogin, setLoginPassword] = useState();
    const [usernameSignup, setSignupUserName] = useState();
    const [passwordSignup, setSignupPassword] = useState();
    const [error, setError] = useState('');

    const handleSubmitLogin = async e => {
      e.preventDefault();
      const token = await loginUser({
        usernameLogin,
        passwordLogin
      });
      setToken(token);
    }

    const handleSubmitSignup = async e => {
        e.preventDefault();
        const token = await loginUser({
          usernameSignup,
          passwordSignup
        });
        setToken(token);
      }
  
    // const handleSubmitLogin = async (e) => {
    //   e.preventDefault();
      
    //   try {
    //     const response = await fetch('http://localhost:8080/login', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ usernameLogin, passwordLogin }),
    //     });
  
    //     if (response.ok) {
    //       const loginData = await response.json();
    //       setToken(loginData.token);
    //     } else {
    //       setError('Invalid username or password');
    //     }
    //   } catch (error) {
    //     console.error('Error during login:', error);
    //     setError('Error during login');
    //   }
    // };

    // const handleSubmitSignup = async (e) => {
    //   e.preventDefault();
    //   try {
    //       const response = await fetch('http://localhost:8080/signup', {
    //           method: 'POST',
    //           headers: {
    //               'Content-Type': 'application/json',
    //           },
    //           body: JSON.stringify({ usernameSignup, passwordSignup }),
    //       });

    //       if (response.ok) {
    //           // Automatically log in the user after successful signup
    //           const loginResponse = await fetch('http://localhost:8080/login', {
    //               method: 'POST',
    //               headers: {
    //                   'Content-Type': 'application/json',
    //               },
    //               body: JSON.stringify({ usernameSignup, passwordSignup }),
    //           });

    //           if (loginResponse.ok) {
    //               const loginData = await loginResponse.json();
    //               setToken(loginData.token);
    //           } else {
    //               // Handle login error after signup
    //               console.error('Login failed after signup');
    //           }
    //       } else {
    //           // Handle signup error
    //           console.error('Signup failed');
    //       }
    //   } catch (error) {
    //       console.error('Error during signup:', error);
    //   }
    // }
    
    return(
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

        <h1>Please Sign Up</h1>
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
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }
