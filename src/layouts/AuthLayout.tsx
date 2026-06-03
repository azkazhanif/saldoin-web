import React from "react";
import SocialAuth from "../components/organisms/auth/SocialAuth";

const AuthLayout = ({
  children,
  social = true,
}: {
  children: React.ReactNode;
  social?: boolean;
}) => {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-blue"></div>
      <div className="flex flex-col items-center justify-center">
        <div className="w-md">
          {children}
          {social && <SocialAuth />}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
