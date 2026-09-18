import { useLocation, useNavigate, Link } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle,
  CalendarDays,
  Users,
  PartyPopper,
  MapPin,
  ChevronRight,
} from "lucide-react";

import { useEffect, useState } from "react";

import halls from "../../data/halls";

export default function AvailabilityResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    hallId,
    localHallId,
    hallName,
    location: hallLocation,
    date,
    guests,
    eventType,
  } = location.state || {};

  const [hall, setHall] = useState(null);
  const [loadingHall, setLoadingHall] = useState(true);

  // Real availability from PostgreSQL
  const [availability, setAvailability] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [availabilityError, setAvailabilityError] = useState("");

  // =========================================================
  // LOAD HALL
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const loadHall = async () => {
      try {
        setLoadingHall(true);

        let backendHall = null;
        let localHall = null;

        // -----------------------------------------------------
        // FIRST: TRY THE LOCAL HALL ID PASSED FROM BOOKING
        // -----------------------------------------------------

        if (localHallId) {
          localHall = halls.find(
            (item) =>
              String(item.id) === String(localHallId)
          );
        }

        // -----------------------------------------------------
        // TRY BACKEND
        // -----------------------------------------------------

        try {
          const response = await fetch(
            "http://localhost:5000/api/halls"
          );

          if (response.ok) {
            const data = await response.json();

            if (
              data?.success &&
              Array.isArray(data.halls)
            ) {
              backendHall = data.halls.find(
                (item) =>
                  String(item.id) === String(hallId)
              );

              // -------------------------------------------------
              // If local hall wasn't found yet,
              // match using backend name + location.
              // -------------------------------------------------

              if (!localHall && backendHall) {
                localHall = halls.find(
                  (item) =>
                    String(item.name)
                      .trim()
                      .toLowerCase() ===
                      String(backendHall.name || "")
                        .trim()
                        .toLowerCase() &&
                    String(item.location)
                      .trim()
                      .toLowerCase() ===
                      String(
                        backendHall.location || ""
                      )
                        .trim()
                        .toLowerCase()
                );
              }
            }
          }
        } catch (error) {
          console.warn(
            "Backend hall loading failed:",
            error
          );
        }

        // -----------------------------------------------------
        // FINAL LOCAL FALLBACK
        // -----------------------------------------------------

        if (!localHall && hallName) {
          localHall = halls.find(
            (item) =>
              String(item.name)
                .trim()
                .toLowerCase() ===
                String(hallName)
                  .trim()
                  .toLowerCase() &&
              String(item.location)
                .trim()
                .toLowerCase() ===
                String(hallLocation || "")
                  .trim()
                  .toLowerCase()
          );
        }

        // -----------------------------------------------------
        // NOTHING FOUND
        // -----------------------------------------------------

        if (!backendHall && !localHall) {
          if (!cancelled) {
            setHall(null);
          }

          return;
        }

        // -----------------------------------------------------
        // BUILD FINAL HALL
        // -----------------------------------------------------

        const finalHall = {
          id: String(
            backendHall?.id ??
              hallId ??
              localHall?.id ??
              ""
          ),

          localId:
            localHall?.id ??
            localHallId ??
            null,

          name:
            backendHall?.name ??
            localHall?.name ??
            hallName ??
            "Event Hall",

          location:
            backendHall?.location ??
            localHall?.location ??
            hallLocation ??
            "",

          image:
            localHall?.image ??
            backendHall?.image ??
            "",

          images:
            localHall?.images ??
            backendHall?.images ??
            (backendHall?.image
              ? [backendHall.image]
              : []),

          capacity: Number(
            backendHall?.capacity ??
              localHall?.capacity ??
              0
          ),

          price: Number(
            backendHall?.price_per_day ??
              backendHall?.price ??
              localHall?.price ??
              0
          ),

          rating:
            backendHall?.rating ??
            localHall?.rating ??
            4.5,

          reviews:
            backendHall?.reviews ??
            localHall?.reviews ??
            0,
        };

        if (!cancelled) {
          setHall(finalHall);
        }
      } catch (error) {
        console.error(
          "Error loading availability hall:",
          error
        );

        // -----------------------------------------------------
        // SIMPLE LOCAL FALLBACK
        // -----------------------------------------------------

        const fallbackHall =
          localHallId
            ? halls.find(
                (item) =>
                  String(item.id) ===
                  String(localHallId)
              )
            : halls.find(
                (item) =>
                  String(item.id) ===
                  String(hallId)
              );

        if (!cancelled && fallbackHall) {
          setHall({
            ...fallbackHall,
            id: String(hallId || fallbackHall.id),
            localId: fallbackHall.id,
          });
        }
      } finally {
        if (!cancelled) {
          setLoadingHall(false);
        }
      }
    };

    loadHall();

    return () => {
      cancelled = true;
    };
  }, [
    hallId,
    localHallId,
    hallName,
    hallLocation,
  ]);

  // =========================================================
  // CHECK REAL AVAILABILITY
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const checkAvailability = async () => {
      if (!hall?.id || !date) {
        setAvailability(null);
        setLoadingAvailability(false);
        return;
      }

      try {
        setLoadingAvailability(true);
        setAvailabilityError("");
        setAvailability(null);

        const response = await fetch(
          `http://localhost:5000/api/halls/${hall.id}/availability?date=${encodeURIComponent(
            date
          )}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data?.message || "Availability check failed."
          );
        }

        if (!cancelled) {
          setAvailability(Boolean(data.available));
        }
      } catch (error) {
        console.error("Availability check error:", error);

        if (!cancelled) {
          setAvailabilityError(
            error.message ||
              "Unable to check availability right now."
          );
          setAvailability(null);
        }
      } finally {
        if (!cancelled) {
          setLoadingAvailability(false);
        }
      }
    };

    checkAvailability();

    return () => {
      cancelled = true;
    };
  }, [hall?.id, date]);

  // =========================================================
  // VALIDATE BOOKING DETAILS
  // =========================================================

  if (
    !date ||
    !guests ||
    !eventType
  ) {
    return (
      <section className="min-h-[70vh] bg-[#F8F6F0] px-6 py-20">
        <div className="mx-auto max-w-[900px] text-center">

          <h1 className="text-3xl font-bold text-[#0B2239]">
            Availability details not found
          </h1>

          <p className="mt-3 text-gray-600">
            Please select your event details again.
          </p>

          <Link
            to="/explore"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0B2742] px-6 py-3 font-semibold text-white hover:bg-[#173A5C]"
          >
            <ArrowLeft size={18} />
            Explore Halls
          </Link>

        </div>
      </section>
    );
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loadingHall) {
    return (
      <section className="min-h-[70vh] bg-[#F8F6F0] px-6 py-20 text-center">

        <div className="mx-auto max-w-[700px] rounded-2xl bg-white p-10 shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FBF7ED]">
            <CalendarDays
              size={30}
              className="text-[#C6922E]"
            />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-[#0B2239]">
            Checking Availability...
          </h1>

          <p className="mt-3 text-gray-600">
            We're checking the selected hall and event details.
          </p>

        </div>

      </section>
    );
  }

  // =========================================================
  // HALL NOT FOUND
  // =========================================================

  if (!hall) {
    return (
      <section className="min-h-[70vh] bg-[#F8F6F0] px-6 py-20">
        <div className="mx-auto max-w-[900px] text-center">

          <h1 className="text-3xl font-bold text-[#0B2239]">
            Hall Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            We couldn't find the selected hall.
          </p>

          <Link
            to="/explore"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0B2742] px-6 py-3 font-semibold text-white hover:bg-[#173A5C]"
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
  // CONTINUE TO REVIEW
  // =========================================================

  const handleContinue = () => {
    if (loadingAvailability || availability !== true) {
      return;
    }

    navigate(
      `/hall/${hall.localId || hall.id}/review`,
      {
        state: {
          hallId: String(
            hall.localId || hall.id
          ),

          backendHallId: String(
            hall.id
          ),

          date,
          guests: Number(guests),
          eventType,

          hallName: hall.name,
          hallLocation: hall.location,
        },
      }
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <section className="min-h-screen bg-[#F8F6F0] px-6 py-10 lg:px-10">

      <div className="mx-auto max-w-[1000px]">

        {/* BACK */}

        <Link
          to={`/hall/${hall.id}/booking`}
          state={{
            hallId: hall.id,
            localHallId: hall.localId,
            hallName: hall.name,
            location: hall.location,
          }}
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#0B2742] hover:text-[#C6922E]"
        >
          <ArrowLeft size={18} />
          Back to Booking Details
        </Link>

        {/* SUCCESS CARD */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

          {/* HEADER */}

          <div className="bg-[#0B2742] px-6 py-8 text-center text-white lg:px-10">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
              <CheckCircle
                size={34}
                className={
                  availability === false
                    ? "text-red-300"
                    : "text-[#D4A84F]"
                }
              />
            </div>

            <h1 className="mt-5 text-3xl font-bold lg:text-4xl">
              {loadingAvailability
                ? "Checking Availability..."
                : availability === true
                ? "Hall Available!"
                : availability === false
                ? "Hall Unavailable"
                : "Availability Check Failed"}
            </h1>

            <p className="mx-auto mt-2 max-w-[600px] text-sm leading-6 text-white/75">
              {loadingAvailability
                ? "We're checking the selected date against current bookings."
                : availability === true
                ? "Good news! The selected hall is available for your requested event details."
                : availability === false
                ? "This hall already has a pending or accepted booking for the selected date."
                : availabilityError ||
                  "We couldn't verify availability right now. Please try again."}
            </p>

          </div>

          {/* DETAILS */}

          <div className="grid gap-8 p-6 lg:grid-cols-[1fr_360px] lg:p-10">

            {/* LEFT */}

            <div>

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FBF7ED]">
                  <PartyPopper
                    size={23}
                    className="text-[#C6922E]"
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[#0B2239]">
                    {hall.name}
                  </h2>

                  <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin size={16} />
                    {hall.location}
                  </div>
                </div>

              </div>

              {/* EVENT DETAILS */}

              <div className="mt-8 grid gap-4 sm:grid-cols-3">

                <div className="rounded-xl border border-[#E8E3D8] bg-[#FBFAF7] p-5">

                  <CalendarDays
                    size={21}
                    className="text-[#C6922E]"
                  />

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Event Date
                  </p>

                  <p className="mt-1 font-bold text-[#0B2239]">
                    {formattedDate}
                  </p>

                </div>

                <div className="rounded-xl border border-[#E8E3D8] bg-[#FBFAF7] p-5">

                  <Users
                    size={21}
                    className="text-[#C6922E]"
                  />

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Guests
                  </p>

                  <p className="mt-1 font-bold text-[#0B2239]">
                    {Number(guests).toLocaleString("en-IN")}
                  </p>

                </div>

                <div className="rounded-xl border border-[#E8E3D8] bg-[#FBFAF7] p-5">

                  <PartyPopper
                    size={21}
                    className="text-[#C6922E]"
                  />

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Event Type
                  </p>

                  <p className="mt-1 font-bold text-[#0B2239]">
                    {eventType}
                  </p>

                </div>

              </div>

              {/* INFORMATION */}

              <div
                className={`mt-8 rounded-xl border p-5 ${
                  availability === false
                    ? "border-red-200 bg-red-50"
                    : availabilityError
                    ? "border-[#E8D8B7] bg-[#FBF7ED]"
                    : "border-[#E8E3D8] bg-[#FBF7ED]"
                }`}
              >

                <div className="flex items-start gap-3">

                  <CheckCircle
                    size={20}
                    className={`mt-0.5 shrink-0 ${
                      availability === false
                        ? "text-red-500"
                        : availabilityError
                        ? "text-[#C6922E]"
                        : "text-[#15945A]"
                    }`}
                  />

                  <div>
                    <h3 className="font-bold text-[#0B2239]">
                      {loadingAvailability
                        ? "Checking current availability"
                        : availability === true
                        ? "Availability confirmed"
                        : availability === false
                        ? "Date is already booked"
                        : "Unable to confirm availability"}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {loadingAvailability
                        ? "Please wait while we check the selected date against bookings in HallMate."
                        : availability === true
                        ? "The selected date is currently free. You can now review your booking details before submitting the booking request."
                        : availability === false
                        ? "Another pending or accepted booking already exists for this hall on the selected date. Please choose another date."
                        : availabilityError ||
                          "Please go back and try checking the date again."}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* RIGHT SUMMARY */}

            <div className="h-fit rounded-2xl border border-[#E8E3D8] bg-[#FBFAF7] p-6">

              <h3 className="text-xl font-bold text-[#0B2239]">
                Booking Summary
              </h3>

              <div className="mt-5 space-y-4">

                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-gray-500">
                    Hall
                  </span>

                  <span className="text-right text-sm font-semibold text-[#0B2239]">
                    {hall.name}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">
                    Date
                  </span>

                  <span className="text-sm font-semibold text-[#0B2239]">
                    {formattedDate}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">
                    Guests
                  </span>

                  <span className="text-sm font-semibold text-[#0B2239]">
                    {Number(guests).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">
                    Event
                  </span>

                  <span className="text-sm font-semibold text-[#0B2239]">
                    {eventType}
                  </span>
                </div>

                <div className="border-t border-[#E8E3D8] pt-4">

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-gray-500">
                      Hall Rent
                    </span>

                    <span className="font-bold text-[#0B2239]">
                      ₹{hall.price.toLocaleString("en-IN")}
                    </span>

                  </div>

                  <p className="mt-1 text-right text-xs text-gray-500">
                    per day
                  </p>

                </div>

              </div>

              {/* CONTINUE */}

              <button
                type="button"
                onClick={handleContinue}
                disabled={loadingAvailability || availability !== true}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold text-white transition ${
                  loadingAvailability || availability !== true
                    ? "cursor-not-allowed bg-gray-300"
                    : "bg-[#C6922E] hover:bg-[#AD7F25]"
                }`}
              >
                {loadingAvailability
                  ? "Checking..."
                  : availability === true
                  ? "Review Booking"
                  : "Review Unavailable"}
                <ChevronRight size={19} />
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-gray-500">
                You can review everything before submitting your booking request.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}