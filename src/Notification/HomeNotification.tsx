import { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const HomeNotification = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      toast.custom(
        (t) => (
          <div className="w-100 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-600">
                      Demo
                    </span>

                    <span className="text-xs text-neutral-400">
                      Novara
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold tracking-tight text-neutral-950">
                    Admin Dashboard
                  </h3>

                  <p className="mt-1.5 max-w-[320px] text-sm leading-5 text-neutral-500">
                    Explore the Novara admin dashboard demo and see how store
                    management works.
                  </p>
                </div>

                <button
                  onClick={() => toast.dismiss(t)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
                >
                  ×
                </button>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => {
                    toast.dismiss(t);
                    navigate("/dashboard");
                  }}
                  className="flex-1 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-800"
                >
                  Open Demo
                </button>

                <button
                  onClick={() => toast.dismiss(t)}
                  className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        ),
        {
          duration: 120000,
          position: "top-right",
          unstyled: true,
        },
      );
    }, 700);

    return () => clearTimeout(timer);
  }, [navigate]);

  return null;
};

export default HomeNotification;