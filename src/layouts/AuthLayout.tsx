import React from "react";
import SocialAuth from "../components/organisms/auth/SocialAuth";
import authImage from "../assets/auth-pic.png";
import { Link } from "react-router";

const AuthLayout = ({
  children,
  social = true,
  title,
}: {
  children: React.ReactNode;
  social?: boolean;
  title?: "login" | "register";
}) => {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex flex-col items-center justify-center bg-blue">
        <img src={authImage} alt="Auth Background" />
        <p className="text-white font-bold text-xl md:text-2xl mb-2 text-center">
          Easy to control your finances
        </p>
        <p className="w-md text-white text-center">
          Manage your money, track your expenses, and achieve your financial
          goals with ease.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="w-md">
          {children}
          {social && <SocialAuth />}
          {title === "login" && (
            <p className="text-center mt-4">
              Don't have an account?{" "}
              <Link to="/auth/register" className="text-blue-500">
                Sign Up
              </Link>
            </p>
          )}
          {title === "register" && (
            <p className="text-center mt-4">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-blue-500">
                Login
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
