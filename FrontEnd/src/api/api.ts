import axios from "axios";

const api = axios.create({
  baseURL: "http://api.grubgo.local",
});

export default api;
