import { cn } from "@/lib/utils";

export function StatCard({ label, value, icon, trend, className }) {
  return (
    <div className={cn("surface-card rounded-xl p-6", className)}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-medium">
          {label}
        </span>

        <div className="text-muted-foreground">
          {icon}
        </div>
      </div>

      <div className="text-3xl font-semibold text-foreground tracking-tighter">
        {value}
      </div>

      {trend && (
        <p className="text-xs text-safe mt-2">
          {trend}
        </p>
      )}
    </div>
  );
}
