const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');

const apiKey =
  '9f12407924a9ccb4b56e999e3aa07a6adda73a0de41fd92e40a4feb4983f87e9';
const model = 'google/gemini-2.0-flash-exp:free';

const url = 'https://ir-api.myqa.cc/v1/openai/images/generations';

module.exports = async function generate(description) {
  let query = `Generate a ${description}. Photorealistic.`;
  const payload = {
    prompt: query,
    model: model,
    quality: 'auto',
  };

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(url, payload, { headers });
    const rawBase64 = response.data.data[0].b64_json;
    const buffer = Buffer.from(rawBase64, 'base64');

    const hash = crypto
      .createHash('sha1')
      .update(buffer)
      .digest('hex')
      .slice(0, 8);
    const filename = `${hash}.jpg`;

    fs.writeFileSync(`public/img/${filename}`, buffer);
    console.log(`Image saved as ${filename}`);
    return filename;
  } catch (error) {
    console.error(
      'Error generating image:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
