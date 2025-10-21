import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import type { WeatherData } from '../types/weather';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  currentWeather: WeatherData | null;
  isCelsius: boolean;
}

export const ChatBot = ({ currentWeather, isCelsius }: ChatBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your weather assistant. Ask me about the weather, travel tips, or outfit suggestions!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const convertTemp = (temp: number) => {
    return isCelsius ? temp : (temp * 9/5) + 32;
  };

  const formatTemp = (temp: number) => {
    return Math.round(convertTemp(temp));
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();

    if (!currentWeather) {
      return "I don't have weather data yet. Please search for a city first!";
    }

    if (lowerMsg.includes('temperature') || lowerMsg.includes('temp') || lowerMsg.includes('hot') || lowerMsg.includes('cold')) {
      const temp = formatTemp(currentWeather.main.temp);
      const feelsLike = formatTemp(currentWeather.main.feels_like);
      const unit = isCelsius ? 'C' : 'F';
      return `The current temperature in ${currentWeather.name} is ${temp}°${unit}, but it feels like ${feelsLike}°${unit}. ${temp > 25 ? "It's quite warm!" : temp < 10 ? "It's pretty cold!" : "The temperature is moderate."}`;
    }

    if (lowerMsg.includes('umbrella') || lowerMsg.includes('rain')) {
      const weatherMain = currentWeather.weather[0].main.toLowerCase();
      if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
        return `Yes, you should definitely carry an umbrella! It's ${currentWeather.weather[0].description} in ${currentWeather.name} right now.`;
      }
      return `No need for an umbrella! The weather is ${currentWeather.weather[0].description} in ${currentWeather.name}.`;
    }

    if (lowerMsg.includes('outfit') || lowerMsg.includes('wear') || lowerMsg.includes('clothes')) {
      const temp = formatTemp(currentWeather.main.temp);
      const weatherMain = currentWeather.weather[0].main.toLowerCase();

      let outfit = '';
      if (temp > 25) {
        outfit = 'Light clothing like t-shirts, shorts, and sandals would be perfect. Don\'t forget sunglasses!';
      } else if (temp > 15) {
        outfit = 'Comfortable layers work well - jeans with a light jacket or sweater.';
      } else if (temp > 5) {
        outfit = 'Wear warm clothing - a jacket, long pants, and closed shoes. A scarf might be nice too.';
      } else {
        outfit = 'Bundle up! Heavy coat, warm layers, gloves, and a hat are essential.';
      }

      if (weatherMain.includes('rain')) {
        outfit += ' Bring a waterproof jacket or umbrella.';
      }

      return outfit;
    }

    if (lowerMsg.includes('humidity')) {
      return `The humidity level in ${currentWeather.name} is ${currentWeather.main.humidity}%. ${currentWeather.main.humidity > 70 ? 'It might feel a bit muggy!' : 'The air feels relatively comfortable.'}`;
    }

    if (lowerMsg.includes('wind')) {
      return `Wind speed is currently ${currentWeather.wind.speed} m/s in ${currentWeather.name}. ${currentWeather.wind.speed > 10 ? 'It\'s quite windy!' : 'Wind conditions are calm.'}`;
    }

    if (lowerMsg.includes('visibility')) {
      const visibilityKm = (currentWeather.visibility / 1000).toFixed(1);
      return `Visibility is ${visibilityKm} km in ${currentWeather.name}. ${parseFloat(visibilityKm) < 5 ? 'Visibility is reduced, drive carefully!' : 'Visibility is good!'}`;
    }

    if (lowerMsg.includes('weather') || lowerMsg.includes('condition')) {
      const temp = formatTemp(currentWeather.main.temp);
      const unit = isCelsius ? 'C' : 'F';
      return `Current weather in ${currentWeather.name}: ${currentWeather.weather[0].description}, ${temp}°${unit}. Humidity is ${currentWeather.main.humidity}% and wind speed is ${currentWeather.wind.speed} m/s.`;
    }

    if (lowerMsg.includes('travel') || lowerMsg.includes('trip')) {
      const temp = formatTemp(currentWeather.main.temp);
      const weatherMain = currentWeather.weather[0].main.toLowerCase();

      if (weatherMain.includes('rain') || weatherMain.includes('storm')) {
        return `Current weather in ${currentWeather.name} shows ${currentWeather.weather[0].description}. You might want to plan indoor activities or carry rain gear!`;
      } else if (weatherMain.includes('clear') && temp > 15 && temp < 30) {
        return `Perfect weather for traveling to ${currentWeather.name}! It's ${currentWeather.weather[0].description} with comfortable temperatures.`;
      }
      return `Weather in ${currentWeather.name} is ${currentWeather.weather[0].description} at ${temp}°. Plan accordingly!`;
    }

    return `I can help you with weather conditions, outfit suggestions, and travel tips for ${currentWeather.name}. Try asking about temperature, rain, what to wear, or travel advice!`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-white/20 flex flex-col z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 flex items-center gap-3">
            <Bot className="w-6 h-6 text-white" />
            <div>
              <h3 className="text-white font-semibold">Weather Assistant</h3>
              <p className="text-white/80 text-xs">Always here to help!</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about weather..."
                className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-2 rounded-full transition-all duration-300 hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
