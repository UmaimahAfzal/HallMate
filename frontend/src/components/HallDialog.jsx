import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";

let showHallDialog = null;

export function hallAlert(message, type = "info", title = "HallMate") {
  if (showHallDialog) {
    showHallDialog({
      message,
      type,
      title,
    });
  }
}

export default function HallDialog() {
  const [dialog, setDialog] = useState(null);

  useEffect(() => {
  showHallDialog = (data) => {
    setDialog(data);
  };

  return () => {
    showHallDialog = null;
  };
}, []);

  if (!dialog) return null;

  const closeDialog = () => {
    setDialog(null);
  };

  const icons = {
    success: (
      <CheckCircle
        size={28}
        className="text-[#15945A]"
      />
    ),

    error: (
      <XCircle
        size={28}
        className="text-red-500"
      />
    ),

    warning: (
      <AlertCircle
        size={28}
        className="text-[#C6922E]"
      />
    ),

    info: (
      <Info
        size={28}
        className="text-[#0B2742]"
      />
    ),
  };

  const iconBackground = {
    success: "bg-[#DDF8EA]",
    error: "bg-red-50",
    warning: "bg-[#FBF3DF]",
    info: "bg-[#EEF4F9]",
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-5 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          closeDialog();
        }
      }}
    >
      <div
        className="w-full max-w-[440px] overflow-hidden rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        {/* TOP */}
        <div className="flex items-start justify-between px-6 pt-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                iconBackground[dialog.type] || iconBackground.info
              }`}
            >
              {icons[dialog.type] || icons.info}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#C6922E]">
                HALLMATE
              </p>

              <h2 className="mt-0.5 text-xl font-bold text-[#0B2239]">
                {dialog.title}
              </h2>
            </div>
          </div>

          <button
            onClick={closeDialog}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-[#0B2239]"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* MESSAGE */}
        <div className="px-6 py-6">
          <p className="text-[15px] leading-7 text-gray-600">
            {dialog.message}
          </p>
        </div>

        {/* FOOTER */}
        <div className="border-t border-[#E8E3D8] bg-[#FBFAF7] px-6 py-4">
          <button
            onClick={closeDialog}
            autoFocus
            className="w-full rounded-lg bg-[#C6922E] px-5 py-3 font-bold text-white transition hover:bg-[#AD7F25] focus:outline-none focus:ring-2 focus:ring-[#C6922E] focus:ring-offset-2"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}