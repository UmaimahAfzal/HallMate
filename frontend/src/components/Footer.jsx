import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0B2742] text-white">

      <div className="max-w-6xl mx-auto px-6 py-14">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-bold">
              Hall<span className="text-[#D4A84F]">Mate</span>
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
              A smarter way to discover, manage and book event halls,
              powered by intelligent venue recommendations.
            </p>
          </div>


          {/* EXPLORE */}
          <div>
            <h3 className="text-sm font-bold tracking-wide text-[#D4A84F]">
              EXPLORE
            </h3>

            <div className="mt-5 space-y-4 text-sm">

              <Link
                to="/explore"
                className="block text-white/75 hover:text-[#D4A84F] transition"
              >
                Browse Halls
              </Link>

              <Link
                to="/ai-assistant"
                className="block text-white/75 hover:text-[#D4A84F] transition"
              >
                AI Recommendations
              </Link>

              <Link
                to="/how-it-works"
                className="block text-white/75 hover:text-[#D4A84F] transition"
              >
                How It Works
              </Link>

            </div>
          </div>


          {/* FOR OWNERS */}
          <div>
            <h3 className="text-sm font-bold tracking-wide text-[#D4A84F]">
              FOR OWNERS
            </h3>

            <div className="mt-5 space-y-4 text-sm">

              <Link
                to="/owner/my-hall"
                className="block text-white/75 hover:text-[#D4A84F] transition"
              >
                List Your Hall
              </Link>

              <Link
                to="/owner/bookings"
                className="block text-white/75 hover:text-[#D4A84F] transition"
              >
                Manage Bookings
              </Link>

              <Link
                to="/owner/dashboard"
                className="block text-white/75 hover:text-[#D4A84F] transition"
              >
                Owner Dashboard
              </Link>

            </div>
          </div>

        </div>


        {/* BOTTOM */}
        <div className="mt-12 border-t border-white/10 pt-6">

          <p className="text-xs text-white/50">
            © 2026 HallMate. Smart venues. Smarter bookings.
          </p>

        </div>

      </div>

    </footer>
  );
}