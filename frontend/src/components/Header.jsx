import {
  MoreHorizontal,
  UserRound,
  Bell,
  Menu,
  X,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
  const checkNotifications = async () => {
    try {
      const savedUser =
        localStorage.getItem("hallmateUser") ||
        sessionStorage.getItem("hallmateUser");

      if (!savedUser) {
        setHasUnreadNotifications(false);
        return;
      }

      const user = JSON.parse(savedUser);

      if (!user?.id) {
        setHasUnreadNotifications(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/notifications/${user.id}`
      );

      const data = await response.json();

      if (data.success) {
        const unread = (data.notifications || []).some(
          (notification) => !notification.is_read
        );

        setHasUnreadNotifications(unread);
      }
    } catch (error) {
      console.error("Notification check failed:", error);
    }
  };

  checkNotifications();

  const interval = setInterval(checkNotifications, 5000);

  return () => clearInterval(interval);
}, []);

  const navClass = ({ isActive }) =>
    `text-[15px] font-semibold transition-colors ${
      isActive
        ? "text-[#C6922E]"
        : "text-[#0B2742] hover:text-[#C6922E]"
    }`;

  const mobileNavClass = ({ isActive }) =>
    `py-2 font-semibold transition-colors ${
      isActive
        ? "text-[#C6922E]"
        : "text-[#0B2742]"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">

      <div className="mx-auto flex h-[90px] max-w-[1280px] items-center justify-between px-6 lg:px-10">

        {/* BRAND */}
        <NavLink
          to="/"
          className="flex items-center gap-3"
          onClick={() => {
            setMenuOpen(false);
            setMoreOpen(false);
          }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B2742]">
            <span className="text-2xl font-bold text-[#C6922E]">
              H
            </span>
          </div>

          <div className="flex flex-col leading-none">

            <span className="text-[26px] font-bold tracking-tight text-[#0B2742]">
              Hall<span className="text-[#C6922E]">Mate</span>
            </span>

            <span className="mt-1 text-[11px] font-semibold tracking-[0.22em] text-[#0B2742]">
              SMART VENUE BOOKING
            </span>

          </div>
        </NavLink>


        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-10 md:flex">

          <NavLink
            to="/"
            end
            className={navClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/explore"
            className={navClass}
          >
            Explore Halls
          </NavLink>

          <NavLink
            to="/my-bookings"
            className={navClass}
          >
            My Bookings
          </NavLink>

          <NavLink
            to="/ai-assistant"
            className={navClass}
          >
            AI Assistant
          </NavLink>

          <NavLink
            to="/how-it-works"
            className={navClass}
          >
            How It Works
          </NavLink>

        </nav>


        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 md:flex">

          {/* THREE DOTS */}
          <div className="relative">

            <button
              type="button"
              aria-label="More options"
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#0B2742] transition hover:bg-[#F7F4ED]"
            >
              <MoreHorizontal size={22} />
            </button>


            {/* THREE DOTS MENU */}
            {moreOpen && (
              <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-xl border border-[#E8E3D8] bg-white p-2 shadow-lg">

                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    navigate("/owner/sign-in");
                  }}
                  className="w-full rounded-lg px-4 py-3 text-left text-sm font-semibold text-[#0B2742] transition hover:bg-[#F7F4ED] hover:text-[#C6922E]"
                >
                  Hall Owner
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    navigate("/admin/sign-in");
                  }}
                  className="w-full rounded-lg px-4 py-3 text-left text-sm font-semibold text-[#0B2742] transition hover:bg-[#F7F4ED] hover:text-[#C6922E]"
                >
                  Super Admin
                </button>

              </div>
            )}

          </div>


          {/* NOTIFICATIONS */}
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => navigate("/notifications")}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-[#0B2742] transition hover:bg-[#F7F4ED]"
          >
            <Bell size={20} />

            {/* Notification dot */}
           {hasUnreadNotifications && (
  <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full bg-[#C6922E]" />
)}
          </button>


          {/* PROFILE */}
          <button
            type="button"
            aria-label="Account"
            onClick={() => navigate("/profile")}
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#0B2742] transition hover:bg-[#F7F4ED]"
          >
            <UserRound size={20} />
          </button>


          {/* SIGN IN */}
          <NavLink
            to="/sign-in"
            className="flex h-12 items-center justify-center rounded-lg bg-[#0B2742] px-7 text-[15px] font-semibold text-white transition hover:bg-[#173A5C]"
          >
            Sign In
          </NavLink>

        </div>


        {/* MOBILE BUTTON */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-[#0B2742] md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? (
            <X size={25} />
          ) : (
            <Menu size={25} />
          )}
        </button>

      </div>


      {/* MOBILE NAV */}
      {menuOpen && (
        <div className="border-t border-[#E8E3D8] bg-white px-6 py-5 md:hidden">

          <div className="flex flex-col gap-4">

            <NavLink
              to="/"
              end
              className={mobileNavClass}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/explore"
              className={mobileNavClass}
              onClick={() => setMenuOpen(false)}
            >
              Explore Halls
            </NavLink>

            <NavLink
              to="/my-bookings"
              className={mobileNavClass}
              onClick={() => setMenuOpen(false)}
            >
              My Bookings
            </NavLink>

            <NavLink
              to="/ai-assistant"
              className={mobileNavClass}
              onClick={() => setMenuOpen(false)}
            >
              AI Assistant
            </NavLink>


            {/* NOTIFICATIONS */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigate("/notifications");
              }}
              className="flex items-center gap-2 py-2 text-left font-semibold text-[#0B2742] transition hover:text-[#C6922E]"
            >
              <Bell size={19} />
              Notifications
            </button>


            {/* PROFILE */}
            <button
              type="button"
              aria-label="Account"
              onClick={() => {
                setMenuOpen(false);
                navigate("/profile");
              }}
              className="flex items-center gap-2 py-2 text-left font-semibold text-[#0B2742] transition hover:text-[#C6922E]"
            >
              <UserRound size={19} />
              Profile & Settings
            </button>


            <NavLink
              to="/how-it-works"
              className={mobileNavClass}
              onClick={() => setMenuOpen(false)}
            >
              How It Works
            </NavLink>


            {/* OWNER / ADMIN OPTIONS */}
            <div className="border-t border-[#E8E3D8] pt-4">

              <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
                More
              </p>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/owner/sign-in");
                }}
                className="block w-full py-2 text-left font-semibold text-[#0B2742] transition hover:text-[#C6922E]"
              >
                Hall Owner
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/admin/sign-in");
                }}
                className="block w-full py-2 text-left font-semibold text-[#0B2742] transition hover:text-[#C6922E]"
              >
                Super Admin
              </button>

            </div>


            {/* SIGN IN */}
            <NavLink
              to="/sign-in"
              className="mt-2 flex h-11 items-center justify-center rounded-lg bg-[#0B2742] font-semibold text-white"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </NavLink>

          </div>

        </div>
      )}

    </header>
  );
}

export default Header;