import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { Lock, Users, ShieldAlert, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const recentActivity = [
  { domain: "facebook.com", action: "Blocked", time: "2 min ago" },
  { domain: "suspicious-login.ru", action: "Threat Detected", time: "15 min ago" },
  { domain: "instagram.com", action: "Blocked", time: "1 hr ago" },
  { domain: "reddit.com", action: "Blocked", time: "3 hr ago" },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in">
        <div>
          <h2 className="mt-4 text-3xl font-semibold text-foreground tracking-tighter">Overview</h2>
          <p className="text-muted-foreground text-lg">Your workspace at a glance.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Blocked Sites" value={12} icon={<Lock size={18} />} trend="+3 this week" />
          <StatCard label="Group Members" value={5} icon={<Users size={18} />} />
          <StatCard label="Threats Detected" value={3} icon={<ShieldAlert size={18} />} trend="2 resolved" />
          <StatCard label="Safety Score" value="94%" icon={<Zap size={18} />} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="surface-card rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Recent Activity</h3>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Last 24h</span>
            </div>
            <div className="divide-y divide-border/30">
              {recentActivity.map((item, i) => (
                <div key={i} className="px-6 py-3.5 flex items-center justify-between hover:bg-accent/30 transition-colors">
                  <div>
                    <span className="text-sm font-mono text-foreground">{item.domain}</span>
                    <span className={`ml-3 text-xs ${item.action === "Threat Detected" ? "text-destructive" : "text-muted-foreground"}`}>
                      {item.action}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="surface-card rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-medium text-foreground">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/blocked" className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <Lock size={16} className="text-primary" />
                  <span className="text-sm text-foreground">Add a site to blocklist</span>
                </div>
                <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link href="/url-checker" className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <Zap size={16} className="text-primary" />
                  <span className="text-sm text-foreground">Check a URL for safety</span>
                </div>
                <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link href="/groups" className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-primary" />
                  <span className="text-sm text-foreground">Invite someone to your group</span>
                </div>
                <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
