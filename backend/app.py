import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from difflib import get_close_matches

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Allow all origins for API routes

# Load the movie data and similarity matrix
try:
    movies_list = pickle.load(open('movies.pkl', 'rb'))
    similarity = pickle.load(open('similarity.pkl', 'rb'))
    movies = pd.DataFrame(movies_list)
except FileNotFoundError:
    movies = pd.DataFrame()
    similarity = None
    print("Warning: 'movies.pkl' or 'similarity.pkl' not found. Recommendation endpoint will not work.")

@app.route('/api/recommend', methods=['POST'])
def recommend():
    app.logger.info("Recommendation request received.")
    if similarity is None:
        app.logger.error("Recommendation model not loaded.")
        return jsonify({"error": "Recommendation model not loaded."}), 500

    data = request.get_json()
    movie_title = data.get('title')
    app.logger.info(f"Movie title: {movie_title}")

    if not movie_title:
        return jsonify({"error": "Movie title not provided."}), 400

    # ✅ Fuzzy match: find the closest title from the dataset
    close_matches = get_close_matches(movie_title, movies['title'].values, n=1, cutoff=0.6)
    if not close_matches:
        return jsonify({"error": f"No similar movie found in dataset for '{movie_title}'."}), 404

    matched_title = close_matches[0]
    movie_index = movies[movies['title'] == matched_title].index[0]
    distances = similarity[movie_index]
    recommended_movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]

    recommended_movies = []
    for i in recommended_movies_list:
        recommended_movies.append({
            "title": movies.iloc[i[0]].title
        })

    app.logger.info(f"Input: {movie_title}, matched: {matched_title}, recommendations: {recommended_movies}")
    return jsonify({
        "matched_title": matched_title,
        "recommendations": recommended_movies
    })

@app.route('/api/user_recommendations', methods=['POST'])
def user_recommendations():
    app.logger.info("User recommendations request received.")
    if similarity is None:
        app.logger.error("Recommendation model not loaded.")
        return jsonify({"error": "Recommendation model not loaded."}), 500

    data = request.get_json()
    user_movies = data.get('titles', [])
    app.logger.info(f"User's favorite movies: {user_movies}")

    if not user_movies:
        return jsonify({"error": "No movie titles provided."}), 400

    all_recommendations = set()
    for movie_title in user_movies:
        # Fuzzy match for each user movie
        close_matches = get_close_matches(movie_title, movies['title'].values, n=1, cutoff=0.6)
        if not close_matches:
            continue
        matched_title = close_matches[0]
        movie_index = movies[movies['title'] == matched_title].index[0]
        distances = similarity[movie_index]
        # Get top 10 for each
        recommended_movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:11]
        for i in recommended_movies_list:
            all_recommendations.add(movies.iloc[i[0]].title)

    # Remove movies the user has already seen
    final_recommendations = [rec for rec in all_recommendations if rec not in user_movies]
    
    # Limit to 10 recommendations
    final_recommendations = final_recommendations[:10]

    app.logger.info(f"Final recommendations: {final_recommendations}")
    return jsonify([{"title": title} for title in final_recommendations])

@app.route('/api/test')
def test_route():
    return jsonify({"message": "Hello from the recommendation backend!"})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
