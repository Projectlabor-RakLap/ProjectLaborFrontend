import axios, { AxiosInstance } from 'axios';

const baseURL ="https://localhost:7116" //process.env.REACT_APP_API_URL || `https://${window.location.hostname}:7116`;


const axiosInstance: AxiosInstance = axios.create({
  baseURL,
   headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  }
});
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error("API error:", error);
    // Itt pl. kezelheted a 401-et, token refresh stb.
    return Promise.reject(error);
  }
);
export default axiosInstance;