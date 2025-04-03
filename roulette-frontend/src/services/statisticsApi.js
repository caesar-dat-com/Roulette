import axios from 'axios';

const statisticsApi = axios.create({
  baseURL: 'http://localhost:3005', // URL del microservicio "statistics"
  timeout: 5000,
});

export default statisticsApi;
