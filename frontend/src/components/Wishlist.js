import React from "react";

function Wishlist({ wishlist, onRemove }) {
  return (
    <div>
      <h3>Your Wishlist</h3>
      <ul>
        {wishlist.map((game) => (
          <li key={game.id}>
            <strong>{game.name}</strong><br />
            <img src={game.background_image} alt={game.name} width="200" /><br />
            <button onClick={() => onRemove(game.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Wishlist;
