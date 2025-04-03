import axios from 'axios';

const usersApi = axios.create({
  baseURL: 'http://localhost:3001', // URL del microservicio "users"
  timeout: 5000,
});

export default usersApi;
