import {
  Search,
  CalendarDays,
  SlidersHorizontal,
  Heart,
  Star,
  Car,
  Snowflake,
  ChevronDown,
  MapPin,
  Check,
  ArrowRight,
} from "lucide-react";

import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import localHalls from "../../data/halls";

// ============================================================
// LOCATIONS
// IMPORTANT: THIS IS THE DISPLAY ORDER
// ============================================================

const locations = [
  "All locations",
  "Hyderabad",
  "Nizamabad",
  "Nagpur",
  "Bengaluru",
  "Chennai",
  "Mumbai",
  "Pune",
  "Delhi",
];

const locationOrder = {
  Hyderabad: 1,
  Nizamabad: 2,
  Nagpur: 3,
  Bengaluru: 4,
  Chennai: 5,
  Mumbai: 6,
  Pune: 7,
  Delhi: 8,
};

// ============================================================
// EVENT TYPES
// ============================================================

const eventTypes = [
  "All event types",
  "Wedding",
  "Corporate",
  "Birthday",
  "Engagement",
  "Party",
  "Exhibition",
  "Other",
];

const sortOptions = [
  "Popularity",
  "Price",
  "Rating",
];

// ============================================================
// DROPDOWN
// ============================================================

function Dropdown({
  open,
  setOpen,
  name,
  value,
  icon: Icon,
  options,
  onSelect,
}) {
  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() =>
          setOpen(open === name ? null : name)
        }
        className="flex h-11 w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 text-left transition hover:border-[#D4A84F] focus:border-[#D4A84F] focus:outline-none"
      >
        <Icon
          size={17}
          className="shrink-0 text-[#5F7690]"
        />

        <span className="flex-1 truncate text-sm text-[#0B2239]">
          {value}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-[#0B2239] transition-transform ${
            open === name ? "rotate-180" : ""
          }`}
        />
      </button>

      {open === name && (
        <div className="absolute left-0 top-[calc(100%+7px)] z-[100] w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onSelect(option);
                setOpen(null);
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-[#0B2239] transition hover:bg-[#F8F6F0]"
            >
              <span>{option}</span>

              {value === option && (
                <Check
                  size={16}
                  className="text-[#D4A84F]"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// HALL CARD
// ============================================================

function HallCard({ hall }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const openHall = () => {
    // IMPORTANT:
    // Backend ID is the real hall ID.
    navigate(`/hall/${hall.id}`);
  };

  return (
    <article
      onClick={openHall}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openHall();
        }
      }}
      role="button"
      tabIndex={0}
      className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#D4A84F]/50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D4A84F]"
    >
      {/* IMAGE */}

      <div className="relative h-44 overflow-hidden bg-[#EDE9DF]">
        <img
          src={hall.image}
          alt={hall.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        {/* HEART */}

        <button
          type="button"
          aria-label={
            liked
              ? `Remove ${hall.name} from favourites`
              : `Add ${hall.name} to favourites`
          }
          onClick={(e) => {
            e.stopPropagation();
            setLiked((value) => !value);
          }}
          className="absolute right-3 top-3 rounded-full bg-white p-2 shadow-md transition hover:scale-105"
        >
          <Heart
            size={18}
            className={
              liked
                ? "fill-[#D4A84F] text-[#D4A84F]"
                : "text-[#0B2239]"
            }
          />
        </button>

        {/* AVAILABLE */}

        <span className="absolute bottom-3 left-3 rounded-md bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 shadow-sm">
          Available
        </span>
      </div>

      {/* CONTENT */}

      <div className="p-4">
        <h3 className="text-[15px] font-bold text-[#0B2239]">
          {hall.name}
        </h3>

        <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
          <MapPin size={12} />
          {hall.location}
        </p>

        {/* RATING */}

        <div className="mt-2.5 flex items-center gap-1 text-xs">
          <Star
            size={13}
            className="fill-[#D4A84F] text-[#D4A84F]"
          />

          <span className="font-semibold text-[#D4A84F]">
            {hall.rating}
          </span>

          <span className="text-slate-500">
            ({hall.reviews} reviews)
          </span>
        </div>

        {/* DETAILS */}

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
          <span>👥 {hall.capacity}</span>

          {hall.amenities?.AC && (
            <span className="flex items-center gap-1">
              <Snowflake size={12} />
              AC
            </span>
          )}

          {hall.amenities?.parking && (
            <span className="flex items-center gap-1">
              <Car size={12} />
              Parking
            </span>
          )}
        </div>

        {/* PRICE */}

        <div className="mt-3 flex items-end justify-between">
          <p className="text-[15px] font-bold text-[#0B2239]">
            ₹ {Number(hall.price).toLocaleString("en-IN")}

            <span className="ml-1 text-xs font-normal text-slate-500">
              / day
            </span>
          </p>

          <span className="flex items-center gap-1 text-xs font-semibold text-[#C6922E] opacity-0 transition group-hover:opacity-100">
            View
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </article>
  );
}

// ============================================================
// EXPLORE HALLS
// ============================================================

export default function ExploreHalls() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [halls, setHalls] = useState([]);
  const [loadingHalls, setLoadingHalls] =
    useState(true);
  const [hallError, setHallError] = useState("");

  // ==========================================================
  // LOAD FROM BACKEND
  // ==========================================================

  useEffect(() => {
    const loadHalls = async () => {
      try {
        setLoadingHalls(true);
        setHallError("");

        const response = await fetch(
          "http://localhost:5000/api/halls"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch halls"
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message ||
              "Failed to fetch halls"
          );
        }

        const formattedHalls =
          data.halls.map((hall) => ({
            id: String(hall.id),

            name: hall.name,

            location:
              hall.location || "Hyderabad",

            description:
              hall.description || "",

            image: hall.image,

            capacity:
              Number(hall.capacity) || 0,

            price:
              Number(hall.price_per_day) || 0,

            owner_id: hall.owner_id,

            owner_name:
              hall.owner_name ||
              "Hall Owner",

            rating: 4.5,

            reviews: 0,

           eventTypes:
  localHalls.find(
    (localHall) =>
      localHall.name === hall.name &&
      localHall.location === hall.location
  )?.eventTypes || [],

amenities:
  localHalls.find(
    (localHall) =>
      localHall.name === hall.name &&
      localHall.location === hall.location
  )?.amenities || {},

            available: true,
          }));

        setHalls(formattedHalls);
      } catch (error) {
        console.error(
          "Error loading halls:",
          error
        );

        setHallError(
          "Unable to load halls. Please make sure the HallMate backend is running."
        );
      } finally {
        setLoadingHalls(false);
      }
    };

    loadHalls();
  }, []);

  // ==========================================================
  // INITIAL SEARCH VALUES
  // ==========================================================

  const initialLocation =
    searchParams.get("location") || "";

  const initialDate =
    searchParams.get("date") || "";

  const initialType =
    searchParams.get("type") || "";

  // ==========================================================
  // SEARCH STATES
  // ==========================================================

  const [selectedLocation, setSelectedLocation] =
    useState(
      locations.includes(initialLocation)
        ? initialLocation
        : "All locations"
    );

  const [selectedDate, setSelectedDate] =
    useState(initialDate);

  const [selectedEventType, setSelectedEventType] =
    useState(
      eventTypes.includes(initialType)
        ? initialType
        : "All event types"
    );

  const [hallSearch, setHallSearch] =
    useState("");

  const [openDropdown, setOpenDropdown] =
    useState(null);

  // ==========================================================
  // FILTER STATES
  // ==========================================================

  const [selectedTypes, setSelectedTypes] =
    useState(
      eventTypes.includes(initialType) &&
        initialType !== "All event types"
        ? [initialType]
        : []
    );

  const [selectedAmenities, setSelectedAmenities] =
    useState([]);

  const [maxCapacity, setMaxCapacity] =
    useState(1000);

  const [maxPrice, setMaxPrice] =
    useState(100000);

  const [sort, setSort] =
    useState("Popularity");

  // ==========================================================
  // FILTER HANDLERS
  // ==========================================================

  const toggleType = (type) => {
    setSelectedTypes((current) =>
      current.includes(type)
        ? current.filter(
            (item) => item !== type
          )
        : [...current, type]
    );
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((current) =>
      current.includes(amenity)
        ? current.filter(
            (item) => item !== amenity
          )
        : [...current, amenity]
    );
  };

  // ==========================================================
  // URL UPDATE
  // ==========================================================

  const updateSearchParams = (
    location,
    date,
    eventType
  ) => {
    const params = new URLSearchParams();

    if (
      location &&
      location !== "All locations"
    ) {
      params.set("location", location);
    }

    if (date) {
      params.set("date", date);
    }

    if (
      eventType &&
      eventType !== "All event types"
    ) {
      params.set("type", eventType);
    }

    setSearchParams(params, {
      replace: true,
    });
  };

  // ==========================================================
  // LOCATION
  // ==========================================================

  const handleLocationChange = (value) => {
    setSelectedLocation(value);

    updateSearchParams(
      value,
      selectedDate,
      selectedEventType
    );
  };

  // ==========================================================
  // DATE
  // ==========================================================

  const handleDateChange = (value) => {
    setSelectedDate(value);

    updateSearchParams(
      selectedLocation,
      value,
      selectedEventType
    );
  };

  // ==========================================================
  // EVENT TYPE
  // ==========================================================

  const handleEventChange = (value) => {
    setSelectedEventType(value);

    if (value === "All event types") {
      setSelectedTypes([]);
    } else {
      setSelectedTypes([value]);
    }

    updateSearchParams(
      selectedLocation,
      selectedDate,
      value
    );
  };

  // ==========================================================
  // CLEAR ALL FILTERS
  // ==========================================================

  const clearFilters = () => {
    setSelectedLocation("All locations");
    setSelectedDate("");
    setSelectedEventType(
      "All event types"
    );

    setSelectedTypes([]);
    setSelectedAmenities([]);

    setMaxCapacity(1000);
    setMaxPrice(100000);

    setHallSearch("");

    setSort("Popularity");

    setSearchParams({});
  };

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredHalls = useMemo(() => {
    return halls.filter((hall) => {
      // LOCATION

      if (
        selectedLocation !==
          "All locations" &&
        hall.location?.toLowerCase() !==
          selectedLocation.toLowerCase()
      ) {
        return false;
      }

      // SEARCH

      if (hallSearch.trim()) {
        const text =
          hallSearch
            .trim()
            .toLowerCase();

        const matchesName =
          hall.name
            ?.toLowerCase()
            .includes(text);

        const matchesLocation =
          hall.location
            ?.toLowerCase()
            .includes(text);

        if (
          !matchesName &&
          !matchesLocation
        ) {
          return false;
        }
      }

      // EVENT TYPE

      if (
        selectedTypes.length > 0 &&
        !selectedTypes.some((type) =>
          hall.eventTypes?.includes(type)
        )
      ) {
        return false;
      }

      // CAPACITY

      if (
        Number(hall.capacity) >
        Number(maxCapacity)
      ) {
        return false;
      }

      // PRICE

      if (
        Number(hall.price) >
        Number(maxPrice)
      ) {
        return false;
      }

      // AMENITIES

      if (
        selectedAmenities.includes("AC") &&
        !hall.amenities?.AC
      ) {
        return false;
      }

      if (
        selectedAmenities.includes(
          "Parking"
        ) &&
        !hall.amenities?.parking
      ) {
        return false;
      }

      if (
        selectedAmenities.includes(
          "Catering"
        ) &&
        !hall.amenities?.catering
      ) {
        return false;
      }

      return true;
    });
  }, [
    halls,
    selectedLocation,
    hallSearch,
    selectedTypes,
    maxCapacity,
    maxPrice,
    selectedAmenities,
  ]);

  // ==========================================================
  // SORT
  //
  // IMPORTANT:
  // Popularity keeps LOCATION ORDER.
  //
  // Hyderabad halls first
  // then Nizamabad
  // then Nagpur
  // ...
  // ==========================================================

  const sortedHalls = useMemo(() => {
  return [...filteredHalls].sort((a, b) => {

    /*
     * LOCATION ORDER
     * 1. Hyderabad
     * 2. Nizamabad
     * 3. Everything else
     */
    const locationOrder = {
      hyderabad: 0,
      nizamabad: 1,
    };

    const locationA =
      locationOrder[
        String(a.location || "").toLowerCase()
      ] ?? 2;

    const locationB =
      locationOrder[
        String(b.location || "").toLowerCase()
      ] ?? 2;

    /*
     * FIRST: Hyderabad → Nizamabad → others
     */
    if (locationA !== locationB) {
      return locationA - locationB;
    }

    /*
     * THEN apply selected sorting
     */
    if (sort === "Price") {
      return (
        Number(a.price) -
        Number(b.price)
      );
    }

    if (sort === "Rating") {
      return (
        Number(b.rating) -
        Number(a.rating)
      );
    }

    /*
     * Popularity
     */
    return (
      Number(b.reviews) -
      Number(a.reviews)
    );
  });
}, [filteredHalls, sort]);  // ==========================================================
  // DATE DISPLAY
  // ==========================================================

  const formattedDate = selectedDate
    ? new Date(
        `${selectedDate}T00:00:00`
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#F8F6F0]">
      <main className="mx-auto max-w-7xl px-5 py-6 lg:px-8">

        {/* ==================================================
            TOP SEARCH
        ================================================== */}

        <div className="relative z-40 grid gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm md:grid-cols-[1.1fr_1.1fr_1fr_1.2fr]">

          {/* LOCATION */}

          <Dropdown
            open={openDropdown}
            setOpen={setOpenDropdown}
            name="location"
            value={selectedLocation}
            icon={MapPin}
            options={locations}
            onSelect={handleLocationChange}
          />

          {/* DATE */}

          <div className="relative">
            <div className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 transition hover:border-[#D4A84F]">
              <CalendarDays
                size={17}
                className="shrink-0 text-[#5F7690]"
              />

              <input
                type="date"
                value={selectedDate}
                onChange={(e) =>
                  handleDateChange(
                    e.target.value
                  )
                }
                className="w-full cursor-pointer bg-transparent text-sm text-[#0B2239] outline-none"
              />
            </div>
          </div>

          {/* EVENT */}

          <Dropdown
            open={openDropdown}
            setOpen={setOpenDropdown}
            name="event"
            value={selectedEventType}
            icon={SlidersHorizontal}
            options={eventTypes}
            onSelect={handleEventChange}
          />

          {/* SEARCH */}

          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F7690]"
            />

            <input
              type="text"
              value={hallSearch}
              onChange={(e) =>
                setHallSearch(
                  e.target.value
                )
              }
              placeholder="Search hall..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-[#0B2239] outline-none transition placeholder:text-slate-400 hover:border-[#D4A84F] focus:border-[#D4A84F]"
            />
          </div>
        </div>

        {/* DATE */}

        {formattedDate && (
          <div className="mt-3 text-xs text-slate-500">
            Showing halls for{" "}
            <span className="font-semibold text-[#0B2239]">
              {formattedDate}
            </span>
          </div>
        )}

        {/* ==================================================
            MAIN
        ================================================== */}

        <div className="relative z-10 mt-5 grid gap-6 lg:grid-cols-[230px_1fr]">

          {/* =================================================
              FILTER SIDEBAR
          ================================================= */}

          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0B2239]">
                Filters
              </h2>

              <button
                type="button"
                onClick={clearFilters}
                className="text-[11px] font-semibold text-[#D4A84F] hover:underline"
              >
                Clear
              </button>
            </div>

            {/* EVENT TYPE */}

            <div className="mt-5">
              <p className="text-sm font-bold text-[#0B2239]">
                Event Type
              </p>

              <div className="mt-3 space-y-2">
                {eventTypes
                  .filter(
                    (type) =>
                      type !==
                      "All event types"
                  )
                  .map((type) => (
                    <label
                      key={type}
                      className="flex cursor-pointer items-center gap-2 text-xs text-slate-600"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(
                          type
                        )}
                        onChange={() =>
                          toggleType(type)
                        }
                        className="accent-[#D4A84F]"
                      />

                      {type}
                    </label>
                  ))}
              </div>
            </div>

            {/* CAPACITY */}

            <div className="mt-7">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#0B2239]">
                  Capacity
                </p>

                <span className="text-[10px] text-slate-500">
                  Up to
                </span>
              </div>

              <input
                type="number"
                min="0"
                max="1000"
                value={maxCapacity}
                onChange={(e) =>
                  setMaxCapacity(
                    Math.min(
                      1000,
                      Math.max(
                        0,
                        Number(
                          e.target.value
                        )
                      )
                    )
                  )
                }
                className="mt-3 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-[#0B2239] outline-none focus:border-[#D4A84F]"
              />

              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={maxCapacity}
                onChange={(e) =>
                  setMaxCapacity(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="mt-4 w-full accent-[#D4A84F]"
              />

              <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                <span>0</span>

                <span>
                  {maxCapacity >= 1000
                    ? "1000+"
                    : maxCapacity}
                </span>
              </div>

              <p className="mt-2 text-[10px] text-slate-400">
                Showing halls with capacity
                up to{" "}
                <span className="font-semibold text-slate-500">
                  {maxCapacity >=
                  1000
                    ? "1000+"
                    : maxCapacity}
                </span>
              </p>
            </div>

            {/* PRICE */}

            <div className="mt-7">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#0B2239]">
                  Price Range
                </p>

                <span className="text-[10px] text-slate-500">
                  Up to
                </span>
              </div>

              <input
                type="number"
                min="0"
                max="100000"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(
                    Math.min(
                      100000,
                      Math.max(
                        0,
                        Number(
                          e.target.value
                        )
                      )
                    )
                  )
                }
                className="mt-3 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-[#0B2239] outline-none focus:border-[#D4A84F]"
              />

              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="mt-4 w-full accent-[#D4A84F]"
              />

              <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                <span>₹0</span>

                <span>
                  ₹
                  {maxPrice.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <p className="mt-2 text-[10px] text-slate-400">
                Showing halls up to{" "}
                <span className="font-semibold text-slate-500">
                  ₹
                  {maxPrice.toLocaleString(
                    "en-IN"
                  )}
                </span>{" "}
                per day
              </p>
            </div>

            {/* AMENITIES */}

            <div className="mt-7">
              <p className="text-sm font-bold text-[#0B2239]">
                Amenities
              </p>

              <div className="mt-3 space-y-2">
                {[
                  "AC",
                  "Parking",
                  "Catering",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex cursor-pointer items-center gap-2 text-xs text-slate-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(
                        item
                      )}
                      onChange={() =>
                        toggleAmenity(item)
                      }
                      className="accent-[#D4A84F]"
                    />

                    {item}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* =================================================
              RESULTS
          ================================================= */}

          <section>

            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-xl font-bold text-[#0B2239]">
                {loadingHalls
                  ? "Loading halls..."
                  : `${sortedHalls.length} Halls Found`}
              </h1>

              {/* SORT */}

              {!loadingHalls && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown ===
                          "sort"
                          ? null
                          : "sort"
                      )
                    }
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-[#0B2239] transition hover:border-[#D4A84F]"
                  >
                    <span>
                      Sort by:
                    </span>

                    <span className="font-semibold">
                      {sort}
                    </span>

                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        openDropdown ===
                        "sort"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {openDropdown ===
                    "sort" && (
                    <div className="absolute right-0 top-[calc(100%+7px)] z-[100] w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                      {sortOptions.map(
                        (option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setSort(
                                option
                              );
                              setOpenDropdown(
                                null
                              );
                            }}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-[#0B2239] hover:bg-[#F8F6F0]"
                          >
                            <span>
                              {option}
                            </span>

                            {sort ===
                              option && (
                              <Check
                                size={15}
                                className="text-[#D4A84F]"
                              />
                            )}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* LOADING */}

            {loadingHalls && (
              <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <p className="text-sm text-slate-500">
                  Loading HallMate halls...
                </p>
              </div>
            )}

            {/* ERROR */}

            {!loadingHalls &&
              hallError && (
                <div className="rounded-xl border border-red-200 bg-white p-10 text-center shadow-sm">
                  <h2 className="text-lg font-bold text-[#0B2239]">
                    Unable to load halls
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {hallError}
                  </p>
                </div>
              )}

            {/* HALL GRID */}

            {!loadingHalls &&
              !hallError &&
              sortedHalls.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {sortedHalls.map(
                    (hall) => (
                      <HallCard
                        key={hall.id}
                        hall={hall}
                      />
                    )
                  )}
                </div>
              )}

            {/* NO RESULTS */}

            {!loadingHalls &&
              !hallError &&
              sortedHalls.length ===
                0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F8F6F0]">
                    <Search
                      size={22}
                      className="text-[#C6922E]"
                    />
                  </div>

                  <h2 className="mt-4 text-lg font-bold text-[#0B2239]">
                    No halls found
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Try changing your
                    location, event type,
                    search or filters.
                  </p>

                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="mt-4 rounded-lg bg-[#D4A84F] px-4 py-2 text-xs font-semibold text-[#0B2239] transition hover:bg-[#C5983F]"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
          </section>
        </div>
      </main>
    </div>
  );
}