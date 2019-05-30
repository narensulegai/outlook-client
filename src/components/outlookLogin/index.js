import React, {useState} from 'react';
import {login, logout, getCurrentUser} from "../../lib/outlookApi";

function OutlookLogin(props) {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  props.onChange(currentUser);

  const onLogin = async () => {
    await login();
    const currentUser = getCurrentUser();
    setCurrentUser(getCurrentUser());
    props.onChange(currentUser);
  };

  const onLogout = async () => {
    await logout();
    setCurrentUser(null);
    props.onChange(currentUser);
  };

  return <div>
    {currentUser !== null
      ? <div>
        <button onClick={onLogout}>Logout Outlook</button>
      </div>
      : <button onClick={onLogin}>Login Outlook</button>}


  </div>
}

export default OutlookLogin;