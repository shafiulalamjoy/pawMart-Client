import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Homepage from "../pages/Homepage";
import SignIn from "../pages/SignIn";
import Register from "../pages/Register";
import AddListing from "../pages/AddListing";
import ProtectedRoute from "../components/ProtectedRoute";
import Error404 from "../pages/Error404";


const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "signin", element: <SignIn /> },
      { path: "register", element: <Register /> },
      { path: "add-listing", element: <ProtectedRoute><AddListing /></ProtectedRoute> },
      // ... add other routes
      { path: "*", element: <Error404 /> },
    ],
  },
]);

export default routes;

