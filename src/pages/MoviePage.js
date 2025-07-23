import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../api/tmdb';
import { getRecommendations } from '../api/recommendations';
import StarRating from '../components/StarRating';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';

const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await getMovieDetails(id);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    if (!movie) return;

    const fetchRecommendations = async () => {
      try {
        const recommendedMovies = await getRecommendations(movie.title);
        setRecommendations(recommendedMovies);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();

    const q = query(collection(db, "reviews"), where("movieId", "==", id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reviewsData = [];
      querySnapshot.forEach((doc) => {
        reviewsData.push({ ...doc.data(), id: doc.id });
      });
      setReviews(reviewsData);
    });
    return () => unsubscribe();
  }, [movie, id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be logged in to submit a review.');
      return;
    }
    if (rating === 0 || review.trim() === '') {
      alert('Please provide a rating and a review.');
      return;
    }
    try {
      await addDoc(collection(db, 'reviews'), {
        movieId: id,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        rating,
        review,
        createdAt: new Date(),
      });
      setRating(0);
      setReview('');
    } catch (error) {
      console.error('Error adding review: ', error);
    }
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-4">
          <img 
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750.png?text=No+Image'} 
            className="img-fluid rounded" 
            alt={movie.title} 
          />
        </div>
        <div className="col-md-8">
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <h4>Release Date: {movie.release_date}</h4>
          <hr />
          
          <div className="card bg-light mb-4">
            <div className="card-body">
              <h3>Rate & Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-2">
                  <StarRating rating={rating} setRating={setRating} />
                </div>
                <div className="mb-3">
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Write your review..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>

          <h3>Reviews</h3>
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div className="card mb-3" key={r.id}>
                <div className="card-body">
                  <h5 className="card-title">{r.userName}</h5>
                  <StarRating rating={r.rating} isStatic={true} />
                  <p className="card-text">{r.review}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to write one!</p>
          )}
        </div>
      </div>

      <div className="mt-4">
          <h4>Recommended for you</h4>
          {recommendations.length > 0 ? (
              <ul className="list-group">
                  {recommendations.map((rec, index) => (
                      <li key={index} className="list-group-item">{rec.title}</li>
                  ))}
              </ul>
          ) : (
              <p>No recommendations available.</p>
          )}
      </div>
    </div>
  );
};

export default MoviePage;