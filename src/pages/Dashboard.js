import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { getLatestMovies, getTopRatedMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [latestMovies, setLatestMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const latest = await getLatestMovies();
        setLatestMovies(latest.data.results);
        const topRated = await getTopRatedMovies();
        setTopRatedMovies(topRated.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome to Dashboard</h2>
        <div>
          <span className="me-3">Logged in as: {currentUser?.displayName || currentUser?.email}</span>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <h3>Latest Movies</h3>
      <div className="row">
        {latestMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <h3 className="mt-5">Top Rated Movies</h3>
      <div className="row">
        {topRatedMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
