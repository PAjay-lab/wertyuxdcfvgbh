require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;
 
app.set('view engine', 'ejs');
app.use(express.static('public'));
 
let accessToken = '';
 
async function fetchToken() {
  try {
    const response = await axios.post(process.env.TOKEN_URL, null, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params: {
        grant_type: 'client_credentials',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
      }
    });
    accessToken = response.data.access_token;
  } catch (err) {
    console.error('Error fetching token:', err.message);
  }
}
 
app.get('/', async (req, res) => {
  if (!accessToken) await fetchToken();
 
  try {
    const stories = await axios.get(process.env.SAC_API, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
 
    res.render('index', { stories: stories.data.value || [] });
  } catch (err) {
    res.send(`Failed to fetch stories: ${err.message}`);
  }
});
 
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
 
