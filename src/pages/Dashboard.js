import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLatestMovies, getTopRatedMovies, getMovieDetails, searchMovies } from '../api/tmdb';
import { getUserRecommendations } from '../api/recommendations';
import MovieCard from '../components/MovieCard';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [latestMovies, setLatestMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [userRecommendations, setUserRecommendations] = useState([]);

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

    const fetchUserRecommendations = async () => {
      if (!currentUser) return;
      try {
        const q = query(collection(db, "reviews"), where("userId", "==", currentUser.uid), where("rating", ">=", 4));
        const querySnapshot = await getDocs(q);
        const highRatedMovieIds = querySnapshot.docs.map(doc => doc.data().movieId);

        if (highRatedMovieIds.length > 0) {
          const movieDetailsPromises = highRatedMovieIds.map(id => getMovieDetails(id));
          const movieDetailsResponses = await Promise.all(movieDetailsPromises);
          const highRatedMovieTitles = movieDetailsResponses.map(res => res.data.title);

          if (highRatedMovieTitles.length > 0) {
            const recommendedTitles = await getUserRecommendations(highRatedMovieTitles);
            const moviePromises = recommendedTitles.map(rec => searchMovies(rec.title));
            const movieResponses = await Promise.all(moviePromises);
            const detailedRecommendations = movieResponses
              .map(res => res.data.results[0])
              .filter(Boolean);
            setUserRecommendations(detailedRecommendations);
          }
        }
      } catch (error) {
        console.error('Error fetching user recommendations:', error);
      }
    };


    fetchMovies();
    fetchUserRecommendations();
  }, [currentUser]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome to Dashboard</h2>
        <div>
          <span className="me-3">Logged in as: {currentUser?.displayName || currentUser?.email}</span>
        </div>
      </div>

      {userRecommendations.length > 0 && (
        <>
          <h3 className="mt-5">Recommended For You</h3>
          <div className="row">
            {userRecommendations.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}

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
