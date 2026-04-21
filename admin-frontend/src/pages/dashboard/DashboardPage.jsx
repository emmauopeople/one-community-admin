import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getDashboardSummary } from "../../api/dashboardApi";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProviders: 0,
    activeProviders: 0,
    totalSkills: 0,
    openRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await getDashboardSummary();
        setStats(data.stats);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  return (
    <DashboardLayout title="Dashboard">
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-sm text-gray-500">Total Providers</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              {stats.totalProviders}
            </h3>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-sm text-gray-500">Active Providers</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              {stats.activeProviders}
            </h3>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-sm text-gray-500">Total Skills</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              {stats.totalSkills}
            </h3>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-sm text-gray-500">Open Requests</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              {stats.openRequests}
            </h3>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
