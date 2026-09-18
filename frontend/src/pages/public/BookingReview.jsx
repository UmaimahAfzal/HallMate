import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Users,
  PartyPopper,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

import halls from "../../data/halls";
import { hallAlert } from "../../components/HallDialog";

export default function BookingReview() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    hallId,
    backendHallId,
    date,
    guests,
    eventType,
  } = location.state || {};

  const hall = halls.find(
    (item) => String(item.id) === String(hallId)
  );

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    requirements: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // =========================================================
  // LOAD LOGGED-IN CUSTOMER DETAILS
  // =========================================================

  useEffect(() => {
    const savedUser = localStorage.getItem("hallmateUser");

    if (!savedUser) return;

    try {
      const user = JSON.parse(savedUser);

      if (user?.role === "customer" && user?.loggedIn) {
        setFormData((previous) => ({
          ...previous,
          name: user.name || "",
          phone: user.phone || "",
          email: user.email || "",
        }));
      }
    } catch (error) {
      console.error("Unable to load customer account:", error);
    }
  }, []);

  // =========================================================
  // VALIDATE BOOKING DETAILS
  // =========================================================

  if (!hall || !date || !guests || !eventType) {
    return (
      <section className="min-h-[70vh] bg-[#F8F6F0] px-6 py-20">
        <div className="mx-auto max-w-[700px] rounded-2xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-[#0B2239]">
            Booking details not found
          </h1>

          <p className="mt-3 text-gray-600">
            Please select your hall and event details again.
          </p>

          <Link
            to="/explore"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B2742] px-6 py-3 font-semibold text-white hover:bg-[#173A5C]"
          >
            <ArrowLeft size={18} />
            Explore Halls
          </Link>
        </div>
      </section>
    );
  }

  // =========================================================
  // FORMATTED DATE
  // =========================================================

  const formattedDate = new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // ENTER KEY NAVIGATION
  // =========================================================

  const handleEnterNext = (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const form = e.currentTarget;

    const elements = Array.from(
      form.querySelectorAll(
        "input:not([disabled]), textarea:not([disabled]), button:not([disabled])"
      )
    );

    const currentIndex = elements.indexOf(e.target);

    if (currentIndex === -1) return;

    if (e.target.name === "requirements") {
      form.requestSubmit();
      return;
    }

    if (currentIndex < elements.length - 1) {
      elements[currentIndex + 1].focus();
    }
  };

  // =========================================================
  // SUBMIT BOOKING
  // =========================================================

  const handleProceed = async (e) => {
    e.preventDefault();

    // ---------------------------------------------------------
    // GET LOGGED-IN CUSTOMER
    // ---------------------------------------------------------

    let savedUser = null;

    try {
      savedUser = JSON.parse(
        localStorage.getItem("hallmateUser") || "null"
      );
    } catch (error) {
      savedUser = null;
    }

    if (!savedUser?.id || savedUser?.role !== "customer") {
      hallAlert(
        "Please sign in to your HallMate customer account before submitting the booking request.",
        "warning",
        "Sign In Required"
      );

      // Save the current booking details temporarily so that
      // the flow can be continued after sign in.
      sessionStorage.setItem(
        "hallmatePendingBooking",
        JSON.stringify({
          hallId,
          backendHallId,
          date,
          guests,
          eventType,
        })
      );

      navigate("/sign-in", {
        state: {
          returnTo: `/hall/${hallId}/review`,
        },
      });

      return;
    }

    // ---------------------------------------------------------
    // VALIDATE CONTACT DETAILS
    // ---------------------------------------------------------

    if (!formData.name.trim()) {
      hallAlert(
        "Please enter your full name before continuing.",
        "warning",
        "Missing Name"
      );
      return;
    }

    if (!formData.phone.trim()) {
      hallAlert(
        "Please enter your phone number before continuing.",
        "warning",
        "Missing Phone Number"
      );
      return;
    }

    if (!formData.email.trim()) {
      hallAlert(
        "Please enter your email address before continuing.",
        "warning",
        "Missing Email"
      );
      return;
    }

    // ---------------------------------------------------------
    // USE REAL BACKEND HALL ID
    // ---------------------------------------------------------

    const realHallId = backendHallId || hallId;

    if (!realHallId) {
      hallAlert(
        "We couldn't identify the selected hall. Please select the hall again.",
        "warning",
        "Hall Not Found"
      );
      return;
    }

    // ---------------------------------------------------------
    // SEND BOOKING TO BACKEND
    // ---------------------------------------------------------

    try {
      setSubmitting(true);

      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hallId: Number(realHallId),
            customerId: Number(savedUser.id),
            eventDate: date,
            guests: Number(guests),
            eventType,
            customerName: formData.name.trim(),
            customerPhone: formData.phone.trim(),
            customerEmail: formData.email.trim().toLowerCase(),
            specialRequirements:
              formData.requirements.trim() || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to submit the booking request."
        );
      }

      // -------------------------------------------------------
      // REAL BOOKING CREATED
      // -------------------------------------------------------

      const booking = data.booking;

      const bookingReference =
        booking?.booking_reference ||
        booking?.bookingReference;

      // Remove temporary booking information if it exists.
      sessionStorage.removeItem("hallmatePendingBooking");

      // -------------------------------------------------------
      // GO TO CONFIRMATION
      // -------------------------------------------------------

      navigate(`/hall/${hallId}/confirmation`, {
        state: {
          hallId: String(hallId),
          backendHallId: String(realHallId),
          date,
          guests,
          eventType,
          customer: formData,
          bookingReference,
        },
      });
    } catch (error) {
      console.error("Booking submission error:", error);

      hallAlert(
        error.message ||
          "Unable to submit your booking request. Please try again.",
        "warning",
        "Booking Failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#F8F6F0] px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-[1100px]">

        {/* BACK */}

        <Link
          to={`/hall/${hallId}/availability`}
          state={{
            hallId,
            date,
            guests,
            eventType,
          }}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0B2742] hover:text-[#C6922E]"
        >
          <ArrowLeft size={18} />
          Back to Availability
        </Link>

        {/* PAGE HEADER */}

        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#C6922E]">
            HALLMATE BOOKING
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#0B2239] lg:text-4xl">
            Review Your Booking
          </h1>

          <p className="mt-2 text-gray-600">
            Check your event details and provide your contact information.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">

          {/* LEFT */}

          <div className="space-y-6">

            {/* HALL CARD */}

            <div className="overflow-hidden rounded-2xl border border-[#E8E3D8] bg-white shadow-sm">
              <div className="flex flex-col sm:flex-row">

                <img
                  src={hall.image}
                  alt={hall.name}
                  className="h-60 w-full object-cover sm:h-auto sm:w-64"
                />

                <div className="flex-1 p-6">

                  <p className="text-sm text-gray-500">
                    Selected Hall
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-[#0B2239]">
                    {hall.name}
                  </h2>

                  <div className="mt-2 flex items-center gap-2 text-gray-600">
                    <MapPin
                      size={17}
                      className="text-[#C6922E]"
                    />
                    {hall.location}
                  </div>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#DDF8EA] px-4 py-2 text-sm font-semibold text-[#15945A]">
                    <CheckCircle size={16} />
                    Available for your date
                  </div>

                </div>
              </div>
            </div>

            {/* EVENT DETAILS */}

            <div className="rounded-2xl border border-[#E8E3D8] bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold text-[#0B2239]">
                Your Event Details
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">

                <div className="rounded-xl border border-[#E8E3D8] bg-[#FBFAF7] p-4">

                  <CalendarDays
                    size={22}
                    className="text-[#C6922E]"
                  />

                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Event Date
                  </p>

                  <p className="mt-1 font-semibold text-[#0B2239]">
                    {formattedDate}
                  </p>

                </div>

                <div className="rounded-xl border border-[#E8E3D8] bg-[#FBFAF7] p-4">

                  <Users
                    size={22}
                    className="text-[#C6922E]"
                  />

                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Guests
                  </p>

                  <p className="mt-1 font-semibold text-[#0B2239]">
                    {guests} guests
                  </p>

                </div>

                <div className="rounded-xl border border-[#E8E3D8] bg-[#FBFAF7] p-4">

                  <PartyPopper
                    size={22}
                    className="text-[#C6922E]"
                  />

                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Event Type
                  </p>

                  <p className="mt-1 font-semibold text-[#0B2239]">
                    {eventType}
                  </p>

                </div>

              </div>
            </div>

            {/* CONTACT DETAILS */}

            <form
              onSubmit={handleProceed}
              onKeyDown={handleEnterNext}
              className="rounded-2xl border border-[#E8E3D8] bg-white p-6 shadow-sm"
            >

              <div>
                <h2 className="text-xl font-bold text-[#0B2239]">
                  Your Contact Details
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  We'll use these details for booking communication.
                </p>
              </div>

              {/* NAME */}

              <div className="mt-6">

                <label className="mb-2 block text-sm font-semibold text-[#0B2239]">
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C6922E]"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    disabled={submitting}
                    className="w-full rounded-xl border border-[#D9D3C7] bg-white py-3.5 pl-11 pr-4 text-[#0B2239] outline-none transition focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/20 disabled:bg-gray-100"
                  />

                </div>
              </div>

              {/* PHONE + EMAIL */}

              <div className="mt-5 grid gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#0B2239]">
                    Phone Number
                  </label>

                  <div className="relative">

                    <Phone
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C6922E]"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      disabled={submitting}
                      className="w-full rounded-xl border border-[#D9D3C7] bg-white py-3.5 pl-11 pr-4 text-[#0B2239] outline-none transition focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/20 disabled:bg-gray-100"
                    />

                  </div>
                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#0B2239]">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C6922E]"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      disabled={submitting}
                      className="w-full rounded-xl border border-[#D9D3C7] bg-white py-3.5 pl-11 pr-4 text-[#0B2239] outline-none transition focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/20 disabled:bg-gray-100"
                    />

                  </div>
                </div>

              </div>

              {/* REQUIREMENTS */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-[#0B2239]">
                  Special Requirements
                  <span className="ml-1 font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <div className="relative">

                  <FileText
                    size={19}
                    className="absolute left-4 top-4 text-[#C6922E]"
                  />

                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows="4"
                    disabled={submitting}
                    placeholder="Any special arrangements or requirements?"
                    className="w-full resize-none rounded-xl border border-[#D9D3C7] bg-white py-3.5 pl-11 pr-4 text-[#0B2239] outline-none transition focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/20 disabled:bg-gray-100"
                  />

                </div>
              </div>

              {/* BUTTON */}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C6922E] px-7 py-3.5 font-bold text-white transition hover:bg-[#AD7F25] focus:outline-none focus:ring-2 focus:ring-[#C6922E] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Submitting Booking...
                  </>
                ) : (
                  <>
                    Proceed to Confirmation
                    <ChevronRight size={19} />
                  </>
                )}
              </button>

            </form>
          </div>

          {/* RIGHT SUMMARY */}

          <div>

            <div className="sticky top-6 rounded-2xl border border-[#E8E3D8] bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold text-[#0B2239]">
                Booking Summary
              </h2>

              <div className="mt-5 space-y-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Hall
                  </p>

                  <p className="mt-1 font-semibold text-[#0B2239]">
                    {hall.name}
                  </p>
                </div>

                <div className="border-t border-[#E8E3D8] pt-4">

                  <p className="text-sm text-gray-500">
                    Date
                  </p>

                  <p className="mt-1 font-semibold text-[#0B2239]">
                    {formattedDate}
                  </p>

                </div>

                <div className="border-t border-[#E8E3D8] pt-4">

                  <p className="text-sm text-gray-500">
                    Guests
                  </p>

                  <p className="mt-1 font-semibold text-[#0B2239]">
                    {guests} guests
                  </p>

                </div>

                <div className="border-t border-[#E8E3D8] pt-4">

                  <p className="text-sm text-gray-500">
                    Event Type
                  </p>

                  <p className="mt-1 font-semibold text-[#0B2239]">
                    {eventType}
                  </p>

                </div>

              </div>

              <div className="mt-6 rounded-xl border border-[#E5D7B7] bg-[#FBF7ED] p-5">

                <p className="text-sm text-gray-600">
                  Starting price
                </p>

                <p className="mt-1 text-2xl font-bold text-[#0B2239]">
                  ₹{hall.price.toLocaleString("en-IN")}
                  <span className="ml-1 text-sm font-normal text-gray-500">
                    / day
                  </span>
                </p>

              </div>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                Your booking request will be sent to the hall owner for
                confirmation. You will receive a notification when the
                owner responds.
              </p>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}