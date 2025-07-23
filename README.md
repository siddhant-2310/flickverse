# Fickverse 🎬

Fickverse is a web application that provides movie recommendations, reviews, and ratings. It's a one-stop destination for movie lovers to discover new movies, share their thoughts, and connect with other movie enthusiasts.

## Features ✨

-   **Movie Recommendations:** Get personalized movie recommendations based on your favorite movies.
-   **Search:** Search for movies to get more information about them.
-   **User Authentication:** Sign up and log in to your account to access personalized features.
-   **Movie Ratings and Reviews:** Rate and review movies to share your opinions with others.

## Technologies Used 💻

**Frontend:**

-   [React](https://reactjs.org/)
-   [React Router](https://reactrouter.com/)
-   [Axios](https://axios-http.com/)
-   [Firebase](https://firebase.google.com/)
-   [Bootstrap](https://getbootstrap.com/)

**Backend:**

-   [Flask](https://flask.palletsprojects.com/)
-   [Pandas](https://pandas.pydata.org/)
-   [Scikit-learn](https://scikit-learn.org/)

## Getting Started 🚀

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/)
-   [Python](https://www.python.org/)
-   [pip](https://pip.pypa.io/en/stable/installation/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/fickverse.git
    cd fickverse
    ```

2.  **Set up the backend:**

    ```bash
    cd backend
    pip install -r requirements.txt
    python app.py
    ```

    The backend will be running at `http://localhost:5001`.

3.  **Set up the frontend:**

    ```bash
    cd ../
    npm install
    npm start
    ```

    The frontend will be running at `http://localhost:3000`.

## Usage 👨‍💻

Once the application is running, you can:

1.  Create an account or log in.
2.  Search for movies.
3.  Click on a movie to see more details and get recommendations.
4.  Rate and review movies.

## API Endpoints 🔗

-   `POST /api/recommend`: Get movie recommendations based on a movie title.
    -   **Request Body:** `{ "title": "Movie Title" }`
    -   **Response:** A list of recommended movies.
-   `GET /api/test`: A test endpoint to check if the backend is running.