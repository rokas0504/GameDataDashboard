import React from "react";

function Wishlist({ wishlist, onRemove }) {
  const containerStyle = {
    padding: "1rem",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
  };

  const cardStyle = {
    backgroundColor: "#f2f2f2",
    padding: "1rem",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  };

  const imageStyle = {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
    margin: "0.5rem 0",
  };

  const buttonStyle = {
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: "#c0392b",
  };

  return (
    <div style={containerStyle}>
      <h3>Your Wishlist</h3>
      <div style={gridStyle}>
        {wishlist.map((game) => (
          <div style={cardStyle} key={game.id}>
            <strong>{game.name}</strong>
            <img src={game.background_image} alt={game.name} style={imageStyle} />
            <button
              style={buttonStyle}
              onClick={() => onRemove(game.id)}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#c0392b")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#e74c3c")}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
