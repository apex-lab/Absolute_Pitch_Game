import axios from 'axios';
import { refreshAuthToken } from './gameutils';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
});

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // If the error is 401 and the request hasn't been retried yet
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const newToken = await refreshAuthToken();
            if (newToken) {
                originalRequest.headers['Authorization'] = newToken;
                return axiosInstance(originalRequest); // Retry the original request
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;