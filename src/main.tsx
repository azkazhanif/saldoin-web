import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import ProtectedRoute from "./components/atoms/auth/ProtectedRoute.tsx";
import AuthRoute from "./components/atoms/auth/AuthRoute.tsx";
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import ForgotPassword from "./pages/auth/ForgotPassword.tsx";
import VerifyOtp from "./pages/auth/VerifyOtp.tsx";
import NewPassword from "./pages/auth/NewPassword.tsx";
import Dashboard from "./pages/main/Dashboard.tsx";
import Wallet from "./pages/main/Wallet.tsx";
import Transactions from "./pages/main/Transactions.tsx";
import Categories from "./pages/main/Categories.tsx";
import Budget from "./pages/main/Budget.tsx";
import Profile from "./pages/main/Profile.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "auth",
    children: [
      {
        path: "login",
        element: (
          <AuthRoute>
            <Login />
          </AuthRoute>
        ),
      },
      {
        path: "register",
        element: (
          <AuthRoute>
            <Register />
          </AuthRoute>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <AuthRoute>
            <ForgotPassword />
          </AuthRoute>
        ),
      },
      {
        path: "verify-otp",
        element: (
          <AuthRoute>
            <VerifyOtp />
          </AuthRoute>
        ),
      },
      {
        path: "new-password",
        element: (
          <AuthRoute>
            <NewPassword />
          </AuthRoute>
        ),
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "wallet",
    element: (
      <ProtectedRoute>
        <Wallet />
      </ProtectedRoute>
    ),
  },
  {
    path: "transactions",
    element: (
      <ProtectedRoute>
        <Transactions />
      </ProtectedRoute>
    ),
  },
  {
    path: "categories",
    element: (
      <ProtectedRoute>
        <Categories />
      </ProtectedRoute>
    ),
  },
  {
    path: "budget",
    element: (
      <ProtectedRoute>
        <Budget />
      </ProtectedRoute>
    ),
  },
  {
    path: "profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);

