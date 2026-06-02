import React from "react";
import SocialAuth from "../components/organisms/SocialAuth";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center bg-blue"></div>
      <div className="flex flex-col items-center justify-center">
        <div className="w-md">
          {children}
          <SocialAuth />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
