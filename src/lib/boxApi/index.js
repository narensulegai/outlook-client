const clientId = '3ccc38g555atvo8e2jbzedk1pgtasj04';
const clientSecret = 'ICOgCh3hc11RzGhXcM94uX68yKNbmY2Y';

const toUrl = (m) => {
  const params = [];
  for (let k in m) {
    params.push(`${k}=${m[k]}`);
  }
  return params.join('&');
};

export const login = () => {
  const params = toUrl({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: 'http://localhost:3001',
    state: 'abc'
  });
  window.location = `https://account.box.com/api/oauth2/authorize?${params}`;
};

export const getToken = async (codeType) => {
  const body = toUrl({
    'grant_type': 'authorization_code',
    'client_id': clientId,
    'client_secret': clientSecret,
    ...codeType
  });
  const token = await fetch('https://api.box.com/oauth2/token', {
    method: 'POST',
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body
  });
  const t = await token.json();

  localStorage.boxAccessToken = t.access_token;
  localStorage.boxRefreshToken = t.refresh_token;
};


export const logout = async () => {
  const token = localStorage.getItem('boxAccessToken');
  const body = toUrl({
    'client_id': clientId,
    'client_secret': clientSecret,
    token
  });

  await fetch('https://api.box.com/oauth2/revoke', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body
  });

  localStorage.removeItem('boxAccessToken');
  localStorage.removeItem('boxRefreshToken');
};


const callApi = async (api) => {
  const accessToken = localStorage.getItem('boxAccessToken');
  const r = await fetch(api, {
    headers: {'Authorization': `Bearer ${accessToken}`}
  });
  return await r.json();
};


const callApiHandleLogin = async (api) => {
  try {
    return await callApi(api);
  } catch (e) {
    alert('You have been logged out of box, please login and try again');
    login();
  }
};

export const isLoggedIn = () => {
  return localStorage.getItem('boxAccessToken') !== null;
};


export const getUser = async () => {
  const api = 'https://api.box.com/2.0/users/me';
  return await callApiHandleLogin(api);
};

export const getFile = async (id = '77564228365') => {
  const api = `https://api.box.com/2.0/folders/${id}`;
  return await callApiHandleLogin(api);
};