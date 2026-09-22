import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Register from './components/Register'
import Login from './components/Login'
import Home from './components/home'
import Weather from './components/Weather'
import Sms from './components/Sms'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/sms" element={<Sms />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App