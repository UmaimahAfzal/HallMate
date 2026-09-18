import { useNavigate } from "react-router-dom";
import {
  Search,
  CalendarDays,
  ClipboardCheck,
  Bell,
  ArrowRight,
} from "lucide-react";

export default function HowItWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Discover a Hall",
      text: "Browse halls by location, event type, date, price and capacity.",
    },
    {
      number: "02",
      icon: CalendarDays,
      title: "Check Availability",
      text: "Open a hall to view its details and check availability for your event date.",
    },
    {
      number: "03",
      icon: ClipboardCheck,
      title: "Send Booking Request",
      text: "Enter your event details and submit a booking request to the hall owner.",
    },
    {
      number: "04",
      icon: Bell,
      title: "Get Confirmation",
      text: "Receive notifications when the hall owner accepts or updates your booking.",
    },
  ];

  return (
    <section className="min-h-[78vh] bg-[#F8F6F0] px-6 py-12">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto">

          <p className="text-sm font-semibold text-[#C6922E]">
            SIMPLE & CONVENIENT
          </p>

          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-[#0B2742]">
            How HallMate Works
          </h1>

          <p className="mt-4 text-gray-500 leading-7">
            From discovering the right venue to receiving your
            booking confirmation, HallMate keeps everything in one place.
          </p>

        </div>

        {/* STEPS */}
        <div className="relative mt-14">

          {/* DESKTOP LINE */}
          <div className="hidden lg:block absolute top-[54px] left-[12%] right-[12%] border-t-2 border-dashed border-[#DCCFAF]" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-3xl bg-white border border-[#E8E1D4] p-7 shadow-sm hover:shadow-md transition"
                >

                  <div className="flex items-center justify-between">

                    <div className="relative z-10 w-14 h-14 rounded-2xl bg-[#0B2742] flex items-center justify-center">
                      <Icon
                        size={23}
                        className="text-[#D4A84F]"
                      />
                    </div>

                    <span className="text-4xl font-bold text-[#F0E8D8]">
                      {step.number}
                    </span>

                  </div>

                  <h2 className="mt-7 text-lg font-bold text-[#0B2742]">
                    {step.title}
                  </h2>

                  <p className="mt-3 text-sm text-gray-500 leading-6">
                    {step.text}
                  </p>

                </div>
              );
            })}

          </div>
        </div>

        {/* FLOW */}
        <div className="mt-12 rounded-3xl bg-[#0B2742] px-7 py-8 md:px-10 text-white">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-7">

            <div>
              <p className="text-[#D4A84F] text-sm font-semibold">
                READY TO BEGIN?
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Find your perfect venue today.
              </h2>

              <p className="mt-2 text-sm text-white/60">
                Explore halls, compare your options and send your booking request.
              </p>
            </div>

            <button
              onClick={() => navigate("/explore")}
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4A84F] px-6 py-3.5 text-sm font-bold text-[#0B2742] hover:bg-[#E2B85E]"
            >
              Explore Halls
              <ArrowRight size={17} />
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}