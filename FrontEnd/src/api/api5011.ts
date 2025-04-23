import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:5011/api/",
});

export default instance;
