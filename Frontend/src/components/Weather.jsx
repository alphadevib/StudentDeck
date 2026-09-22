import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Weather.css";

function Weather() {
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {

    if (!city.trim()) {
      alert("Please enter a city");
      return;
    }

    try {

      setWeather("");
      setLoading(true);

      const response = await axios.get(
        `http://localhost:8080/city/${encodeURIComponent(city)}`
      );

      setWeather(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data)
      );

    } catch (error) {

      console.log(error);
      setWeather("Error fetching weather");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="weather-container">
      <div className="weather-box">

        <h1>🌦 Weather App</h1>
        <p className="weather-subtitle">Check current conditions by city</p>

        <div className="weather-form">

          <input
            className="field"
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getWeather()}
          />

          <button
            className="btn btn-primary"
            onClick={getWeather}
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Weather"}
          </button>

        </div>

        {loading && <p className="weather-status">Loading weather...</p>}

        {!loading && weather && (
          <div className="weather-result">{weather}</div>
        )}

        <button
          className="btn btn-ghost btn-block weather-back"
          onClick={() => navigate("/home")}
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}

export default Weather;
