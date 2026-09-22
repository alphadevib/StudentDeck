import { useState } from "react";
import "./Register.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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

    async function submit() {
        try {
            const response = await axios.post(`http://localhost:8080/login`, loginUser);
            alert("User Login Success...");
            localStorage.setItem("Token", response.data)
            navigate("/home");
        } catch (err) {
            console.log(err);
            alert("User Failed to Login...")
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">

                <h1>Welcome Back</h1>
                <p className="auth-subtitle">Log in to your account</p>

                <div className="auth-form">

                    <div className="auth-field">
                        <label htmlFor="email">Email</label>
                        <input
                            className="field"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                            onChange={a}
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <input
                            className="field"
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            onChange={a}
                        />
                    </div>

                    <button className="btn btn-primary btn-block" onClick={submit}>
                        Login
                    </button>

                </div>

                <Link className="auth-footer" to="/register">
                    New user? Register here
                </Link>

            </div>
        </div>
    );
}

export default Login;
