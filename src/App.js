import React from 'react';
import './App.css';
import Main from './components/main';
import BoxLoginCallback from './components/boxLoginCallback';
import BoxLogin from './components/boxLogin';
import OutlookLogin from './components/outlookLogin';

function App() {

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
  console.log('App');

  return (
    <div className="App">
      <OutlookLogin/>
      <BoxLogin/>
      {pages[path]}
    </div>
  );
}

export default App;
