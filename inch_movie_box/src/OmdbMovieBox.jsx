import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MovieBoxCard from "./MovieBoxCard";
import "./App.css";
import SearchIcon from "./search.svg";
import axios from "axios";
import MovieBoxDetails from "./MovieBoxDetails";

const OmdbMovie = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const searchMovies = async () => {
    try {
      const response = await axios.get(
        `https://localhost:32768/api/InchMovieBox/title?title=${searchTerm}`
      );
      setSearchResults(response?.data);
      setMovies(response?.data);
      // Save the search query to local storage

    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const getHistory = async () => {
    try {
      const response = await axios.get(
        'https://localhost:32768/api/InchMovieBox/history'
      );
      setSearchHistory(response?.data);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const handleSearchHistory = () => {
    getHistory();
    setShowHistory(prev => !prev);
  };


  useEffect(() => {
    // Fetch the initial search history from local storage
    const initialHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(initialHistory);
  }, []);

  return (
    <Router>
      <div className="app">
        <h1>Inch_MovieBox</h1>
        <button className="button"  onClick={handleSearchHistory}>Search History</button>

        {showHistory &&
          <div>
            <h2>5 Recently searched movies:</h2>
            <ul>
              {searchHistory.map((query, index) => (
                <li key={index}>{query}</li>
              ))}
            </ul>
          </div>
        }

        <div className="search">
          <input
            placeholder="Search for movies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchMovies();
              }
            }}
          />
          <img
            src={SearchIcon}
            alt="search"
            onClick={() => searchMovies(searchTerm)}
          />
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <div>
                {searchResults !== null && searchResults?.length > 0 ? (
                  <div className="container">
                    {movies &&
                      movies.map((movie) => (
                        <Link key={movie.imdbID} to={`https://localhost:32768/api/InchMovieBox/${movie.imdbID}`}>
                          <MovieBoxCard movie={movie} />
                        </Link>
                        
                      ))}
                  </div>
                ) : (
                  <div className="empty">
                    <h1>
                      {searchResults !== null
                        ? "No search found"
                        : "No movie found"}
                    </h1>
                  </div>
                )}


              </div>
            }
          />
          <Route path="https://localhost:7064/api/InchMovieBox/:id" element={<MovieBoxDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default OmdbMovie;