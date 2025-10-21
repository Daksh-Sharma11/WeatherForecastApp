import { Cloud, Droplets, Wind, Eye } from 'lucide-react';
import type { WeatherData } from '../types/weather';
import { getWeatherIconUrl } from '../services/weatherService';

interface CurrentWeatherProps {
  weather: WeatherData;
  isCelsius: boolean;
}

export const CurrentWeather = ({ weather, isCelsius }: CurrentWeatherProps) => {
  const convertTemp = (temp: number) => {
    return isCelsius ? temp : (temp * 9/5) + 32;
  };

  const formatTemp = (temp: number) => {
    return Math.round(convertTemp(temp));
  };

  return (
    <div className="backdrop-blur-lg bg-white/10 dark:bg-black/20 rounded-3xl p-8 shadow-2xl border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-5xl font-bold text-white mb-2">
            {formatTemp(weather.main.temp)}°{isCelsius ? 'C' : 'F'}
          </h2>
          <p className="text-xl text-white/90 capitalize">
            {weather.weather[0].description}
          </p>
          <p className="text-lg text-white/80 mt-1">
            {weather.name}, {weather.sys.country}
          </p>
        </div>
        <img
          src={getWeatherIconUrl(weather.weather[0].icon)}
          alt={weather.weather[0].description}
          className="w-32 h-32 drop-shadow-lg"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="backdrop-blur-md bg-white/10 dark:bg-black/10 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5 text-white/80" />
            <span className="text-white/70 text-sm">Humidity</span>
          </div>
          <p className="text-2xl font-semibold text-white">{weather.main.humidity}%</p>
        </div>

        <div className="backdrop-blur-md bg-white/10 dark:bg-black/10 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-5 h-5 text-white/80" />
            <span className="text-white/70 text-sm">Wind Speed</span>
          </div>
          <p className="text-2xl font-semibold text-white">{weather.wind.speed} m/s</p>
        </div>

        <div className="backdrop-blur-md bg-white/10 dark:bg-black/10 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Cloud className="w-5 h-5 text-white/80" />
            <span className="text-white/70 text-sm">Pressure</span>
          </div>
          <p className="text-2xl font-semibold text-white">{weather.main.pressure} hPa</p>
        </div>

        <div className="backdrop-blur-md bg-white/10 dark:bg-black/10 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-white/80" />
            <span className="text-white/70 text-sm">Visibility</span>
          </div>
          <p className="text-2xl font-semibold text-white">{(weather.visibility / 1000).toFixed(1)} km</p>
        </div>
      </div>

      <div className="mt-6 flex gap-4 text-white/80">
        <span>Feels like: {formatTemp(weather.main.feels_like)}°</span>
        <span>Min: {formatTemp(weather.main.temp_min)}°</span>
        <span>Max: {formatTemp(weather.main.temp_max)}°</span>
      </div>
    </div>
  );
};
