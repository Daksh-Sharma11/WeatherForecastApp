export const getWeatherGradient = (weatherMain: string, isDark: boolean): string => {
  const gradients: Record<string, { light: string; dark: string }> = {
    Clear: {
      light: 'from-sky-400 via-blue-300 to-cyan-200',
      dark: 'from-slate-900 via-blue-900 to-slate-800'
    },
    Clouds: {
      light: 'from-gray-400 via-gray-300 to-slate-200',
      dark: 'from-gray-800 via-gray-700 to-slate-800'
    },
    Rain: {
      light: 'from-slate-500 via-gray-400 to-blue-300',
      dark: 'from-slate-900 via-slate-700 to-blue-900'
    },
    Drizzle: {
      light: 'from-blue-300 via-slate-300 to-gray-200',
      dark: 'from-slate-800 via-blue-900 to-gray-900'
    },
    Thunderstorm: {
      light: 'from-slate-600 via-gray-500 to-zinc-400',
      dark: 'from-slate-950 via-gray-900 to-slate-800'
    },
    Snow: {
      light: 'from-blue-100 via-slate-100 to-gray-50',
      dark: 'from-slate-700 via-blue-800 to-slate-900'
    },
    Mist: {
      light: 'from-gray-300 via-slate-200 to-zinc-100',
      dark: 'from-gray-800 via-slate-700 to-zinc-800'
    },
    Fog: {
      light: 'from-gray-300 via-slate-200 to-zinc-100',
      dark: 'from-gray-800 via-slate-700 to-zinc-800'
    },
    Haze: {
      light: 'from-amber-200 via-orange-100 to-yellow-50',
      dark: 'from-orange-900 via-amber-800 to-yellow-900'
    }
  };

  const gradient = gradients[weatherMain] || gradients.Clear;
  return isDark ? gradient.dark : gradient.light;
};
