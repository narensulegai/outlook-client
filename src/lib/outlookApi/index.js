import {UserAgentApplication} from "msal/lib-commonjs/index";
import {toUrl} from '../boxApi';

const msalConfig = {
  auth: {
    clientId: "cd83697c-e9dd-4d58-8aad-8d1ae1b475a6",
    redirectUri: 'https://narensulegai.github.io/outlook-client',
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

// https://graph.microsoft.com/v1.0/me/messages?$search="from:shilpa_goswami@mckinsey.com"&$select=subject,from
// https://graph.microsoft.com/v1.0/me/messages?$filter=from/emailAddress/address eq 'Shilpa_Goswami@mckinsey.com'

const emailEndPoint = 'https://graph.microsoft.com/v1.0/me/messages?'
  + toUrl({
    '$search': `"recipients:updateideabank"`,
    '$select': 'sender,subject,body',
    '$top': 50,
    '$count': 'true'
  });

export const getEmails = async (endPoint = emailEndPoint) => {

  const res = await callApi(endPoint,
    {'Prefer': 'outlook.body-content-type="text"'});
  return {
    nextLink: res['@odata.nextLink'],
    emails: res.value
  }
};