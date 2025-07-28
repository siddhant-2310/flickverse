import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, className }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750.png?text=No+Image';

  return (
    <div className={className || "col-md-3 mb-4"}>
      <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
      <div className="card h-100">
        <img src={posterUrl} className="card-img-top" alt={movie.title} />
        <div className="card-body">
          <h6 className="card-title">{movie.title}</h6>
        </div>
      </div>
    </Link>
    </div>
  );
};

export default MovieCard;
