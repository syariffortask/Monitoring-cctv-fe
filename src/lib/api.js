import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000
});

// request interceptor / handler request sebeleum dikirim ke server
api.interceptors.request.use(
    (config) => {
        if (config.skipInterceptor) {
            return config;
        }
        const token = localStorage.getItem('token');
        if(!token){
            return Promise.reject({"message": "Unauthorized/token not found"});
        }
        config.headers.Authorization = `Bearer ${token}`;
        return config;
},
    (error) => Promise.reject(error)
);


// response interceptor / handler response dari server
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      return Promise.reject({ message: "Invalid credentials, please login again" });
    }
    return Promise.reject(error);
  }
);


export default api;