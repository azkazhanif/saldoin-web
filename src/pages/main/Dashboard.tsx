import React from "react";
import MainLayout from "../../layouts/MainLayout";
import { useDashboard } from "../../hooks/useDashboard";
import MetricCard from "../../components/dashboard/MetricCard";
import OverviewChart from "../../components/dashboard/OverviewChart";
import QuickActions from "../../components/dashboard/QuickActions";
import DailyExpensesChart from "../../components/dashboard/DailyExpensesChart";
import RecentActivities from "../../components/dashboard/RecentActivities";
import {
  IoTrendingUpOutline,
  IoTrendingDownOutline,
  IoWalletOutline,
} from "react-icons/io5";

const Dashboard: React.FC = () => {
  const {
    loading,
    wallets,
    categories,
    totalIncome,
    totalOutcome,
    totalSaving,
    monthlyChartData,
    dailyExpensesData,
    recentActivities,
    addTransaction,
    transferFunds,
  } = useDashboard();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm font-semibold mt-4 animate-pulse">
            Loading dashboard...
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Card: Income */}
        <MetricCard
          title="Total Income"
          amount={totalIncome}
          trendText="+12.5% vs last month"
          trendIcon={<IoTrendingUpOutline className="w-4 h-4" />}
          trendColorClass="text-green-500"
          cardIcon={<IoTrendingUpOutline className="w-6 h-6" />}
          iconBgClass="bg-green-50 text-green-600"
        />

        {/* Metric Card: Outcome */}
        <MetricCard
          title="Total Outcome"
          amount={totalOutcome}
          trendText="+8.2% vs last month"
          trendIcon={<IoTrendingDownOutline className="w-4 h-4" />}
          trendColorClass="text-red-500"
          cardIcon={<IoTrendingDownOutline className="w-6 h-6" />}
          iconBgClass="bg-red-50 text-red-600"
        />

        {/* Metric Card: Saving */}
        <MetricCard
          title="Total Saving"
          amount={totalSaving}
          trendText="46.3% saving rate"
          trendIcon={<IoWalletOutline className="w-4 h-4" />}
          trendColorClass="text-blue"
          cardIcon={<IoWalletOutline className="w-6 h-6" />}
          iconBgClass="bg-blue/10 text-blue"
        />

        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Monthly Comparison Chart (spans 2 columns) */}
          <OverviewChart data={monthlyChartData} />

          {/* Daily Expenses Chart Card (spans 2 columns) */}
          <DailyExpensesChart data={dailyExpensesData} />
        </div>

        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Quick Actions Card (spans 1 column) */}
          <QuickActions
            categories={categories}
            wallets={wallets}
            addTransaction={addTransaction}
            transferFunds={transferFunds}
          />

          {/* Recent Activity Card (spans 1 column) */}
          <RecentActivities data={recentActivities} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
