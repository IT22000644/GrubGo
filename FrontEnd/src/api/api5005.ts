import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5005/",
});

export default instance;
