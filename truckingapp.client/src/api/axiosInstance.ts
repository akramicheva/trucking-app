import axios from 'axios';

const api = axios.create({

    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {

    return response;
  },
  (error) => {

    if (error.response?.status === 401) {
      console.warn('Сессия истекла или отсутствует доступ. Перенаправление на логин...');
 
      localStorage.removeItem('token');

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
 
export default api;