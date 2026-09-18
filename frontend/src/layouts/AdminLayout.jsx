import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  CreditCard,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("hallmateUser") || "null"
  );

  const currentSection =
    new URLSearchParams(location.search).get("section") || "overview";

  const handleLogout = () => {
    localStorage.removeItem("hallmateUser");
    navigate("/admin/sign-in");
  };

  const menuItems = [
    {
      key: "overview",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      key: "users",
      label: "Users & Owners",
      icon: Users,
    },
    {
      key: "halls",
      label: "Halls",
      icon: Building2,
    },
    {
      key: "bookings",
      label: "Bookings",
      icon: ClipboardList,
    },
    {
      key: "payments",
      label: "Payments",
      icon: CreditCard,
    },
  ];

  const goTo = (key) => {
    if (key === "overview") {
      navigate("/admin/dashboard");
    } else {
      navigate(`/admin/dashboard?section=${key}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#0B2239]">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[86px] bg-white border-b border-[#E8E1D4] flex items-center justify-between px-7">

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#0B2742] flex items-center justify-center">
            <span className="text-[#D4A84F] font-bold text-xl">
              H
            </span>
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#0B2742]">
              HallMate
            </h1>

            <p className="text-xs text-gray-500">
              Super Admin Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-[#0B2742]">
              {user?.name || "HallMate Admin"}
            </p>

            <p className="text-xs text-gray-500">
              Super Admin
            </p>
          </div>

          <div className="w-11 h-11 rounded-full bg-[#0B2742] flex items-center justify-center">
            <ShieldCheck
              size={20}
              className="text-[#D4A84F]"
            />
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-[86px] bottom-0 w-[250px] bg-[#0B2742] text-white px-4 py-7">

        <div className="mb-8 px-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4A84F] font-bold">
            Administration
          </p>

          <p className="mt-1 text-xs text-white/50">
            HallMate Management
          </p>
        </div>

        <nav className="space-y-2">

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = currentSection === item.key;

            return (
              <button
                key={item.key}
                onClick={() => goTo(item.key)}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-[#D4A84F] text-[#0B2742]"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </button>
            );
          })}

        </nav>

        {/* BOTTOM */}
        <div className="absolute left-4 right-4 bottom-7">

          <div className="border-t border-white/10 mb-5" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white transition"
          >
            <LogOut size={19} />
            Sign Out
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="ml-[250px] pt-[86px] min-h-screen">
        <Outlet />
      </main>

    </div>
  );
}