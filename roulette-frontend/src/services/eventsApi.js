import axios from 'axios';

const eventsApi = axios.create({
  baseURL: 'http://localhost:3006', // URL del microservicio "events"
  timeout: 5000,
});

export default eventsApi;
