const RAWG_API_KEY = process.env.REACT_APP_RAWG_API_KEY;

export const fetchWishlist = async (token) => {
  const res = await fetch("https://localhost:5001/api/wishlist", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
};

const fetchGameById = async (gameId) => {
  try {
    const res = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${RAWG_API_KEY}`);
    if (!res.ok) throw new Error("Game not found");
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch game ${gameId}:`, error);
    return null;
  }
};

export const fetchDetailedWishlist = async (token) => {
  const rawWishlist = await fetchWishlist(token);

  const detailed = await Promise.all(
    rawWishlist.map(async (item) => {
      const gameData = await fetchGameById(item.gameId);
      return gameData;
    })
  );

  return detailed.filter(game => game !== null);
};

export const addToWishlist = async (token, gameId) => {
  const res = await fetch("https://localhost:5001/api/wishlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ gameId }),
  });

  return await res.json();
};

export async function submitRating(token, gameId, rating) {
  const res = await fetch("https://localhost:5001/api/rate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ gameId, rating }),
  });
  return res.json();
}

export async function getAverageRating(token, gameId) {
  const res = await fetch(`https://localhost:5001/api/ratings/${gameId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export const removeFromWishlist = async (token, gameId) => {
  const res = await fetch("https://localhost:5001/api/wishlist", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ gameId }),
  });

  return await res.json();
};

