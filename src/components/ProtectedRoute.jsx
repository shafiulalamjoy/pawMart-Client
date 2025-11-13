// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

/**
 * ProtectedRoute
 * - Waits for Firebase auth to initialize before deciding.
 * - Preserves full requested URL (pathname + search + hash) so redirect returns user to same place.
 * - Displays a minimal loading fallback while auth state is being determined.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    // subscribe to auth state changes
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setChecking(false);
    });

    return () => unsub();
  }, []);

  // While Firebase initializes, show simple loading to avoid flash-redirect
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-pulse px-4 py-2 bg-gray-200 rounded">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (user) {
    return children;
  }

  // preserve full location including search & hash
  const fullPath = `${location.pathname}${location.search || ""}${location.hash || ""}`;

  return <Navigate to="/signin" replace state={{ redirectTo: fullPath }} />;
}

