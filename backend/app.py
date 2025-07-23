import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

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

    if not movie_title or movie_title not in movies['title'].values:
        app.logger.warning(f"Movie title '{movie_title}' not found or not provided.")
        return jsonify({"error": "Movie title not found or not provided."}), 404

    try:
        movie_index = movies[movies['title'] == movie_title].index[0]
        distances = similarity[movie_index]
        recommended_movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]

        recommended_movies = []
        for i in recommended_movies_list:
            recommended_movies.append({
                "title": movies.iloc[i[0]].title
            })
        
        app.logger.info(f"Recommendations found: {recommended_movies}")
        return jsonify(recommended_movies)
    except Exception as e:
        app.logger.error(f"An error occurred during recommendation: {e}")
        return jsonify({"error": "An internal error occurred."}), 500

@app.route('/api/test')
def test_route():
    return jsonify({"message": "Hello from the recommendation backend!"})

if __name__ == '__main__':
    app.run(debug=True, port=5001)