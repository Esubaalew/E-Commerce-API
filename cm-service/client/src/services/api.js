// api.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // Replace with your server URL

const api = axios.create({
  baseURL: API_URL,
});

export default api;
