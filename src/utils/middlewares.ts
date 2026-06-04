import { redirect } from "react-router-dom";

export const requireAuth = async () => {
  const token = localStorage.getItem("token");
  const url = import.meta.env.VITE_API_URL;

  if (!token) {
    return redirect("/login");
  }

  /// Check if the token is still active
  const request = await fetch(`${url}api/v1/certificates`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (request.status == 401) {
    localStorage.removeItem("token");
    return redirect("/login");
  }
  return null;
};

export const guestOnly = async () => {
  const token = localStorage.getItem("token");

  if (token) {
    return redirect("/dashboard");
  }

  return null;
};
