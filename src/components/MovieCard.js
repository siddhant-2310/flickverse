import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750.png?text=No+Image';

  return (
    <div className="col-md-3 mb-4">
      <div className="card h-100">
        <Link to={`/movie/${movie.id}`}>
          <img src={posterUrl} className="card-img-top" alt={movie.title} />
        </Link>
        <div className="card-body">
          <h6 className="card-title">{movie.title}</h6>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
