import {UserAgentApplication} from "msal/lib-commonjs/index";
import {toUrl} from '../boxApi';

const msalConfig = {
  auth: {
    clientId: "cd83697c-e9dd-4d58-8aad-8d1ae1b475a6",
    redirectUri: 'http://narensulegai.github.io/outlook-client'
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  }
};

const requestObj = {
  scopes: ["user.read"]
};

const userAgent = new UserAgentApplication(msalConfig);
userAgent.handleRedirectCallback(() => {

});


const acquireToken = async () => {
  return await acquireTokenOrRedirect();
};

export const login = async () => {
  await userAgent.loginRedirect(requestObj);
};

export const acquireTokenOrRedirect = async () => {
  try {
    const {accessToken} = await userAgent.acquireTokenSilent(requestObj);
    return accessToken;
  } catch (e) {
    //ClientAuthError, ServerError
    if (e.name === 'ServerError') {
      await userAgent.acquireTokenRedirect(requestObj);
    } else if (e.name === 'ClientAuthError') {
      //  user has logged out or is yet to login
    } else {
      alert('Your session has expired, you are being logged out. \nPlease login again.');
      await logout();
    }
  }
};

export const getCurrentUser = () => {
  return userAgent.getAccount() || null;
};

export const logout = () => {
  return userAgent.logout();
};


const callApi = async (url, addHeaders = {}) => {
  const accessToken = await acquireToken();
  if (accessToken) {
    const res = await fetch(url, {
      headers: {...addHeaders, 'Authorization': 'Bearer ' + accessToken}
    });
    return res.json();
  } else {
    throw new Error('Unable to get access token');
  }

};

export const getFirstEmailPage = async (groupName) => {
  const emailEndPoint = 'https://graph.microsoft.com/v1.0/me/messages?'
    + toUrl({
      '$search': `"recipients:${groupName}"`,
      '$select': 'sender,subject,body',
      '$top': 50,
      '$count': 'true'
    });

  return await getEmails(emailEndPoint);
};

export const getEmails = async (endPoint) => {

  const res = await callApi(endPoint,
    {'Prefer': 'outlook.body-content-type="text"'});
  return {
    nextLink: res['@odata.nextLink'],
    emails: res.value
  }
};