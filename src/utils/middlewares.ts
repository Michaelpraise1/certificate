import { redirect } from "react-router-dom";



export const requireAuth = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw redirect("/login");
  }

  return null;
};

export const guestOnly = async () => {
  const token = localStorage.getItem("token");

  if (token) {
    throw redirect("/dashboard");
  }

  return null;
};