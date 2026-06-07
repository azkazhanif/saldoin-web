import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
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
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "new-password",
        element: <NewPassword />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "wallet",
    element: <Wallet />,
  },
  {
    path: "transactions",
    element: <Transactions />,
  },
  {
    path: "categories",
    element: <Categories />,
  },
  {
    path: "budget",
    element: <Budget />,
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
