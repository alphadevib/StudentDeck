import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/home'
import Sms from './components/sms'
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sms" element={<Sms />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
