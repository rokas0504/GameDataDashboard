import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDetailedWishlist, addToWishlist } from "../api/api";
import { searchGames } from "../api/searchGames";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import Wishlist from "../components/Wishlist";
import { removeFromWishlist } from "../api/api";
import "../components/Dashboard.css"


function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const token = localStorage.getItem("token");
  
    if (!storedUser || !token) {
      navigate("/login");
      return;
    }
  
    setUsername(storedUser);
  
    fetchDetailedWishlist(token)
      .then(setWishlist)
      .catch((err) => console.error("Error fetching detailed wishlist:", err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    try {
      const data = await searchGames(searchTerm);
      setSearchResults(data.results || []);
    } catch (err) {
      console.error("Search error:", err);
    }
  };
  
  const handleAddToWishlist = async (gameId) => {
    const token = localStorage.getItem("token");
    try {
      const result = await addToWishlist(token, gameId);
      if (result.message) {
        const updatedWishlist = await fetchDetailedWishlist(token);
        setWishlist(updatedWishlist);
        alert("Added to wishlist");
      } else {
        alert(result.error || "Could not add to wishlist");
      }
    } catch (err) {
      console.error("Add error:", err);
    }
  };
  

  const handleRemoveFromWishlist = async (gameId) => {
    const token = localStorage.getItem("token");
    try {
      const result = await removeFromWishlist(token, gameId);
      if (result.message) {
        const updatedWishlist = await fetchDetailedWishlist(token);
        setWishlist(updatedWishlist);
        alert("Removed from wishlist");
      } else {
        alert(result.error || "Could not remove from wishlist");
      }
    } catch (err) {
      console.error("Remove error:", err);
    }
  };
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {username}!</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
  
      <hr />
  
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
      />
  
      {searchResults.length > 0 && (
        <SearchResults
          results={searchResults}
          wishlist={wishlist}
          onAddToWishlist={handleAddToWishlist}
        />
      )}
  
      <hr />
  
      <Wishlist wishlist={wishlist} onRemove={handleRemoveFromWishlist} />
    </div>
  );
  
}

export default Dashboard;
