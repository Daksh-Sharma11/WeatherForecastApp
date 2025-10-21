import { useState, useEffect } from 'react';
import { Moon, Sun, ThermometerIcon } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { ForecastSection } from './components/ForecastSection';
import { ChatBot } from './components/ChatBot';
import type { WeatherData, DailyForecast } from './types/weather';
import {
  getCurrentWeather,
  getCurrentWeatherByCoords,
  getForecast,
  getForecastByCoords,
  processDailyForecast
} from './services/weatherService';
import { getWeatherGradient } from './utils/weatherBackgrounds';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecasts, setForecasts] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    getLocationWeather();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const getLocationWeather = async () => {
    if ('geolocation' in navigator) {
      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const weatherData = await getCurrentWeatherByCoords(latitude, longitude);
            const forecastData = await getForecastByCoords(latitude, longitude);

            setWeather(weatherData);
            setForecasts(processDailyForecast(forecastData));
          } catch (err) {
            setError('Unable to fetch weather data');
            loadDefaultCity();
          } finally {
            setLoading(false);
          }
        },
        () => {
          loadDefaultCity();
        }
      );
    } else {
      loadDefaultCity();
    }
  };

  const loadDefaultCity = async () => {
    setLoading(true);
    setError(null);
    try {
      const weatherData = await getCurrentWeather('London');
      const forecastData = await getForecast('London');

      setWeather(weatherData);
      setForecasts(processDailyForecast(forecastData));
    } catch (err) {
      setError('Unable to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const weatherData = await getCurrentWeather(city);
      const forecastData = await getForecast(city);

      setWeather(weatherData);
      setForecasts(processDailyForecast(forecastData));
    } catch (err) {
      setError('City not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const weatherMain = weather?.weather[0]?.main || 'Clear';
  const gradientClass = getWeatherGradient(weatherMain, isDark);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} transition-all duration-1000`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Weather Forecast
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => setIsCelsius(!isCelsius)}
              className="backdrop-blur-lg bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 text-white px-4 py-2 rounded-full border border-white/20 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <ThermometerIcon className="w-5 h-5" />
              {isCelsius ? '°C' : '°F'}
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              className="backdrop-blur-lg bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 text-white p-3 rounded-full border border-white/20 transition-all duration-300 hover:scale-105"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            onGetLocation={getLocationWeather}
            loading={loading}
          />
        </div>

        {error && (
          <div className="backdrop-blur-lg bg-red-500/20 border border-red-500/50 text-white px-6 py-4 rounded-2xl mb-8">
            {error}
          </div>
        )}

        {loading && !weather && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
        )}

        {weather && (
          <div className="space-y-8">
            <CurrentWeather weather={weather} isCelsius={isCelsius} />
            {forecasts.length > 0 && (
              <ForecastSection forecasts={forecasts} isCelsius={isCelsius} />
            )}
          </div>
        )}
      </div>

      <ChatBot currentWeather={weather} isCelsius={isCelsius} />
    </div>
  );
}

export default App;
