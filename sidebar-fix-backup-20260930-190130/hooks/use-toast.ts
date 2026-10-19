type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
};

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastOptions) => {
    const log = variant === "destructive" ? console.error : console.info;
    log(`[${variant}] ${title ?? "Notification"}${description ? `: ${description}` : ""}`);
  };

  return { toast };
}
