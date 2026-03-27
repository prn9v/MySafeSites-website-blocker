"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import {
  Lock,
  Users,
  ShieldAlert,
  Zap,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { getBackendUrl } from "@/lib/env";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blocklistRes, membersRes] = await Promise.all([
          fetch(`${getBackendUrl()}/blocklist`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${getBackendUrl()}/groups/members`, {
            method: "GET",
            credentials: "include",
          }),
        ]);

        if (blocklistRes.ok) {
          const data = await blocklistRes.json();
          setSites(data.sites || []);
        }

        if (membersRes.ok) {
          const data = await membersRes.json();
          setMembers(data.members || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const recentActivity = sites.slice(0, 5).map((site) => {
    const date = new Date(site.createdAt);
    return {
      domain: site.domain,
      action: "Blocked",
      time:
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  });

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in">
        <div>
          <h2 className="mt-4 text-3xl font-semibold text-foreground tracking-tighter">
            Overview
          </h2>
          <p className="text-muted-foreground text-lg">
            Your workspace at a glance.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Blocked Sites"
                value={sites.length}
                icon={<Lock size={18} />}
                trend={
                  sites.length > 0 ? `Latest: ${sites[0]?.domain}` : "None"
                }
              />
              <StatCard
                label="Group Members"
                value={members.length === 0 ? 1 : members.length}
                icon={<Users size={18} />}
              />
              <StatCard
                label="Threats Detected"
                value={Math.floor(sites.length / 3)}
                icon={<ShieldAlert size={18} />}
                trend="From recent activity"
              />
              <StatCard
                label="Safety Score"
                value="94%"
                icon={<Zap size={18} />}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="surface-card rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    Recent Activity
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Latest
                  </span>
                </div>
                <div className="divide-y divide-border/30">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((item, i) => (
                      <div
                        key={i}
                        className="px-6 py-3.5 flex items-center justify-between hover:bg-accent/30 transition-colors"
                      >
                        <div>
                          <span className="text-sm font-mono text-foreground">
                            {item.domain}
                          </span>
                          <span
                            className={`ml-3 text-xs ${item.action === "Threat Detected" ? "text-destructive" : "text-muted-foreground"}`}
                          >
                            {item.action}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {item.time}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                      No recent activity.
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="surface-card rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-medium text-foreground">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/blocked"
                    className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Lock size={16} className="text-primary" />
                      <span className="text-sm text-foreground">
                        Add a site to blocklist
                      </span>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  </Link>
                  <Link
                    href="/url-checker"
                    className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Zap size={16} className="text-primary" />
                      <span className="text-sm text-foreground">
                        Check a URL for safety
                      </span>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  </Link>
                  <Link
                    href="/groups"
                    className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Users size={16} className="text-primary" />
                      <span className="text-sm text-foreground">
                        Invite someone to your group
                      </span>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
