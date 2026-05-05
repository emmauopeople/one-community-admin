import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAdminLoginMonitoring } from "../../api/monitoringApi";

export default function AnalyticsPage() {
  const [minutes, setMinutes] = useState(15);
  const [summary, setSummary] = useState({
    success_count: 0,
    failed_count: 0,
    total_count: 0,
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMonitoring = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getAdminLoginMonitoring(minutes);
        setSummary({
          success_count: Number(data.summary?.success_count || 0),
          failed_count: Number(data.summary?.failed_count || 0),
          total_count: Number(data.summary?.total_count || 0),
        });
        setRecentLogs(data.recent_logs || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load monitoring data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadMonitoring();
  }, [minutes]);

  return (
    <DashboardLayout title="Analytics">
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">
          Time Window
        </label>
        <select
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          className="rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value={15}>Last 15 minutes</option>
          <option value={60}>Last 60 minutes</option>
          <option value={360}>Last 6 hours</option>
          <option value={1440}>Last 24 hours</option>
        </select>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-5">
  <h3 className="mb-4 text-lg font-semibold text-gray-800">
    Admin Login Overview
  </h3>

  <div className="space-y-4">
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-gray-600">Successful Logins</span>
        <span className="font-medium text-green-700">
          {summary.success_count}
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-green-500"
          style={{
            width: `${
              summary.total_count
                ? (summary.success_count / summary.total_count) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>

    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-gray-600">Failed Logins</span>
        <span className="font-medium text-red-700">
          {summary.failed_count}
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-red-500"
          style={{
            width: `${
              summary.total_count
                ? (summary.failed_count / summary.total_count) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>
  </div>
</div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm text-gray-500">Loading analytics...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : (
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-sm text-gray-500">Successful Admin Logins</p>
              <h3 className="mt-2 text-2xl font-bold text-green-700">
                {summary.success_count}
              </h3>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-sm text-gray-500">Failed Admin Logins</p>
              <h3 className="mt-2 text-2xl font-bold text-red-700">
                {summary.failed_count}
              </h3>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-sm text-gray-500">Total Login Attempts</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-800">
                {summary.total_count}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Recent Admin Login Activity
            </h3>

            {recentLogs.length === 0 ? (
              <p className="text-sm text-gray-500">No recent login activity.</p>
            ) : (
              <div className="overflow-x-auto">
                <div className="max-h-[420px] overflow-y-auto rounded-xl border">
                  <table className="min-w-full text-sm">
                    <thead className="sticky top-0 z-10 bg-blue-700 text-white">
                      <tr className="text-left">
                        <th className="py-3 pr-4 pl-3 font-semibold">Email</th>
                        <th className="py-3 pr-4 font-semibold">Status</th>
                        <th className="py-3 pr-4 font-semibold">Reason</th>
                        <th className="py-3 pr-4 font-semibold">IP</th>
                        <th className="py-3 pr-4 font-semibold">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="border-b last:border-b-0 hover:bg-gray-50"
                        >
                          <td className="py-4 pr-4 pl-3 text-gray-800">
                            {log.email_attempted}
                          </td>
                          <td className="py-4 pr-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                log.status === "success"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="py-4 pr-4 text-gray-600">
                            {log.failure_reason || "-"}
                          </td>
                          <td className="py-4 pr-4 text-gray-600">
                            {log.ip_address || "-"}
                          </td>
                          <td className="py-4 pr-4 text-gray-600">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}