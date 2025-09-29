import React, { useState } from 'react';
import { Star, Calendar, Tag, Trash2 } from 'lucide-react';
import type { Movie } from '../App';

interface MovieCardProps {
  movie: Movie;
  onDelete: (title: string) => void;
  loading: boolean;
}

export default function MovieCard({ movie, onDelete, loading }: MovieCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting || loading) return;
    setDeleting(true);
    await onDelete(movie.title);
    setDeleting(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? 'text-yellow-400 fill-current'
            : 'text-slate-400'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-200 line-clamp-2">
          {movie.title}
        </h3>
        <button
          onClick={handleDelete}
          disabled={deleting || loading}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete movie"
        >
          {deleting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-slate-300">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{movie.year}</span>
        </div>

        <div className="flex items-center space-x-2 text-slate-300">
          <Tag className="w-4 h-4" />
          <span className="text-sm bg-slate-700/50 px-2 py-1 rounded-full">
            {movie.genre}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {renderStars(movie.rating)}
          </div>
          <span className="text-slate-300 text-sm">
            {movie.rating}/5
          </span>
        </div>

        <div className="mt-4">
          <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
            {movie.description}
          </p>
        </div>
      </div>
    </div>
  );
}