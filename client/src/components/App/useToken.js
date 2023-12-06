import { useState } from 'react';
export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token;
  };
  
  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    if (userToken) {
      sessionStorage.setItem('token', JSON.stringify(userToken));
      setToken(userToken.token);
    } else {
      // Handle the case when userToken is null (i.e., during logout)
      sessionStorage.removeItem('token');
      setToken(null);
    }
  };

  return {
    setToken: saveToken,
    token
  };
}
