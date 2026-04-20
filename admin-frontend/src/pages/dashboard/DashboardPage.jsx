import DashboardLayout from "../../components/layout/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm text-gray-500">Total Providers</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-2">0</h3>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm text-gray-500">Active Providers</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-2">0</h3>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm text-gray-500">Total Skills</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-2">0</h3>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm text-gray-500">Open Requests</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-2">0</h3>
        </div>
      </div>
    </DashboardLayout>
  );
}
