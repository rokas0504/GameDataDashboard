import React, { useState, useEffect } from "react";
import "./SearchResults.css";
import { submitRating, getAverageRating } from "../api/api";
import { fetchGameDeals } from "../api/priceComparison";

function SearchResults({ results, wishlist, onAddToWishlist }) {
  const [ratings, setRatings] = useState({});
  const [userRatings, setUserRatings] = useState({});
  const [prices, setPrices] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    results.forEach((game) => {
      getAverageRating(token, game.id).then((data) => {
        setRatings((prev) => ({
          ...prev,
          [game.id]: data.averageRating || 0,
        }));
      });
      fetchGameDeals(game.name).then((priceData) => {
        if (priceData) {
          setPrices((prev) => ({
            ...prev,
            [game.id]: priceData.price || "N/A",
          }));
        }
      });
    });
  }, [results, token]);

  const handleRatingChange = (gameId, value) => {
    setUserRatings((prev) => ({
      ...prev,
      [gameId]: value,
    }));
  };

  const handleSubmitRating = async (gameId) => {
    const rating = userRatings[gameId];
    if (!rating) return;

    const res = await submitRating(token, gameId, rating);
    alert(res.message || "Rating submitted");
    const updated = await getAverageRating(token, gameId);
    setRatings((prev) => ({
      ...prev,
      [gameId]: updated.averageRating,
    }));
  };

  const isInWishlist = (gameId) => {
    return wishlist.some((item) => String(item.id) === String(gameId));
  };

  return (
    <div>
      <h3>Search Results</h3>
      <div className="grid-container">
        {results.map((game) => (
          <div className="game-card" key={game.id}>
            <strong>{game.name}</strong>
            <p>{game.released}</p>
            <img src={game.background_image} alt={game.name} width="90%" />
            <p>Price: ${prices[game.id] || "Loading..."}</p>
            <button
              onClick={() => onAddToWishlist(game.id)}
              disabled={isInWishlist(game.id)}
              className={isInWishlist(game.id) ? "disabled-button" : "active-button"}
            >
              {isInWishlist(game.id)
                ? " In Wishlist"
                : " Add to Wishlist"}
            </button>

            <div>
              <p> Average Rating: {ratings[game.id] || "No ratings..."}</p>
              <input
                type="number"
                min="1"
                max="10"
                value={userRatings[game.id] || ""}
                onChange={(e) =>
                  handleRatingChange(game.id, parseInt(e.target.value))
                }
              />
              <button onClick={() => handleSubmitRating(game.id)}>
                Submit Rating
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
