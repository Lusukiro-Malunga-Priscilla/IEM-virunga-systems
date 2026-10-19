import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & { label?: ReactNode };

export function AuthInput({ className, label, ...props }: AuthInputProps) {
  return (
    <label className="block w-full text-left">
      {label ? <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span> : null}
      <input
        {...props}
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
      />
    </label>
  );
}

export function AuthPrimaryButton({ className, children, loading, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
    >
      {loading ? "Chargement..." : children}
    </button>
  );
}

export function AuthGhostButton({ className, children, loading, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
    >
      {loading ? "Chargement..." : children}
    </button>
  );
}

export function AuthNotice({ variant = "default", children }: { variant?: "default" | "success" | "error"; children: ReactNode }) {
  const tone =
    variant === "success"
      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
      : variant === "error"
        ? "border-red-400/30 bg-red-500/10 text-red-100"
        : "border-white/10 bg-white/5 text-slate-200";

  return <div className={cn("rounded-xl border px-3 py-2 text-sm", tone)}>{children}</div>;
}
