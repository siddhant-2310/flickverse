import React from 'react';
import StarRating from './StarRating';

const Movie = ({ movie }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{movie.title}</h5>
        <p className="card-text">{movie.overview}</p>
        {/* Rating and Review Section */}
        <div>
          <h6>Rate this movie</h6>
          <StarRating />
          <div className="mb-3">
            <textarea className="form-control" rows="3" placeholder="Write your review..." />
          </div>
          <button className="btn btn-primary">Submit Review</button>
        </div>
      </div>
    </div>
  );
};

export default Movie;
