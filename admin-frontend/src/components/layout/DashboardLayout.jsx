import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
export default function DashboardLayout({ children, title = "Dashboard" }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <aside className="hidden md:flex md:w-64 md:flex-col md:bg-gradient-to-b md:from-blue-700 md:to-green-600 md:shadow-md">
        <div className="px-6 py-5 border-b border-white/20">
          <h1 className="text-lg font-bold text-white">One Community Admin</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/providers"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15"
              }`
            }
          >
            Providers
          </NavLink>
          <NavLink
            to="/requests"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15"
              }`
            }
          >
            Requests
          </NavLink>
          <NavLink
            to="/skills"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15"
              }`
            }
          >
            Skills
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15"
              }`
            }
          >
            Analytics
          </NavLink>
          <NavLink
            to="/system"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15"
              }`
            }
          >
            System
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col pb-28 md:pb-0">
        <header className="bg-gray-100 border-b border-amber-200 px-4 py-4 md:px-6">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              {title}
            </h2>

            <button
              onClick={handleLogout}
              className="ml-auto rounded-lg bg-gradient-to-r from-blue-600 to-green-500 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-green-600"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="p-4 md:p-6">{children}</div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-700 to-green-600 border-t border-white/20 md:hidden">
        <div className="grid grid-cols-3 text-center text-xs">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/providers"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15"
              }`
            }
          >
            Providers
          </NavLink>
          <NavLink
            to="/requests"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15"
              }`
            }
          >
            Requests
          </NavLink>
          <NavLink
            to="/skills"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15"
              }`
            }
          >
            Skills
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15"
              }`
            }
          >
            Analytics
          </NavLink>
          <NavLink
            to="/system"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15"
              }`
            }
          >
            System
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
