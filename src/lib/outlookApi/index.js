import {UserAgentApplication} from "msal/lib-commonjs/index";
import {toUrl} from '../boxApi';

const msalConfig = {
  auth: {
    clientId: "cd83697c-e9dd-4d58-8aad-8d1ae1b475a6"
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  }
};

const requestObj = {
  scopes: ["Mail.ReadWrite", "MailboxSettings.ReadWrite"]
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

const graphBaseUrl = 'https://graph.microsoft.com/v1.0';

const callApi = async (path, method = 'GET', addHeaders = {}, body = null) => {
  const accessToken = await acquireToken();
  if (accessToken) {

    let req = {
      headers: {'Content-Type': 'application/json', ...addHeaders, 'Authorization': 'Bearer ' + accessToken},
      method,
    };
    if (body) {
      req.body = JSON.stringify(body);
    }
    const res = await fetch(graphBaseUrl + path, req);
    return res.json();
  } else {
    throw new Error('Unable to get access token.');
  }

};
export const getFirstEmailPage = async (groupName) => {
  const emailEndPoint = '/me/mailFolders/inbox/messages?'
    + toUrl({
      '$search': `"recipients:${groupName}"`,
      '$select': 'sender,subject,body,categories',
      '$top': 50,
      '$count': 'true'
    });

  return await getEmails(emailEndPoint);
};

export const createCategoryIfNotExists = async (categoryName) => {
  const res = await callApi('/me/outlook/masterCategories');
  if (res.value.filter(c => (c.displayName + '').toUpperCase() === (categoryName + '').toUpperCase()).length === 0) {
    alert(`Category name ${categoryName} does not exist we will create one.`);
    await callApi('/me/outlook/masterCategories', 'POST', {}, {
      displayName: categoryName,
      color: "preset9"
    })
  }

};

export const createFolderIfNotExists = async (folderName) => {
  const res = await callApi('/me/mailFolders');
  const folderEle = res.value.filter(c => (c.displayName + '').toUpperCase() === (folderName + '').toUpperCase());
  if (folderEle.length === 0) {
    alert(`Folder name ${folderName} does not exist we will create one.`);
    const newRes = await callApi('/me/mailFolders', 'POST', {}, {
      displayName: folderName
    });
    return newRes.id;
  }
  return folderEle[0].id;
};

export const moveEmailsToFolder = async (folderName, ids) => {

  const folderId = await createFolderIfNotExists(folderName);

  // https://github.com/microsoftgraph/microsoft-graph-docs/issues/2268
  await ids.map(async (id) => {
    await callApi(`/me/messages/${id}/move`, 'POST', {}, {
      "destinationId": folderId
    });
  })

};

export const autoReplyToSender = async (message, ids) => {
  await ids.map(async (id) => {
    await callApi(`/me/messages/${id}/reply`, 'POST', {}, {
      "comment": message
    });
  })
};

export const applyCategoryToEmails = async (categoryName, ids) => {

  await createCategoryIfNotExists(categoryName);

  await ids.map(async (id) => {
    await callApi(`/me/messages/${id}`, 'PATCH', {}, {
      categories: [categoryName]
    });
  })

};

export const getEmails = async (endPoint) => {

  const res = await callApi(endPoint, 'GET',
    {'Prefer': 'outlook.body-content-type="text"'});
  return {
    nextLink: res['@odata.nextLink'],
    emails: res.value
  }
};