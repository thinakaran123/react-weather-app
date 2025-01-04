import searchimage from '../Assets/search.png';
import cloud from '../Assets/cloud.png';
import humidity from '../Assets/humidity.png';
import wind from '../Assets/wind.png';
import clear_icon from '../Assets/clear.png';
import drizzle from '../Assets/drizzle.png';
import rain from '../Assets/rain.png';
import snow from '../Assets/snow.png';

import { useState } from 'react';

export default function Home() {
    const [userData, setUserData] = useState("");
    const [weatherData, setWeatherData] = useState({});
    const [suggestions, setSuggestions] = useState([]); // New state for city suggestions
    const apikey = process.env.REACT_APP_APIKEY;

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": clear_icon,
        "02n": clear_icon,
        "03d": clear_icon,
        "03n": clear_icon,
        "04d": drizzle,
        "04n": drizzle,
        "09d": rain,
        "09n": rain,
        "10d": rain,
        "10n": rain,
        "13d": snow,
        "13n": snow
    };

    const fetchCitySuggestions = async (query) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apikey}`;
            const response = await fetch(url);
            const data = await response.json();
            setSuggestions(data.map(item => ({
                name: item.name,
                state: item.state || "",
                country: item.country
            })));
        } catch (error) {
            console.error("Error fetching city suggestions:", error);
        }
    };

    const search = async (cityname) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=metric&appid=${apikey}`;
            const response = await fetch(url);
            const data = await response.json();
            const icon = allIcons[data.weather[0].icon] || clear_icon;
            setWeatherData({
                temp: Math.floor(data.main.temp),
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                location: data.name,
                icon: icon
            });
            setSuggestions([]); // Clear suggestions after search
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setUserData(`${suggestion.name}, ${suggestion.state}, ${suggestion.country}`);
        search(suggestion.name);
    };

    return (
        <>
            <section className="gap-5 bg-bgcolor min-h-screen w-[100%] flex flex-col justify-center items-center">
                <h1 className="text-4xl font-titlefont">Weather App</h1>
                <div className="flex flex-col items-center text-white bg-secondbgcolor p-4 rounded-xl w-[85%] md:w-[25%]">
                    <div className="relative w-[100%]">
                        <input
                            value={userData}
                            onChange={(e) => {
                                setUserData(e.target.value.trim());
                                fetchCitySuggestions(e.target.value.trim());
                            }}
                            className="text-black w-[100%] p-1 rounded-3xl"
                            placeholder="Enter city name"
                        />
                        <img
                            className="absolute bottom-1 right-[5%] cursor-pointer"
                            src={searchimage}
                            onClick={() => search(userData)}
                        />
                        {/* Suggestions Dropdown */}
                        {suggestions.length > 0 && (
                            <div className="absolute top-full left-0 bg-white text-black w-full rounded-md shadow-md z-10">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion.name}, {suggestion.state}, {suggestion.country}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <img src={weatherData.icon} className="w-32" />
                        <p className="text-4xl">{weatherData.temp}° C</p>
                        <p className="text-xl">{weatherData.location}</p>
                    </div>
                    <div className="flex gap-6 mt-6">
                        <div className="grid gap-2">
                            <img src={humidity} />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span className="text-xl">Humidity</span>
                            </div>
                        </div>
                        <div className="h-32 border-l-2 border-gray-500"></div>
                        <div className="grid gap-2">
                            <img src={wind} />
                            <div>
                                <p>{weatherData.windSpeed}</p>
                                <span className="text-xl">Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
