import { useParams, Link, useNavigate, useLocation } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Users,
  CheckCircle,
  ChevronDown,
  Check,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { hallAlert } from "../../components/HallDialog";

import halls from "../../data/halls";

export default function HallBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [hall, setHall] = useState(null);
  const [loadingHall, setLoadingHall] = useState(true);

  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const [eventType, setEventType] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const guestsRef = useRef(null);
  const eventTypeRef = useRef(null);
  const continueRef = useRef(null);

  // =========================================================
  // LOAD HALL
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const loadHall = async () => {
      try {
        setLoadingHall(true);

        let backendHall = null;

        // -----------------------------------------------------
        // BACKEND
        // -----------------------------------------------------

        try {
          const response = await fetch(
            "http://localhost:5000/api/halls"
          );

          if (response.ok) {
            const data = await response.json();

            if (data?.success && Array.isArray(data.halls)) {
              backendHall = data.halls.find(
                (item) =>
                  String(item.id) === String(id)
              );
            }
          }
        } catch (error) {
          console.warn(
            "Could not load backend hall:",
            error
          );
        }

        // -----------------------------------------------------
        // MATCH LOCAL HALL USING NAME + LOCATION
        // -----------------------------------------------------

        let localHall = null;

        if (backendHall) {
          localHall = halls.find(
            (item) =>
              String(item.name).trim().toLowerCase() ===
                String(backendHall.name || "")
                  .trim()
                  .toLowerCase() &&
              String(item.location).trim().toLowerCase() ===
                String(backendHall.location || "")
                  .trim()
                  .toLowerCase()
          );
        }

        // -----------------------------------------------------
        // LOCAL ID FALLBACK
        // -----------------------------------------------------

        if (!localHall) {
          localHall = halls.find(
            (item) =>
              String(item.id) === String(id)
          );
        }

        // -----------------------------------------------------
        // IF BACKEND EXISTS, BUILD FINAL HALL
        // -----------------------------------------------------

        if (backendHall) {
          const finalHall = {
            id: String(backendHall.id),

            localId:
              localHall?.id ?? null,

            name:
              backendHall.name ??
              localHall?.name ??
              "Event Hall",

            location:
              backendHall.location ??
              localHall?.location ??
              "",

            image:
              localHall?.image ??
              backendHall.image ??
              "",

            images:
              localHall?.images ??
              backendHall.images ??
              (backendHall.image
                ? [backendHall.image]
                : []),

            capacity: Number(
              backendHall.capacity ??
                localHall?.capacity ??
                0
            ),

            price: Number(
              backendHall.price_per_day ??
                backendHall.price ??
                localHall?.price ??
                0
            ),

            eventTypes:
              localHall?.eventTypes ??
              backendHall.eventTypes ??
              [
                "Wedding",
                "Birthday",
                "Engagement",
                "Party",
                "Corporate",
                "Exhibition",
                "Other",
              ],
          };

          if (!cancelled) {
            setHall(finalHall);
          }

          return;
        }

        // -----------------------------------------------------
        // LOCAL FALLBACK
        // -----------------------------------------------------

        if (localHall && !cancelled) {
          setHall({
            ...localHall,
            id: String(localHall.id),
            localId: localHall.id,
          });

          return;
        }

        if (!cancelled) {
          setHall(null);
        }
      } catch (error) {
        console.error(
          "Error loading booking hall:",
          error
        );

        if (!cancelled) {
          setHall(null);
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
  }, [id]);

  // =========================================================
  // DATE → GUESTS
  // =========================================================

  const handleDateKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      guestsRef.current?.focus();
    }
  };

  // =========================================================
  // GUESTS → EVENT TYPE
  // =========================================================

  const handleGuestsKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      setDropdownOpen(true);

      setTimeout(() => {
        eventTypeRef.current?.focus();
      }, 50);
    }
  };

  // =========================================================
  // EVENT TYPE SELECT
  // =========================================================

  const handleEventSelect = (type) => {
    setEventType(type);
    setDropdownOpen(false);

    setTimeout(() => {
      continueRef.current?.focus();
    }, 50);
  };

  // =========================================================
  // EVENT TYPE KEYBOARD
  // =========================================================

  const handleEventKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      setDropdownOpen((prev) => !prev);
    }

    if (e.key === "Escape") {
      e.preventDefault();

      setDropdownOpen(false);
    }
  };

  // =========================================================
  // CONTINUE KEYBOARD
  // =========================================================

  const handleContinueKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      e.currentTarget.click();
    }
  };

  // =========================================================
  // CHECK AVAILABILITY
  // =========================================================

  const handleContinue = (e) => {
    e.preventDefault();

    if (!date || !guests || !eventType) {
      hallAlert(
        "Please fill in all booking details.",
        "warning",
        "Missing Booking Details"
      );

      return;
    }

    if (Number(guests) > hall.capacity) {
      hallAlert(
        `This hall can accommodate a maximum of ${hall.capacity} guests.`,
        "warning",
        "Guest Limit Exceeded"
      );

      return;
    }

    // -------------------------------------------------------
    // IMPORTANT:
    // Keep BOTH backend ID and hall identity.
    // This allows the next pages to find the hall correctly.
    // -------------------------------------------------------

    navigate(`/hall/${hall.id}/availability`, {
      state: {
        hallId: String(hall.id),
        localHallId: hall.localId
          ? String(hall.localId)
          : null,

        hallName: hall.name,
        location: hall.location,

        date,
        guests: Number(guests),
        eventType,
      },
    });
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loadingHall) {
    return (
      <section className="min-h-[70vh] bg-[#F8F6F0] px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-[#0B2239]">
          Loading Hall...
        </h1>

        <p className="mt-3 text-gray-600">
          Please wait while we load the hall details.
        </p>
      </section>
    );
  }

  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!hall) {
    return (
      <section className="min-h-[70vh] bg-[#F8F6F0] px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-[#0B2239]">
          Hall Not Found
        </h1>

        <p className="mt-3 text-gray-600">
          We couldn't find the hall you're looking for.
        </p>

        <Link
          to="/explore"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0B2742] px-6 py-3 font-semibold text-white"
        >
          <ArrowLeft size={18} />
          Back to Explore Halls
        </Link>
      </section>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <section className="min-h-screen bg-[#F8F6F0] px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-[1100px]">

        {/* BACK */}

        <Link
          to={`/hall/${hall.id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0B2742] hover:text-[#C6922E]"
        >
          <ArrowLeft size={18} />
          Back to Hall Details
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* =================================================
              BOOKING FORM
          ================================================= */}

          <div className="rounded-2xl bg-white p-6 shadow-sm lg:p-8">

            <div>
              <p className="text-sm font-semibold tracking-wide text-[#C6922E]">
                HALLMATE BOOKING
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#0B2239]">
                Check Availability
              </h1>

              <p className="mt-2 text-gray-600">
                Tell us about your event and we'll check this hall for you.
              </p>
            </div>

            <form
              onSubmit={handleContinue}
              className="mt-8 space-y-6"
            >

              {/* EVENT DATE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0B2239]">
                  Event Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#C6922E]"
                  />

                  <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                      setDate(e.target.value)
                    }
                    onKeyDown={handleDateKeyDown}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    className="h-[52px] w-full rounded-xl border border-[#DDD8CC] bg-white py-3.5 pl-11 pr-4 text-[#0B2239] outline-none focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/20"
                  />
                </div>

                <p className="mt-1.5 text-xs text-gray-500">
                  Press Enter to continue
                </p>
              </div>

              {/* GUESTS */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0B2239]">
                  Number of Guests
                </label>

                <div className="relative">
                  <Users
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#C6922E]"
                  />

                  <input
                    ref={guestsRef}
                    type="number"
                    min="1"
                    max={hall.capacity}
                    value={guests}
                    onChange={(e) =>
                      setGuests(e.target.value)
                    }
                    onKeyDown={handleGuestsKeyDown}
                    placeholder={`Up to ${hall.capacity} guests`}
                    className="h-[52px] w-full rounded-xl border border-[#DDD8CC] bg-white py-3.5 pl-11 pr-4 text-[#0B2239] outline-none focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/20"
                  />
                </div>

                <p className="mt-1.5 text-xs text-gray-500">
                  Maximum capacity: {hall.capacity} guests
                </p>
              </div>

              {/* EVENT TYPE */}

              <div className="relative">

                <label className="mb-2 block text-sm font-semibold text-[#0B2239]">
                  Event Type
                </label>

                <button
                  ref={eventTypeRef}
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  onClick={() =>
                    setDropdownOpen(
                      (prev) => !prev
                    )
                  }
                  onKeyDown={handleEventKeyDown}
                  className={`flex h-[52px] w-full items-center justify-between rounded-xl border bg-white px-4 text-left outline-none transition ${
                    dropdownOpen
                      ? "border-[#C6922E] ring-2 ring-[#C6922E]/20"
                      : "border-[#DDD8CC] hover:border-[#C6922E]"
                  }`}
                >
                  <span
                    className={
                      eventType
                        ? "text-[#0B2239]"
                        : "text-gray-400"
                    }
                  >
                    {eventType ||
                      "Select event type"}
                  </span>

                  <ChevronDown
                    size={19}
                    className={`text-[#0B2742] transition-transform ${
                      dropdownOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div
                    role="listbox"
                    className="absolute left-0 right-0 top-[78px] z-30 overflow-hidden rounded-xl border border-[#E8E3D8] bg-white p-1.5 shadow-xl"
                  >
                    {hall.eventTypes.map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          role="option"
                          aria-selected={
                            eventType === type
                          }
                          onClick={() =>
                            handleEventSelect(
                              type
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                            eventType === type
                              ? "bg-[#FBF7ED] text-[#C6922E]"
                              : "text-[#0B2239] hover:bg-[#FBF7ED] hover:text-[#C6922E]"
                          }`}
                        >
                          <span>{type}</span>

                          {eventType === type && (
                            <Check
                              size={17}
                              className="text-[#C6922E]"
                            />
                          )}
                        </button>
                      )
                    )}
                  </div>
                )}

                <p className="mt-1.5 text-xs text-gray-500">
                  Press Enter to open the options
                </p>
              </div>

              {/* CONTINUE */}

              <button
                ref={continueRef}
                type="submit"
                onKeyDown={handleContinueKeyDown}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C6922E] px-6 py-4 font-bold text-white transition hover:bg-[#AD7F25] focus:outline-none focus:ring-2 focus:ring-[#C6922E] focus:ring-offset-2"
              >
                <CheckCircle size={19} />
                Check Availability
              </button>

            </form>
          </div>

          {/* =================================================
              HALL SUMMARY
          ================================================= */}

          <div className="h-fit overflow-hidden rounded-2xl border border-[#E8E3D8] bg-white">

            <img
              src={hall.image}
              alt={hall.name}
              className="h-52 w-full object-cover"
            />

            <div className="p-6">

              <p className="text-sm text-gray-500">
                Your selected hall
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#0B2239]">
                {hall.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {hall.location}
              </p>

              <div className="my-5 border-t border-[#E8E3D8]" />

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Capacity
                </span>

                <span className="font-semibold text-[#0B2239]">
                  {hall.capacity} guests
                </span>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="text-gray-600">
                  Starting price
                </span>

                <span className="font-bold text-[#0B2239]">
                  ₹{hall.price.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="mt-5 rounded-xl bg-[#FBF7ED] p-4">
                <p className="text-sm leading-6 text-gray-600">
                  Final availability and booking details will be confirmed before any payment is required.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}