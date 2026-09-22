import { useState } from "react"
import "./Register.css"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

function Register() {

    const [registerUser, setRegisterUser] = useState({
        name: "",
        email: "",
        password: ""
    })

    const navigate = useNavigate();

    function a(e) {
        setRegisterUser({ ...registerUser, [e.target.name]: e.target.value })
    }

    async function submit() {
        try {
            await axios.post(`http://localhost:8080/register`, registerUser)
            alert("User Registered Successfully")
            navigate("/login")
        } catch (err) {
            alert("User failed to register: " + (err.response?.data?.message || err.message));
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">

                <h1>Create Account</h1>
                <p className="auth-subtitle">Sign up to manage your students</p>

                <div className="auth-form">

                    <div className="auth-field">
                        <label htmlFor="name">Name</label>
                        <input
                            className="field"
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Your full name"
                            onChange={a}
                        />
                    </div>

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
                        Register
                    </button>

                </div>

                <Link className="auth-footer" to="/login">
                    Already have an account? Log in
                </Link>

            </div>
        </div>
    )
}

export default Register
