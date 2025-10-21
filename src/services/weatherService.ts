import type { WeatherData, ForecastData, DailyForecast } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getCurrentWeather = async (city: string): Promise<WeatherData> => {
  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error('City not found');
  }

  return response.json();
};

export const getCurrentWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error('Unable to fetch weather data');
  }

  return response.json();
};

export const getForecast = async (city: string): Promise<ForecastData> => {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error('Unable to fetch forecast data');
  }

  return response.json();
};

export const getForecastByCoords = async (lat: number, lon: number): Promise<ForecastData> => {
  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error('Unable to fetch forecast data');
  }

  return response.json();
};

export const processDailyForecast = (forecastData: ForecastData): DailyForecast[] => {
  const dailyData: { [key: string]: any } = {};

  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();

    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        temps: [item.main.temp],
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        weatherMain: item.weather[0].main
      };
    } else {
      dailyData[date].temps.push(item.main.temp);
      dailyData[date].temp_min = Math.min(dailyData[date].temp_min, item.main.temp_min);
      dailyData[date].temp_max = Math.max(dailyData[date].temp_max, item.main.temp_max);
    }
  });

  return Object.values(dailyData).slice(0, 7);
};

export const getWeatherIconUrl = (icon: string): string => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};
