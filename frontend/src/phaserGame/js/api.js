import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:3000', 
  baseURL:'https://absolute-pitch-game-glsd.onrender.com', 
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;