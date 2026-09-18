import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle,
  ClipboardList,
  Clock3,
  CreditCard,
  Eye,
  Home,
  MapPin,
  PartyPopper,
  Phone,
  Users,
  XCircle,
} from "lucide-react";

const API_URL = "http://localhost:5000";

export default function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * =========================================================
   * LOAD REAL BOOKINGS
   * =========================================================
   */
  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const savedUser = JSON.parse(
        localStorage.getItem("hallmateUser") || "null"
      );

      if (!savedUser?.id) {
        setBookings([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/bookings/customer/${savedUser.id}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load your bookings."
        );
      }

      setBookings(data.bookings || []);
    } catch (err) {
      console.error("My bookings error:", err);
      setError(
        err.message || "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  /*
   * =========================================================
   * FORMATTERS
   * =========================================================
   */
  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(
      `${String(date).slice(0, 10)}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  /*
   * =========================================================
   * VIEW BOOKING
   * =========================================================
   */
  const openBooking = (booking) => {
    navigate(
      `/hall/${booking.hall_id}/confirmation`,
      {
        state: {
          hallId: booking.hall_id,
          date: booking.event_date,
          guests: booking.guests,
          eventType: booking.event_type,
          bookingReference:
            booking.booking_reference,
          status: booking.status,
          price: booking.price,
          hallName: booking.hall_name,
          hallImage: booking.hall_image,
          location: booking.hall_location,
          customer: {
            name: booking.customer_name,
            phone: booking.customer_phone,
            email: booking.customer_email,
          },
        },
      }
    );
  };

  /*
   * =========================================================
   * STATUS
   * =========================================================
   */
  const getStatus = (booking) => {
    const status = String(
      booking.status || "Pending"
    ).toLowerCase();

    if (status === "accepted") {
      return "accepted";
    }

    if (status === "rejected") {
      return "rejected";
    }

    return "pending";
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */
  if (loading) {
    return (
      <section className="min-h-screen bg-[#F8F6F0] px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-[1180px]">

          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#C6922E]">
            HALLMATE
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#0B2239] lg:text-4xl">
            My Bookings
          </h1>

          <div className="mt-8 rounded-2xl border border-[#E8E3D8] bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FBF3DF]">
              <Clock3
                size={30}
                className="animate-pulse text-[#C6922E]"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#0B2239]">
              Loading your bookings...
            </h2>

          </div>
        </div>
      </section>
    );
  }

  /*
   * =========================================================
   * ERROR
   * =========================================================
   */
  if (error) {
    return (
      <section className="min-h-screen bg-[#F8F6F0] px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-[1180px]">

          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#C6922E]">
            HALLMATE
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#0B2239] lg:text-4xl">
            My Bookings
          </h1>

          <div className="mt-8 rounded-2xl border border-red-200 bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <XCircle
                size={32}
                className="text-red-600"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#0B2239]">
              Unable to load bookings
            </h2>

            <p className="mt-2 text-gray-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadBookings}
              className="mt-6 rounded-xl bg-[#0B2742] px-6 py-3 font-bold text-white"
            >
              Try Again
            </button>

          </div>
        </div>
      </section>
    );
  }

  /*
   * =========================================================
   * EMPTY
   * =========================================================
   */
  if (bookings.length === 0) {
    return (
      <section className="min-h-screen bg-[#F8F6F0] px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-[1180px]">

          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#C6922E]">
            HALLMATE
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#0B2239] lg:text-4xl">
            My Bookings
          </h1>

          <p className="mt-2 max-w-[650px] leading-6 text-gray-600">
            Keep track of your hall booking requests,
            confirmations, payments, and upcoming events.
          </p>

          <div className="mt-8 rounded-2xl border border-[#E8E3D8] bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#EEF4F9]">
              <ClipboardList
                size={38}
                className="text-[#0B2742]"
              />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#0B2239]">
              No bookings yet
            </h2>

            <p className="mx-auto mt-3 max-w-[500px] leading-6 text-gray-600">
              You haven't made any hall booking requests yet.
              Explore our halls and find the perfect venue for
              your event.
            </p>

            <Link
              to="/explore"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#C6922E] px-7 py-3.5 font-bold text-white transition hover:bg-[#AD7F25]"
            >
              <Home size={18} />
              Explore Halls
            </Link>

          </div>
        </div>
      </section>
    );
  }

  /*
   * =========================================================
   * BOOKINGS
   * =========================================================
   */
  return (
    <section className="min-h-screen bg-[#F8F6F0] px-5 py-10 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-[1180px]">

        {/* HEADER */}
        <div className="mb-8">

          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#C6922E]">
            HALLMATE
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#0B2239] lg:text-4xl">
            My Bookings
          </h1>

          <p className="mt-2 max-w-[700px] leading-6 text-gray-600">
            Keep track of your hall booking requests,
            confirmations, payments, and upcoming events.
          </p>

        </div>

        <div className="space-y-7">

          {bookings.map((booking) => {

            const status = getStatus(booking);

            const isAccepted =
              status === "accepted";

            const isRejected =
              status === "rejected";

            const paymentKey =
              `hallmatePayment_${booking.booking_reference}`;

            let localPayment = null;

            try {
              localPayment = JSON.parse(
                localStorage.getItem(paymentKey) || "null"
              );
            } catch {
              localPayment = null;
            }

            const isPaid =
              booking.payment_status === "Paid" ||
              booking.payment_status === "paid" ||
              booking.paid_at ||
              localPayment?.status === "Paid";

            return (
              <div
                key={booking.id}
                className="overflow-hidden rounded-3xl border border-[#E8E3D8] bg-white shadow-sm"
              >

                {/* =================================================
                    BIG CONFIRMED HEADER
                ================================================== */}
                {isAccepted && (
                  <div className="border-b border-[#CFE7D7] bg-gradient-to-r from-[#F1FBF5] via-white to-[#FBF7ED] px-6 py-7 sm:px-8">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-5">

                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#DDF8EA]">
                          <CheckCircle
                            size={37}
                            strokeWidth={2.3}
                            className="text-[#15945A]"
                          />
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C6922E]">
                            HALLMATE BOOKING
                          </p>

                          <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-[#0B2239] sm:text-4xl">
                            BOOKING CONFIRMED
                          </h2>

                          <p className="mt-1 text-sm text-gray-600">
                            Your hall has been accepted by the owner.
                          </p>
                        </div>

                      </div>

                      {/* PAYMENT STATUS */}
                      <div
                        className={`rounded-xl px-5 py-3 text-center ${
                          isPaid
                            ? "border border-[#CFE7D7] bg-[#EAF7EF]"
                            : "border border-[#E5D7B7] bg-[#FBF7ED]"
                        }`}
                      >

                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
                          PAYMENT
                        </p>

                        <p
                          className={`mt-1 text-sm font-extrabold ${
                            isPaid
                              ? "text-[#15945A]"
                              : "text-[#C6922E]"
                          }`}
                        >
                          {isPaid
                            ? "PAYMENT COMPLETED"
                            : "PAYMENT PENDING"}
                        </p>

                      </div>

                    </div>
                  </div>
                )}

                {/* =================================================
                    PENDING HEADER
                ================================================== */}
                {!isAccepted && !isRejected && (
                  <div className="border-b border-[#E8E3D8] bg-[#FFFBF2] px-6 py-6 sm:px-8">

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF4D7]">
                        <Clock3
                          size={30}
                          className="text-[#C6922E]"
                        />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#C6922E]">
                          BOOKING REQUEST
                        </p>

                        <h2 className="mt-1 text-2xl font-extrabold text-[#0B2239]">
                          Awaiting Owner Confirmation
                        </h2>
                      </div>

                    </div>

                  </div>
                )}

                {/* =================================================
                    REJECTED HEADER
                ================================================== */}
                {isRejected && (
                  <div className="border-b border-red-100 bg-red-50 px-6 py-6 sm:px-8">

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                        <XCircle
                          size={30}
                          className="text-red-600"
                        />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-red-600">
                          BOOKING UPDATE
                        </p>

                        <h2 className="mt-1 text-2xl font-extrabold text-[#0B2239]">
                          Booking Request Rejected
                        </h2>
                      </div>

                    </div>

                  </div>
                )}

                {/* =================================================
                    BODY
                ================================================== */}
                <div className="grid lg:grid-cols-[1fr_290px]">

                  {/* DETAILS */}
                  <div className="p-6 sm:p-8">

                    <div className="flex flex-col gap-6 sm:flex-row">

                      {/* IMAGE */}
                      <div className="h-48 w-full shrink-0 overflow-hidden rounded-2xl sm:h-44 sm:w-64">

                        {booking.hall_image ? (
                          <img
                            src={booking.hall_image}
                            alt={booking.hall_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-[#0B2742]">
                            <span className="font-bold text-[#C6922E]">
                              HallMate
                            </span>
                          </div>
                        )}

                      </div>

                      {/* INFO */}
                      <div className="flex-1">

                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#C6922E]">
                          Selected Hall
                        </p>

                        <h3 className="mt-1 text-2xl font-bold text-[#0B2239]">
                          {booking.hall_name}
                        </h3>

                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <MapPin
                            size={16}
                            className="text-[#C6922E]"
                          />
                          {booking.hall_location}
                        </div>

                        {/* DETAILS GRID */}
                        <div className="mt-6 grid gap-3 sm:grid-cols-3">

                          <div className="rounded-xl bg-[#FBFAF7] p-3.5">
                            <CalendarDays
                              size={18}
                              className="text-[#C6922E]"
                            />

                            <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                              Event Date
                            </p>

                            <p className="mt-1 text-sm font-bold text-[#0B2239]">
                              {formatDate(
                                booking.event_date
                              )}
                            </p>
                          </div>

                          <div className="rounded-xl bg-[#FBFAF7] p-3.5">
                            <Users
                              size={18}
                              className="text-[#C6922E]"
                            />

                            <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                              Guests
                            </p>

                            <p className="mt-1 text-sm font-bold text-[#0B2239]">
                              {booking.guests}
                            </p>
                          </div>

                          <div className="rounded-xl bg-[#FBFAF7] p-3.5">
                            <PartyPopper
                              size={18}
                              className="text-[#C6922E]"
                            />

                            <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                              Event Type
                            </p>

                            <p className="mt-1 text-sm font-bold text-[#0B2239]">
                              {booking.event_type}
                            </p>
                          </div>

                        </div>

                      </div>

                    </div>

                    {/* REFERENCE */}
                    <div className="mt-7 flex flex-col gap-3 border-t border-[#E8E3D8] pt-5 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                          Booking Reference
                        </p>

                        <p className="mt-1 font-bold tracking-wide text-[#0B2239]">
                          {booking.booking_reference}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                          Booking Amount
                        </p>

                        <p className="mt-1 text-xl font-extrabold text-[#0B2239]">
                          {formatCurrency(booking.price)}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      RIGHT STATUS PANEL
                  ================================================== */}
                  <div className="border-t border-[#E8E3D8] bg-[#FBFAF7] p-6 lg:border-l lg:border-t-0 sm:p-8">

                    {isAccepted ? (
                      <div className="flex h-full flex-col justify-center">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DDF8EA]">
                          <CheckCircle
                            size={30}
                            className="text-[#15945A]"
                          />
                        </div>

                        <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#C6922E]">
                          STATUS
                        </p>

                        <h3 className="mt-2 text-3xl font-extrabold leading-tight text-[#0B2239]">
                          BOOKING
                          <br />
                          <span className="text-[#15945A]">
                            CONFIRMED
                          </span>
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                          Your hall booking has been confirmed
                          by the owner.
                        </p>

                        <div className="mt-5 rounded-xl border border-[#CFE7D7] bg-[#EAF7EF] p-4">

                          <div className="flex items-center gap-2 text-[#15945A]">
                            <CreditCard size={18} />

                            <span className="text-sm font-bold">
                              {isPaid
                                ? "Payment Completed"
                                : "Payment Pending"}
                            </span>
                          </div>

                          {isPaid && (
                            <p className="mt-1 text-xs text-gray-600">
                              Payment has been successfully
                              recorded.
                            </p>
                          )}

                        </div>

                        {booking.owner_phone && (
                          <a
                            href={`tel:${booking.owner_phone}`}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#C6922E] bg-white px-5 py-3.5 text-sm font-bold text-[#0B2742] transition hover:bg-[#FBF7ED]"
                          >
                            <Phone size={18} />
                            Call Owner
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            openBooking(booking)
                          }
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B2742] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#173A5C]"
                        >
                          <Eye size={18} />
                          View Booking
                          <ArrowRight size={17} />
                        </button>

                      </div>
                    ) : isRejected ? (
                      <div className="flex h-full flex-col justify-center">

                        <XCircle
                          size={38}
                          className="text-red-600"
                        />

                        <h3 className="mt-4 text-2xl font-extrabold text-[#0B2239]">
                          Booking Rejected
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          This booking request was not accepted
                          by the hall owner.
                        </p>

                        <Link
                          to="/explore"
                          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#0B2742] px-5 py-3.5 text-sm font-bold text-white"
                        >
                          Explore Other Halls
                          <ArrowRight size={17} />
                        </Link>

                      </div>
                    ) : (
                      <div className="flex h-full flex-col justify-center">

                        <Clock3
                          size={38}
                          className="text-[#C6922E]"
                        />

                        <h3 className="mt-4 text-2xl font-extrabold text-[#0B2239]">
                          Request Pending
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          The hall owner is reviewing your
                          booking request.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            openBooking(booking)
                          }
                          className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[#D9D3C7] bg-white px-5 py-3.5 text-sm font-bold text-[#0B2742]"
                        >
                          <Eye size={18} />
                          View Request
                        </button>

                      </div>
                    )}

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}