import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
const Register = () => {
 
  const navigate = useNavigate();
  const {loading, handleRegister, user} = useAuth();

  const[userName, setUserName] = useState("")
  const[email, setEmail] = useState("")
  const[password, setPassWord] = useState("")
  const[confirmPassword, setConfirmPassword] = useState("")
  const[errors, setErrors] = useState({})

   const handleFormSUbmit = async (e)=>{
    e.preventDefault();
    const nextErrors = {};
    if(!userName.trim()){
      nextErrors.userName = "Username is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email.trim()){
      nextErrors.email = "Email is required.";
    } else if(!emailRegex.test(email.trim())){
      nextErrors.email = "Please provide a valid email address.";
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if(!password.trim()){
      nextErrors.password = "Password is required.";
    } else if(password.length < 8 || !hasUpper || !hasLower || !hasNumber || !hasSpecial){
      nextErrors.password = "Use 8+ chars with uppercase, lowercase, number, and special character.";
    }

    if(!confirmPassword.trim()){
      nextErrors.confirmPassword = "Please re-enter your password.";
    } else if(password !== confirmPassword){
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    if(Object.keys(nextErrors).length > 0){
      return;
    }

    const result = await handleRegister({
      username: userName,
      email,
      password
    });

    if(result?.success){
      navigate('/login?registered=1');
    } else {
      setErrors({ form: result?.message || "Registration failed. Please try again." });
    }
 }
  useEffect(() => {
    if (user && !loading) {
      navigate('/', { replace: true })
    }
  }, [user, loading, navigate])

 if(loading){
  return <h1>Loading....</h1>
 }
  return (
   <main>
      <div className="form-container">
        <h1>Register</h1>
        <form action="" onSubmit={handleFormSUbmit}>
          <div className="input-group">
            <label htmlFor="userName">Username</label>
            <input 
            value={userName}
            onChange={(e)=>{setUserName(e.target.value)}}
            type="text" id="userName" name="userName" placeholder="enter your username" />
            {errors.userName && <p className="field-error">{errors.userName}</p>}
          </div>

           <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
            value={email}
            onChange={(e)=>{setEmail(e.target.value)}}
            type="email" id="email" name="email" placeholder="enter email address" />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>


          <div className="input-group">
            
            <label htmlFor="password">Password</label>
            <input
            value={password}
            onChange={(e)=>{setPassWord(e.target.value)}}
            type="password" id="password" name="password" placeholder="enter your password "/>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              value={confirmPassword}
              onChange={(e)=>{setConfirmPassword(e.target.value)}}
              type="password" id="confirmPassword" name="confirmPassword" placeholder="re-enter your password" />
              {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
          </div>

          {errors.form && <p className="form-error">{errors.form}</p>}

          <button className="button primary-button">Register</button>
        </form>

        <p>Already have an account? <Link to={"/login"}>Login</Link></p>
      </div>
    </main>
  )
}

export default Register
