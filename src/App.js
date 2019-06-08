import React, {useState, useEffect} from 'react';
import './App.scss';
import Main from './components/main';
import BoxLoginCallback from './components/boxLoginCallback';
import * as outlookApi from './lib/outlookApi';
import OutlookLogin from './components/outlookLogin';
import CurrentUserContext from './context/CurrentUserContext';

function App() {
  const [currentOutlookUser, setCurrentOutlookUser] = useState(outlookApi.getCurrentUser());
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

  if (currentOutlookUser) {
    outlookApi.acquireTokenOrRedirect();
  }

  const handleOutlookLoginChange = (user) => {
    setCurrentOutlookUser(user)
  };


  return <div className={'main-layout'}>
    <div className={'logo'}/>
    <div className={'header'}>
      <div>Outlook Client</div>
      <OutlookLogin onChange={handleOutlookLoginChange}/>
    </div>
    <div className={'side-bar'}/>
    <div className={'body'}>
      <CurrentUserContext.Provider value={currentOutlookUser}>
        {pages[path]}
      </CurrentUserContext.Provider>
    </div>
    {/*<BoxLogin/>*/}


  </div>

}

export default App;
