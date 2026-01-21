

export const login = async (email, password) => {
  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) return false;

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("auth", "true");
      localStorage.setItem("role", data.role); 
      return true;
    }

    return false;
  } catch (err) {
    console.error("Login error:", err);
    return false;
  }
};


export const logout = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("role");
};


export const isAuth = () => {
  return localStorage.getItem("auth") === "true";
};


export const isAdmin = () => {
  return isAuth() && localStorage.getItem("role") === "admin";
};

export const isUser = () => {
  return isAuth() && localStorage.getItem("role") === "user";
};