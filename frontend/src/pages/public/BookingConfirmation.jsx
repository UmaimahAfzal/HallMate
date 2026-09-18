import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  CheckCircle,
  CalendarDays,
  Users,
  PartyPopper,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  ClipboardCheck,
  ArrowRight,
  Home,
  Clock3,
  XCircle,
  ShieldCheck,
} from "lucide-react";

import halls from "../../data/halls";

const API_URL = "http://localhost:5000";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * ---------------------------------------------------------
   * LOAD REAL BOOKING FROM BACKEND
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const loadBooking = async () => {
      try {
        const savedUser = JSON.parse(
          localStorage.getItem("hallmateUser") || "null"
        );

        /*
         * If we have a customer account, use the backend
         * customer bookings endpoint.
         */
        if (savedUser?.id) {
          const response = await fetch(
            `${API_URL}/api/bookings/customer/${savedUser.id}`
          );

          const data = await response.json();

          if (response.ok && data.success && data.bookings?.length) {
            let matchedBooking = null;

            /*
             * First preference:
             * booking reference passed from booking flow.
             */
            if (state.bookingReference) {
              matchedBooking = data.bookings.find(
                (item) =>
                  item.booking_reference === state.bookingReference
              );
            }

            /*
             * Second preference:
             * hall + date + customer email.
             * This also supports "View Booking" from My Bookings.
             */
            if (!matchedBooking) {
              matchedBooking = data.bookings.find((item) => {
                const sameHall =
                  String(item.hall_id) === String(state.hallId);

                const sameDate =
                  String(item.event_date).slice(0, 10) ===
                  String(state.date).slice(0, 10);

                const sameEmail =
                  !state.customer?.email ||
                  item.customer_email === state.customer.email;

                return sameHall && sameDate && sameEmail;
              });
            }

            /*
             * Final fallback:
             * most recent booking.
             */
            if (!matchedBooking) {
              matchedBooking = data.bookings[0];
            }

            setBooking(matchedBooking);
            setLoading(false);
            return;
          }
        }

        /*
         * Fallback to navigation state if backend data
         * cannot be loaded.
         */
        setBooking({
          booking_reference:
            state.bookingReference ||
            `HM-${Date.now().toString().slice(-8)}`,
          hall_id: state.hallId,
          event_date: state.date,
          guests: state.guests,
          event_type: state.eventType,
          customer_name: state.customer?.name || "",
          customer_phone: state.customer?.phone || "",
          customer_email: state.customer?.email || "",
          status: state.status || "Pending",
          price: state.price || null,
          hall_name: state.hallName || "",
          hall_location: state.location || "",
          hall_image: state.hallImage || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Unable to load booking:", error);

        setBooking({
          booking_reference:
            state.bookingReference ||
            `HM-${Date.now().toString().slice(-8)}`,
          hall_id: state.hallId,
          event_date: state.date,
          guests: state.guests,
          event_type: state.eventType,
          customer_name: state.customer?.name || "",
          customer_phone: state.customer?.phone || "",
          customer_email: state.customer?.email || "",
          status: state.status || "Pending",
          price: state.price || null,
          hall_name: state.hallName || "",
          hall_location: state.location || "",
          hall_image: state.hallImage || "",
        });

        setLoading(false);
      }
    };

    loadBooking();
  }, [
    state.bookingReference,
    state.hallId,
    state.date,
    state.guests,
    state.eventType,
  ]);

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */
  if (loading) {
    return (
      <section className="min-h-screen bg-[#F8F6F0] px-6 py-20">
        <div className="mx-auto max-w-[900px] rounded-2xl border border-[#E8E3D8] bg-white px-8 py-20 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FBF3DF]">
            <Clock3
              size={30}
              className="animate-pulse text-[#C6922E]"
            />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-[#0B2239]">
            Loading Booking Details...
          </h1>

          <p className="mt-2 text-gray-600">
            Please wait while we retrieve your booking.
          </p>
        </div>
      </section>
    );
  }

  /*
   * ---------------------------------------------------------
   * HALL
   * ---------------------------------------------------------
   */
  const hall = halls.find(
    (item) => String(item.id) === String(booking?.hall_id)
  );

  const hallName =
    booking?.hall_name || hall?.name || "Selected Hall";

  const hallLocation =
    booking?.hall_location || hall?.location || "HallMate Venue";

  const hallImage =
    booking?.hall_image || hall?.image || "";

  /*
   * ---------------------------------------------------------
   * BOOKING DETAILS
   * ---------------------------------------------------------
   */
  const bookingReference =
    booking?.booking_reference ||
    state.bookingReference ||
    `HM-${Date.now().toString().slice(-8)}`;

  const eventDate =
    booking?.event_date || state.date || "";

  const guests =
    booking?.guests || state.guests || "";

  const eventType =
    booking?.event_type || state.eventType || "";

  const customerName =
    booking?.customer_name ||
    state.customer?.name ||
    "";

  const customerPhone =
    booking?.customer_phone ||
    state.customer?.phone ||
    "";

  const customerEmail =
    booking?.customer_email ||
    state.customer?.email ||
    "";

  const amount =
    Number(booking?.price || state.price || hall?.price || 0);

  const formattedDate = eventDate
    ? new Date(`${String(eventDate).slice(0, 10)}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "Date not available";

  /*
   * ---------------------------------------------------------
   * STATUS
   * ---------------------------------------------------------
   */
  const rawStatus = String(
    booking?.status || state.status || "Pending"
  ).toLowerCase();

  const isConfirmed =
    rawStatus === "accepted" ||
    rawStatus === "confirmed";

  const isRejected =
    rawStatus === "rejected";

  /*
   * ---------------------------------------------------------
   * PROCEED TO PAYMENT
   * ---------------------------------------------------------
   */
  const handlePayment = () => {
    navigate("/payment", {
      state: {
        bookingId: booking?.id,
        bookingReference,
        hallId: booking?.hall_id || state.hallId,
        hallName,
        hallLocation,
        hallImage,
        date: eventDate,
        guests,
        eventType,
        customer: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
        },
        price: amount,
        status: booking?.status || "Accepted",
      },
    });
  };

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */
  return (
    <section className="min-h-screen bg-[#F8F6F0] px-5 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1180px]">

        {/* =====================================================
            TOP BACK LINK
        ====================================================== */}
        <Link
          to="/my-bookings"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0B2742] transition hover:text-[#C6922E]"
        >
          <ArrowRight
            size={17}
            className="rotate-180"
          />
          Back to My Bookings
        </Link>

        {/* =====================================================
            MAIN CARD
        ====================================================== */}
        <div className="overflow-hidden rounded-3xl border border-[#E5DED0] bg-white shadow-sm">

          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">

            {/* =================================================
                LEFT — HALL + BOOKING DETAILS
            ================================================= */}
            <div className="border-b border-[#E8E3D8] lg:border-b-0 lg:border-r">

              {/* HALL IMAGE */}
              <div className="relative h-[270px] overflow-hidden sm:h-[330px]">
                {hallImage ? (
                  <img
                    src={hallImage}
                    alt={hallName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[#0B2742]">
                    <span className="text-4xl font-bold text-[#C6922E]">
                      HallMate
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2239]/75 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-sm font-semibold text-white/80">
                    Your Selected Venue
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                    {hallName}
                  </h2>

                  <div className="mt-2 flex items-center gap-2 text-sm text-white/90">
                    <MapPin
                      size={16}
                      className="text-[#D9A441]"
                    />
                    {hallLocation}
                  </div>
                </div>
              </div>

              {/* DETAILS */}
              <div className="p-6 sm:p-8">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#C6922E]">
                      Booking Details
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-[#0B2239]">
                      {bookingReference}
                    </h2>
                  </div>

                  <div className="hidden h-11 w-11 items-center justify-center rounded-full bg-[#FBF3DF] sm:flex">
                    <ClipboardCheck
                      size={22}
                      className="text-[#C6922E]"
                    />
                  </div>
                </div>

                {/* EVENT DETAILS */}
                <div className="mt-7 grid gap-3 sm:grid-cols-3">

                  <div className="rounded-xl border border-[#E8E3D8] bg-[#FBFAF7] p-4">
                    <CalendarDays
                      size={20}
                      className="text-[#C6922E]"
                    />

                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Event Date
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#0B2239]">
                      {formattedDate}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E8E3D8] bg-[#FBFAF7] p-4">
                    <Users
                      size={20}
                      className="text-[#C6922E]"
                    />

                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Guests
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#0B2239]">
                      {guests} guests
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E8E3D8] bg-[#FBFAF7] p-4">
                    <PartyPopper
                      size={20}
                      className="text-[#C6922E]"
                    />

                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Event Type
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#0B2239]">
                      {eventType}
                    </p>
                  </div>

                </div>

                {/* CUSTOMER */}
                <div className="mt-6 border-t border-[#E8E3D8] pt-6">

                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#C6922E]">
                    Customer
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">

                    <div className="flex items-center gap-3 rounded-xl bg-[#FBFAF7] p-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B2742]">
                        <User
                          size={17}
                          className="text-[#D9A441]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wide text-gray-500">
                          Name
                        </p>

                        <p className="truncate text-sm font-semibold text-[#0B2239]">
                          {customerName || "Customer"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-[#FBFAF7] p-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B2742]">
                        <Phone
                          size={17}
                          className="text-[#D9A441]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wide text-gray-500">
                          Phone
                        </p>

                        <p className="truncate text-sm font-semibold text-[#0B2239]">
                          {customerPhone || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-[#FBFAF7] p-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B2742]">
                        <Mail
                          size={17}
                          className="text-[#D9A441]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wide text-gray-500">
                          Email
                        </p>

                        <p className="truncate text-sm font-semibold text-[#0B2239]">
                          {customerEmail || "Not provided"}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* =================================================
                RIGHT — BIG CONFIRMATION
            ================================================= */}
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">

              {isConfirmed && (
                <>
                  {/* SUCCESS ICON */}
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#DDF8EA]">
                    <CheckCircle
                      size={54}
                      strokeWidth={2.2}
                      className="text-[#15945A]"
                    />
                  </div>

                  <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-[#C6922E]">
                    HALLMATE BOOKING
                  </p>

                  <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[#0B2239] sm:text-5xl">
                    BOOKING
                    <br />
                    <span className="text-[#C6922E]">
                      CONFIRMED
                    </span>
                  </h1>

                  <p className="mt-5 max-w-md text-[15px] leading-7 text-gray-600">
                    Great news! The hall owner has accepted your
                    booking request. Your venue is now confirmed
                    for the selected date.
                  </p>

                  {/* REFERENCE */}
                  <div className="mt-7 rounded-2xl border border-[#E5D7B7] bg-[#FBF7ED] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                      Booking Reference
                    </p>

                    <p className="mt-2 text-2xl font-extrabold tracking-wide text-[#0B2239]">
                      {bookingReference}
                    </p>
                  </div>

                  {/* PRICE */}
                  <div className="mt-5 flex items-end justify-between border-b border-[#E8E3D8] pb-5">
                    <div>
                      <p className="text-sm text-gray-500">
                        Booking Amount
                      </p>

                      <p className="mt-1 text-3xl font-extrabold text-[#0B2239]">
                        ₹{amount.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <span className="mb-1 text-sm text-gray-500">
                      / day
                    </span>
                  </div>

                  {/* PAYMENT BUTTON */}
                  <button
                    type="button"
                    onClick={handlePayment}
                    className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-[#C6922E] px-6 py-4 text-base font-bold text-white shadow-sm transition hover:bg-[#AD7F25] hover:shadow-md"
                  >
                    <CreditCard size={20} />
                    Proceed to Payment
                    <ArrowRight size={19} />
                  </button>

                  {/* TRUST */}
                  <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#F7F8FA] p-4">
                    <ShieldCheck
                      size={19}
                      className="mt-0.5 shrink-0 text-[#0B2742]"
                    />

                    <p className="text-xs leading-5 text-gray-600">
                      Your booking has been confirmed by the hall
                      owner. Continue securely to complete your
                      payment.
                    </p>
                  </div>
                </>
              )}

              {!isConfirmed && !isRejected && (
                <>
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF4D7]">
                    <Clock3
                      size={52}
                      className="text-[#C6922E]"
                    />
                  </div>

                  <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-[#C6922E]">
                    HALLMATE BOOKING
                  </p>

                  <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[#0B2239] sm:text-5xl">
                    BOOKING
                    <br />
                    <span className="text-[#C6922E]">
                      REQUEST SENT
                    </span>
                  </h1>

                  <p className="mt-5 max-w-md text-[15px] leading-7 text-gray-600">
                    Your booking request has been submitted
                    successfully. The hall owner will review it
                    and confirm the booking.
                  </p>

                  <div className="mt-7 rounded-2xl border border-[#E5D7B7] bg-[#FBF7ED] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                      Booking Reference
                    </p>

                    <p className="mt-2 text-2xl font-extrabold tracking-wide text-[#0B2239]">
                      {bookingReference}
                    </p>
                  </div>

                  <Link
                    to="/my-bookings"
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B2742] px-6 py-4 font-bold text-white transition hover:bg-[#173A5C]"
                  >
                    <ClipboardCheck size={19} />
                    View My Booking
                  </Link>
                </>
              )}

              {isRejected && (
                <>
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
                    <XCircle
                      size={52}
                      className="text-red-600"
                    />
                  </div>

                  <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-[#C6922E]">
                    HALLMATE BOOKING
                  </p>

                  <h1 className="mt-3 text-4xl font-extrabold text-[#0B2239]">
                    BOOKING REQUEST
                    <br />
                    <span className="text-red-600">
                      NOT ACCEPTED
                    </span>
                  </h1>

                  <p className="mt-5 max-w-md text-[15px] leading-7 text-gray-600">
                    Unfortunately, the hall owner did not accept
                    this booking request.
                  </p>

                  <Link
                    to="/explore"
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B2742] px-6 py-4 font-bold text-white transition hover:bg-[#173A5C]"
                  >
                    <Home size={19} />
                    Explore Other Halls
                  </Link>
                </>
              )}

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}