import { createBrowserRouter, Navigate } from "react-router";
import Login from "./features/auth/pages/login.jsx";
import Register from "./features/auth/pages/register.jsx";
import Protected from "./features/auth/components/protected.jsx";
import Home from "./features/aifeatures/pages/home.jsx";
import Interview from "./features/aifeatures/pages/interview.jsx";
import AppLayout from "./features/aifeatures/components/AppLayout.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/home",
    element: <Navigate to="/" replace />
  },
  {
    path: "/app",
    element: <Protected><AppLayout /></Protected>,
    children: [
      { index: true, element: <Navigate to="/app/interview" replace /> },
      { path: "interview", element: <Interview /> },
      { path: "interview/:interviewId", element: <Interview /> }
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  }
]);
