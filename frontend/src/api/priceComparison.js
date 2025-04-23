export async function fetchGameDeals(title) {
  try {
    const res = await fetch(`https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(title)}&limit=1`);
    const data = await res.json();
    console.log(data)
    return data[0]; 
  } catch (err) {
    console.error("Error fetching price:", err);
    return null;
  }
}
  