import AuthLayout from "../../components/layout/AuthLayout";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <AuthLayout
      title="One Community Admin"
      subtitle="Sign in to access the admin dashboard."
    >
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="admin@example.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-right">
  <Link
    to="/forgot-password"
    className="text-sm text-blue-600 hover:text-green-600 hover:underline"
  >
    Forgot Password?
  </Link>
</div>

        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-green-500 text-white py-2 font-medium hover:from-blue-700 hover:to-green-600 transition"
        >
          Sign In
        </button>
      </form>
    </AuthLayout>
  );
}