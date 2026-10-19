import type { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  formTitle?: string;
  formSubtitle?: string;
};

export default function AuthLayout({ children, formTitle, formSubtitle }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-md p-8">
        <header style={{ marginBottom: 18 }}>
          {formTitle ? <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{formTitle}</h2> : null}
          {formSubtitle ? <p style={{ marginTop: 6, color: '#64748b' }}>{formSubtitle}</p> : null}
        </header>
        <section>{children}</section>
      </div>
    </div>
  );
}
