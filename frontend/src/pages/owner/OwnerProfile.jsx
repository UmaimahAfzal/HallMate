import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  CalendarDays,
  ChevronRight,
} from "lucide-react";

export default function OwnerProfile() {
  const navigate = useNavigate();

  const [owner, setOwner] = useState(null);
  const [hallCount, setHallCount] = useState(0);
  const [locationCount, setLocationCount] = useState(0);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error("Unable to read owner account:", error);
      navigate("/owner/sign-in");
    }
  }, [navigate]);

  // =====================================================
  // GET OWNER'S HALL INFORMATION
  // =====================================================

  useEffect(() => {
    if (!owner?.id) {
      setLoading(false);
      return;
    }

    const fetchOwnerHalls = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/halls"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Unable to fetch halls"
          );
        }

        const halls = Array.isArray(data)
          ? data
          : data?.halls || [];

        const ownerHalls = halls.filter(
          (hall) =>
            Number(hall.owner_id) === Number(owner.id)
        );

        setHallCount(ownerHalls.length);

        const uniqueLocations = new Set(
          ownerHalls
            .map((hall) => hall.location)
            .filter(Boolean)
        );

        setLocationCount(uniqueLocations.size);
      } catch (error) {
        console.error(
          "Unable to fetch owner halls:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerHalls();
  }, [owner]);

  // =====================================================
  // LOADING
  // =====================================================

  if (!owner || loading) {
    return (
      <section className="flex min-h-[calc(100vh-86px)] items-center justify-center bg-[#F8F6F0]">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B2742] shadow-lg">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-[#D9A441]" />
          </div>

          <p className="mt-4 text-sm font-semibold text-[#718096]">
            Loading profile...
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // OWNER DISPLAY DATA
  // =====================================================

  const ownerName = owner.name || "Hall Owner";

  const ownerInitial =
    ownerName.trim().charAt(0).toUpperCase() || "O";

  return (
    <section className="min-h-[calc(100vh-86px)] bg-[#F8F6F0] px-6 py-7 lg:px-8">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mx-auto mb-7 max-w-[1400px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C6922E]" />

              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C6922E]">
                ACCOUNT
              </p>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#0B2742]">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-[#8793A3]">
              Manage your HallMate owner account and venue information.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/owner/dashboard")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E1DCD1] bg-white px-5 py-3 text-sm font-semibold text-[#0B2742] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#C6922E] hover:text-[#C6922E] hover:shadow-md"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

        </div>
      </div>

      {/* =====================================================
          MAIN PROFILE AREA
      ====================================================== */}

      <div className="mx-auto grid max-w-[1400px] items-start gap-6 xl:grid-cols-[370px_1fr]">

        {/* =====================================================
            LEFT PROFILE CARD
        ====================================================== */}

        <div className="rounded-2xl border border-[#E7E1D6] bg-white shadow-[0_8px_30px_rgba(11,39,66,0.06)]">

          {/* PROFILE BANNER */}

          <div className="relative h-32 overflow-hidden rounded-t-2xl bg-[#0B2742]">

            {/* Decorative circles */}

            <div className="absolute -right-10 -top-20 h-48 w-48 rounded-full border-[20px] border-white/5" />

            <div className="absolute -left-12 -bottom-24 h-44 w-44 rounded-full border-[16px] border-[#C6922E]/10" />

            <div className="absolute right-8 bottom-5 h-16 w-16 rounded-full bg-[#C6922E]/5" />

            {/* Banner text */}

            <div className="absolute bottom-5 left-7">
              <p className="text-[10px] font-bold tracking-[0.24em] text-[#D9A441]">
                HALLMATE
              </p>

              <p className="mt-1 text-[10px] font-medium tracking-[0.12em] text-white/55">
                OWNER PORTAL
              </p>
            </div>

          </div>

          {/* PROFILE CONTENT */}

          <div className="px-7 pb-7">

            {/* AVATAR */}

            <div className="relative z-20 -mt-12 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-[5px] border-white bg-[#0B2742] shadow-[0_8px_25px_rgba(11,39,66,0.22)] ring-1 ring-[#D8C49A]">
                <span className="text-3xl font-bold text-[#D9A441]">
                  {ownerInitial}
                </span>
              </div>
            </div>

            {/* NAME */}

            <div className="mt-4 text-center">
              <h2 className="break-words text-2xl font-bold text-[#0B2742]">
                {ownerName}
              </h2>

              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#EADFC9] bg-[#F8F2E6] px-4 py-2">
                <ShieldCheck
                  size={15}
                  className="text-[#C6922E]"
                />

                <span className="text-xs font-bold text-[#0B2742]">
                  Hall Owner
                </span>
              </div>
            </div>

            {/* DIVIDER */}

            <div className="my-6 h-px bg-[#EEE9DF]" />

            {/* CONTACT INFORMATION */}

            <div className="space-y-3">

              {/* EMAIL */}

              <div className="group flex items-center gap-3 rounded-xl border border-transparent bg-[#FCFBF8] px-4 py-3.5 transition hover:border-[#E8DCC2] hover:bg-[#FBF8F1]">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7F1E4]">
                  <Mail
                    size={17}
                    className="text-[#C6922E]"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9AA8B8]">
                    Email
                  </p>

                  <p className="mt-1 truncate text-xs font-bold text-[#0B2742]">
                    {owner.email || "Not provided"}
                  </p>
                </div>

              </div>

              {/* PHONE */}

              <div className="group flex items-center gap-3 rounded-xl border border-transparent bg-[#FCFBF8] px-4 py-3.5 transition hover:border-[#E8DCC2] hover:bg-[#FBF8F1]">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7F1E4]">
                  <Phone
                    size={17}
                    className="text-[#C6922E]"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9AA8B8]">
                    Phone
                  </p>

                  <p className="mt-1 text-xs font-bold text-[#0B2742]">
                    {owner.phone || "Not provided"}
                  </p>
                </div>

              </div>

            </div>

            {/* STATUS */}

            <div className="mt-6 flex items-center justify-between rounded-xl border border-[#E6EBDD] bg-[#F5FAF6] px-4 py-3.5">

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                  <CheckCircle2
                    size={17}
                    className="text-[#16834A]"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#8793A3]">
                    Account Status
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-[#0B2742]">
                    Active
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-[#16834A]/10 px-3 py-1 text-[10px] font-bold text-[#16834A]">
                ACTIVE
              </span>

            </div>

          </div>
        </div>


        {/* =====================================================
            RIGHT CONTENT
        ====================================================== */}

        <div className="space-y-6">

          {/* =====================================================
              ACCOUNT INFORMATION
          ====================================================== */}

          <div className="rounded-2xl border border-[#E7E1D6] bg-white p-6 shadow-[0_8px_30px_rgba(11,39,66,0.05)] lg:p-7">

            <div className="mb-6 flex items-start justify-between">

              <div>
                <div className="flex items-center gap-3">

                  <div className="h-8 w-1 rounded-full bg-[#C6922E]" />

                  <h2 className="text-xl font-bold text-[#0B2742]">
                    Account Information
                  </h2>

                </div>

                <p className="mt-2 text-sm text-[#8793A3]">
                  Your registered HallMate owner details.
                </p>
              </div>

              <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-[#F7F1E4] sm:flex">
                <ShieldCheck
                  size={20}
                  className="text-[#C6922E]"
                />
              </div>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

              {/* FULL NAME */}

              <div className="rounded-xl border border-[#E8E3D8] bg-[#FCFBF8] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#D8C49A] hover:shadow-sm">

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F1E4]">
                  <UserRound
                    size={18}
                    className="text-[#C6922E]"
                  />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9AA8B8]">
                  Full Name
                </p>

                <p className="mt-1.5 break-words text-sm font-bold text-[#0B2742]">
                  {owner.name || "Not provided"}
                </p>

              </div>

              {/* EMAIL */}

              <div className="rounded-xl border border-[#E8E3D8] bg-[#FCFBF8] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#D8C49A] hover:shadow-sm">

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F1E4]">
                  <Mail
                    size={18}
                    className="text-[#C6922E]"
                  />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9AA8B8]">
                  Email Address
                </p>

                <p className="mt-1.5 break-words text-sm font-bold text-[#0B2742]">
                  {owner.email || "Not provided"}
                </p>

              </div>

              {/* PHONE */}

              <div className="rounded-xl border border-[#E8E3D8] bg-[#FCFBF8] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#D8C49A] hover:shadow-sm">

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F1E4]">
                  <Phone
                    size={18}
                    className="text-[#C6922E]"
                  />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9AA8B8]">
                  Phone Number
                </p>

                <p className="mt-1.5 text-sm font-bold text-[#0B2742]">
                  {owner.phone || "Not provided"}
                </p>

              </div>

              {/* ACCOUNT TYPE */}

              <div className="rounded-xl border border-[#E8E3D8] bg-[#FCFBF8] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#D8C49A] hover:shadow-sm">

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F1E4]">
                  <ShieldCheck
                    size={18}
                    className="text-[#C6922E]"
                  />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9AA8B8]">
                  Account Type
                </p>

                <p className="mt-1.5 text-sm font-bold text-[#0B2742]">
                  Hall Owner
                </p>

              </div>

            </div>
          </div>


          {/* =====================================================
              BUSINESS OVERVIEW
          ====================================================== */}

          <div className="rounded-2xl border border-[#E7E1D6] bg-white p-6 shadow-[0_8px_30px_rgba(11,39,66,0.05)] lg:p-7">

            <div className="mb-6">

              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-[#C6922E]" />

                <h2 className="text-xl font-bold text-[#0B2742]">
                  Business Overview
                </h2>
              </div>

              <p className="mt-2 text-sm text-[#8793A3]">
                A quick look at your venue portfolio.
              </p>

            </div>


            {/* STAT CARDS */}

            <div className="grid gap-4 md:grid-cols-2">

              {/* HALLS */}

              <div className="group relative overflow-hidden rounded-xl border border-[#E8E3D8] bg-[#FCFBF8] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#D8C49A] hover:shadow-sm">

                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#F7F1E4] transition group-hover:scale-110" />

                <div className="relative flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0B2742] shadow-sm">
                      <Building2
                        size={22}
                        className="text-[#D9A441]"
                      />
                    </div>

                    <div>
                      <p className="text-2xl font-bold text-[#0B2742]">
                        {hallCount}
                      </p>

                      <p className="mt-0.5 text-xs font-semibold text-[#8793A3]">
                        Halls Managed
                      </p>
                    </div>

                  </div>

                  <ChevronRight
                    size={18}
                    className="text-[#C7BFAF] transition group-hover:translate-x-1 group-hover:text-[#C6922E]"
                  />

                </div>

              </div>


              {/* LOCATIONS */}

              <div className="group relative overflow-hidden rounded-xl border border-[#E8E3D8] bg-[#FCFBF8] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#D8C49A] hover:shadow-sm">

                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#F7F1E4] transition group-hover:scale-110" />

                <div className="relative flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0B2742] shadow-sm">
                      <MapPin
                        size={22}
                        className="text-[#D9A441]"
                      />
                    </div>

                    <div>
                      <p className="text-2xl font-bold text-[#0B2742]">
                        {locationCount}
                      </p>

                      <p className="mt-0.5 text-xs font-semibold text-[#8793A3]">
                        Locations Covered
                      </p>
                    </div>

                  </div>

                  <ChevronRight
                    size={18}
                    className="text-[#C7BFAF] transition group-hover:translate-x-1 group-hover:text-[#C6922E]"
                  />

                </div>

              </div>

            </div>


            {/* PORTFOLIO NOTE */}

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#E8E3D8] bg-[#F8F6F0] px-4 py-4">

              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                <CalendarDays
                  size={15}
                  className="text-[#C6922E]"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-[#0B2742]">
                  Manage your venues from one place
                </p>

                <p className="mt-1 text-xs leading-5 text-[#718096]">
                  Your assigned venues are managed through the
                  HallMate Owner Portal. View your halls, check
                  availability, and respond to customer booking
                  requests using the sidebar.
                </p>
              </div>

            </div>

          </div>


          {/* =====================================================
              QUICK ACCESS
          ====================================================== */}

          <div className="rounded-2xl border border-[#E7E1D6] bg-[#0B2742] p-6 shadow-[0_8px_30px_rgba(11,39,66,0.10)] lg:p-7">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D9A441]">
                  QUICK ACCESS
                </p>

                <h3 className="mt-1 text-lg font-bold text-white">
                  Manage your venue portfolio
                </h3>

                <p className="mt-1 text-xs leading-5 text-white/55">
                  Quickly access your halls and booking management.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={() => navigate("/owner/my-hall")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C6922E] px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#D9A441]"
                >
                  <Building2 size={15} />
                  My Halls
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/owner/bookings")}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/15"
                >
                  <CalendarDays size={15} />
                  Bookings
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}