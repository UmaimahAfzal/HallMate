import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  Users,
  CalendarDays,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

export default function AIAssistant() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const suggestions = [
    "Wedding hall for 300 guests",
    "Affordable birthday hall",
    "Corporate event venue",
    "Premium hall in Hyderabad",
  ];

  const locations = [
    "Hyderabad",
    "Nizamabad",
    "Nagpur",
    "Bengaluru",
    "Chennai",
    "Mumbai",
    "Pune",
    "Delhi",
  ];

  const eventTypes = [
    "Wedding",
    "Corporate",
    "Birthday",
    "Engagement",
    "Party",
    "Exhibition",
  ];

  const findRequirement = (text) => {
    const lower = text.toLowerCase();

    const location = locations.find((item) =>
      lower.includes(item.toLowerCase())
    );

    const type = eventTypes.find((item) =>
      lower.includes(item.toLowerCase())
    );

    return { location, type };
  };

  const handleSearch = () => {
    const text = message.trim();

    if (!text) return;

    const { location, type } = findRequirement(text);

    const params = new URLSearchParams();

    if (location) {
      params.set("location", location);
    }

    if (type) {
      params.set("type", type);
    }

    /*
      If no specific location/event type is detected,
      send the complete text to Explore Halls search.
    */
    if (!location && !type) {
      params.set("search", text);
    }

    navigate(`/explore?${params.toString()}`);
  };

 const handleSuggestion = (text) => {
  setMessage(text);
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <section className="min-h-[78vh] bg-[#F8F6F0] px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F5EBD7] px-4 py-2 text-sm font-semibold text-[#A87918]">
            <Sparkles size={16} />
            Smart Venue Assistant
          </div>

          <h1 className="mt-5 text-4xl md:text-5xl font-bold text-[#0B2742]">
            Tell us what kind of
            <span className="text-[#C6922E]"> venue </span>
            you need.
          </h1>

          <p className="mt-4 text-gray-500 leading-7">
            Describe your event, location or preferences and
            quickly explore suitable HallMate venues.
          </p>
        </div>

        {/* ASSISTANT */}
        <div className="max-w-3xl mx-auto mt-10 rounded-3xl bg-white border border-[#E8E1D4] shadow-lg overflow-hidden">

          {/* TOP */}
          <div className="bg-[#0B2742] px-7 py-6 text-white">
            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-[#D4A84F] flex items-center justify-center">
                <Sparkles
                  size={23}
                  className="text-[#0B2742]"
                />
              </div>

              <div>
                <h2 className="font-bold text-lg">
                  HallMate Assistant
                </h2>

                <p className="text-sm text-white/60">
                  Your venue discovery companion
                </p>
              </div>

            </div>
          </div>

          {/* BODY */}
          <div className="p-7">

            <div className="flex gap-3">

              <div className="w-9 h-9 shrink-0 rounded-full bg-[#F5EBD7] flex items-center justify-center">
                <MessageCircle
                  size={17}
                  className="text-[#C6922E]"
                />
              </div>

              <div className="rounded-2xl rounded-tl-none bg-[#FAF8F3] px-5 py-4 text-sm text-[#0B2742] leading-6">
                Hello! 👋 Tell me about your event and I’ll help
                you find suitable halls.
              </div>

            </div>

            {/* INPUT */}
            <div className="mt-7 relative">

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
                placeholder="Example: I need a wedding hall in Hyderabad for 300 guests..."
                className="w-full resize-none rounded-2xl border border-[#DDD6C8] bg-white px-5 py-4 pr-14 text-sm text-[#0B2742] outline-none focus:border-[#C6922E]"
              />

              <button
                type="button"
                onClick={handleSearch}
                disabled={!message.trim()}
                className="absolute right-3 bottom-3 w-10 h-10 rounded-xl bg-[#0B2742] text-white flex items-center justify-center hover:bg-[#123957] disabled:opacity-40 transition"
              >
                <ArrowRight size={18} />
              </button>

            </div>

            {/* SUGGESTIONS */}
            <div className="mt-5">

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Try asking
              </p>

              <div className="flex flex-wrap gap-2">

                {suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSuggestion(item)}
                    className="rounded-full border border-[#E5DED1] bg-[#FAF8F3] px-4 py-2 text-xs font-medium text-[#0B2742] hover:border-[#C6922E] hover:text-[#A87918] transition"
                  >
                    {item}
                  </button>
                ))}

              </div>

            </div>

          </div>
        </div>

        {/* QUICK CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">

          <QuickCard
            icon={MapPin}
            title="Choose Location"
            text="Find venues near your preferred city."
          />

          <QuickCard
            icon={Users}
            title="Guest Capacity"
            text="Choose a hall that fits your guests."
          />

          <QuickCard
            icon={CalendarDays}
            title="Event Date"
            text="Check venue availability for your date."
          />

        </div>

      </div>
    </section>
  );
}

function QuickCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl bg-white border border-[#E8E1D4] p-5 flex gap-4">

      <div className="w-10 h-10 shrink-0 rounded-xl bg-[#F5EBD7] flex items-center justify-center">
        <Icon
          size={18}
          className="text-[#C6922E]"
        />
      </div>

      <div>
        <h3 className="font-semibold text-[#0B2742] text-sm">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {text}
        </p>
      </div>

    </div>
  );
}