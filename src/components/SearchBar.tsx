import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onGetLocation: () => void;
  loading: boolean;
}

export const SearchBar = ({ onSearch, onGetLocation, loading }: SearchBarProps) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      setSearchInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="backdrop-blur-lg bg-white/10 dark:bg-black/20 rounded-full p-2 shadow-2xl border border-white/20 flex items-center gap-2">
        <button
          type="button"
          onClick={onGetLocation}
          disabled={loading}
          className="bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30 p-3 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Use current location"
        >
          <MapPin className="w-5 h-5 text-white" />
        </button>

        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search city or ZIP code..."
          disabled={loading}
          className="flex-1 bg-transparent text-white placeholder-white/60 px-4 py-2 focus:outline-none disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading || !searchInput.trim()}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-3 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
