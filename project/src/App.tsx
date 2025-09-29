import React, { useState, useEffect } from "react";
import { Film, Plus, LogOut } from "lucide-react";
import AuthForm from "./components/AuthForm";
import MovieCard from "./components/MovieCard";
import AddMovieModal from "./components/AddMovieModal";
import * as api from "./utils/api";

export interface User {
  username: string;
  token: string;
}

export interface Movie {
  title: string;
  year?: number;
  genre?: string;
  rating?: number;
  description?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) {
      setUser({ token, username });
      fetchFavorites(token);
    }
  }, []);

  const fetchFavorites = async (token: string) => {
    try {
      setLoading(true);
      const movies = await api.getFavorites(token);
      setFavorites(movies);
    } catch (err: any) {
      setError(err.message || "Failed to load favorite movies");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (username: string, password: string, isLogin: boolean) => {
    try {
      setLoading(true);
      setError("");

      const response = isLogin
        ? await api.login(username, password) // artık x-www-form-urlencoded
        : await api.register(username, password);

      const userData = { username, token: response.access_token };
      setUser(userData);
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("username", username);

      if (isLogin) {
        await fetchFavorites(response.access_token);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (movie: Movie) => {
    if (!user) return;
    try {
      setLoading(true);

      const movieToAdd: Movie = {
        title: movie.title,
        year: movie.year ?? 0,
        genre: movie.genre ?? "",
        rating: movie.rating ?? 0,
        description: movie.description ?? "",
      };

      await api.addFavorite(user.token, movieToAdd);
      setFavorites(prev => [...prev, movieToAdd]);
      setShowAddMovie(false);
    } catch (err: any) {
      setError(err.message || "Failed to add movie");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteFavorite = async (title: string) => {
    if (!user) return;
    try {
      setLoading(true);
      await api.deleteFavorite(user.token, title);
      setFavorites(prev => prev.filter(m => m.title !== title));
    } catch (err: any) {
      setError(err.message || "Failed to delete movie");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
const updateFavoriteMovie = async (oldTitle: string, updatedMovie: Movie) => {
  if (!user) return;
  try {
    setLoading(true);
    const updated = await api.updateFavorite(user.token, oldTitle, updatedMovie);
    setFavorites(prev => prev.map(f => f.title === oldTitle ? updated : f));
  } catch (err: any) {
    setError(err.message || "Failed to update movie");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                <Film className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Movie Favorites</h1>
              <p className="text-slate-300">
                Create your personal collection of favorite movies
              </p>
            </div>
            <AuthForm onAuth={handleAuth} loading={loading} error={error} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Movie Favorites</h1>
                <p className="text-sm text-slate-300">Welcome back, {user.username}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddMovie(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Movie
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {loading && favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading your favorite movies...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <Film className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">
              No favorite movies yet
            </h2>
            <p className="text-slate-300 mb-6">
              Start building your collection by adding your first movie!
            </p>
            <button
              onClick={() => setShowAddMovie(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Movie
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Your Favorite Movies
              </h2>
              <p className="text-slate-300">
                {favorites.length} movie{favorites.length !== 1 ? "s" : ""} in your
                collection
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((movie, index) => (
                <MovieCard
                  key={`${movie.title}-${index}`}
                  movie={movie}
                  onDelete={deleteFavorite}
                  loading={loading}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {showAddMovie && (
        <AddMovieModal
          onAdd={addFavorite}
          onClose={() => setShowAddMovie(false)}
          loading={loading}
        />
      )}
    </div>
  );
}

export default App;
