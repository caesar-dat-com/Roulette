import axios from 'axios';

const bonusesApi = axios.create({
  baseURL: 'http://localhost:3003', // URL del microservicio "bonuses"
  timeout: 5000,
});

export default bonusesApi;
