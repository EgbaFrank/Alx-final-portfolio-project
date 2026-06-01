import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data for Charts
  const vitaminData = {
    datasets: [
      {
        data: [58, 42],
        backgroundColor: ["#4caf50", "#e0e0e0"],
        borderWidth: 0,
      },
    ],
  };

  const mineralData = {
    datasets: [
      {
        data: [62, 38],
        backgroundColor: ["#ff9800", "#e0e0e0"],
        borderWidth: 0,
      },
    ],
  };

  const waterData = {
    datasets: [
      {
        data: [48, 52],
        backgroundColor: ["#2196f3", "#e0e0e0"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: "70%",
    plugins: {
      tooltip: { enabled: true },
      legend: { display: false },
    },
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 focus:outline-none hover:text-gray-800 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-green-600">DailyNutri </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-gray-600 text-sm">
            <span className="font-semibold">Doe</span>
          </div>
          <img
            src="https://via.placeholder.com/40"
            alt="User"
            className="rounded-full w-8 h-8 object-cover shadow"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex justify-center py-12 px-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-5xl w-full">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-green-600 drop-shadow-sm">
              Good Morning, Doe!
            </h2>
            <p className="text-gray-500 text-lg mt-2">
              Here's an overview of your nutrition today.
            </p>
          </div>

          {/* Summary Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-b from-yellow-600 to-yellow-700 border border-yellow-700 rounded-lg p-6 flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105">
              <Doughnut data={vitaminData} options={chartOptions} />
              <p className="text-yellow-300 font-semibold mt-4">Vitamin Intake</p>
            </div>
            <div className="bg-gradient-to-b from-green-600 to-green-700 border border-green-700 rounded-lg p-6 flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105">
              <Doughnut data={mineralData} options={chartOptions} />
              <p className="text-green-300 font-semibold mt-4">Mineral Intake</p>
            </div>
            <div className="bg-gradient-to-b from-blue-600 to-blue-700 border border-blue-700 rounded-lg p-6 flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105">
              <Doughnut data={waterData} options={chartOptions} />
              <p className="text-blue-300 font-semibold mt-4">Water Intake</p>
            </div>
          </div>

          {/* Alerts Section */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow mb-8">
            <h3 className="text-2xl font-bold text-red-600 mb-3">Alerts 🚨</h3>
            <ul className="list-disc list-inside text-red-700">
              <li>Vitamin D intake is critically low today. Consider adding more sunlight or fortified foods.</li>
              <li>Calcium intake is 30% below recommended levels. Add milk, cheese, or leafy greens to your meals.</li>
              <li>Hydration levels are low—drink at least 2 more glasses of water today.</li>
            </ul>
          </div>

                    {/* Accomplishments Section */}
                    <div className="bg-gray-50 rounded-lg p-6 shadow mb-8 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-green-600 mb-3">
              Accomplishments 🎉
            </h3>
            <p className="text-gray-700">
              Great job meeting today's iron target!
            </p>
            <p className="text-gray-500 mt-2">
              Iron is essential for oxygen transportation in your body.
            </p>
          </div>

          {/* Recommendations Section */}
          <div className="bg-gray-50 rounded-lg p-6 shadow mb-8 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-blue-600 mb-3">
              Recommendations 🥛
            </h3>
            <p className="text-gray-700">
              You're a bit low on calcium. Add some milk or yogurt to your next
              meal!
            </p>
            <p className="text-gray-500 mt-2">
              Calcium is important for strong bones and teeth.
            </p>
          </div>

          {/* Buttons Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-6">
              <button
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium shadow hover:bg-green-700 transition"
                onClick={toggleModal}
              >
                Log a Meal
              </button>
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium shadow hover:bg-green-700 transition">
                Progress Report
              </button>
            </div>
            <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-medium shadow hover:bg-gray-200 transition">
              View History
            </button>
          </div>
        </div>
      </main>

      {/* Log a Meal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Log a Meal</h3>
            <form>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meal Name
              </label>
              <input
                type="text"
                className="block w-full border rounded-lg p-2 mb-4"
                placeholder="Enter meal name"
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nutrient Content (%)
              </label>
              <input
                type="number"
                className="block w-full border rounded-lg p-2 mb-4"
                placeholder="Enter percentage"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-center py-6">
        <div className="container mx-auto px-4">
          <div className="text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} DailyNutri. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
