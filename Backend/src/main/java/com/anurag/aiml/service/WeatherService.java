package com.anurag.aiml.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
 
import java.util.Map;

@Service
public class WeatherService 
{

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${weather.api-key}")
    private String apiKey;
    
    @Cacheable("weather")
    public String getWeatherByCity(String city) throws InterruptedException
    {
        System.out.println("StartedFetching....................");
        
        String url = "https://api.openweathermap.org/data/2.5/weather?q=" + city
                   + "&appid=" + this.apiKey
                   + "&units=metric";
  
        try {
            ResponseEntity<Map> response = this.restTemplate.getForEntity(url, Map.class);
            if (!response.getStatusCode().is2xxSuccessful()) 
            {
                return "Failed to get weather: " + response.getStatusCode();
            }

            System.out.println(response+"================================================================================");

            Map body = response.getBody();
            if (body == null || body.isEmpty()) {
                return "Empty weather data received.";
            }
            
            System.out.println("body isss"+body+"================================================================================"+"endd");
            Map main = (Map) body.get("main");
            Map weather = ((java.util.List<Map>) body.get("weather")).get(0);
            
            System.out.println(main+"================================================================================");
            System.out.println(weather+"================================================================================");
            
            // FIX: Safely retrieve temperature using Number class
            Number tempNum = (Number) main.get("temp");
            double temp = (tempNum != null) ? tempNum.doubleValue() : 0.0;
            
            System.out.println(temp+"================================================================================");
            String description = (String) weather.get("description");
            System.out.println(description+"================================================================================");
            
            return "Current weather in " + city + ": " + temp + "°C, " + description;

        } catch (Exception e) {
            return "Error fetching weather: " + e.getMessage();
        }
    }
}
