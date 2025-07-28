import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Search from './pages/Search';
import MoviePage from './pages/MoviePage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4 app-container">
        <Routes>
          <Route path="/" element={
            <div className="p-5 mb-4 rounded-3 app-jumbotron">
              <div className="container-fluid py-5">
                <h1 className="display-5 fw-bold">Welcome to Fickverse 🎬</h1>
                <p className="col-md-8 fs-4">Your one-stop destination for movie recommendations, reviews, and ratings. Discover new movies, share your thoughts, and connect with other movie lovers.</p>
                <Link to="/search" className="btn btn-primary btn-lg">Search Movies</Link>
              </div>
            </div>
          } />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movie/:id" element={
            <PrivateRoute>
              <MoviePage />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/search" element={
            <PrivateRoute>
              <Search />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
