const axios = require('axios');
const qs = require('qs');

const getAccessToken = async () => {
  const data = qs.stringify({
    grant_type: 'client_credentials',
    scope: 'technology.catalog.read',
  });

  const config = {
    method: 'post',
    url: process.env.AUTH2_ACCESSTOKEN_URL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'OpenPlatform/1.0',
    },
    auth: {
      username: process.env.AUTH_CLIENT,
      password: process.env.AUTH2_SECRET,
    },
    data: data,
  };
  const response = await axios(config);
  return response.data.id_token;
};

const performVisualSearch = async (imageUrl, page, pageSize) => {
  const accessToken = await getAccessToken();
  const config = {
    method: 'get',
    url: `https://api.inditex.com/pubvsearch/products?image=${encodeURIComponent(
      imageUrl,
    )}&page=${page}&perPage=${pageSize}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'User-Agent': 'OpenPlatform/1.0',
    },
  };

  //console.log(config.url);
  const response = await axios(config);
  return response.data;
};

module.exports = {
  performVisualSearch,
};
