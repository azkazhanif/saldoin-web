import React from "react";
import Header from "../components/organisms/main/Header";
import Sidebar from "../components/organisms/main/Sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col md:grid md:grid-cols-5 min-h-screen">
        <Sidebar />
        <div className="flex-1 md:col-span-4 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-6">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
