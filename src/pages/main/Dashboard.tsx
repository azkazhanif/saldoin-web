import React from "react";
import MainLayout from "../../layouts/MainLayout";
import { useDashboard } from "../../hooks/useDashboard";
import MetricCard from "../../components/dashboard/MetricCard";
import OverviewChart from "../../components/dashboard/OverviewChart";
import QuickActions from "../../components/dashboard/QuickActions";
import DailyExpensesChart from "../../components/dashboard/DailyExpensesChart";
import RecentActivities from "../../components/dashboard/RecentActivities";
import BudgetWarnings from "../../components/dashboard/BudgetWarnings";
import TopWallets from "../../components/dashboard/TopWallets";
import BudgetOverview from "../../components/dashboard/BudgetOverview";
import UpcomingBills from "../../components/dashboard/UpcomingBills";
import TopSpendingCategories from "../../components/dashboard/TopSpendingCategories";
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
    totalExpense,
    currentBalance,
    dailyExpenseDays,
    setDailyExpenseDays,
    monthlyChartData,
    dailyExpensesData,
    recentActivities,
    upcomingBills,
    topSpendingCategories,
    budgetOverview,
    budgetWarnings,
    topWallets,
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
      <div className="flex flex-col gap-2 lg:gap-6">
        {/* Top Row: Metric Cards */}
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-6">
          <div className="flex-1">
            <MetricCard
              title="Total Income"
              amount={totalIncome}
              trendText="+12.5% vs last month"
              trendIcon={<IoTrendingUpOutline className="w-4 h-4" />}
              trendColorClass="text-green-500"
              cardIcon={<IoTrendingUpOutline className="w-6 h-6" />}
              iconBgClass="bg-green-50 text-green-600"
            />
          </div>
          <div className="flex-1">
            <MetricCard
              title="Total Expense"
              amount={totalExpense}
              trendText="+8.2% vs last month"
              trendIcon={<IoTrendingUpOutline className="w-4 h-4" />}
              trendColorClass="text-red-500"
              cardIcon={<IoTrendingDownOutline className="w-6 h-6" />}
              iconBgClass="bg-red-50 text-red-600"
            />
          </div>
          <div className="flex-1">
            <MetricCard
              title="Current Balance"
              amount={currentBalance}
              trendText="Total money in your wallets"
              trendIcon={<IoWalletOutline className="w-4 h-4" />}
              trendColorClass="text-blue"
              cardIcon={<IoWalletOutline className="w-6 h-6" />}
              iconBgClass="bg-blue/10 text-blue"
            />
          </div>
        </div>

        {/* Content Columns wrapper */}
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-6 items-stretch lg:items-start">
          {/* Left Column (approx 66% width) */}
          <div className="contents lg:flex lg:flex-col lg:gap-6 lg:w-2/3">
            <div className="order-5 lg:order-none w-full">
              <OverviewChart data={monthlyChartData} />
            </div>
            <div className="order-6 lg:order-none w-full">
              <DailyExpensesChart 
                data={dailyExpensesData} 
                days={dailyExpenseDays} 
                setDays={setDailyExpenseDays} 
              />
            </div>
            <div className="order-8 lg:order-none w-full">
              <BudgetOverview data={budgetOverview} />
            </div>
            <div className="order-10 lg:order-none w-full">
              <BudgetWarnings warnings={budgetWarnings} />
            </div>
          </div>

          {/* Right Column (approx 33% width) */}
          <div className="contents lg:flex lg:flex-col lg:gap-6 lg:w-1/3">
            <div className="order-4 lg:order-none w-full">
              <QuickActions
                categories={categories}
                wallets={wallets}
                addTransaction={addTransaction}
                transferFunds={transferFunds}
              />
            </div>
            <div className="order-7 lg:order-none w-full">
              <RecentActivities data={recentActivities} />
            </div>
            <div className="order-9 lg:order-none w-full">
              <UpcomingBills data={upcomingBills} />
            </div>
            <div className="order-11 lg:order-none w-full">
              <TopSpendingCategories categories={topSpendingCategories} />
            </div>
            <div className="order-12 lg:order-none w-full">
              <TopWallets wallets={topWallets} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
