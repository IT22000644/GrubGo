import axios from "axios";


const api1 = axios.create({

  baseURL: "http://localhost:3000/api/v1",
});

const api2 = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

export { api1, api2 };
