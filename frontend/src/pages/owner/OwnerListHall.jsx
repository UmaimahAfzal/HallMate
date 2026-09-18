import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  MapPin,
  IndianRupee,
  Users,
  Image,
  FileText,
  Save,
} from "lucide-react";

export default function OwnerListHall() {
  const navigate = useNavigate();

  const [owner, setOwner] = useState(() => {
    try {
      const saved =
        localStorage.getItem("hallmateOwner") ||
        sessionStorage.getItem("hallmateOwner");

      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    image: "",
    pricePerDay: "",
    capacity: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!owner?.id || owner.role !== "owner") {
      navigate("/owner/sign-in");
      return;
    }

    if (
      !form.name.trim() ||
      !form.location.trim() ||
      !form.pricePerDay ||
      !form.capacity
    ) {
      setError(
        "Please fill in hall name, location, price and capacity."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        "http://localhost:5000/api/halls",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ownerId: owner.id,
            name: form.name.trim(),
            location: form.location.trim(),
            description: form.description.trim(),
            image: form.image.trim(),
            pricePerDay: Number(form.pricePerDay),
            capacity: Number(form.capacity),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to list your hall."
        );
      }

      setSuccess("Hall listed successfully.");

      setTimeout(() => {
        navigate("/owner/my-hall");
      }, 700);

    } catch (err) {
      console.error("List hall error:", err);
      setError(
        err.message || "Unable to list your hall. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0]">

      {/* HEADER */}
      <div className="border-b border-[#E8E3D8] bg-white">
        <div className="mx-auto max-w-[1100px] px-6 py-7 lg:px-10">

          <button
            type="button"
            onClick={() => navigate("/owner/my-hall")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#53677A] hover:text-[#C6922E]"
          >
            <ArrowLeft size={17} />
            Back to My Halls
          </button>

          <p className="text-xs font-bold tracking-[0.2em] text-[#C6922E]">
            VENUE MANAGEMENT
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0B2742] md:text-4xl">
            List Your Hall
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#718096]">
            Add your event venue to HallMate and make it available for customers.
          </p>

        </div>
      </div>


      {/* FORM */}
      <main className="mx-auto max-w-[1100px] px-6 py-8 lg:px-10">

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#E8E3D8] bg-white p-6 shadow-sm md:p-8"
        >

          {/* MESSAGES */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {success}
            </div>
          )}


          {/* BASIC DETAILS */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F1E4]">
                <Building2
                  size={19}
                  className="text-[#C6922E]"
                />
              </div>

              <div>
                <h2 className="font-bold text-[#0B2742]">
                  Hall Details
                </h2>

                <p className="text-xs text-[#718096]">
                  Provide the basic information about your venue.
                </p>
              </div>

            </div>


            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* NAME */}
              <Field
                icon={Building2}
                label="Hall Name"
                required
              >
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Grand Celebration Hall"
                  className="input"
                  required
                />
              </Field>


              {/* LOCATION */}
              <Field
                icon={MapPin}
                label="Location"
                required
              >
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Hyderabad"
                  className="input"
                  required
                />
              </Field>


              {/* CAPACITY */}
              <Field
                icon={Users}
                label="Guest Capacity"
                required
              >
                <input
                  name="capacity"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  className="input"
                  required
                />
              </Field>


              {/* PRICE */}
              <Field
                icon={IndianRupee}
                label="Price Per Day"
                required
              >
                <input
                  name="pricePerDay"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.pricePerDay}
                  onChange={handleChange}
                  placeholder="e.g. 55000"
                  className="input"
                  required
                />
              </Field>

            </div>
          </div>


          {/* DESCRIPTION */}
          <div className="border-t border-[#EEE9DF] pt-8 mb-8">

            <Field
              icon={FileText}
              label="Description"
            >
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your hall, suitable events and key highlights..."
                className="input resize-none"
              />
            </Field>

          </div>


          {/* IMAGE */}
          <div className="border-t border-[#EEE9DF] pt-8">

            <Field
              icon={Image}
              label="Hall Image URL"
            >
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Paste an image URL"
                className="input"
              />
            </Field>

            <p className="mt-2 text-xs text-[#9AA8B8]">
              You can leave this empty if you don't have an image URL.
            </p>

          </div>


          {/* ACTIONS */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#EEE9DF] pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => navigate("/owner/my-hall")}
              className="rounded-xl border border-[#DDD8CC] bg-white px-6 py-3 text-sm font-bold text-[#0B2742] transition hover:border-[#C6922E] hover:text-[#C6922E]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B2742] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#123A5B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />

              {saving ? "Listing Hall..." : "List Hall"}
            </button>

          </div>

        </form>

      </main>
    </div>
  );
}


function Field({
  icon: Icon,
  label,
  required,
  children,
}) {
  return (
    <div>

      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0B2742]">

        <Icon
          size={16}
          className="text-[#C6922E]"
        />

        {label}

        {required && (
          <span className="text-red-500">*</span>
        )}

      </label>

      {children}

    </div>
  );
}