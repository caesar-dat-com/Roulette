import axios from 'axios';

const transactionsApi = axios.create({
  baseURL: 'http://localhost:3004', // URL del microservicio "transactions"
  timeout: 5000,
});

export default transactionsApi;
