import React, { useState } from 'react';
import { X, Film, Calendar, Tag, Star, FileText } from 'lucide-react';
import type { Movie } from '../App';

interface AddMovieModalProps {
  onAdd: (movie: Movie) => void;
  onClose: () => void;
  loading: boolean;
}

export default function AddMovieModal({ onAdd, onClose, loading }: AddMovieModalProps) {
  const [movie, setMovie] = useState<Movie>({
    title: '',
    year: new Date().getFullYear(),
    genre: '',
    rating: 5,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (movie.title.trim() && movie.genre.trim() && movie.description.trim()) {
      onAdd(movie);
    }
  };

  const handleChange = (field: keyof Movie, value: string | number) => {
    setMovie(prev => ({ ...prev, [field]: value }));
  };

  const renderStarSelector = () => {
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleChange('rating', i + 1)}
            className={`p-1 rounded transition-colors duration-200 ${
              i < movie.rating
                ? 'text-yellow-400 hover:text-yellow-300'
                : 'text-slate-400 hover:text-yellow-400'
            }`}
          >
            <Star className={`w-6 h-6 ${i < movie.rating ? 'fill-current' : ''}`} />
          </button>
        ))}
        <span className="ml-2 text-slate-300 text-sm">
          {movie.rating}/5
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Film className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Add New Movie</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-200 mb-2">
              Movie Title
            </label>
            <div className="relative">
              <Film className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                id="title"
                value={movie.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter movie title"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-slate-200 mb-2">
                Year
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  id="year"
                  value={movie.year}
                  onChange={(e) => handleChange('year', parseInt(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-slate-200 mb-2">
                Genre
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="genre"
                  value={movie.genre}
                  onChange={(e) => handleChange('genre', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Action"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Rating
            </label>
            {renderStarSelector()}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-200 mb-2">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                id="description"
                value={movie.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Describe what you loved about this movie..."
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !movie.title.trim() || !movie.genre.trim() || !movie.description.trim()}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Adding...
                </div>
              ) : (
                'Add Movie'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}