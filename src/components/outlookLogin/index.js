import React, {useState, useEffect} from 'react';
import {login, logout, getCurrentUser} from "../../lib/outlookApi";

function OutlookLogin() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  const onLogin = async () => {
    await login();
    setCurrentUser(getCurrentUser())
  };

  const onLogout = async () => {
    await logout();
    setCurrentUser(null);
  };

  return <div>
    {currentUser !== null
      ? <div>
        <span>{currentUser.userName}</span>
        <button onClick={onLogout}>Logout Outlook</button>
      </div>
      : <button onClick={onLogin}>Login Outlook</button>}


  </div>
}

export default OutlookLogin;