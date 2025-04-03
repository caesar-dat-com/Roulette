import axios from 'axios';

const rouletteApi = axios.create({
  baseURL: 'http://localhost:3002', // URL del microservicio "roulette"
  timeout: 5000,
});

export default rouletteApi;
