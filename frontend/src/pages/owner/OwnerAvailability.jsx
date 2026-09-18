import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  RefreshCw,
  XCircle,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function OwnerAvailability() {
  const navigate = useNavigate();

  const [owner, setOwner] = useState(null);
  const [ownerHalls, setOwnerHalls] = useState([]);

  const [selectedHallId, setSelectedHallId] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    getLocalDateString(new Date())
  );

  const [monthDate, setMonthDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const [availabilityMap, setAvailabilityMap] = useState({});
  const [selectedAvailability, setSelectedAvailability] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
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
  // LOAD OWNER'S HALLS
  // =====================================================

  const loadOwnerHalls = async () => {
    if (!owner?.id) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/halls`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load your halls."
        );
      }

      const myHalls = (data.halls || []).filter(
        (hall) =>
          Number(hall.owner_id) === Number(owner.id)
      );

      setOwnerHalls(myHalls);

      if (myHalls.length > 0) {
        setSelectedHallId((current) => {
          if (
            current &&
            myHalls.some(
              (hall) => String(hall.id) === String(current)
            )
          ) {
            return current;
          }

          return String(myHalls[0].id);
        });
      }
    } catch (err) {
      console.error("Availability hall loading error:", err);

      setError(
        err.message ||
          "Unable to load your halls. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (owner?.id) {
      loadOwnerHalls();
    }
  }, [owner]);

  // =====================================================
  // SELECTED HALL
  // =====================================================

  const selectedHall = useMemo(() => {
    return ownerHalls.find(
      (hall) =>
        String(hall.id) === String(selectedHallId)
    );
  }, [ownerHalls, selectedHallId]);

  // =====================================================
  // CHECK AVAILABILITY
  // =====================================================

  const checkDateAvailability = async (
    hallId,
    date,
    updateSelected = true
  ) => {
    if (!hallId || !date) return null;

    try {
      const response = await fetch(
        `${API_URL}/api/halls/${hallId}/availability?date=${date}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Availability check failed."
        );
      }

      const result = {
        date,
        available: Boolean(data.available),
      };

      setAvailabilityMap((prev) => ({
        ...prev,
        [date]: result,
      }));

      if (updateSelected) {
        setSelectedAvailability(result);
      }

      return result;
    } catch (err) {
      console.error("Availability check error:", err);

      if (updateSelected) {
        setSelectedAvailability({
          date,
          available: null,
          error:
            err.message ||
            "Unable to check availability.",
        });
      }

      return null;
    }
  };

  // =====================================================
  // CHECK SELECTED DATE
  // =====================================================

  const handleCheckSelectedDate = async () => {
    if (!selectedHallId || !selectedDate) return;

    setChecking(true);

    await checkDateAvailability(
      selectedHallId,
      selectedDate,
      true
    );

    setChecking(false);
  };

  // =====================================================
  // WHEN HALL CHANGES
  // =====================================================

  useEffect(() => {
    if (!selectedHallId || !selectedDate) return;

    setAvailabilityMap({});
    setSelectedAvailability(null);

    checkDateAvailability(
      selectedHallId,
      selectedDate,
      true
    );
  }, [selectedHallId]);

  // =====================================================
  // CALENDAR DAYS
  // =====================================================

  const calendarDays = useMemo(() => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [monthDate]);

  const monthLabel = monthDate.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  );

  // =====================================================
  // DATE HELPERS
  // =====================================================

  function isPastDate(date) {
    return startOfDay(date) < startOfDay(new Date());
  }

  function isToday(date) {
    return (
      getLocalDateString(date) ===
      getLocalDateString(new Date())
    );
  }

  function isSelected(date) {
    return (
      getLocalDateString(date) === selectedDate
    );
  }

  // =====================================================
  // SELECT CALENDAR DATE
  // =====================================================

  const handleDateSelect = async (date) => {
    if (!date || isPastDate(date)) return;

    const dateString = getLocalDateString(date);

    setSelectedDate(dateString);

    if (selectedHallId) {
      await checkDateAvailability(
        selectedHallId,
        dateString,
        true
      );
    }
  };

  // =====================================================
  // MONTH NAVIGATION
  // =====================================================

  const goToPreviousMonth = () => {
    const today = new Date();

    const previous = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() - 1,
      1
    );

    const currentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    if (previous < currentMonth) return;

    setMonthDate(previous);
  };

  const goToNextMonth = () => {
    setMonthDate(
      new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        1
      )
    );
  };

  const formattedSelectedDate = selectedDate
    ? formatDateForDisplay(selectedDate)
    : "Select a date";

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-90px)] items-center justify-center bg-[#F3EFE6] px-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0B2742] shadow-lg">
            <RefreshCw
              size={25}
              className="animate-spin text-[#D9A441]"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#0B2742]">
            Loading your availability
          </h2>

          <p className="mt-2 text-sm text-[#687B8D]">
            Fetching your halls...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-90px)] items-center justify-center bg-[#F3EFE6] px-6">
        <div className="w-full max-w-lg rounded-2xl border border-[#DDD6C9] bg-white p-8 text-center shadow-md">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0F0]">
            <XCircle
              size={28}
              className="text-[#C24141]"
            />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-[#0B2742]">
            Unable to load availability
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#687B8D]">
            {error}
          </p>

          <button
            type="button"
            onClick={loadOwnerHalls}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B2742] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#173A5C]"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F3EFE6]">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="border-b border-[#DCD5C8] bg-white">

        <div className="mx-auto max-w-[1280px] px-6 py-7 lg:px-10">

          
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="text-xs font-bold tracking-[0.22em] text-[#C6922E]">
                DATE MANAGEMENT
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0B2742] md:text-4xl">
                Availability
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#53677A]">
                Check and monitor booking availability across
                your HallMate venues.
              </p>

            </div>

            <div className="flex w-fit items-center gap-3 rounded-xl border border-[#E2D8C5] bg-[#FBF7EE] px-5 py-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B2742]">
                <CalendarDays
                  size={18}
                  className="text-[#D9A441]"
                />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A7A62]">
                  Your venues
                </p>

                <p className="text-sm font-bold text-[#0B2742]">
                  {ownerHalls.length} halls
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="mx-auto max-w-[1280px] px-6 py-8 lg:px-10">

        {/* =================================================
            HALL SELECTOR
        ================================================= */}

        <section className="rounded-2xl border border-[#DDD6C9] bg-white p-6 shadow-[0_4px_18px_rgba(11,39,66,0.06)]">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end">

            <div className="flex-1">

              <label
                htmlFor="hall-select"
                className="mb-2 block text-sm font-bold text-[#0B2742]"
              >
                Select Hall
              </label>

              <div className="relative">

                <Building2
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C6922E]"
                />

                <select
                  id="hall-select"
                  value={selectedHallId}
                  onChange={(e) =>
                    setSelectedHallId(e.target.value)
                  }
                  className="h-13 w-full appearance-none rounded-xl border border-[#D6CEC0] bg-[#FEFDFC] pl-11 pr-4 text-sm font-semibold text-[#0B2742] outline-none transition hover:border-[#C8B99E] focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
                >
                  {ownerHalls.map((hall) => (
                    <option
                      key={hall.id}
                      value={hall.id}
                    >
                      {hall.name} — {hall.location}
                    </option>
                  ))}
                </select>

              </div>

            </div>

            <div className="lg:w-[300px]">

              <label
                htmlFor="availability-date"
                className="mb-2 block text-sm font-bold text-[#0B2742]"
              >
                Check Specific Date
              </label>

              <input
                id="availability-date"
                type="date"
                value={selectedDate}
                min={getLocalDateString(new Date())}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
                className="h-13 w-full rounded-xl border border-[#D6CEC0] bg-[#FEFDFC] px-4 text-sm font-semibold text-[#0B2742] outline-none transition hover:border-[#C8B99E] focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
              />

            </div>

            <button
              type="button"
              onClick={handleCheckSelectedDate}
              disabled={
                checking ||
                !selectedHallId ||
                !selectedDate
              }
              className="flex h-13 items-center justify-center gap-2 rounded-xl bg-[#0B2742] px-7 text-sm font-bold text-white shadow-sm transition hover:bg-[#173A5C] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checking ? (
                <>
                  <RefreshCw
                    size={17}
                    className="animate-spin"
                  />
                  Checking...
                </>
              ) : (
                <>
                  <CalendarDays size={17} />
                  Check Availability
                </>
              )}
            </button>

          </div>

          {/* HALL DETAILS */}

          {selectedHall && (
            <div className="mt-6 flex flex-col gap-4 border-t border-[#E9E3D8] pt-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-bold text-[#0B2742]">
                  {selectedHall.name}
                </h2>

                <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[#687B8D]">
                  <MapPin
                    size={15}
                    className="text-[#C6922E]"
                  />
                  {selectedHall.location}
                </div>

              </div>

              <div className="flex items-center gap-2 rounded-full border border-[#CBE7D5] bg-[#F0FAF3] px-4 py-2 text-xs font-bold text-[#16834A]">
                <CheckCircle2 size={15} />
                Active Hall
              </div>

            </div>
          )}

        </section>

        {/* =================================================
            AVAILABILITY RESULT
        ================================================= */}

        <section className="mt-6">

          {selectedAvailability?.error ? (

            <div className="rounded-2xl border border-[#E9C8C8] bg-white p-6 shadow-sm">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F0]">
                  <XCircle
                    size={22}
                    className="text-[#C24141]"
                  />
                </div>

                <div>
                  <h2 className="font-bold text-[#0B2742]">
                    Availability check failed
                  </h2>

                  <p className="mt-1 text-sm text-[#687B8D]">
                    {selectedAvailability.error}
                  </p>
                </div>

              </div>

            </div>

          ) : selectedAvailability?.available === true ? (

            <div className="rounded-2xl border border-[#BFDCC9] bg-[#F3FAF5] p-6 shadow-sm">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#DDF2E4]">
                    <CheckCircle2
                      size={27}
                      className="text-[#16834A]"
                    />
                  </div>

                  <div>

                    <p className="text-xs font-bold tracking-[0.15em] text-[#16834A]">
                      AVAILABLE
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-[#0B2742]">
                      {formattedSelectedDate}
                    </h2>

                    <p className="mt-1 text-sm text-[#53677A]">
                      No pending or accepted booking is
                      currently recorded for this date.
                    </p>

                  </div>

                </div>

                <div className="rounded-xl border border-[#E4E7E4] bg-white px-5 py-3 text-center shadow-sm">

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9AA8B8]">
                    Hall
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#0B2742]">
                    {selectedHall?.name}
                  </p>

                </div>

              </div>

            </div>

          ) : selectedAvailability?.available === false ? (

            <div className="rounded-2xl border border-[#E5CCA1] bg-[#FFF9ED] p-6 shadow-sm">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F8E8C5]">
                    <Clock3
                      size={25}
                      className="text-[#B07817]"
                    />
                  </div>

                  <div>

                    <p className="text-xs font-bold tracking-[0.15em] text-[#A36B0E]">
                      NOT AVAILABLE
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-[#0B2742]">
                      {formattedSelectedDate}
                    </h2>

                    <p className="mt-1 text-sm text-[#53677A]">
                      This date already has a pending or
                      accepted booking request.
                    </p>

                  </div>

                </div>

                <div className="rounded-xl border border-[#EDE5D7] bg-white px-5 py-3 text-center shadow-sm">

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9AA8B8]">
                    Hall
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#0B2742]">
                    {selectedHall?.name}
                  </p>

                </div>

              </div>

            </div>

          ) : (

            <div className="rounded-2xl border border-[#DDD6C9] bg-white p-6 shadow-sm">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7F1E4]">
                  <CalendarDays
                    size={23}
                    className="text-[#C6922E]"
                  />
                </div>

                <div>

                  <h2 className="font-bold text-[#0B2742]">
                    Select a date
                  </h2>

                  <p className="mt-1 text-sm text-[#687B8D]">
                    Choose a date below to check its
                    availability.
                  </p>

                </div>

              </div>

            </div>

          )}

        </section>

        {/* =================================================
            CALENDAR
        ================================================= */}

        <section className="mt-7 overflow-hidden rounded-2xl border border-[#D9D1C4] bg-white shadow-[0_5px_20px_rgba(11,39,66,0.07)]">

          {/* CALENDAR HEADER */}

          <div className="flex flex-col gap-4 border-b border-[#DDD6C9] bg-[#FEFDFC] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-bold tracking-[0.2em] text-[#C6922E]">
                CALENDAR
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#0B2742]">
                {monthLabel}
              </h2>

            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={goToPreviousMonth}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D6CEC0] bg-white text-[#53677A] transition hover:border-[#C6922E] hover:text-[#C6922E]"
                aria-label="Previous month"
              >
                <ChevronLeft size={19} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setMonthDate(
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      1
                    )
                  )
                }
                className="h-10 rounded-xl border border-[#D6CEC0] bg-white px-4 text-xs font-bold text-[#0B2742] transition hover:border-[#C6922E] hover:text-[#C6922E]"
              >
                Today
              </button>

              <button
                type="button"
                onClick={goToNextMonth}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D6CEC0] bg-white text-[#53677A] transition hover:border-[#C6922E] hover:text-[#C6922E]"
                aria-label="Next month"
              >
                <ChevronRight size={19} />
              </button>

            </div>

          </div>

          {/* LEGEND */}

          <div className="flex flex-wrap gap-6 border-b border-[#DDD6C9] bg-[#FAF8F3] px-6 py-4">

            <div className="flex items-center gap-2 text-xs font-semibold text-[#53677A]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#16834A]" />
              Available
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#53677A]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#C6922E]" />
              Booked / Requested
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#53677A]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#BDB5A7]" />
              Past date
            </div>

          </div>

          {/* WEEK DAYS */}

          <div className="grid grid-cols-7 border-b border-[#D9D1C4] bg-[#F5F1E8]">

            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map((day) => (
              <div
                key={day}
                className="border-r border-[#D9D1C4] px-2 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-[#53677A]"
              >
                {day}
              </div>
            ))}

          </div>

          {/* CALENDAR DAYS */}

          <div className="grid grid-cols-7">

            {calendarDays.map((date, index) => {

              if (!date) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[90px] border-b border-r border-[#E1DBD0] bg-[#F8F6F0]"
                  />
                );
              }

              const dateString =
                getLocalDateString(date);

              const cached =
                availabilityMap[dateString];

              const past = isPastDate(date);
              const today = isToday(date);
              const selected = isSelected(date);

              return (
                <button
                  type="button"
                  key={dateString}
                  disabled={past}
                  onClick={() =>
                    handleDateSelect(date)
                  }
                  className={`relative min-h-[90px] border-b border-r border-[#E1DBD0] p-2 text-left transition ${
                    past
                      ? "cursor-not-allowed bg-[#F8F6F0]"
                      : "bg-white hover:bg-[#FBF8F1]"
                  } ${
                    selected
                      ? "bg-[#FFF9ED] ring-2 ring-inset ring-[#C6922E]"
                      : ""
                  }`}
                >

                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      today
                        ? "bg-[#0B2742] text-white shadow-sm"
                        : past
                        ? "text-[#B9B1A3]"
                        : "text-[#0B2742]"
                    }`}
                  >
                    {date.getDate()}
                  </div>

                  {!past && cached && (
                    <div className="mt-3">

                      <div
                        className={`flex items-center gap-1.5 text-[10px] font-bold ${
                          cached.available
                            ? "text-[#16834A]"
                            : "text-[#A36B0E]"
                        }`}
                      >

                        <span
                          className={`h-2 w-2 rounded-full ${
                            cached.available
                              ? "bg-[#16834A]"
                              : "bg-[#C6922E]"
                          }`}
                        />

                        {cached.available
                          ? "Available"
                          : "Booked"}

                      </div>

                    </div>
                  )}

                  {!past && !cached && (
                    <p className="mt-3 text-[10px] font-semibold text-[#9A9183]">
                      Check date
                    </p>
                  )}

                </button>
              );
            })}

          </div>

        </section>

        {/* =================================================
            HOW IT WORKS
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-[#D9D1C4] bg-white p-5 shadow-sm">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B2742]">
              <CalendarDays
                size={18}
                className="text-[#D9A441]"
              />
            </div>

            <div>

              <h3 className="text-sm font-bold text-[#0B2742]">
                How availability works
              </h3>

              <p className="mt-1 text-xs leading-5 text-[#53677A]">
                A date becomes unavailable when a customer has
                a pending or accepted booking request for this
                hall. Rejected or cancelled requests do not
                block the date.
              </p>

            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

// =========================================================
// HELPERS
// =========================================================

function getLocalDateString(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function startOfDay(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function formatDateForDisplay(dateString) {
  const [year, month, day] =
    dateString.split("-").map(Number);

  const date = new Date(
    year,
    month - 1,
    day
  );

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}