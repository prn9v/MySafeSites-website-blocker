import { Shield, Lock, Search, Zap, Download, ArrowRight, ShieldCheck, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    icon: Lock,
    title: "Block Distracting Sites",
    description: "Add domains to your blocklist and stay focused across all your devices.",
  },
  {
    icon: ShieldCheck,
    title: "AI Safety Detection",
    description: "Our AI analyzes URLs in real-time to detect phishing, malware, and scams.",
  },
  {
    icon: Users,
    title: "Group Blocking",
    description: "Share blocklists with your team or family. Everyone stays protected.",
  },
  {
    icon: Globe,
    title: "Browser Extension",
    description: "Install once. Works on Chrome and Edge. Blocks sites instantly.",
  },
];

const steps = [
  { step: "01", title: "Install Extension", description: "Add MySafeSites to your browser in one click." },
  { step: "02", title: "Create Blocklist", description: "Add distracting or harmful domains to block." },
  { step: "03", title: "Stay Protected", description: "AI monitors threats. You focus on deep work." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-xl sticky top-0 z-50 bg-background/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Shield size={18} />
            </div>
            <span className="font-bold tracking-tighter text-lg">MySafeSites</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.12)_0%,_transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-6 py-24 lg:py-36 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/40 text-xs text-muted-foreground mb-8">
            <Zap size={12} className="text-primary" />
            Now with AI-powered threat detection
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05] mb-6 max-w-4xl mx-auto">
            Deep work, protected
            <br />
            <span className="text-gradient-primary">by intelligence.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Block distracting websites, detect threats in real-time, and stay focused.
            MySafeSites keeps you productive and safe across all your devices.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button variant="hero" size="lg" className="gap-2">
                Start for Free <ArrowRight size={16} />
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="gap-2">
              <Download size={16} /> Install Extension
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-20 pt-10 border-t border-border/50">
            {[
              { value: "47.2%", label: "Less distraction" },
              { value: "12K+", label: "Active users" },
              { value: "99.8%", label: "Threat accuracy" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-foreground tracking-tighter">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/50 bg-card/20">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Everything you need to stay safe</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Powerful tools to block distractions and detect threats, all in one dashboard.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="surface-card rounded-xl p-6 group hover:border-primary/30 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">How it works</h2>
            <p className="text-muted-foreground">Three steps to a distraction-free workday.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="relative">
                <span className="text-6xl font-bold text-border/40 tracking-tighter">{s.step}</span>
                <h3 className="text-lg font-semibold text-foreground mt-2 mb-2 tracking-tight">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="surface-card rounded-2xl p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.08)_0%,_transparent_70%)]" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Ready to take control?</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">Join thousands of users who have reduced distractions by 47% with MySafeSites.</p>
              <Link to="/signup">
                <Button variant="hero" size="lg" className="gap-2">
                  Get Started Free <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">MySafeSites</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 MySafeSites. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
