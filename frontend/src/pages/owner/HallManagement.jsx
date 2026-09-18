import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  IndianRupee,
  Search,
  RefreshCw,
  CalendarDays,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import localHalls from "../../data/halls";

export default function HallManagement() {
  const navigate = useNavigate();

  const [owner, setOwner] = useState(null);
  const [ownerHalls, setOwnerHalls] = useState([]);

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All Locations");

  const [loading, setLoading] = useState(true);
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
      const response = await fetch(
        "http://localhost:5000/api/halls"
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load halls."
        );
      }

      // Only halls belonging to the logged-in owner.
      const myHalls = (data.halls || []).filter(
        (hall) =>
          Number(hall.owner_id) === Number(owner.id)
      );

      setOwnerHalls(myHalls);
    } catch (err) {
      console.error("Hall loading error:", err);

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
  // FORMATTERS
  // =====================================================

  const formatCurrency = (value) => {
    const amount = Number(value || 0);

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // =====================================================
  // GET IMAGE
  //
  // Backend hall data is matched with the existing local
  // HallMate hall data so we continue using the same
  // established hall imagery.
  // =====================================================

  const getHallImage = (hall) => {
    if (hall.image) {
      return hall.image;
    }

    if (hall.image_url) {
      return hall.image_url;
    }

    if (hall.imageUrl) {
      return hall.imageUrl;
    }

    const localHall = localHalls.find(
      (item) =>
        item.name === hall.name &&
        String(item.location).toLowerCase() ===
          String(hall.location).toLowerCase()
    );

    if (localHall?.images?.length) {
      return localHall.images[0];
    }

    if (localHall?.image) {
      return localHall.image;
    }

    return null;
  };

  // =====================================================
  // LOCATIONS
  // =====================================================

  const locations = useMemo(() => {
    const uniqueLocations = [
      ...new Set(
        ownerHalls
          .map((hall) => hall.location)
          .filter(Boolean)
      ),
    ];

    return uniqueLocations.sort();
  }, [ownerHalls]);

  // =====================================================
  // FILTERED HALLS
  // =====================================================

  const filteredHalls = useMemo(() => {
    const query = search.trim().toLowerCase();

    return ownerHalls.filter((hall) => {
      const matchesSearch =
        !query ||
        String(hall.name || "")
          .toLowerCase()
          .includes(query) ||
        String(hall.location || "")
          .toLowerCase()
          .includes(query);

      const matchesLocation =
        locationFilter === "All Locations" ||
        hall.location === locationFilter;

      return matchesSearch && matchesLocation;
    });
  }, [ownerHalls, search, locationFilter]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("hallmateOwner");
    sessionStorage.removeItem("hallmateOwner");

    navigate("/owner/sign-in");
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
            Loading your halls
          </h2>

          <p className="mt-2 text-sm text-[#718096]">
            Fetching your assigned venues...
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
      <div className="flex min-h-[calc(100vh-90px)] items-center justify-center bg-[#F8F6F0] px-6">
        <div className="w-full max-w-lg rounded-2xl border border-[#E8E3D8] bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDECEC]">
            <Building2
              size={26}
              className="text-[#C24141]"
            />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-[#0B2742]">
            Unable to load your halls
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#718096]">
            {error}
          </p>

          <button
            type="button"
            onClick={loadOwnerHalls}
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
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F8F6F0]">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="border-b border-[#E8E3D8] bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-7 lg:px-10">

          {/* TITLE ROW */}

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="text-xs font-bold tracking-[0.2em] text-[#C6922E]">
                VENUE MANAGEMENT
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0B2742] md:text-4xl">
                My Halls
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718096]">
                View and manage your halls on HallMate.
              </p>

            </div>

            {/* ACTIONS */}

            <div className="flex items-center gap-3">

              {/* LIST YOUR HALL */}

              <button
                type="button"
                onClick={() => navigate("/owner/list-hall")}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0B2742] px-4 text-sm font-bold text-white transition hover:bg-[#123A5B]"
              >
                <Building2 size={17} />
                List Your Hall
              </button>

              {/* REFRESH */}

              <button
                type="button"
                onClick={loadOwnerHalls}
                disabled={loading}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E0D7] bg-white text-[#53677A] transition hover:border-[#C6922E] hover:text-[#C6922E] disabled:opacity-50"
                title="Refresh halls"
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
              </button>

              {/* HALL COUNT */}

              <div className="flex items-center gap-2 rounded-xl bg-[#F7F1E4] px-4 py-3">
                <Building2
                  size={18}
                  className="text-[#C6922E]"
                />

                <span className="text-sm font-bold text-[#0B2742]">
                  {ownerHalls.length} Halls
                </span>
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
            SUMMARY STRIP
        ================================================= */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-[#E8E3D8] bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7F1E4]">
                <Building2
                  size={20}
                  className="text-[#C6922E]"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-[#718096]">
                  Assigned Halls
                </p>

                <p className="mt-1 text-2xl font-bold text-[#0B2742]">
                  {ownerHalls.length}
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-[#E8E3D8] bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDF8F1]">
                <CheckCircle2
                  size={20}
                  className="text-[#16834A]"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-[#718096]">
                  Active Halls
                </p>

                <p className="mt-1 text-2xl font-bold text-[#0B2742]">
                  {ownerHalls.length}
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-[#E8E3D8] bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7F1E4]">
                <MapPin
                  size={20}
                  className="text-[#C6922E]"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-[#718096]">
                  Locations
                </p>

                <p className="mt-1 text-2xl font-bold text-[#0B2742]">
                  {locations.length}
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <section className="mt-7 rounded-2xl border border-[#E8E3D8] bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row">

            {/* SEARCH */}

            <div className="relative flex-1">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA8B8]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by hall name or location..."
                className="h-12 w-full rounded-xl border border-[#DDD8CC] bg-white pl-11 pr-4 text-sm text-[#0B2742] outline-none transition placeholder:text-[#9AA8B8] focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
              />

            </div>

            {/* LOCATION */}

            <select
              value={locationFilter}
              onChange={(e) =>
                setLocationFilter(e.target.value)
              }
              className="h-12 rounded-xl border border-[#DDD8CC] bg-white px-4 text-sm font-medium text-[#0B2742] outline-none transition focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10 md:w-[210px]"
            >
              <option>All Locations</option>

              {locations.map((location) => (
                <option
                  key={location}
                  value={location}
                >
                  {location}
                </option>
              ))}
            </select>

          </div>

          <div className="mt-4 flex items-center justify-between">

            <p className="text-xs text-[#718096]">
              Showing{" "}
              <span className="font-bold text-[#0B2742]">
                {filteredHalls.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#0B2742]">
                {ownerHalls.length}
              </span>{" "}
              halls
            </p>

            {(search ||
              locationFilter !== "All Locations") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setLocationFilter("All Locations");
                }}
                className="text-xs font-semibold text-[#C6922E] hover:underline"
              >
                Clear filters
              </button>
            )}

          </div>

        </section>

        {/* =================================================
            HALL GRID
        ================================================= */}

        {filteredHalls.length === 0 ? (

          <section className="mt-7 rounded-2xl border border-dashed border-[#D8D1C3] bg-white px-6 py-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7F1E4]">
              <Search
                size={27}
                className="text-[#C6922E]"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#0B2742]">
              No halls found
            </h2>

            <p className="mt-2 text-sm text-[#718096]">
              Try changing your search or location filter.
            </p>

          </section>

        ) : (

          <section className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredHalls.map((hall) => {

              const image = getHallImage(hall);

              return (
                <article
                  key={hall.id}
                  className="group overflow-hidden rounded-2xl border border-[#E8E3D8] bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#D8C49A] hover:shadow-md"
                >

                  {/* IMAGE */}

                  <div className="relative h-[210px] overflow-hidden bg-[#0B2742]">

                    {image ? (
                      <img
                        src={image}
                        alt={hall.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Building2
                          size={45}
                          className="text-[#D9A441]"
                        />
                      </div>
                    )}

                    {/* STATUS */}

                    <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#16834A] shadow-sm">
                      <CheckCircle2 size={14} />
                      Active
                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <h2 className="truncate text-lg font-bold text-[#0B2742]">
                          {hall.name}
                        </h2>

                        <div className="mt-2 flex items-center gap-1.5 text-sm text-[#718096]">
                          <MapPin
                            size={15}
                            className="shrink-0 text-[#C6922E]"
                          />

                          <span>
                            {hall.location}
                          </span>
                        </div>

                      </div>

                      <div className="shrink-0 rounded-lg bg-[#F7F1E4] px-2.5 py-1 text-[10px] font-bold text-[#C6922E]">
                        HALL
                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#EEE9DF] pt-4">

                      <div>

                        <div className="flex items-center gap-1.5 text-xs text-[#9AA8B8]">
                          <Users size={14} />
                          Capacity
                        </div>

                        <p className="mt-1 text-sm font-bold text-[#0B2742]">
                          {Number(
                            hall.capacity || 0
                          ).toLocaleString("en-IN")}{" "}
                          guests
                        </p>

                      </div>

                      <div>

                        <div className="flex items-center gap-1.5 text-xs text-[#9AA8B8]">
                          <IndianRupee size={14} />
                          Price
                        </div>

                        <p className="mt-1 text-sm font-bold text-[#0B2742]">
                          {formatCurrency(
                            hall.price_per_day ??
                              hall.price
                          )}
                        </p>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-5 flex gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/hall/${hall.id}`
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#DDD8CC] bg-white px-3 py-2.5 text-xs font-bold text-[#0B2742] transition hover:border-[#C6922E] hover:text-[#C6922E]"
                      >
                        View Hall
                        <ChevronRight size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/owner/availability`
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#0B2742] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#123A5B]"
                      >
                        <CalendarDays size={15} />
                        Availability
                      </button>

                    </div>

                  </div>

                </article>
              );
            })}

          </section>

        )}

        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="mt-10 border-t border-[#E8E3D8] pt-6 text-center">

          <p className="text-xs text-[#9AA8B8]">
            Showing halls managed by{" "}
            <span className="font-semibold text-[#718096]">
              {owner?.name}
            </span>
          </p>

        </div>

      </main>
    </div>
  );
}