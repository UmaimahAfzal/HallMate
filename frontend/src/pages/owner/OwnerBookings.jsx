import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  RefreshCw,
  Search,
  Users,
  X,
  XCircle,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function OwnerBookings() {
  const navigate = useNavigate();

  const [owner, setOwner] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [confirmModal, setConfirmModal] = useState({
  open: false,
  bookingId: null,
  status: null,
});

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
  // LOAD OWNER BOOKINGS
  // =====================================================

  const loadBookings = async () => {
    if (!owner?.id) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/bookings/owner/${owner.id}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load bookings."
        );
      }

      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Owner bookings loading error:", err);

      setError(
        err.message ||
          "Unable to load bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (owner?.id) {
      loadBookings();
    }
  }, [owner]);

  // =====================================================
  // FILTER BOOKINGS
  // =====================================================

  const filteredBookings = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus =
        statusFilter === "All" ||
        booking.status === statusFilter;

      if (!matchesStatus) return false;

      if (!searchText) return true;

      return (
        String(booking.customer_name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(booking.hall_name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(booking.hall_location || "")
          .toLowerCase()
          .includes(searchText) ||
        String(booking.booking_reference || "")
          .toLowerCase()
          .includes(searchText) ||
        String(booking.event_type || "")
          .toLowerCase()
          .includes(searchText)
      );
    });
  }, [bookings, search, statusFilter]);

  // =====================================================
  // COUNTS
  // =====================================================

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const acceptedBookings = bookings.filter(
    (booking) => booking.status === "Accepted"
  ).length;

  const rejectedBookings = bookings.filter(
    (booking) => booking.status === "Rejected"
  ).length;

  // =====================================================
  // ACCEPT / REJECT
  // =====================================================

  const updateBookingStatus = async (
  bookingId,
  status
) => {
  setConfirmModal({
    open: true,
    bookingId,
    status,
  });
};

const confirmBookingStatus = async () => {
  const { bookingId, status } = confirmModal;

  setConfirmModal({
    open: false,
    bookingId: null,
    status: null,
  });

  setUpdatingId(bookingId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/status`,
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
          data.message ||
            "Unable to update booking."
        );
      }

      setBookings((prev) =>
        prev.map((booking) =>
          Number(booking.id) === Number(bookingId)
            ? {
                ...booking,
                status,
              }
            : booking
        )
      );
    } catch (err) {
      console.error(
        "Booking status update error:",
        err
      );

      setError(
        err.message ||
          "Unable to update booking. Please try again."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-90px)] items-center justify-center bg-[#F8F6F0] px-6">
        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B2742]">
            <RefreshCw
              size={24}
              className="animate-spin text-[#D9A441]"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#0B2742]">
            Loading bookings
          </h2>

          <p className="mt-2 text-sm text-[#718096]">
            Fetching your customer requests...
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F8F6F0]">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="border-b border-[#DDD6C9] bg-white">

        <div className="mx-auto max-w-[1280px] px-6 py-7 lg:px-10">

          <button
            type="button"
            onClick={() =>
              navigate("/owner/dashboard")
            }
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#53677A] transition hover:text-[#0B2742]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="text-xs font-bold tracking-[0.2em] text-[#C6922E]">
                BOOKING MANAGEMENT
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0B2742] md:text-4xl">
                Bookings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#53677A]">
                Review customer booking requests for your
                halls and manage them from one place.
              </p>

            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#E2D8C7] bg-[#FBF7EE] px-4 py-3">

              <CalendarDays
                size={19}
                className="text-[#C6922E]"
              />

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8B7A60]">
                  Total Requests
                </p>

                <p className="text-lg font-bold text-[#0B2742]">
                  {totalBookings}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-[1280px] px-6 py-8 lg:px-10">

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#F0CACA] bg-[#FFF6F6] p-4">

            <XCircle
              size={20}
              className="mt-0.5 shrink-0 text-[#C24141]"
            />

            <div className="flex-1">

              <p className="text-sm font-bold text-[#8F2D2D]">
                Something went wrong
              </p>

              <p className="mt-1 text-sm text-[#A85C5C]">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-[#A85C5C] hover:text-[#8F2D2D]"
            >
              <X size={17} />
            </button>

          </div>
        )}

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-[#DDD6C9] bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-[#53677A]">
                  Total Bookings
                </p>

                <p className="mt-2 text-3xl font-bold text-[#0B2742]">
                  {totalBookings}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7F0E2]">
                <CalendarDays
                  size={21}
                  className="text-[#C6922E]"
                />
              </div>

            </div>

            <p className="mt-3 text-xs text-[#718096]">
              Across your halls
            </p>

          </div>

          {/* PENDING */}

          <div className="rounded-2xl border border-[#DDD6C9] bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-[#53677A]">
                  Pending Requests
                </p>

                <p className="mt-2 text-3xl font-bold text-[#0B2742]">
                  {pendingBookings}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF4DB]">
                <Clock3
                  size={21}
                  className="text-[#C6922E]"
                />
              </div>

            </div>

            <p className="mt-3 text-xs text-[#718096]">
              Need your attention
            </p>

          </div>

          {/* ACCEPTED */}

          <div className="rounded-2xl border border-[#DDD6C9] bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-[#53677A]">
                  Accepted
                </p>

                <p className="mt-2 text-3xl font-bold text-[#0B2742]">
                  {acceptedBookings}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F7EE]">
                <CheckCircle2
                  size={21}
                  className="text-[#16834A]"
                />
              </div>

            </div>

            <p className="mt-3 text-xs text-[#718096]">
              Confirmed bookings
            </p>

          </div>

          {/* REJECTED */}

          <div className="rounded-2xl border border-[#DDD6C9] bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-[#53677A]">
                  Rejected
                </p>

                <p className="mt-2 text-3xl font-bold text-[#0B2742]">
                  {rejectedBookings}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDECEC]">
                <XCircle
                  size={21}
                  className="text-[#C24141]"
                />
              </div>

            </div>

            <p className="mt-3 text-xs text-[#718096]">
              Declined requests
            </p>

          </div>

        </div>

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <section className="mt-7 rounded-2xl border border-[#DDD6C9] bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row">

            {/* SEARCH */}

            <div className="relative flex-1">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8996A4]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search customer, hall, event or booking reference..."
                className="h-12 w-full rounded-xl border border-[#D9D1C3] bg-white pl-11 pr-4 text-sm text-[#0B2742] outline-none transition placeholder:text-[#9AA8B8] focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
              />

            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="h-12 rounded-xl border border-[#D9D1C3] bg-white px-4 text-sm font-semibold text-[#0B2742] outline-none transition focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10 lg:w-[190px]"
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Accepted">
                Accepted
              </option>

              <option value="Rejected">
                Rejected
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

            </select>

            {/* REFRESH */}

            <button
              type="button"
              onClick={loadBookings}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#D9D1C3] bg-white px-5 text-sm font-bold text-[#0B2742] transition hover:border-[#C6922E] hover:text-[#C6922E]"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

          </div>

          <div className="mt-4 text-xs font-medium text-[#718096]">
            Showing{" "}
            <span className="font-bold text-[#0B2742]">
              {filteredBookings.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[#0B2742]">
              {totalBookings}
            </span>{" "}
            bookings
          </div>

        </section>

        {/* =================================================
            BOOKINGS
        ================================================= */}

        <section className="mt-6">

          {filteredBookings.length === 0 ? (

            <div className="rounded-2xl border border-[#DDD6C9] bg-white px-6 py-16 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7F0E2]">

                <CalendarDays
                  size={28}
                  className="text-[#C6922E]"
                />

              </div>

              <h2 className="mt-5 text-xl font-bold text-[#0B2742]">
                {totalBookings === 0
                  ? "No bookings yet"
                  : "No bookings found"}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718096]">

                {totalBookings === 0
                  ? "When customers submit booking requests for your halls, they will appear here for you to review."
                  : "Try changing your search or status filter to find the booking you are looking for."}

              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {filteredBookings.map((booking) => (

                <BookingCard
                  key={booking.id}
                  booking={booking}
                  updating={
                    Number(updatingId) ===
                    Number(booking.id)
                  }
                  onUpdateStatus={
                    updateBookingStatus
                  }
                />

              ))}

            </div>

          )}

        </section>
{/* CONFIRMATION MODAL */}
{confirmModal.open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2239]/55 px-4 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-3xl border border-[#E2D8C7] bg-white p-7 shadow-2xl">

      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
          confirmModal.status === "Accepted"
            ? "bg-[#E8F7EE]"
            : "bg-[#FDECEC]"
        }`}
      >
        {confirmModal.status === "Accepted" ? (
          <CheckCircle2
            size={30}
            className="text-[#16834A]"
          />
        ) : (
          <XCircle
            size={30}
            className="text-[#C24141]"
          />
        )}
      </div>

      <div className="mt-5 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C6922E]">
          Booking Request
        </p>

        <h2 className="mt-2 text-2xl font-bold text-[#0B2742]">
          {confirmModal.status === "Accepted"
            ? "Accept this booking?"
            : "Reject this booking?"}
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#718096]">
          {confirmModal.status === "Accepted"
            ? "The customer will be notified that their booking request has been accepted."
            : "The customer will be notified that their booking request has been rejected."}
        </p>
      </div>

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() =>
            setConfirmModal({
              open: false,
              bookingId: null,
              status: null,
            })
          }
          className="flex h-11 flex-1 items-center justify-center rounded-xl border border-[#D9D1C3] bg-white px-5 text-sm font-bold text-[#53677A] transition hover:bg-[#F8F6F0]"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={confirmBookingStatus}
          className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-white transition ${
            confirmModal.status === "Accepted"
              ? "bg-[#16834A] hover:bg-[#126E3E]"
              : "bg-[#C24141] hover:bg-[#A93434]"
          }`}
        >
          {confirmModal.status === "Accepted" ? (
            <>
              <Check size={17} />
              Accept Booking
            </>
          ) : (
            <>
              <X size={17} />
              Reject Booking
            </>
          )}
        </button>
      </div>

    </div>
  </div>
)}
      </main>

    </div>
  );
}

// =========================================================
// BOOKING CARD
// =========================================================

function BookingCard({
  booking,
  updating,
  onUpdateStatus,
}) {
  const isPending =
    booking.status === "Pending";

  const isAccepted =
    booking.status === "Accepted";

  const isRejected =
    booking.status === "Rejected";

  return (
    <article className="overflow-hidden rounded-2xl border border-[#DDD6C9] bg-white shadow-sm">

      {/* TOP */}

      <div className="flex flex-col gap-5 border-b border-[#EAE4D9] p-5 lg:flex-row lg:items-start lg:justify-between lg:px-6 lg:py-5">

        {/* CUSTOMER */}

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0B2742] text-lg font-bold text-[#D9A441]">
            {getInitials(
              booking.customer_name
            )}
          </div>

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h2 className="text-lg font-bold text-[#0B2742]">
                {booking.customer_name ||
                  "Customer"}
              </h2>

              <StatusBadge
                status={booking.status}
              />

            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#718096]">

              {booking.booking_reference && (
                <span>
                  Ref:{" "}
                  <span className="font-semibold text-[#53677A]">
                    {booking.booking_reference}
                  </span>
                </span>
              )}

              {booking.customer_email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={13} />
                  {booking.customer_email}
                </span>
              )}

            </div>

          </div>

        </div>

        {/* DATE */}

        <div className="flex items-center gap-3 rounded-xl border border-[#E5DED1] bg-[#FBF8F2] px-4 py-3 lg:min-w-[190px]">

          <CalendarDays
            size={19}
            className="text-[#C6922E]"
          />

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8B7A60]">
              Event Date
            </p>

            <p className="mt-0.5 text-sm font-bold text-[#0B2742]">
              {formatDate(
                booking.event_date
              )}
            </p>

          </div>

        </div>

      </div>

      {/* DETAILS */}

      <div className="grid gap-0 divide-y divide-[#EAE4D9] md:grid-cols-4 md:divide-x md:divide-y-0">

        {/* HALL */}

        <div className="p-5 lg:px-6">

          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8B7A60]">
            Hall
          </p>

          <p className="mt-2 text-sm font-bold text-[#0B2742]">
            {booking.hall_name ||
              "Hall"}
          </p>

          {booking.hall_location && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#718096]">
              <MapPin
                size={13}
                className="text-[#C6922E]"
              />
              {booking.hall_location}
            </p>
          )}

        </div>

        {/* EVENT */}

        <div className="p-5 lg:px-6">

          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8B7A60]">
            Event
          </p>

          <p className="mt-2 text-sm font-bold text-[#0B2742]">
            {booking.event_type ||
              "Event"}
          </p>

        </div>

        {/* GUESTS */}

        <div className="p-5 lg:px-6">

          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8B7A60]">
            Guests
          </p>

          <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#0B2742]">
            <Users
              size={16}
              className="text-[#C6922E]"
            />
            {booking.guests}
          </p>

        </div>

        {/* PRICE */}

        <div className="p-5 lg:px-6">

          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8B7A60]">
            Booking Value
          </p>

          <p className="mt-2 text-lg font-bold text-[#0B2742]">
            {formatCurrency(
              booking.price
            )}
          </p>

        </div>

      </div>

      {/* REQUIREMENTS */}

      {booking.special_requirements && (
        <div className="border-t border-[#EAE4D9] bg-[#FCFAF5] px-5 py-4 lg:px-6">

          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8B7A60]">
            Special Requirements
          </p>

          <p className="mt-1.5 text-sm leading-6 text-[#53677A]">
            {booking.special_requirements}
          </p>

        </div>
      )}

      {/* ACTIONS */}

      {isPending && (
        <div className="flex flex-col gap-3 border-t border-[#EAE4D9] bg-[#FFFCF7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">

          <div className="flex items-center gap-2 text-xs font-semibold text-[#8B7A60]">
            <Clock3 size={15} />
            This request is waiting for your response.
          </div>

          <div className="flex gap-3">

            <button
              type="button"
              disabled={updating}
              onClick={() =>
                onUpdateStatus(
                  booking.id,
                  "Rejected"
                )
              }
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#D9BABA] bg-white px-5 text-sm font-bold text-[#A13A3A] transition hover:bg-[#FFF5F5] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {updating ? (
                <RefreshCw
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <X size={16} />
              )}

              Reject

            </button>

            <button
              type="button"
              disabled={updating}
              onClick={() =>
                onUpdateStatus(
                  booking.id,
                  "Accepted"
                )
              }
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#16834A] px-5 text-sm font-bold text-white transition hover:bg-[#126E3E] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {updating ? (
                <RefreshCw
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Check size={16} />
              )}

              Accept

            </button>

          </div>

        </div>
      )}

      {/* ACCEPTED MESSAGE */}

      {isAccepted && (
        <div className="flex items-center gap-3 border-t border-[#D7ECDD] bg-[#F3FBF6] px-5 py-4 lg:px-6">

          <CheckCircle2
            size={19}
            className="text-[#16834A]"
          />

          <p className="text-sm font-semibold text-[#17663C]">
            This booking has been accepted.
            The customer has been notified.
          </p>

        </div>
      )}

      {/* REJECTED MESSAGE */}

      {isRejected && (
        <div className="flex items-center gap-3 border-t border-[#F0D5D5] bg-[#FFF7F7] px-5 py-4 lg:px-6">

          <XCircle
            size={19}
            className="text-[#C24141]"
          />

          <p className="text-sm font-semibold text-[#8F2D2D]">
            This booking request was rejected.
            The customer has been notified.
          </p>

        </div>
      )}

      {/* CANCELLED MESSAGE */}

      {booking.status === "Cancelled" && (
        <div className="flex items-center gap-3 border-t border-[#E4E0D8] bg-[#F8F7F4] px-5 py-4 lg:px-6">

          <XCircle
            size={19}
            className="text-[#718096]"
          />

          <p className="text-sm font-semibold text-[#53677A]">
            This booking has been cancelled.
          </p>

        </div>
      )}

    </article>
  );
}

// =========================================================
// STATUS BADGE
// =========================================================

function StatusBadge({ status }) {
  if (status === "Accepted") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7F6ED] px-3 py-1 text-[11px] font-bold text-[#16834A]">
        <CheckCircle2 size={13} />
        Accepted
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDECEC] px-3 py-1 text-[11px] font-bold text-[#A13A3A]">
        <XCircle size={13} />
        Rejected
      </span>
    );
  }

  if (status === "Cancelled") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECECEC] px-3 py-1 text-[11px] font-bold text-[#66717D]">
        <XCircle size={13} />
        Cancelled
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3D9] px-3 py-1 text-[11px] font-bold text-[#A46D13]">
      <Clock3 size={13} />
      Pending
    </span>
  );
}

// =========================================================
// HELPERS
// =========================================================

function getInitials(name) {
  if (!name) return "C";

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "₹0";
  }

  return `₹${number.toLocaleString("en-IN")}`;
}