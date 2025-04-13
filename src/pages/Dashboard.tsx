
import { useState } from "react";
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";
import DrawerMenu from "@/components/dashboard/DrawerMenu";
import DashboardContent from "@/components/dashboard/DashboardContent";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("comments");

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Header */}
      <Header />

      <div className="flex flex-1 relative">
        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <DashboardContent activeTab={activeTab} />
        </main>

        {/* Collapsible Menu Trigger Button */}
        <DrawerMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
