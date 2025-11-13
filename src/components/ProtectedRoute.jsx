import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function ProtectedRoute({ children }) {
  const auth = getAuth();
  const location = useLocation();

  if (auth.currentUser) {
    return children;
  }
  // send to signin and remember where user wanted to go
  return <Navigate to="/signin" replace state={{ redirectTo: location.pathname }} />;
}
