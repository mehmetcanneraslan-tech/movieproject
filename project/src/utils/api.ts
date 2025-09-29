const API_URL = "http://localhost:8000"; // frontend portuna göre backend port değil, API 8000 olacak

export const login = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
};




export const register = async (username: string, password: string) => {
  const res = await fetch(`http://localhost:8000/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Register failed");
  return res.json();
};

export const getFavorites = async (token: string) => {
  const res = await fetch(`http://localhost:8000/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch favorites");
  return res.json();
};

export const addFavorite = async (token: string, movie: any) => {
  const res = await fetch(`http://localhost:8000/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(movie),
  });
  if (!res.ok) throw new Error("Failed to add favorite");
  return res.json();
};

export const deleteFavorite = async (token: string, title: string) => {
  const res = await fetch(`http://localhost:8000/favorites/${encodeURIComponent(title)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete favorite");
  return res.json();
};
export const updateFavorite = async (token: string, oldTitle: string, movie: any) => {
  const res = await fetch(`${API_URL}/favorites/${encodeURIComponent(oldTitle)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(movie),
  });

  if (!res.ok) throw new Error("Failed to update favorite");
  return res.json();
};
