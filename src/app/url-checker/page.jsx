'use client'

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Zap, ShieldCheck, AlertTriangle, Loader2, XCircle } from "lucide-react";
import { getBackendUrl } from "@/lib/env";

export default function SafetyCheckerPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`${getBackendUrl()}/api/url-checker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        // API returned an error (400 / 500)
        setError(data?.details || data?.error || "Something went wrong.");
        return;
      }

      setResult(data);
    } catch (err) {
      setError("Network error — could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result
    ? result.score > 80
      ? "text-safe"
      : result.score > 60
      ? "text-warning"
      : "text-destructive"
    : "";

  const strokeColor = result
    ? result.score > 80
      ? "stroke-safe"
      : result.score > 60
      ? "stroke-warning"
      : "stroke-destructive"
    : "";

  // Derive SSL status from risks array returned by the API
  const sslRisk = result?.risks?.find((r) =>
    r.label.toLowerCase().includes("ssl")
  );
  const sslLabel =
    sslRisk?.severity === "safe"
      ? "Valid Certificate"
      : sslRisk
      ? "Invalid / Missing"
      : "Unknown";
  const sslColor =
    sslRisk?.severity === "safe" ? "text-safe" : "text-destructive";

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in">
        <div>
          <h2 className="text-2xl font-semibold text-foreground tracking-tighter">
            URL Safety Checker
          </h2>
          <p className="text-muted-foreground text-sm">
            Analyze any domain using our real-time AI threat model.
          </p>
        </div>

        {/* Input */}
        <div className="surface-card rounded-xl p-1">
          <div className="flex gap-2 p-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && analyze()}
              placeholder="Enter URL to analyze (e.g., suspicious-login.com)"
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/40 font-mono"
            />
            <Button
              onClick={analyze}
              disabled={loading || !url.trim()}
              className="shrink-0 gap-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Zap size={16} />
              )}
              {loading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="surface-card rounded-xl p-5 flex items-start gap-3 border border-destructive/30 bg-destructive/5">
            <XCircle size={18} className="text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">
                Analysis Failed
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score */}
            <div className="surface-card rounded-xl p-6 md:col-span-2 flex flex-col items-center py-12">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-border flex items-center justify-center">
                  <span
                    className={`text-4xl font-mono font-bold ${scoreColor}`}
                  >
                    {result.score}%
                  </span>
                </div>
                <svg
                  className="absolute top-0 left-0 w-32 h-32 -rotate-90"
                  viewBox="0 0 128 128"
                >
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    fill="none"
                    className={strokeColor}
                    strokeWidth="4"
                    strokeDasharray={376}
                    strokeDashoffset={376 - (376 * result.score) / 100}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-foreground mb-1">
                {result.classification}
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Analysis complete for{" "}
                <span className="text-foreground font-mono">{result.url}</span>
              </p>
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="p-3 rounded-lg bg-background border border-border">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                    Classification
                  </span>
                  <span className="text-sm text-foreground font-medium">
                    {result.classification}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-background border border-border">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                    SSL Status
                  </span>
                  <span className={`text-sm font-medium ${sslColor}`}>
                    {sslLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="surface-card rounded-xl p-6 space-y-4">
              <h4 className="text-[10px] font-medium text-foreground uppercase tracking-widest">
                Risk Factors
              </h4>
              <ul className="space-y-4">
                {result.risks.map((risk, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    {risk.severity === "safe" ? (
                      <ShieldCheck size={16} className="text-safe shrink-0" />
                    ) : risk.severity === "high" ? (
                      <XCircle size={16} className="text-destructive shrink-0" />
                    ) : (
                      <AlertTriangle
                        size={16}
                        className="text-warning shrink-0"
                      />
                    )}
                    <span className="text-foreground/80">{risk.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && !error && (
          <div className="surface-card rounded-xl p-12 text-center border-dashed">
            <Zap size={32} className="text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">
              Enter a URL above to start the analysis.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}'use client'

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Zap, ShieldCheck, AlertTriangle, Loader2, XCircle } from "lucide-react";

export default function SafetyCheckerPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/url-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        // API returned an error (400 / 500)
        setError(data?.details || data?.error || "Something went wrong.");
        return;
      }

      setResult(data);
    } catch (err) {
      setError("Network error — could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result
    ? result.score > 80
      ? "text-safe"
      : result.score > 60
      ? "text-warning"
      : "text-destructive"
    : "";

  const strokeColor = result
    ? result.score > 80
      ? "stroke-safe"
      : result.score > 60
      ? "stroke-warning"
      : "stroke-destructive"
    : "";

  // Derive SSL status from risks array returned by the API
  const sslRisk = result?.risks?.find((r) =>
    r.label.toLowerCase().includes("ssl")
  );
  const sslLabel =
    sslRisk?.severity === "safe"
      ? "Valid Certificate"
      : sslRisk
      ? "Invalid / Missing"
      : "Unknown";
  const sslColor =
    sslRisk?.severity === "safe" ? "text-safe" : "text-destructive";

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in">
        <div>
          <h2 className="text-2xl font-semibold text-foreground tracking-tighter">
            URL Safety Checker
          </h2>
          <p className="text-muted-foreground text-sm">
            Analyze any domain using our real-time AI threat model.
          </p>
        </div>

        {/* Input */}
        <div className="surface-card rounded-xl p-1">
          <div className="flex gap-2 p-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && analyze()}
              placeholder="Enter URL to analyze (e.g., suspicious-login.com)"
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/40 font-mono"
            />
            <Button
              onClick={analyze}
              disabled={loading || !url.trim()}
              className="shrink-0 gap-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Zap size={16} />
              )}
              {loading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="surface-card rounded-xl p-5 flex items-start gap-3 border border-destructive/30 bg-destructive/5">
            <XCircle size={18} className="text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">
                Analysis Failed
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score */}
            <div className="surface-card rounded-xl p-6 md:col-span-2 flex flex-col items-center py-12">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-border flex items-center justify-center">
                  <span
                    className={`text-4xl font-mono font-bold ${scoreColor}`}
                  >
                    {result.score}%
                  </span>
                </div>
                <svg
                  className="absolute top-0 left-0 w-32 h-32 -rotate-90"
                  viewBox="0 0 128 128"
                >
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    fill="none"
                    className={strokeColor}
                    strokeWidth="4"
                    strokeDasharray={376}
                    strokeDashoffset={376 - (376 * result.score) / 100}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-foreground mb-1">
                {result.classification}
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Analysis complete for{" "}
                <span className="text-foreground font-mono">{result.url}</span>
              </p>
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="p-3 rounded-lg bg-background border border-border">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                    Classification
                  </span>
                  <span className="text-sm text-foreground font-medium">
                    {result.classification}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-background border border-border">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                    SSL Status
                  </span>
                  <span className={`text-sm font-medium ${sslColor}`}>
                    {sslLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="surface-card rounded-xl p-6 space-y-4">
              <h4 className="text-[10px] font-medium text-foreground uppercase tracking-widest">
                Risk Factors
              </h4>
              <ul className="space-y-4">
                {result.risks.map((risk, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    {risk.severity === "safe" ? (
                      <ShieldCheck size={16} className="text-safe shrink-0" />
                    ) : risk.severity === "high" ? (
                      <XCircle size={16} className="text-destructive shrink-0" />
                    ) : (
                      <AlertTriangle
                        size={16}
                        className="text-warning shrink-0"
                      />
                    )}
                    <span className="text-foreground/80">{risk.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && !error && (
          <div className="surface-card rounded-xl p-12 text-center border-dashed">
            <Zap size={32} className="text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">
              Enter a URL above to start the analysis.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}