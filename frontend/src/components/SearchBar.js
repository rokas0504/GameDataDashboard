import React from "react";

function SearchBar({ searchTerm, setSearchTerm, onSearch }) {
  return (
    <div>
      <h3>Search for Games</h3>
      <input
        type="text"
        placeholder="Enter game title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={onSearch}>Search</button>
    </div>
  );
}

export default SearchBar;
