import React from "react";

function SearchBar({ searchTerm, setSearchTerm, onSearch }) {
  const containerStyle = {
    margin: "1rem 0",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    maxWidth: "400px",
    marginInline: "auto",
  };

  const inputStyle = {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "white",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <h3>Search for Games</h3>
      <input
        style={inputStyle}
        type="text"
        placeholder="Enter game title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button style={buttonStyle} onClick={onSearch}>Search</button>
    </div>
  );
}

export default SearchBar;
