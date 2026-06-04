import React from "react";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-5">
      <div className="col-span-1 bg-gray-200 h-screen">Sidebar</div>
      <div className="col-span-4 p-4">Main Content</div>
    </div>
  );
};

export default Dashboard;
