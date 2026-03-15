"use client";

import {
  Shield,
  Lock,
  Search,
  Users,
  Settings,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Blocked Sites", url: "/blocked", icon: Lock },
  { title: "Safety Checker", url: "/url-checker", icon: Search },
  { title: "Groups", url: "/groups", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh(); 
  };

  const breadcrumb =
    navItems.find((i) => pathname.startsWith(i.url))?.title ?? "Overview";

  return (
    <div className="flex min-h-screen bg-background text-muted-foreground font-sans selection:bg-primary/30">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-border flex flex-col p-6 gap-8 bg-background
        transform transition-transform duration-200
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Shield size={20} />
            </div>
            <span className="font-bold text-foreground tracking-tighter text-lg">
              MySafeSites
            </span>
          </div>

          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.url || pathname.startsWith(item.url + "/");

            return (
              <Link
                key={item.title}
                href={item.url}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 group
                  ${
                    isActive
                      ? "bg-accent text-foreground"
                      : "hover:bg-accent hover:text-foreground"
                  }`}
              >
                <item.icon
                  size={18}
                  className="group-hover:text-primary transition-colors"
                />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="pt-6 border-t border-border space-y-1">
          <button
            className="flex items-center gap-3 px-3 py-2 w-full text-left text-destructive hover:text-destructive/80 transition-colors text-sm"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-24 border-b border-border flex items-center justify-between px-4 lg:px-8 bg-background/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>

            <span className="text-lg font-medium text-foreground">
              Workspace / {breadcrumb}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-indigo-400 border border-border" />
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-6xl w-full mx-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
