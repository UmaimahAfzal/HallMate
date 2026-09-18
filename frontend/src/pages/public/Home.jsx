import {
  ArrowRight,
  Sparkles,
  Search,
  MapPin,
  CalendarDays,
  BriefcaseBusiness,
  ChevronDown,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
export default function Home() {
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const dateInputRef = useRef(null);

  const locations = [
    "Nizamabad",
    "Hyderabad",
    "Warangal",
    "Karimnagar",
    "Mumbai",
    "Bangalore",
  ];

  const eventTypes = [
    "Wedding",
    "Corporate",
    "Birthday",
    "Party",
    "Exhibition",
    "Other",
  ];

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const selectLocation = (value) => {
    setLocation(value);
    setOpenDropdown(null);
  };

  const selectEventType = (value) => {
    setEventType(value);
    setOpenDropdown(null);
  };

  const handleDateChange = (e) => {
    setEventDate(e.target.value);
    setOpenDropdown(null);
  };

  return (
    <div className="bg-[#F8F6F0]">

      {/* =====================================================
          HERO / LANDING PAGE
      ====================================================== */}
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">

        {/* Hall Background Image */}
        <img
          src="/images/hero-hall.jpg"
          alt="Elegant event hall"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#061727]/45" />

        {/* Slight warm overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 py-16 lg:px-8">

          <div className="w-full max-w-5xl">

            {/* Small Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4A84F]/50 bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Sparkles size={16} className="text-[#D4A84F]" />
              AI-powered venue discovery
            </div>

            {/* Main Heading */}
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
              Find the perfect
              <span className="block text-[#D4A84F]">
                hall for your moment.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 md:text-xl">
              Discover beautiful event venues, compare your options,
              check availability and book with confidence — all in one
              intelligent platform.
            </p>

            {/* =====================================================
                SEARCH BOX
            ====================================================== */}
            <div className="mt-9 max-w-5xl rounded-2xl border border-white/20 bg-white p-3 shadow-2xl">

              <div className="grid gap-2 md:grid-cols-4">

                {/* =================================================
                    LOCATION
                ================================================== */}
                <div className="relative">

                  <button
                    type="button"
                    onClick={() => toggleDropdown("location")}
                    className="flex min-h-[64px] w-full items-center gap-3 rounded-xl bg-[#F8F6F0] px-4 py-3 text-left transition hover:bg-[#F3EFE5]"
                  >
                    <MapPin
                      size={20}
                      className="shrink-0 text-[#B88A2B]"
                    />

                    <div className="w-full">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Location
                      </p>

                      <p
                        className={`mt-0.5 text-sm font-medium ${
                          location
                            ? "text-[#0B2239]"
                            : "text-[#0B2239]"
                        }`}
                      >
                        {location || "Select location"}
                      </p>
                    </div>

                    <ChevronDown
                      size={17}
                      className={`shrink-0 text-[#0B2239] transition-transform duration-200 ${
                        openDropdown === "location"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {/* Location Dropdown */}
                  {openDropdown === "location" && (
                    <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                      {locations.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => selectLocation(item)}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-[#0B2239] transition hover:bg-[#F8F6F0]"
                        >
                          <span className="flex items-center gap-3">
                            <MapPin
                              size={17}
                              className="text-[#B88A2B]"
                            />
                            {item}
                          </span>

                          {location === item && (
                            <Check
                              size={16}
                              className="text-[#B88A2B]"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                </div>


                {/* =================================================
    EVENT DATE
================================================== */}
<div className="relative">

  <button
    type="button"
    onClick={() => {
      dateInputRef.current?.showPicker?.();
      dateInputRef.current?.focus();
    }}
    className="relative flex min-h-[64px] w-full items-center gap-3 rounded-xl bg-[#F8F6F0] px-4 py-3 text-left transition hover:bg-[#F3EFE5]"
  >

    <CalendarDays
      size={20}
      className="shrink-0 text-[#B88A2B]"
    />

    <div className="w-full">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Event Date
      </p>

      <p className="mt-0.5 text-sm font-medium text-[#0B2239]">
        {eventDate
          ? new Date(eventDate + "T00:00:00").toLocaleDateString("en-GB")
          : "Select date"}
      </p>
    </div>

    <ChevronDown
      size={17}
      className="shrink-0 text-[#0B2239]"
    />

    {/* REAL DATE PICKER */}
    <input
      ref={dateInputRef}
      type="date"
      value={eventDate}
      onChange={(e) => setEventDate(e.target.value)}
      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      aria-label="Choose event date"
    />

  </button>

</div>

                {/* =================================================
                    EVENT TYPE
                ================================================== */}
                <div className="relative">

                  <button
                    type="button"
                    onClick={() => toggleDropdown("type")}
                    className="flex min-h-[64px] w-full items-center gap-3 rounded-xl bg-[#F8F6F0] px-4 py-3 text-left transition hover:bg-[#F3EFE5]"
                  >
                    <BriefcaseBusiness
                      size={20}
                      className="shrink-0 text-[#B88A2B]"
                    />

                    <div className="w-full">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Event Type
                      </p>

                      <p className="mt-0.5 text-sm font-medium text-[#0B2239]">
                        {eventType || "Select type"}
                      </p>
                    </div>

                    <ChevronDown
                      size={17}
                      className={`shrink-0 text-[#0B2239] transition-transform duration-200 ${
                        openDropdown === "type"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {/* Event Type Dropdown */}
                  {openDropdown === "type" && (
                    <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">

                      {eventTypes.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => selectEventType(item)}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-[#0B2239] transition hover:bg-[#F8F6F0]"
                        >
                          <span className="flex items-center gap-3">
                            <BriefcaseBusiness
                              size={17}
                              className="text-[#B88A2B]"
                            />
                            {item}
                          </span>

                          {eventType === item && (
                            <Check
                              size={16}
                              className="text-[#B88A2B]"
                            />
                          )}
                        </button>
                      ))}

                    </div>
                  )}

                </div>


                {/* =================================================
                    SEARCH BUTTON
                ================================================== */}
                <Link
  to={`/explore?location=${encodeURIComponent(location)}&date=${encodeURIComponent(eventDate)}&type=${encodeURIComponent(eventType)}`}
  className="flex min-h-[64px] items-center justify-center gap-2 rounded-xl bg-[#0B2239] px-5 text-sm font-semibold text-white transition hover:bg-[#D4A84F]"
>
  <Search size={19} />
  Search
</Link>

              </div>
            </div>


            {/* AI Link */}
            <Link
              to="/ai-assistant"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/85 transition hover:text-white"
            >
              <Sparkles
                size={15}
                className="text-[#D4A84F]"
              />

              Or tell our AI what kind of venue you're looking for.

              <ArrowRight size={15} />
            </Link>

          </div>
        </div>
      </section>


      {/* =====================================================
          TRUST STRIP
      ====================================================== */}
      <section className="border-y border-slate-200 bg-white">

        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 text-center sm:grid-cols-3 lg:px-8">

          <div>
            <p className="text-2xl font-bold text-[#0B2239]">
              500+
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Venues to discover
            </p>
          </div>


          <div>
            <p className="text-2xl font-bold text-[#0B2239]">
              AI Powered
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Smarter recommendations
            </p>
          </div>


          <div>
            <p className="text-2xl font-bold text-[#0B2239]">
              Simple
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Search to booking
            </p>
          </div>

        </div>
      </section>


      {/* =====================================================
          AI SECTION
      ====================================================== */}
      <section
        id="ai"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >

        <div className="max-w-3xl">

          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#B88A2B]">
            Meet HallMate AI
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#0B2239] md:text-5xl">

            Don't search through hundreds

            <span className="block">
              of halls.
            </span>

            <span className="block text-slate-400">
              Tell us what you need.
            </span>

          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Describe your event naturally and HallMate can understand your
            requirements and help you find suitable venues.
          </p>

          <Link
            to="/ai-assistant"
className="flex min-h-[64px] items-center justify-center gap-2 rounded-xl bg-[#0B2239] px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#D4A84F] hover:text-[#0B2239]"          >
            Try HallMate AI
            <ArrowRight size={17} />
          </Link>

        </div>

      </section>

    </div>
  );
}