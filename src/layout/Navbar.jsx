import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../firebase/initFirebase";

export default function Navbar() {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/pets-supplies", label: "Pets & Supplies" },
    ...(user
      ? [
          { to: "/add-listing", label: "Add Listing" },
          { to: "/my-listings", label: "My Listings" },
          { to: "/my-orders", label: "My Orders" },
        ]
      : []),
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
              alt="PawMart"
              className="w-8 h-8"
            />
            <span className="font-bold text-xl text-blue-700">PawMart</span>
          </Link>

          <nav className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "text-white bg-blue-600"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            {!user ? (
              <>
                <Link
                  to="/signin"
                  className="px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:opacity-90"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <img
                  src={
                    user.photoURL ||
                    "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
                  }
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden relative">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {open ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
                  />
                </svg>
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border py-2 z-50">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
                {!user ? (
                  <>
                    <Link
                      to="/signin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
