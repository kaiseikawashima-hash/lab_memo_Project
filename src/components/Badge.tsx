import { CheckCircle2, Flag, Tag } from "lucide-react";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "cyan" | "violet" | "slate" | "amber";
  icon?: "tag" | "flag" | "check";
};

const tones = {
  cyan: "border-cyan-300/30 bg-cyan-400/10 text-cyan-100",
  violet: "border-violet-300/30 bg-violet-400/10 text-violet-100",
  slate: "border-slate-300/20 bg-slate-400/10 text-slate-200",
  amber: "border-amber-300/30 bg-amber-400/10 text-amber-100"
};

export function Badge({ children, tone = "slate", icon }: BadgeProps) {
  const Icon = icon === "tag" ? Tag : icon === "flag" ? Flag : icon === "check" ? CheckCircle2 : null;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      {children}
    </span>
  );
}
