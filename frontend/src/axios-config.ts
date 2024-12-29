import axios from "axios";
export const config = {
  api_url: "http://localhost:4000/api/v1/",
};
export const api = axios.create({
  baseURL: config.api_url,
});

api.interceptors.request.use((config) => {

  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
