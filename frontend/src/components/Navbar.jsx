import { useState } from "react";
import { Search, UserRound, Menu, X } from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <nav className="mx-auto flex h-[90px] max-w-[1280px] items-center justify-between px-6 lg:px-10">

        {/* LOGO */}
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B2742]">
            <span className="text-2xl font-bold text-[#C6922E]">H</span>
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-[25px] font-bold tracking-tight text-[#0B2742]">
              Hall<span className="text-[#C6922E]">Mate</span>
            </span>

            <span className="mt-1 text-[11px] font-medium tracking-[0.22em] text-[#7A89A0]">
              SMART VENUE BOOKING
            </span>
          </div>
        </a>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-10 md:flex">
          <a
            href="/"
            className="text-[15px] font-semibold text-[#C6922E] transition hover:text-[#0B2742]"
          >
            Home
          </a>

          <a
            href="/explore"
            className="text-[15px] font-semibold text-[#0B2742] transition hover:text-[#C6922E]"
          >
            Explore Halls
          </a>

          <a
            href="/ai-assistant"
            className="text-[15px] font-semibold text-[#0B2742] transition hover:text-[#C6922E]"
          >
            AI Assistant
          </a>

          <a
            href="/how-it-works"
            className="text-[15px] font-semibold text-[#0B2742] transition hover:text-[#C6922E]"
          >
            How It Works
          </a>
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            aria-label="Search"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#0B2742] transition hover:bg-[#F7F4ED]"
          >
            <Search size={21} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            aria-label="Account"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#0B2742] transition hover:bg-[#F7F4ED]"
          >
            <UserRound size={20} strokeWidth={1.8} />
          </button>

          <a
            href="/sign-in"
            className="flex h-12 items-center justify-center rounded-lg bg-[#0B2742] px-7 text-[15px] font-semibold text-white transition hover:bg-[#173A5C]"
          >
            Sign In
          </a>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-[#0B2742] md:hidden"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t border-[#E8E3D8] bg-white px-6 py-5 md:hidden">
          <div className="flex flex-col gap-4">

            <a
              href="/"
              onClick={() => setMenuOpen(false)}
              className="py-2 text-[15px] font-semibold text-[#C6922E]"
            >
              Home
            </a>

            <a
              href="/explore"
              onClick={() => setMenuOpen(false)}
              className="py-2 text-[15px] font-semibold text-[#0B2742]"
            >
              Explore Halls
            </a>

            <a
              href="/ai-assistant"
              onClick={() => setMenuOpen(false)}
              className="py-2 text-[15px] font-semibold text-[#0B2742]"
            >
              AI Assistant
            </a>

            <a
              href="/how-it-works"
              onClick={() => setMenuOpen(false)}
              className="py-2 text-[15px] font-semibold text-[#0B2742]"
            >
              How It Works
            </a>

            <div className="mt-2 flex gap-3 border-t border-[#E8E3D8] pt-4">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F7F4ED] text-[#0B2742]"
              >
                <Search size={20} />
              </button>

              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F7F4ED] text-[#0B2742]"
              >
                <UserRound size={20} />
              </button>

              <a
                href="/sign-in"
                className="flex h-11 flex-1 items-center justify-center rounded-lg bg-[#0B2742] text-[15px] font-semibold text-white"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;