import type { DailyForecast } from '../types/weather';
import { ForecastCard } from './ForecastCard';

interface ForecastSectionProps {
  forecasts: DailyForecast[];
  isCelsius: boolean;
}

export const ForecastSection = ({ forecasts, isCelsius }: ForecastSectionProps) => {
  return (
    <div className="backdrop-blur-lg bg-white/10 dark:bg-black/20 rounded-3xl p-8 shadow-2xl border border-white/20">
      <h3 className="text-2xl font-bold text-white mb-6">7-Day Forecast</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {forecasts.map((forecast, index) => (
          <ForecastCard
            key={index}
            forecast={forecast}
            isCelsius={isCelsius}
          />
        ))}
      </div>
    </div>
  );
};
