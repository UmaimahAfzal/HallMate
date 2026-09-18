import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle,
  CreditCard,
  Lock,
  MapPin,
  ShieldCheck,
  Smartphone,
  User,
  WalletCards,
} from "lucide-react";

const API_URL = "http://localhost:5000";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    bookingId,
    bookingReference,
    hallId,
    hallName,
    hallLocation,
    hallImage,
    date,
    guests,
    eventType,
    customer,
    price,
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");

  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState("");

  const amount = Number(price || 0);

  const formattedDate = date
    ? new Date(
        `${String(date).slice(0, 10)}T00:00:00`
      ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date not available";

  const handleCardChange = (e) => {
    const { name, value } = e.target;

    setCardData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!bookingId) {
      setError(
        "Booking information is missing. Please return to your booking confirmation."
      );
      return;
    }

    setError("");
    setProcessing(true);

    try {
      const response = await fetch(
        `${API_URL}/api/payments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId,
            paymentMethod,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Payment could not be completed."
        );
      }

      /*
       * Payment is now stored in PostgreSQL.
       * Keep a small local record only for UI convenience.
       */
      localStorage.setItem(
        `hallmatePayment_${bookingReference}`,
        JSON.stringify({
          bookingId,
          bookingReference,
          amount,
          method: paymentMethod,
          status: "Paid",
          paidAt: new Date().toISOString(),
          paymentReference:
            data.payment?.payment_reference || null,
        })
      );

      setPaymentSuccess(true);
    } catch (err) {
      console.error("Payment failed:", err);

      setError(
        err.message ||
          "Something went wrong while processing the payment."
      );
    } finally {
      setProcessing(false);
    }
  };

  /*
   * =========================================================
   * PAYMENT SUCCESS
   * =========================================================
   */
  if (paymentSuccess) {
    return (
      <section className="min-h-screen bg-[#F8F6F0] px-5 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto flex min-h-[75vh] max-w-[850px] items-center justify-center">
          <div className="w-full overflow-hidden rounded-3xl border border-[#D8EBDD] bg-white shadow-sm">

            <div className="px-7 py-14 text-center sm:px-12 sm:py-16">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#DDF8EA]">
                <CheckCircle
                  size={56}
                  className="text-[#15945A]"
                />
              </div>

              <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-[#C6922E]">
                HALLMATE PAYMENT
              </p>

              <h1 className="mt-3 text-4xl font-extrabold text-[#0B2239] sm:text-5xl">
                Payment Successful
              </h1>

              <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
                Your payment has been recorded successfully and
                your HallMate booking is now fully completed.
              </p>

              <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#E5D7B7] bg-[#FBF7ED] p-6 text-left">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Booking Reference
                  </span>

                  <span className="font-bold text-[#0B2239]">
                    {bookingReference}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#E5D7B7] pt-4">
                  <span className="text-sm text-gray-500">
                    Amount Paid
                  </span>

                  <span className="text-xl font-extrabold text-[#0B2239]">
                    ₹{amount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#E5D7B7] pt-4">
                  <span className="text-sm text-gray-500">
                    Payment Method
                  </span>

                  <span className="font-semibold capitalize text-[#0B2239]">
                    {paymentMethod === "upi"
                      ? "UPI"
                      : paymentMethod === "card"
                      ? "Card"
                      : "Net Banking"}
                  </span>
                </div>

              </div>

              <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#CFE7D7] bg-[#F2FBF5] p-5">
                <div className="flex items-center justify-center gap-2 text-[#16834A]">
                  <CheckCircle size={20} />

                  <span className="font-bold">
                    Payment recorded successfully
                  </span>
                </div>

                <p className="mt-2 text-center text-xs leading-5 text-gray-600">
                  Your owner dashboard has been updated with
                  this payment.
                </p>
              </div>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                <Link
                  to="/my-bookings"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B2742] px-7 py-3.5 font-bold text-white transition hover:bg-[#173A5C]"
                >
                  View My Bookings
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D9D3C7] bg-white px-7 py-3.5 font-bold text-[#0B2742] transition hover:bg-[#F8F6F0]"
                >
                  Back to Home
                </Link>

              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }

  /*
   * =========================================================
   * PAYMENT PAGE
   * =========================================================
   */
  return (
    <section className="min-h-screen bg-[#F8F6F0] px-5 py-8 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-[1180px]">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0B2742] transition hover:text-[#C6922E]"
        >
          <ArrowLeft size={17} />
          Back to Confirmation
        </button>

        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#C6922E]">
            HALLMATE PAYMENT
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-[#0B2239] sm:text-4xl">
            Complete Your Payment
          </h1>

          <p className="mt-2 max-w-2xl text-gray-600">
            Your booking has been confirmed. Complete the
            payment to finish your HallMate booking.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

          {/* LEFT */}
          <div className="rounded-2xl border border-[#E8E3D8] bg-white p-6 shadow-sm sm:p-8">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FBF3DF]">
                <WalletCards
                  size={22}
                  className="text-[#C6922E]"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#0B2239]">
                  Payment Method
                </h2>

                <p className="text-sm text-gray-500">
                  Choose your preferred payment option.
                </p>
              </div>
            </div>

            {/* METHODS */}
            <div className="mt-7 grid gap-3 sm:grid-cols-3">

              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`rounded-xl border p-4 text-left transition ${
                  paymentMethod === "upi"
                    ? "border-[#C6922E] bg-[#FBF7ED]"
                    : "border-[#E8E3D8] bg-white hover:border-[#C6922E]/50"
                }`}
              >
                <Smartphone
                  size={21}
                  className="text-[#C6922E]"
                />

                <p className="mt-3 text-sm font-bold text-[#0B2239]">
                  UPI
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Google Pay, PhonePe, etc.
                </p>

                {paymentMethod === "upi" && (
                  <div className="mt-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#C6922E]">
                    <Check size={13} className="text-white" />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`rounded-xl border p-4 text-left transition ${
                  paymentMethod === "card"
                    ? "border-[#C6922E] bg-[#FBF7ED]"
                    : "border-[#E8E3D8] bg-white hover:border-[#C6922E]/50"
                }`}
              >
                <CreditCard
                  size={21}
                  className="text-[#C6922E]"
                />

                <p className="mt-3 text-sm font-bold text-[#0B2239]">
                  Card
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Credit or Debit Card
                </p>

                {paymentMethod === "card" && (
                  <div className="mt-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#C6922E]">
                    <Check size={13} className="text-white" />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("netbanking")}
                className={`rounded-xl border p-4 text-left transition ${
                  paymentMethod === "netbanking"
                    ? "border-[#C6922E] bg-[#FBF7ED]"
                    : "border-[#E8E3D8] bg-white hover:border-[#C6922E]/50"
                }`}
              >
                <WalletCards
                  size={21}
                  className="text-[#C6922E]"
                />

                <p className="mt-3 text-sm font-bold text-[#0B2239]">
                  Net Banking
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Pay through your bank
                </p>

                {paymentMethod === "netbanking" && (
                  <div className="mt-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#C6922E]">
                    <Check size={13} className="text-white" />
                  </div>
                )}
              </button>

            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handlePayment} className="mt-7">

              {paymentMethod === "upi" && (
                <div>
                  <label
                    htmlFor="upiId"
                    className="mb-2 block text-sm font-semibold text-[#0B2239]"
                  >
                    UPI ID
                  </label>

                  <div className="relative">
                    <Smartphone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="upiId"
                      type="text"
                      value={upiId}
                      onChange={(e) =>
                        setUpiId(e.target.value)
                      }
                      placeholder="example@upi"
                      required
                      className="h-13 w-full rounded-xl border border-[#D9D3C7] pl-11 pr-4 outline-none transition focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="space-y-5">

                  <div>
                    <label
                      htmlFor="cardNumber"
                      className="mb-2 block text-sm font-semibold text-[#0B2239]"
                    >
                      Card Number
                    </label>

                    <div className="relative">
                      <CreditCard
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        id="cardNumber"
                        name="number"
                        type="text"
                        value={cardData.number}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                        className="h-13 w-full rounded-xl border border-[#D9D3C7] pl-11 pr-4 outline-none transition focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="cardName"
                      className="mb-2 block text-sm font-semibold text-[#0B2239]"
                    >
                      Cardholder Name
                    </label>

                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        id="cardName"
                        name="name"
                        type="text"
                        value={cardData.name}
                        onChange={handleCardChange}
                        placeholder="Name on card"
                        required
                        className="h-13 w-full rounded-xl border border-[#D9D3C7] pl-11 pr-4 outline-none transition focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>
                      <label
                        htmlFor="expiry"
                        className="mb-2 block text-sm font-semibold text-[#0B2239]"
                      >
                        Expiry Date
                      </label>

                      <input
                        id="expiry"
                        name="expiry"
                        type="text"
                        value={cardData.expiry}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                        className="h-13 w-full rounded-xl border border-[#D9D3C7] px-4 outline-none transition focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="cvv"
                        className="mb-2 block text-sm font-semibold text-[#0B2239]"
                      >
                        CVV
                      </label>

                      <input
                        id="cvv"
                        name="cvv"
                        type="password"
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        placeholder="•••"
                        maxLength={4}
                        required
                        className="h-13 w-full rounded-xl border border-[#D9D3C7] px-4 outline-none transition focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
                      />
                    </div>

                  </div>
                </div>
              )}

              {paymentMethod === "netbanking" && (
                <div>
                  <label
                    htmlFor="bank"
                    className="mb-2 block text-sm font-semibold text-[#0B2239]"
                  >
                    Select Your Bank
                  </label>

                  <select
                    id="bank"
                    required
                    defaultValue=""
                    className="h-13 w-full rounded-xl border border-[#D9D3C7] bg-white px-4 text-sm outline-none transition focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
                  >
                    <option value="" disabled>
                      Select a bank
                    </option>
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                    <option>Punjab National Bank</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-[#C6922E] px-6 py-4 font-bold text-white transition hover:bg-[#AD7F25] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {processing ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock size={19} />
                    Pay ₹{amount.toLocaleString("en-IN")}
                    <ArrowRight size={19} />
                  </>
                )}
              </button>

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#F7F8FA] p-4">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-[#0B2742]"
                />

                <p className="text-xs leading-5 text-gray-600">
                  This is a HallMate hackathon payment prototype.
                  No real money is charged.
                </p>
              </div>

            </form>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="h-fit overflow-hidden rounded-2xl border border-[#E8E3D8] bg-white shadow-sm">

            {hallImage && (
              <img
                src={hallImage}
                alt={hallName}
                className="h-56 w-full object-cover"
              />
            )}

            <div className="p-6 sm:p-7">

              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#C6922E]">
                Booking Summary
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#0B2239]">
                {hallName}
              </h2>

              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <MapPin
                  size={16}
                  className="text-[#C6922E]"
                />
                {hallLocation}
              </div>

              <div className="my-6 border-t border-[#E8E3D8]" />

              <div className="flex items-start gap-3">
                <CalendarDays
                  size={19}
                  className="mt-0.5 text-[#C6922E]"
                />

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Event Date
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#0B2239]">
                    {formattedDate}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3">
                <User
                  size={19}
                  className="mt-0.5 text-[#C6922E]"
                />

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Guests
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#0B2239]">
                    {guests} guests
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3">
                <WalletCards
                  size={19}
                  className="mt-0.5 text-[#C6922E]"
                />

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Event Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#0B2239]">
                    {eventType}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-[#FBF7ED] p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Booking Reference
                </p>

                <p className="mt-1 font-bold text-[#0B2239]">
                  {bookingReference}
                </p>
              </div>

              <div className="mt-6 border-t border-[#E8E3D8] pt-5">
                <p className="text-sm text-gray-500">
                  Total Amount
                </p>

                <p className="mt-1 text-3xl font-extrabold text-[#0B2239]">
                  ₹{amount.toLocaleString("en-IN")}
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}