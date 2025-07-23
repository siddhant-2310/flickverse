import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ rating, setRating, isStatic = false }) => {
  const [hover, setHover] = useState(0);

  const handleClick = (ratingValue) => {
    if (!isStatic) {
      setRating(ratingValue);
    }
  };

  const handleMouseEnter = (ratingValue) => {
    if (!isStatic) {
      setHover(ratingValue);
    }
  };

  const handleMouseLeave = () => {
    if (!isStatic) {
      setHover(0);
    }
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            className={ratingValue <= (hover || rating) ? "on" : "off"}
            onClick={() => handleClick(ratingValue)}
            onMouseEnter={() => handleMouseEnter(ratingValue)}
            onMouseLeave={handleMouseLeave}
            disabled={isStatic}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
