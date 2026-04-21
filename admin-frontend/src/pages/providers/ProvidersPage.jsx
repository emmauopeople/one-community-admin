import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getProviders } from "../../api/providerApi";

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await getProviders();
        setProviders(data.providers || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load providers");
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, []);

  return (
    <DashboardLayout title="Providers">
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm text-gray-500">Loading providers...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm text-gray-500 mb-4">
            Total Providers: {providers.length}
          </p>

          {providers.length === 0 ? (
            <p className="text-sm text-gray-500">No providers found.</p>
          ) : (
            <div className="space-y-3">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="border rounded-xl p-4 space-y-1"
                >
                  <p className="font-medium text-gray-800">
                    {provider.display_name || "No name"}
                  </p>
                  <p className="text-sm text-gray-600">{provider.email}</p>
                  <p className="text-sm text-gray-600">
                    {provider.phone || "No phone"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {provider.city || "No city"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {provider.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
