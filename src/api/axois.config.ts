import axios, { AxiosInstance } from 'axios';
import https from 'https';


const baseURL = `${process.env.API_URL}`;


const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // SSL tanúsítványok figyelmen kívül hagyása fejlesztési környezetben
  }),
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;