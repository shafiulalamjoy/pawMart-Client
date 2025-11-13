// src/routes/routes.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import Homepage from "../pages/Homepage";
import SignIn from "../pages/SignIn";
import Register from "../pages/Register";

import PetsAndSupplies from "../pages/PetsAndSupplies";
import AddListing from "../pages/AddListing";
import ListingDetails from "../pages/ListingDetails";
import MyListings from "../pages/MyListings";
import MyOrders from "../pages/MyOrders";

import ProtectedRoute from "../components/ProtectedRoute";
import Error404 from "../pages/Error404";

const routes = createBrowserRouter([
  // App routes wrapped with MainLayout (has Navbar + Footer)
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Homepage /> },

      // Auth
      { path: "signin", element: <SignIn /> },
      { path: "register", element: <Register /> },

      // Public listing pages
      { path: "pets-and-supplies", element: <PetsAndSupplies /> },
      { path: "category-filtered-product/:categoryName", element: <PetsAndSupplies /> },

      // Private routes (wrapped with ProtectedRoute)
      {
        path: "add-listing",
        element: (
          <ProtectedRoute>
            <AddListing />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-listings",
        element: (
          <ProtectedRoute>
            <MyListings />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-orders",
        element: (
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        ),
      },

      // Listing details — private as per your spec (remove ProtectedRoute if you want it public)
      {
        path: "listing/:id",
        element: (
          <ProtectedRoute>
            <ListingDetails />
          </ProtectedRoute>
        ),
      },

      // You can add other nested routes here...
    ],
  },

  // 404 — no layout (so navbar/footer won't show)
  {
    path: "*",
    element: <Error404 />,
  },
]);

export default routes;





