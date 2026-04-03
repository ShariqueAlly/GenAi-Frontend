import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, logout, register, getme, hasAuthToken } from "../services/auth.api";

export const useAuth = ()=>{
    const context = useContext(AuthContext);
    const {user, setUser, loading, setLoading} = context;

    const handleLogin = async({email, password})=>{
      setLoading(true);
       try{
         const data = await login({email, password});
        if(!data?.user){
          return { success: false, message: "Login failed. Please try again." };
        }
        setUser(data.user)
        return { success: true };
        }catch(err){
          const message = err?.response?.data?.message || "Login failed. Please try again.";
          return { success: false, message };
        }finally{
        setLoading(false)
        
       }
    }

     const handleRegister = async({username, email, password})=>{
        setLoading(true);
        try{
         const data = await register({username, email, password});
        if(!data?.user){
          return { success: false, message: "Registration failed. Please try again." };
        }
        return { success: true };
        }catch(err){
          const message = err?.response?.data?.message || "Registration failed. Please try again.";
          return { success: false, message };
        }finally{
           setLoading(false)  

       }
    }

    const handleLogout = async()=>{
        setLoading(true);
        try{
         const data = await logout();
         setUser(null)

        }catch(err){

        }finally{
            
         setLoading(false)
        
          }
    }

    useEffect(() => {
      const getAndSetUser = async () => {
        if (!hasAuthToken()) {
          setUser(null);
          setLoading(false);
          try {
            await logout();
          } catch (err) {}
          return;
        }
        try {
          const data = await getme();
          setUser(data?.user ?? null);
        } catch (err) {
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      getAndSetUser();
    }, [setLoading, setUser]);

    return {user, loading, handleRegister, handleLogout, handleLogin}
}
