const API_URL = 'https://localhost:5001/api';

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
}

export async function registerUser(formData) {
    try {
      const res = await fetch("https://localhost:5001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }
  
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  