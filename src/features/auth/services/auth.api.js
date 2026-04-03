import axios  from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const apiBaseUrl = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;

const getToken = () => localStorage.getItem("auth_token");
const setToken = (token) => {
    if (token) {
        localStorage.setItem("auth_token", token);
    }
};
const clearToken = () => localStorage.removeItem("auth_token");

const api = axios.create({
    baseURL: apiBaseUrl,
})

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function register({username, email, password}){
         try{
        const response=   await api.post("/auth/register", {
            username, email, password
           })
           return response.data
         }catch(err){
           console.log(err);
           throw err;
         }
}

export async function login({email, password}){
         try{
        const response=   await api.post("/auth/login", {
              email, password
           })
           if (response?.data?.token) {
               setToken(response.data.token);
           }
           return response.data

         }catch(err){
           console.log(err);
           throw err;
         }
}

export async function logout(){
        try{
            const response = await api.get("/auth/logout");
            clearToken();
            return response.data
        }catch(err){
            console.log(err)
            throw err;
        }
}

export async function getme(){
        try{
            const response = await api.get("/auth/get-me")
            return response.data
        }catch(err){
            console.log(err)
            throw err;
        }
}

export function hasAuthToken() {
    return Boolean(getToken());
}
