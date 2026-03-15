'use client'

import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Trash2, Globe, Plus, X, Loader2 } from "lucide-react";
import { getBackendUrl } from "@/lib/env";

export default function BlockedSitesPage() {
  const [sites, setSites]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showAdd, setShowAdd]       = useState(false);
  const [newDomain, setNewDomain]   = useState("");
  const [addError, setAddError]     = useState("");
  const [adding, setAdding]         = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ── Fetch on mount ─────────────────────────────
  const fetchSites = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${getBackendUrl()}/blocklist`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSites(data.sites);
    } catch (err) {
      console.error("Failed to fetch sites:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSites(); }, [fetchSites]);

  // ── Add site ───────────────────────────────────
  const addSite = async () => {
    const trimmed = newDomain.trim();
    if (!trimmed) return;

    setAddError("");
    setAdding(true);

    try {
      const res = await fetch(`${getBackendUrl()}/blocklist`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: trimmed }), // field is "domain" per model
      });

      const data = await res.json();

      if (!res.ok) {
        setAddError(data.error || "Failed to add site");
        return;
      }

      setSites((prev) => [data.site, ...prev]);
      setNewDomain("");
      setShowAdd(false);
    } catch {
      setAddError("Something went wrong. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  // ── Remove site ────────────────────────────────
  const removeSite = async (siteId) => {
    setDeletingId(siteId);
    try {
      const res = await fetch(`${getBackendUrl()}/blocklist/${siteId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        console.error("Delete failed:", data.error);
        return;
      }
      setSites((prev) => prev.filter((s) => s._id !== siteId));
    } catch (err) {
      console.error("Failed to remove site:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });

  const handleClose = () => {
    setShowAdd(false);
    setNewDomain("");
    setAddError("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground tracking-tighter">
              Blocked Sites
            </h2>
            <p className="text-muted-foreground text-sm">
              Manage the domains restricted across your devices.
            </p>
          </div>
          <Button onClick={() => setShowAdd(true)} className="gap-2 self-start" disabled={showAdd}>
            <Plus size={16} /> Add Domain
          </Button>
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="surface-card rounded-xl p-4 space-y-2">
            <div className="flex gap-2">
              <input
                value={newDomain}
                onChange={(e) => { setNewDomain(e.target.value); setAddError(""); }}
                onKeyDown={(e) => e.key === "Enter" && addSite()}
                placeholder="Enter domain (e.g., youtube.com)"
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/40"
                autoFocus
                disabled={adding}
              />
              <Button onClick={addSite} disabled={adding}>
                {adding ? <Loader2 size={16} className="animate-spin" /> : "Add"}
              </Button>
              <Button variant="ghost" onClick={handleClose} disabled={adding}>
                <X size={16} />
              </Button>
            </div>
            {addError && <p className="text-destructive text-xs px-1">{addError}</p>}
          </div>
        )}

        {/* Table */}
        <div className="surface-card rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground text-sm">
              <Loader2 size={16} className="animate-spin" /> Loading...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    <th className="px-6 py-4 font-medium">Domain</th>
                    <th className="px-6 py-4 font-medium hidden sm:table-cell">Date Added</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {sites.map((site) => (
                    <tr key={site._id} className="group hover:bg-accent/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                            <Globe size={16} />
                          </div>
                          {/* "domain" matches BlockedSite model field */}
                          <span className="text-sm font-mono text-foreground">{site.domain}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground hidden sm:table-cell">
                        {formatDate(site.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => removeSite(site._id)}
                          disabled={deletingId === site._id}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                        >
                          {deletingId === site._id
                            ? <Loader2 size={16} className="animate-spin" />
                            : <Trash2 size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {sites.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No blocked sites yet. Add one to get started.
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}