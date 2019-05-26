import {UserAgentApplication} from "msal/lib-commonjs/index";

const msalConfig = {
  auth: {
    clientId: "cd83697c-e9dd-4d58-8aad-8d1ae1b475a6",
    redirectUri: 'http://localhost:3001',
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
  const {accessToken} = await userAgent.acquireTokenSilent(requestObj);
  return accessToken;
};

export const login = async () => {
  await userAgent.loginPopup(requestObj);
  await userAgent.acquireTokenPopup(requestObj);
};

export const getCurrentUser = () => {
  return userAgent.getAccount() || null;
};

export const logout = () => {
  return userAgent.logout();
};


const callApi = async (url, addHeaders = {}) => {
  const accessToken = await acquireToken();
  const res = await fetch(url, {
    headers: {...addHeaders, 'Authorization': 'Bearer ' + accessToken}
  });
  return res.json();
};


export const getEmails = async (endPoint = "https://graph.microsoft.com/beta/me/messages") => {
  const res = await callApi(endPoint, {'Prefer': 'outlook.body-content-type="text"'});
  return {
    emails: res.value
  }
};