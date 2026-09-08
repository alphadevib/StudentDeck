import { useState } from "react";
import "./Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

    const [loginUser, setLoginUser] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    function a(e) {
        setLoginUser({
            ...loginUser,
            [e.target.name]: e.target.value
        });
    }

   async function submit(){
      
         try{
               const response=await axios.post(`http://localhost:8080/login`,loginUser);
             alert("User Login Success...");
             localStorage.setItem("Token",response.data)
             navigate("/home");
         }catch(err){
            alert("User Failed to Login...")
         }
   
    }

    return (
        <>
            <div className="Third-div">

                <h1>Login Here</h1>

                <h3>Email</h3>

                <input
                    type="text"
                    name="email"
                    onChange={a}
                />

                <h3>Password</h3>

                <input
                    type="password"
                    name="password"
                    onChange={a}
                />

                <button onClick={submit}>
                    Login
                </button>

                <a href="/register">
                    New User? Register Here!
                </a>

            </div>
        </>
    );
}

export default Login;