import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { User, Palette, Download, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in">
        <div>
          <h2 className="text-2xl font-semibold text-foreground tracking-tighter">Settings</h2>
          <p className="text-muted-foreground text-sm">Manage your account and preferences.</p>
        </div>

        {/* Account */}
        <div className="surface-card rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border/50">
            <User size={18} className="text-primary" />
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">Account</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Full Name</label>
              <input
                defaultValue="John Doe"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Email</label>
              <input
                defaultValue="john@example.com"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>
          <Button>Save Changes</Button>
        </div>


        {/* Extension */}
        <div className="surface-card rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border/50">
            <Shield size={18} className="text-primary" />
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">Browser Extension</h3>
          </div>
          <p className="text-sm text-muted-foreground">Install the MySafeSites extension to block sites directly in your browser.</p>
          <Button variant="secondary" className="gap-2">
            <Download size={16} /> Install Extension
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
