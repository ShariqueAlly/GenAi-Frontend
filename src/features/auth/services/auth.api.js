import axios  from "axios";
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const apiBaseUrl = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;
const api = axios.create({
    baseURL: apiBaseUrl,
    withCredentials:true,
})

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
           return response.data

         }catch(err){
           console.log(err);
           throw err;
         }
}

export async function logout(){
        try{
            const response = await api.get("/auth/logout");
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
