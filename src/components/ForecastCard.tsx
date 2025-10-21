import type { DailyForecast } from '../types/weather';
import { getWeatherIconUrl } from '../services/weatherService';

interface ForecastCardProps {
  forecast: DailyForecast;
  isCelsius: boolean;
}

export const ForecastCard = ({ forecast, isCelsius }: ForecastCardProps) => {
  const convertTemp = (temp: number) => {
    return isCelsius ? temp : (temp * 9/5) + 32;
  };

  const formatTemp = (temp: number) => {
    return Math.round(convertTemp(temp));
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="backdrop-blur-lg bg-white/10 dark:bg-black/20 rounded-2xl p-6 border border-white/20 hover:bg-white/15 dark:hover:bg-black/25 transition-all duration-300 hover:scale-105 hover:shadow-xl min-w-[160px]">
      <p className="text-white font-semibold text-lg mb-3">{getDayName(forecast.date)}</p>

      <img
        src={getWeatherIconUrl(forecast.icon)}
        alt={forecast.description}
        className="w-20 h-20 mx-auto drop-shadow-lg"
      />

      <p className="text-white/80 capitalize text-sm text-center mb-3">
        {forecast.description}
      </p>

      <div className="flex justify-center gap-3 text-white">
        <span className="font-semibold text-lg">
          {formatTemp(forecast.temp_max)}°
        </span>
        <span className="text-white/60 text-lg">
          {formatTemp(forecast.temp_min)}°
        </span>
      </div>
    </div>
  );
};
