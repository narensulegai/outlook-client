import React, {useState, useEffect} from 'react';
import {getToken} from "../../lib/boxApi";

function BoxLoginCallback() {

  let params = (new URL(document.location)).searchParams;
  const code = params.get('code');

  if (code) {
    getToken({code})
      .then(token => {
        window.location = '/';
      });
  }

  return <div>
    {code ? 'Success' : 'Sorry Box authentication failed'}
  </div>;
}

export default BoxLoginCallback;