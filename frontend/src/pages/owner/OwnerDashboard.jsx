import {
  MapPin,
  Users,
  IndianRupee,
  CalendarDays,
  ClipboardList,
  CheckCircle2,
  Clock3,
  XCircle,
  ArrowRight,
  Building2,
  LogOut,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OwnerDashboard() {
  const navigate = useNavigate();

  const [owner, setOwner] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [ownerHalls, setOwnerHalls] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  // =====================================================
  // GET LOGGED-IN OWNER
  // =====================================================

  useEffect(() => {
    const savedOwner =
      localStorage.getItem("hallmateOwner") ||
      sessionStorage.getItem("hallmateOwner");

    if (!savedOwner) {
      navigate("/owner/sign-in");
      return;
    }

    try {
      const parsedOwner = JSON.parse(savedOwner);

      if (!parsedOwner?.id || parsedOwner.role !== "owner") {
        navigate("/owner/sign-in");
        return;
      }

      setOwner(parsedOwner);
    } catch (err) {
      console.error("Owner session error:", err);
      navigate("/owner/sign-in");
    }
  }, [navigate]);

  // =====================================================
  // LOAD OWNER DASHBOARD
  // =====================================================

  const loadDashboard = async () => {
    if (!owner?.id) return;

    setLoading(true);
    setError("");

    try {
      const [dashboardResponse, hallsResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/owner/${owner.id}/dashboard`),
        fetch("http://localhost:5000/api/halls"),
      ]);

      const dashboardData = await dashboardResponse.json();
      const hallsData = await hallsResponse.json();

      if (!dashboardResponse.ok || !dashboardData.success) {
        throw new Error(
          dashboardData.message || "Failed to load dashboard."
        );
      }

      if (!hallsResponse.ok || !hallsData.success) {
        throw new Error(
          hallsData.message || "Failed to load halls."
        );
      }

      setDashboard(dashboardData);

      // Only halls belonging to the logged-in owner.
      const myHalls = (hallsData.halls || []).filter(
        (hall) => Number(hall.owner_id) === Number(owner.id)
      );

      setOwnerHalls(myHalls);
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError(
        err.message || "Unable to load your dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (owner?.id) {
      loadDashboard();
    }
  }, [owner]);

  // =====================================================
  // FORMATTERS
  // =====================================================

  const formatCurrency = (value) => {
    const amount = Number(value || 0);

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "CU";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const statusConfig = (status) => {
    if (status === "Accepted") {
      return {
        icon: CheckCircle2,
        className: "bg-[#EAF7EF] text-[#16834A]",
      };
    }

    if (status === "Rejected") {
      return {
        icon: XCircle,
        className: "bg-[#FDECEC] text-[#C24141]",
      };
    }

    return {
      icon: Clock3,
      className: "bg-[#FFF5DD] text-[#C6922E]",
    };
  };

  // =====================================================
  // ACCEPT / REJECT BOOKING
  // =====================================================

  const updateBookingStatus = async (bookingId, status) => {
    const action =
      status === "Accepted" ? "accept" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this booking request?`
    );

    if (!confirmed) return;

    setActionLoading(`${bookingId}-${status}`);

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update booking."
        );
      }

      // Reload the dashboard so stats + booking list stay accurate.
      await loadDashboard();
    } catch (err) {
      console.error("Booking status error:", err);

      window.alert(
        err.message || "Unable to update this booking."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("hallmateOwner");
    sessionStorage.removeItem("hallmateOwner");

    navigate("/owner/sign-in");
  };

  // =====================================================
  // DATA
  // =====================================================

  const stats = dashboard?.stats || {};

  const recentBookings = dashboard?.recentBookings || [];

  const displayedHalls = useMemo(() => {
    return ownerHalls.slice(0, 4);
  }, [ownerHalls]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && !dashboard) {
    return (
      <div className="flex min-h-[calc(100vh-90px)] items-center justify-center bg-[#F8F6F0] px-6">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B2742]">
            <RefreshCw
              size={25}
              className="animate-spin text-[#D9A441]"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#0B2742]">
            Loading your dashboard
          </h2>

          <p className="mt-2 text-sm text-[#718096]">
            Please wait while we fetch your hall information.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && !dashboard) {
    return (
      <div className="flex min-h-[calc(100vh-90px)] items-center justify-center bg-[#F8F6F0] px-6">
        <div className="w-full max-w-lg rounded-2xl border border-[#E8E3D8] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDECEC]">
            <XCircle
              size={25}
              className="text-[#C24141]"
            />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-[#0B2742]">
            Unable to load dashboard
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#718096]">
            {error}
          </p>

          <button
            type="button"
            onClick={loadDashboard}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B2742] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#123A5B]"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F8F6F0]">

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[1280px] px-6 py-8 lg:px-10">

        {/* =====================================================
            WELCOME
        ===================================================== */}

        <section className="mb-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#C6922E]">
                OWNER DASHBOARD
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0B2742] md:text-4xl">
                {getGreeting()}, {owner?.name?.split(" ")[0] || "Owner"} 👋
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#718096]">
                Here's what's happening with your halls and
                booking requests.
              </p>
            </div>

            <div className="rounded-xl border border-[#E8E3D8] bg-white px-4 py-3">
              <p className="text-xs text-[#718096]">
                Your halls
              </p>

              <p className="mt-1 text-lg font-bold text-[#0B2742]">
                {ownerHalls.length}
              </p>
            </div>

          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-[#E8E3D8] bg-white px-4 py-3 text-sm text-[#C24141]">
              {error}
            </div>
          )}

        </section>

        {/* =====================================================
            STAT CARDS
        ===================================================== */}

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL BOOKINGS */}

          <div className="group rounded-2xl border border-[#E8E3D8] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-[#718096]">
                  Total Bookings
                </p>

                <h2 className="mt-3 text-3xl font-bold text-[#0B2742]">
                  {stats.totalBookings ?? 0}
                </h2>

                <p className="mt-2 text-xs text-[#9AA8B8]">
                  Across your halls
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7F1E4]">
                <ClipboardList
                  size={21}
                  className="text-[#C6922E]"
                />
              </div>

            </div>

          </div>

          {/* PENDING */}

          <div className="group rounded-2xl border border-[#E8E3D8] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-[#718096]">
                  Pending Requests
                </p>

                <h2 className="mt-3 text-3xl font-bold text-[#0B2742]">
                  {stats.pendingRequests ?? 0}
                </h2>

                <p className="mt-2 text-xs text-[#9AA8B8]">
                  Need your attention
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF7E5]">
                <Clock3
                  size={21}
                  className="text-[#C6922E]"
                />
              </div>

            </div>

          </div>

          {/* ACCEPTED */}

          <div className="group rounded-2xl border border-[#E8E3D8] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-[#718096]">
                  Accepted Bookings
                </p>

                <h2 className="mt-3 text-3xl font-bold text-[#0B2742]">
                  {Math.max(
                    0,
                    Number(stats.totalBookings || 0) -
                      Number(stats.pendingRequests || 0)
                  )}
                </h2>

                <p className="mt-2 text-xs text-[#9AA8B8]">
                  Confirmed requests
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDF8F1]">
                <CheckCircle2
                  size={21}
                  className="text-[#16834A]"
                />
              </div>

            </div>

          </div>

          {/* REVENUE */}

          <div className="group rounded-2xl border border-[#E8E3D8] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-[#718096]">
                  This Month
                </p>

                <h2 className="mt-3 text-3xl font-bold text-[#0B2742]">
                  {formatCurrency(stats.monthlyRevenue)}
                </h2>

                <p className="mt-2 text-xs text-[#9AA8B8]">
                  Accepted bookings
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDF8F1]">
                <IndianRupee
                  size={21}
                  className="text-[#16834A]"
                />
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            YOUR HALLS
        ===================================================== */}

        <section className="mt-7 rounded-2xl border border-[#E8E3D8] bg-white p-7 shadow-sm">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-[#C6922E]">
                YOUR VENUES
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#0B2742]">
                Your Halls
              </h2>

              <p className="mt-1 text-sm text-[#718096]">
                Halls currently managed by {owner?.name}.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-[#F8F6F0] px-4 py-2 text-xs font-semibold text-[#53677A]">
              <Building2 size={15} />
              {ownerHalls.length} halls
            </div>

          </div>

          {ownerHalls.length === 0 ? (

            <div className="mt-6 rounded-xl border border-dashed border-[#D8D1C3] bg-[#FCFBF8] px-6 py-10 text-center">
              <Building2
                size={30}
                className="mx-auto text-[#C6922E]"
              />

              <p className="mt-3 font-semibold text-[#0B2742]">
                No halls assigned yet
              </p>

              <p className="mt-1 text-sm text-[#718096]">
                Your assigned halls will appear here.
              </p>
            </div>

          ) : (

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

              {displayedHalls.map((hall) => (

                <div
                  key={hall.id}
                  className="overflow-hidden rounded-xl border border-[#E8E3D8] bg-[#FCFBF8] transition hover:border-[#D8C49A] hover:shadow-sm"
                >

                  <div className="relative h-36 overflow-hidden bg-[#0B2742]">

                    {hall.image ? (
                      <img
                        src={hall.image}
                        alt={hall.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Building2
                          size={34}
                          className="text-[#D9A441]"
                        />
                      </div>
                    )}

                    <div className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#16834A]">
                      Active
                    </div>

                  </div>

                  <div className="p-4">

                    <h3 className="truncate font-bold text-[#0B2742]">
                      {hall.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-[#718096]">
                      <MapPin size={14} className="text-[#C6922E]" />
                      <span className="truncate">
                        {hall.location}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#E8E3D8] pt-3">

                      <div className="flex items-center gap-1.5 text-xs text-[#718096]">
                        <Users size={14} />
                        {hall.capacity} guests
                      </div>

                      <p className="text-sm font-bold text-[#0B2742]">
                        {formatCurrency(hall.price_per_day)}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

          {ownerHalls.length > 4 && (
            <div className="mt-5 border-t border-[#EEE9DF] pt-5 text-center">

              <button
                type="button"
                onClick={() => navigate("/owner/my-hall")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#C6922E] transition hover:text-[#A87820]"
              >
                View all {ownerHalls.length} halls
                <ArrowRight size={16} />
              </button>

            </div>
          )}

        </section>

        {/* =====================================================
            BOOKING REQUESTS
        ===================================================== */}

        <section className="mt-7 rounded-2xl border border-[#E8E3D8] bg-white p-7 shadow-sm">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-[#C6922E]">
                ACTIVITY
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#0B2742]">
                Recent Booking Requests
              </h2>

              <p className="mt-1 text-sm text-[#718096]">
                Review customer requests and respond to bookings.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/owner/bookings")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#C6922E] transition hover:text-[#A87820]"
            >
              View all
              <ArrowRight size={16} />
            </button>

          </div>

          {recentBookings.length === 0 ? (

            <div className="mt-6 rounded-xl border border-dashed border-[#D8D1C3] bg-[#FCFBF8] px-6 py-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F1E4]">
                <ClipboardList
                  size={26}
                  className="text-[#C6922E]"
                />
              </div>

              <h3 className="mt-4 font-bold text-[#0B2742]">
                No booking requests yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718096]">
                Customer booking requests for your halls will
                appear here.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-3">

              {recentBookings.map((booking) => {

                const config = statusConfig(booking.status);
                const StatusIcon = config.icon;

                const isPending =
                  booking.status === "Pending";

                return (
                  <div
                    key={booking.id}
                    className="rounded-xl border border-[#EEE9DF] bg-[#FCFBF8] p-4 transition hover:border-[#D8C49A]"
                  >

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                      {/* CUSTOMER */}

                      <div className="flex min-w-0 flex-1 items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F7F1E4] text-xs font-bold text-[#C6922E]">
                          {getInitials(booking.customer_name)}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-bold text-[#0B2742]">
                            {booking.customer_name}
                          </p>

                          <p className="mt-1 truncate text-xs text-[#718096]">
                            {booking.hall_name}
                          </p>

                        </div>

                      </div>

                      {/* EVENT DETAILS */}

                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-4 lg:w-[470px]">

                        <div>
                          <p className="text-[#9AA8B8]">
                            Event date
                          </p>
                          <p className="mt-1 font-semibold text-[#0B2742]">
                            {formatDate(booking.event_date)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[#9AA8B8]">
                            Event
                          </p>
                          <p className="mt-1 font-semibold text-[#0B2742]">
                            {booking.event_type}
                          </p>
                        </div>

                        <div>
                          <p className="text-[#9AA8B8]">
                            Guests
                          </p>
                          <p className="mt-1 font-semibold text-[#0B2742]">
                            {booking.guests}
                          </p>
                        </div>

                        <div>
                          <p className="text-[#9AA8B8]">
                            Amount
                          </p>
                          <p className="mt-1 font-semibold text-[#0B2742]">
                            {formatCurrency(booking.price)}
                          </p>
                        </div>

                      </div>

                      {/* STATUS + ACTION */}

                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
                        >
                          <StatusIcon size={14} />
                          {booking.status}
                        </span>

                        {isPending && (
                          <>
                            <button
                              type="button"
                              disabled={
                                actionLoading !== null
                              }
                              onClick={() =>
                                updateBookingStatus(
                                  booking.id,
                                  "Accepted"
                                )
                              }
                              className="rounded-lg bg-[#0B2742] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#123A5B] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {actionLoading ===
                              `${booking.id}-Accepted`
                                ? "Accepting..."
                                : "Accept"}
                            </button>

                            <button
                              type="button"
                              disabled={
                                actionLoading !== null
                              }
                              onClick={() =>
                                updateBookingStatus(
                                  booking.id,
                                  "Rejected"
                                )
                              }
                              className="rounded-lg border border-[#E5D3D3] bg-white px-3.5 py-2 text-xs font-bold text-[#C24141] transition hover:bg-[#FDECEC] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {actionLoading ===
                              `${booking.id}-Rejected`
                                ? "Rejecting..."
                                : "Reject"}
                            </button>
                          </>
                        )}

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </section>

        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <section className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">

          <button
            type="button"
            onClick={() => navigate("/owner/availability")}
            className="group rounded-2xl border border-[#E8E3D8] bg-[#0B2742] p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-[#123A5B] hover:shadow-md"
          >

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <CalendarDays
                  size={21}
                  className="text-[#D9A441]"
                />
              </div>

              <ArrowRight
                size={19}
                className="text-white/50 transition group-hover:translate-x-1 group-hover:text-[#D9A441]"
              />

            </div>

            <h3 className="mt-5 font-bold text-white">
              Update Availability
            </h3>

            <p className="mt-1 text-sm leading-5 text-white/60">
              Keep your hall availability up to date.
            </p>

          </button>

          <button
            type="button"
            onClick={() => navigate("/owner/bookings")}
            className="group rounded-2xl border border-[#E8E3D8] bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#D8C49A] hover:shadow-md"
          >

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7F1E4]">
                <ClipboardList
                  size={21}
                  className="text-[#C6922E]"
                />
              </div>

              <ChevronRight
                size={19}
                className="text-[#9AA8B8] transition group-hover:translate-x-1 group-hover:text-[#C6922E]"
              />

            </div>

            <h3 className="mt-5 font-bold text-[#0B2742]">
              Manage Bookings
            </h3>

            <p className="mt-1 text-sm leading-5 text-[#718096]">
              Review all customer booking requests.
            </p>

          </button>

          <button
            type="button"
            onClick={() => navigate("/owner/my-hall")}
            className="group rounded-2xl border border-[#E8E3D8] bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#D8C49A] hover:shadow-md"
          >

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7F1E4]">
                <Building2
                  size={21}
                  className="text-[#C6922E]"
                />
              </div>

              <ChevronRight
                size={19}
                className="text-[#9AA8B8] transition group-hover:translate-x-1 group-hover:text-[#C6922E]"
              />

            </div>

            <h3 className="mt-5 font-bold text-[#0B2742]">
              Manage My Halls
            </h3>

            <p className="mt-1 text-sm leading-5 text-[#718096]">
              View and manage your assigned halls.
            </p>

          </button>

        </section>

        {/* =====================================================
            FOOTER NOTE
        ===================================================== */}

        <div className="py-8 text-center">
          <p className="text-xs text-[#9AA8B8]">
            HallMate Owner Portal · Manage your venues with ease
          </p>
        </div>

      </main>
    </div>
  );
}