import axios from 'axios';
export const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  if (config.url?.startsWith("http://localhost:4000")) {
    config.url = config.url.replace(/^http:\/\/localhost:4000/, "");
  }
  if (config.baseURL?.startsWith("http://localhost:4000")) {
    config.baseURL = "/api";
  }
  return config;
});

export { api }; 
