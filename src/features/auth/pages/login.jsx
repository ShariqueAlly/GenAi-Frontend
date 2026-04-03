import '../auth.form.scss'
import { useNavigate, Link, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';

const Login = () => {
  const {loading, handleLogin, user} = useAuth();
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


 const handleFormSUbmit = async (e)=>{
    e.preventDefault();
    setError("");
    if(!email.trim() || !password.trim()){
      setError("Please enter email and password.");
      return;
    }

   const result = await handleLogin({email, password});
   if(result?.success){
    navigate('/')
   } else {
    setError(result?.message || "Login failed. Please try again.");
   }

 }

  useEffect(() => {
    if (user && !loading) {
      navigate('/', { replace: true })
    }
  }, [user, loading, navigate])

 const searchParams = new URLSearchParams(location.search);
 const registered = searchParams.get('registered') === '1';
 const [showRegistered, setShowRegistered] = useState(registered);

  useEffect(() => {
    if (!registered) return;
    setShowRegistered(true);
    const timer = setTimeout(() => setShowRegistered(false), 3500);
    return () => clearTimeout(timer);
  }, [registered]);

 if(loading){
     
  return <main><h1>Loading....</h1></main>
 }

  return (
    <main>
      <div className="form-container">
        <h1>Log in</h1>
        {showRegistered && (
          <p className="form-success">Registration successful. Please log in to continue.</p>
        )}
        {error && <p className="form-error">{error}</p>}
        <form action="" onSubmit={handleFormSUbmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
            onChange={(e)=>setEmail(e.target.value)} 
            type="email" id="email" name="email" placeholder="enter email address" />
          </div>

          <div className="input-group">
            
            <label htmlFor="password">Password</label>
            <input
            onChange={(e)=>setPassword(e.target.value)} 
            type="password" id="password" name="password" placeholder="enter your password "/>
          </div>

          <button className="button primary-button">Login</button>
        </form>
        <p>Didn't register? <Link to={"/register"}>Register</Link></p>
      </div>
    </main>
  )
}

export default Login
