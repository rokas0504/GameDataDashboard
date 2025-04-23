export async function searchGames(query) {
    const apiKey = process.env.REACT_APP_RAWG_API_KEY;
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}`
    );
    return await res.json();
  }
  