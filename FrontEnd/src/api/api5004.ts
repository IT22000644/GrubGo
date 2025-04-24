import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5004/api/",
});

export default instance;
