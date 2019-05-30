import React, {useState, useEffect} from 'react';
import './App.css';
import Main from './components/main';
import BoxLoginCallback from './components/boxLoginCallback';
import BoxLogin from './components/boxLogin';
import OutlookLogin from './components/outlookLogin';
import {getCurrentUser} from "./lib/outlookApi";
import CurrentUserContext from './context/CurrentUserContext';

function App() {
  const [currentOutlookUser, setCurrentOutlookUser] = useState('Default user');
  //Check if it is a redirect form Box login
  let params = (new URL(document.location)).searchParams;
  let path = "";
  if (params.get('code')) {
    path = 'boxLoginCallback';
  }

  const pages = {
    "": <Main/>,
    "boxLoginCallback": <BoxLoginCallback/>
  };

  const onOutlookLogin = (user) => {
    setCurrentOutlookUser(user)
  };

  return (
    <div className="App">
      {/*<BoxLogin/>*/}
      <OutlookLogin onChange={onOutlookLogin}/>
      <CurrentUserContext.Provider value={currentOutlookUser}>
        {pages[path]}
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
