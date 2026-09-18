import { Outlet, NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  ClipboardList,
  UserRound,
  Bell,
  LogOut,
} from "lucide-react";

import { useEffect, useState } from "react";

export default function OwnerLayout() {
  const navigate = useNavigate();

  const [owner, setOwner] = useState(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  // ================= GET LOGGED-IN OWNER =================

  useEffect(() => {
    const savedOwner =
      localStorage.getItem("hallmateOwner") ||
      sessionStorage.getItem("hallmateOwner");

    if (!savedOwner) {
      return;
    }

    try {
      const parsedOwner = JSON.parse(savedOwner);

      if (parsedOwner?.role === "owner") {
        setOwner(parsedOwner);
      }
    } catch (error) {
      console.error("Unable to read owner account:", error);
    }
  }, []);


  // ================= CHECK OWNER NOTIFICATIONS =================

  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const savedOwner =
          localStorage.getItem("hallmateOwner") ||
          sessionStorage.getItem("hallmateOwner");

        if (!savedOwner) {
          setHasUnreadNotifications(false);
          return;
        }

        const parsedOwner = JSON.parse(savedOwner);

        if (!parsedOwner?.id) {
          setHasUnreadNotifications(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/notifications/${parsedOwner.id}`
        );

        const data = await response.json();

        if (data.success) {
          const unread = (data.notifications || []).some(
            (notification) => !notification.is_read
          );

          setHasUnreadNotifications(unread);
        }
      } catch (error) {
        console.error("Owner notification check failed:", error);
      }
    };

    checkNotifications();

    const interval = setInterval(checkNotifications, 5000);

    return () => clearInterval(interval);
  }, []);


  // ================= OWNER DISPLAY DATA =================

  const ownerName = owner?.name || "Hall Owner";

  const ownerInitial =
    ownerName.trim().charAt(0).toUpperCase() || "O";


  // ================= NAVIGATION STYLE =================

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-[14px] font-semibold transition ${
      isActive
        ? "bg-[#C6922E] text-white"
        : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;


  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#0B2742]">


      {/* =====================================================
          TOP HEADER
      ====================================================== */}

      <header className="fixed left-0 right-0 top-0 z-50 h-[86px] border-b border-[#E8E3D8] bg-white">

        <div className="flex h-full items-center justify-between px-8">


          {/* ================= LOGO ================= */}

          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => navigate("/owner/dashboard")}
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B2742]">

              <span className="text-2xl font-bold text-[#C6922E]">
                H
              </span>

            </div>


            <div className="flex flex-col leading-none">

              <span className="text-[25px] font-bold text-[#0B2742]">
                Hall<span className="text-[#C6922E]">Mate</span>
              </span>

              <span className="mt-1 text-[10px] font-semibold tracking-[0.22em] text-[#0B2742]">
                SMART VENUE BOOKING
              </span>

            </div>

          </div>


          {/* ================= RIGHT SIDE ================= */}

          <div className="flex items-center gap-5">


            {/* NOTIFICATION */}

            <button
              type="button"
              aria-label="Notifications"
              onClick={() => navigate("/owner/notifications")}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#0B2742] transition hover:bg-[#F7F4ED]"
            >

              <Bell size={21} />

              {hasUnreadNotifications && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#C6922E]" />
              )}

            </button>


            {/* DIVIDER */}

            <div className="h-8 w-px bg-[#E8E3D8]" />


            {/* OWNER ACCOUNT */}

            <button
              type="button"
              onClick={() => navigate("/owner/profile")}
              className="flex items-center gap-3"
            >

              {/* OWNER INITIAL */}

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B2742]">

                <span className="text-sm font-bold text-[#C6922E]">
                  {ownerInitial}
                </span>

              </div>


              {/* OWNER NAME */}

              <div className="hidden text-left sm:block">

                <p className="max-w-[180px] truncate text-sm font-bold text-[#0B2742]">
                  {ownerName}
                </p>

                <p className="text-[11px] text-[#8793A3]">
                  Owner Account
                </p>

              </div>

            </button>

          </div>

        </div>

      </header>


      {/* =====================================================
          LEFT SIDEBAR
      ====================================================== */}

      <aside className="fixed bottom-0 left-0 top-[86px] z-40 w-[220px] bg-[#0B2742]">

        <div className="flex h-full flex-col px-4 py-7">


          {/* ================= OWNER PORTAL ================= */}

          <div className="mb-8 flex items-center gap-3 px-2">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C6922E]">

              <span className="font-bold text-[#0B2742]">
                H
              </span>

            </div>


            <div>

              <p className="font-bold text-white">
                HallMate
              </p>

              <p className="text-[9px] font-semibold tracking-[0.2em] text-white/60">
                OWNER PORTAL
              </p>

            </div>

          </div>


          {/* ================= MENU ================= */}

          <p className="mb-3 px-4 text-[10px] font-bold tracking-[0.2em] text-white/40">
            MENU
          </p>


          <nav className="flex flex-col gap-2">

            <NavLink
              to="/owner/dashboard"
              className={navClass}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>


            <NavLink
              to="/owner/my-hall"
              className={navClass}
            >
              <Building2 size={18} />
              My Hall
            </NavLink>


            <NavLink
              to="/owner/availability"
              className={navClass}
            >
              <CalendarDays size={18} />
              Availability
            </NavLink>


            <NavLink
              to="/owner/bookings"
              className={navClass}
            >
              <ClipboardList size={18} />
              Bookings
            </NavLink>

          </nav>


          {/* ================= ACCOUNT ================= */}

          <p className="mb-3 mt-9 px-4 text-[10px] font-bold tracking-[0.2em] text-white/40">
            ACCOUNT
          </p>


          <nav className="flex flex-col gap-2">

            <NavLink
              to="/owner/profile"
              className={navClass}
            >
              <UserRound size={18} />
              Profile
            </NavLink>

          </nav>


          {/* ================= LOGOUT ================= */}

          <div className="mt-auto border-t border-white/10 pt-5">

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("hallmateOwner");
                sessionStorage.removeItem("hallmateOwner");
                navigate("/owner/sign-in");
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >

              <LogOut size={18} />

              Sign Out

            </button>

          </div>

        </div>

      </aside>


      {/* =====================================================
          OWNER PAGE CONTENT
      ====================================================== */}

      <main className="ml-[220px] min-h-screen pt-[86px]">

        <Outlet />

      </main>

    </div>
  );
}