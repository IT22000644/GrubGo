import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:5011/",
});

export default instance;
