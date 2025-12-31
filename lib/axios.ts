import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://lalitpurexpress.com/api/",
  withCredentials: true, // required to send cookies
});

export default axiosInstance;
