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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      <div className="hidden md:flex flex-col items-center justify-center bg-blue p-8">
        <img src={authImage} alt="Auth Background" className="max-w-[70%] h-auto mb-6" />
        <p className="text-white font-extrabold text-2xl md:text-3xl mb-3 text-center">
          Easy to control your finances
        </p>
        <p className="max-w-md text-white/80 text-center text-sm md:text-base leading-relaxed">
          Manage your money, track your expenses, and achieve your financial
          goals with ease.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {children}
          {social && <SocialAuth />}
          {title === "login" && (
            <p className="text-center mt-6 text-sm text-gray font-medium">
              Don't have an account?{" "}
              <Link to="/auth/register" className="text-blue font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          )}
          {title === "register" && (
            <p className="text-center mt-6 text-sm text-gray font-medium">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-blue font-bold hover:underline">
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
