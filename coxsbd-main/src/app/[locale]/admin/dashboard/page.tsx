"use client";

import type React from "react";

import {
  BarChart,
  Cloud,
  Wallet,
  Users,
  Server,
  ArrowUp,
  ArrowDown,
  Activity,
  DollarSign,
  ShoppingCart,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}

        <StatsCard
          title="Total Orders"
          value="1,234"
          icon={<ShoppingCart className="h-6 w-6 text-red-600" />}
          trend={{ value: "+12%", label: "from last month", positive: true }}
        />

        <StatsCard
          title="Active Services"
          value="892"
          icon={<Cloud className="h-6 w-6 text-red-600" />}
          trend={{ value: "56", label: "Hosting Services", positive: true }}
        />

        <StatsCard
          title="Revenue"
          value="$45,678"
          icon={<DollarSign className="h-6 w-6 text-red-600" />}
          trend={{ value: "+$2,340", label: "recent", positive: true }}
        />

        <StatsCard
          title="Support Tickets"
          value="23"
          icon={<Users className="h-6 w-6 text-red-600" />}
          trend={{ value: "5", label: "urgent", positive: false }}
        />
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Orders
            </h3>
            <button className="text-sm text-red-600 hover:text-red-800 font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 font-medium">Service</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <OrderRow
                  service="Windows VPS"
                  customer="John Doe"
                  status="active"
                  amount="$89.99"
                />
                <OrderRow
                  service="Linux VPS"
                  customer="Jane Smith"
                  status="pending"
                  amount="$69.99"
                />
                <OrderRow
                  service="Dedicated Server"
                  customer="Robert Johnson"
                  status="active"
                  amount="$129.99"
                />
                <OrderRow
                  service="Reseller Hosting"
                  customer="Emily Davis"
                  status="cancelled"
                  amount="$49.99"
                />
                <OrderRow
                  service="Storage VPS"
                  customer="Michael Brown"
                  status="active"
                  amount="$79.99"
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* Server Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Server Status
            </h3>
            <button className="text-sm text-red-600 hover:text-red-800 font-medium">
              View Details
            </button>
          </div>
          <div className="space-y-6">
            <ServerStatusItem
              name="Primary Server"
              status="operational"
              load={72}
            />
            <ServerStatusItem
              name="Backup Cluster"
              status="warning"
              load={58}
            />
            <ServerStatusItem name="Storage Node" status="critical" load={91} />
            <ServerStatusItem
              name="Database Server"
              status="operational"
              load={45}
            />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Sales Overview
            </h3>
            <select className="text-sm border text-gray-900 border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </div>
          {/* Chart placeholder */}
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
            <div className="text-center">
              <BarChart className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <span className="text-gray-500">Sales Chart</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Service Distribution
            </h3>
            <select className="text-sm border text-gray-900 border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500">
              <option>All Services</option>
              <option>Hosting Only</option>
              <option>VPS Only</option>
              <option>Dedicated Servers</option>
            </select>
          </div>
          {/* Chart placeholder */}
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
            <div className="text-center">
              <Activity className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <span className="text-gray-500">Distribution Chart</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Recent Activity
          </h3>
          <button className="text-sm text-red-600 hover:text-red-800 font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          <ActivityItem
            icon={<ShoppingCart className="h-4 w-4" />}
            title="New Order"
            description="John Doe purchased Windows VPS"
            time="2 hours ago"
          />
          <ActivityItem
            icon={<Users className="h-4 w-4" />}
            title="New User"
            description="Emily Davis created an account"
            time="4 hours ago"
          />
          <ActivityItem
            icon={<Server className="h-4 w-4" />}
            title="Server Alert"
            description="Storage Node reaching capacity"
            time="6 hours ago"
          />
          <ActivityItem
            icon={<Wallet className="h-4 w-4" />}
            title="Payment Received"
            description="$129.99 from Robert Johnson"
            time="12 hours ago"
          />
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: { value: string; label: string; positive: boolean };
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-2 text-gray-800">{value}</p>
        </div>
        <div className="p-2 bg-red-50 rounded-lg">{icon}</div>
      </div>
      <div
        className={`flex items-center mt-4 text-sm ${
          trend.positive ? "text-green-600" : "text-red-600"
        }`}
      >
        {trend.positive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        <span className="ml-1 font-medium">{trend.value}</span>
        <span className="ml-1 text-gray-500">{trend.label}</span>
      </div>
    </div>
  );
}

function OrderRow({
  service,
  customer,
  status,
  amount,
}: {
  service: string;
  customer: string;
  status: "active" | "pending" | "cancelled";
  amount: string;
}) {
  const statusClasses = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-3 text-gray-800">{service}</td>
      <td className="py-3 text-gray-800">{customer}</td>
      <td className="py-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>
      <td className="py-3 text-gray-800 font-medium">{amount}</td>
    </tr>
  );
}

function ServerStatusItem({
  name,
  status,
  load,
}: {
  name: string;
  status: "operational" | "warning" | "critical";
  load: number;
}) {
  const statusColors = {
    operational: "bg-green-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`h-3 w-3 rounded-full ${statusColors[status]}`}></div>
          <span className="font-medium text-gray-800">{name}</span>
        </div>
        <span className="text-gray-600">{load}% Load</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            status === "operational"
              ? "bg-green-500"
              : status === "warning"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{ width: `${load}%` }}
        ></div>
      </div>
    </div>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="p-2 bg-red-100 rounded-full text-red-600">{icon}</div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="text-xs text-gray-500">{time}</div>
    </div>
  );
}
