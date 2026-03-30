import axios from "axios";

const api = axios.create({
  baseURL: "https://hostel-backend-2fw3.onrender.com/api"
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
