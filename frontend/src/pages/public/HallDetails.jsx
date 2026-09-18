import { useParams, Link, useNavigate } from "react-router-dom";

import {
  MapPin,
  Users,
  Star,
  Snowflake,
  Car,
  Utensils,
  CalendarCheck,
  ArrowLeft,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useEffect, useState } from "react";

import halls from "../../data/halls";

export default function HallDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hall, setHall] = useState(null);
  const [loadingHall, setLoadingHall] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // =========================================================
  // FIND LOCAL HALL BY BACKEND HALL DETAILS
  // =========================================================

  const findLocalHall = (backendHall) => {
    if (!backendHall) return null;

    return halls.find(
      (item) =>
        String(item.name).trim().toLowerCase() ===
          String(backendHall.name || "").trim().toLowerCase() &&
        String(item.location).trim().toLowerCase() ===
          String(backendHall.location || "").trim().toLowerCase()
    );
  };

  // =========================================================
  // LOAD HALL
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const loadHall = async () => {
      try {
        setLoadingHall(true);

        // -----------------------------------------------------
        // FIRST: TRY BACKEND
        // -----------------------------------------------------

        let backendHall = null;

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
            "Backend hall loading failed:",
            error
          );
        }

        // -----------------------------------------------------
        // FIND CORRESPONDING LOCAL HALL
        // -----------------------------------------------------

        const localHall = findLocalHall(backendHall);

        // -----------------------------------------------------
        // FALLBACK:
        // If URL itself happens to contain a local ID
        // -----------------------------------------------------

        const localById =
          localHall ||
          halls.find(
            (item) =>
              String(item.id) === String(id)
          );

        if (!backendHall && !localById) {
          if (!cancelled) {
            setHall(null);
          }
          return;
        }

        // -----------------------------------------------------
        // GALLERY
        // -----------------------------------------------------

        let galleryImages = [];

        // Our local hall-specific image set
        if (
          localById?.images &&
          Array.isArray(localById.images) &&
          localById.images.length > 0
        ) {
          galleryImages = localById.images.filter(Boolean);
        }

        // Backend gallery if it exists
        else if (
          backendHall?.images &&
          Array.isArray(backendHall.images) &&
          backendHall.images.length > 0
        ) {
          galleryImages =
            backendHall.images.filter(Boolean);
        }

        // Backend single image
        else if (backendHall?.image) {
          galleryImages = [backendHall.image];
        }

        // Local single image
        else if (localById?.image) {
          galleryImages = [localById.image];
        }

        // -----------------------------------------------------
        // FINAL HALL OBJECT
        // -----------------------------------------------------

        const finalHall = {
          id: String(
            backendHall?.id ??
              localById?.id ??
              id
          ),

          localId: localById?.id ?? null,

          name:
            backendHall?.name ??
            localById?.name ??
            "Event Hall",

          location:
            backendHall?.location ??
            localById?.location ??
            "",

          description:
            backendHall?.description ??
            localById?.description ??
            "",

          image:
            galleryImages[0] ??
            backendHall?.image ??
            localById?.image ??
            "",

          images: galleryImages,

          capacity: Number(
            backendHall?.capacity ??
              localById?.capacity ??
              0
          ),

          price: Number(
            backendHall?.price_per_day ??
              backendHall?.price ??
              localById?.price ??
              0
          ),

          rating:
            backendHall?.rating ??
            localById?.rating ??
            4.5,

          reviews:
            backendHall?.reviews ??
            localById?.reviews ??
            0,

          eventTypes:
            localById?.eventTypes ??
            backendHall?.eventTypes ??
            [
              "Wedding",
              "Birthday",
              "Engagement",
              "Party",
              "Corporate",
              "Exhibition",
              "Other",
            ],

          amenities:
            localById?.amenities ??
            backendHall?.amenities ??
            {
              AC: true,
              parking: true,
              catering: true,
            },

          available:
            backendHall?.available ??
            localById?.available ??
            true,
        };

        if (!cancelled) {
          setHall(finalHall);
          setSelectedImage(0);
        }
      } catch (error) {
        console.error(
          "Error loading hall:",
          error
        );

        // -----------------------------------------------------
        // FINAL LOCAL FALLBACK
        // -----------------------------------------------------

        const fallbackHall = halls.find(
          (item) =>
            String(item.id) === String(id)
        );

        if (!cancelled && fallbackHall) {
          setHall({
            ...fallbackHall,
            id: String(fallbackHall.id),
            images:
              fallbackHall.images || [
                fallbackHall.image,
              ],
          });

          setSelectedImage(0);
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
  // GALLERY
  // =========================================================

  const gallery =
    hall?.images &&
    Array.isArray(hall.images) &&
    hall.images.length > 0
      ? hall.images
      : hall?.image
        ? [hall.image]
        : [];

  // =========================================================
  // NEXT IMAGE
  // =========================================================

  const nextImage = () => {
    if (gallery.length <= 1) return;

    setSelectedImage((current) =>
      current >= gallery.length - 1
        ? 0
        : current + 1
    );
  };

  // =========================================================
  // PREVIOUS IMAGE
  // =========================================================

  const previousImage = () => {
    if (gallery.length <= 1) return;

    setSelectedImage((current) =>
      current <= 0
        ? gallery.length - 1
        : current - 1
    );
  };

  // =========================================================
  // KEYBOARD
  // =========================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        nextImage();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [gallery.length]);

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
      <section className="min-h-[70vh] bg-[#F8F6F0] px-6 py-20">
        <div className="mx-auto max-w-[1100px] text-center">
          <h1 className="text-3xl font-bold text-[#0B2239]">
            Hall Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            We couldn't find the hall you're looking for.
          </p>

          <Link
            to="/explore"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0B2742] px-6 py-3 font-semibold text-white hover:bg-[#173A5C]"
          >
            <ArrowLeft size={18} />
            Back to Explore Halls
          </Link>
        </div>
      </section>
    );
  }

  // =========================================================
  // CHECK AVAILABILITY
  // =========================================================

  const handleCheckAvailability = () => {
    navigate(`/hall/${hall.id}/booking`, {
      state: {
        hallId: hall.id,
        localHallId: hall.localId,
        hallName: hall.name,
        location: hall.location,
      },
    });
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <section className="min-h-screen bg-[#F8F6F0] px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-[1280px]">

        {/* BACK */}

        <Link
          to="/explore"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0B2742] hover:text-[#C6922E]"
        >
          <ArrowLeft size={18} />
          Back to Explore Halls
        </Link>

        {/* MAIN CARD */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

          {/* =================================================
              GALLERY
          ================================================= */}

          <div className="p-4 lg:p-6">
            <div className="relative h-[300px] w-full overflow-hidden rounded-xl bg-[#E8E3D8] lg:h-[500px]">

              {gallery.length > 0 ? (
                <img
                  src={gallery[selectedImage]}
                  alt={`${hall.name} venue`}
                  draggable="false"
                  className="h-full w-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-500">
                  No image available
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

              {/* LEFT */}

              {gallery.length > 1 && (
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0B2742] shadow-md hover:bg-white"
                >
                  <ChevronLeft size={23} />
                </button>
              )}

              {/* RIGHT */}

              {gallery.length > 1 && (
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0B2742] shadow-md hover:bg-white"
                >
                  <ChevronRight size={23} />
                </button>
              )}

              {/* COUNTER */}

              {gallery.length > 1 && (
                <div className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white">
                  {selectedImage + 1} / {gallery.length}
                </div>
              )}

              {/* TITLE */}

              <div className="absolute bottom-6 left-5 text-white lg:bottom-8 lg:left-8">
                <h1 className="text-3xl font-bold lg:text-5xl">
                  {hall.name}
                </h1>

                <div className="mt-2 flex items-center gap-2 text-sm lg:text-base">
                  <MapPin size={18} />
                  {hall.location}
                </div>
              </div>
            </div>

            {/* DOTS */}

            {gallery.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {gallery.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`View photo ${index + 1}`}
                    onClick={() =>
                      setSelectedImage(index)
                    }
                    className={`rounded-full transition-all ${
                      selectedImage === index
                        ? "h-2.5 w-2.5 bg-[#C6922E]"
                        : "h-2 w-2 bg-[#B9B4AA] hover:bg-[#0B2742]"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="p-6 lg:p-10">

            {/* TOP INFO */}

            <div className="flex flex-col justify-between gap-6 border-b border-[#E8E3D8] pb-7 lg:flex-row lg:items-center">

              <div className="flex flex-wrap items-center gap-5">

                {/* RATING */}

                <div className="flex items-center gap-2">
                  <Star
                    size={20}
                    className="fill-[#C6922E] text-[#C6922E]"
                  />

                  <span className="font-bold text-[#0B2239]">
                    {hall.rating}
                  </span>

                  <span className="text-sm text-gray-500">
                    ({hall.reviews} reviews)
                  </span>
                </div>

                {/* CAPACITY */}

                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={19} />
                  <span>
                    Up to {hall.capacity} guests
                  </span>
                </div>

                {/* AVAILABILITY */}

                <div className="flex items-center gap-2 rounded-full bg-[#DDF8EA] px-3 py-1.5 text-sm font-semibold text-[#15945A]">
                  <CheckCircle size={16} />
                  Available
                </div>
              </div>

              {/* PRICE */}

              <div>
                <p className="text-sm text-gray-500">
                  Starting from
                </p>

                <p className="text-2xl font-bold text-[#0B2239]">
                  ₹{hall.price.toLocaleString("en-IN")}
                  <span className="ml-1 text-sm font-normal text-gray-500">
                    / day
                  </span>
                </p>
              </div>
            </div>

            {/* DETAILS */}

            <div className="grid gap-10 py-8 lg:grid-cols-[1fr_360px]">

              {/* LEFT */}

              <div>

                <h2 className="text-2xl font-bold text-[#0B2239]">
                  About this hall
                </h2>

                <p className="mt-4 leading-7 text-gray-600">
                  {hall.description ||
                    `${hall.name} is a spacious and elegant event venue in ${hall.location}, suitable for a variety of celebrations and events. With a capacity of up to ${hall.capacity} guests, it offers a comfortable setting for your special occasion.`}
                </p>

                {/* EVENT TYPES */}

                <h3 className="mt-8 text-lg font-bold text-[#0B2239]">
                  Suitable for
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {hall.eventTypes.map((type) => (
                    <span
                      key={type}
                      className="rounded-full border border-[#E5D7B7] bg-[#FBF7ED] px-4 py-2 text-sm font-medium text-[#0B2742]"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                {/* AMENITIES */}

                <h3 className="mt-8 text-lg font-bold text-[#0B2239]">
                  Amenities
                </h3>

                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">

                  {hall.amenities?.AC && (
                    <div className="rounded-xl border border-[#E8E3D8] bg-white p-4">
                      <Snowflake
                        size={22}
                        className="text-[#C6922E]"
                      />
                      <p className="mt-2 text-sm font-semibold text-[#0B2239]">
                        Air Conditioning
                      </p>
                    </div>
                  )}

                  {hall.amenities?.parking && (
                    <div className="rounded-xl border border-[#E8E3D8] bg-white p-4">
                      <Car
                        size={22}
                        className="text-[#C6922E]"
                      />
                      <p className="mt-2 text-sm font-semibold text-[#0B2239]">
                        Parking
                      </p>
                    </div>
                  )}

                  {hall.amenities?.catering && (
                    <div className="rounded-xl border border-[#E8E3D8] bg-white p-4">
                      <Utensils
                        size={22}
                        className="text-[#C6922E]"
                      />
                      <p className="mt-2 text-sm font-semibold text-[#0B2239]">
                        Catering
                      </p>
                    </div>
                  )}
                </div>

                {/* REVIEWS */}

                <div className="mt-10 border-t border-[#E8E3D8] pt-8">

                  <h3 className="text-xl font-bold text-[#0B2239]">
                    Ratings & Reviews
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    See what guests have to say about this hall.
                  </p>

                  <div className="mt-5 rounded-xl border border-dashed border-[#DCCDAE] bg-[#FBF7ED] p-5">
                    <p className="text-sm text-gray-600">
                      Reviews from verified bookings will appear here.
                    </p>
                  </div>
                </div>
              </div>

              {/* BOOKING BOX */}

              <div className="h-fit rounded-2xl border border-[#E8E3D8] bg-[#FBFAF7] p-6 lg:sticky lg:top-28">

                <h3 className="text-xl font-bold text-[#0B2239]">
                  Interested in this hall?
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Check availability and continue with your booking.
                </p>

                <div className="mt-5 border-t border-[#E8E3D8] pt-5">

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Capacity
                    </span>

                    <span className="font-semibold text-[#0B2239]">
                      {hall.capacity} guests
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-gray-600">
                      Price
                    </span>

                    <span className="font-bold text-[#0B2239]">
                      ₹{hall.price.toLocaleString("en-IN")}
                      <span className="ml-1 text-xs font-normal text-gray-500">
                        / day
                      </span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckAvailability}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#C6922E] px-6 py-3.5 font-bold text-white transition hover:bg-[#AD7F25]"
                >
                  <CalendarCheck size={19} />
                  Check Availability
                  <ChevronRight size={18} />
                </button>

                <p className="mt-3 text-center text-xs text-gray-500">
                  No payment required at this stage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}