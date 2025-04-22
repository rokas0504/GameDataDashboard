import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState([
    { id: 1, title: "Cyberpunk 2077" },
    { id: 2, title: "Elden Ring" },
    { id: 3, title: "The Witcher 3" },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (!storedUser) {
      navigate("/login");
    } else {
      setUsername(storedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    // Later, send fetch request to search for games
  };

  return (
    <div>
      <h2>Welcome, {username}!</h2>
      <button onClick={handleLogout}>Logout</button>

      <hr />

      <div>
        <h3>Search for Games</h3>
        <input
          type="text"
          placeholder="Enter game title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <hr />

      <div>
        <h3>Your Wishlist</h3>
        <ul>
          {wishlist.map((game) => (
            <li key={game.id}>{game.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
