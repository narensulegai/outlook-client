import React, {useState} from 'react';
import {login, logout, getCurrentUser} from "../../lib/outlookApi";

function OutlookLogin(props) {
  const currentUser = getCurrentUser();

  const onLogin = async () => {
    await login();
  };

  const onLogout = async () => {
    await logout();
  };

  return <React.Fragment>
    {currentUser !== null
      ? <div>
        <button onClick={onLogout}>Logout Outlook</button>
      </div>
      : <button onClick={onLogin}>Login Outlook</button>}


  </React.Fragment>
}

export default OutlookLogin;