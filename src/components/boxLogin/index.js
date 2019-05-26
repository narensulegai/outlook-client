import React, {useState, useEffect} from 'react';
import {login, logout, isLoggedIn} from "../../lib/boxApi";

function BoxLogin() {
  //TODO: check for login timeout

  const [isUserLoggedIn, setUserLoggedIn] = useState(isLoggedIn());

  const onLogin = async () => {
    await login();
    setUserLoggedIn(true);
  };

  const onLogout = async () => {
    await logout();
    setUserLoggedIn(false);
  };

  return <div>
    {isUserLoggedIn
      ? <div>
        <button onClick={onLogout}>Logout Box</button>
      </div>
      : <button onClick={onLogin}>Login Box</button>}


  </div>
}

export default BoxLogin;