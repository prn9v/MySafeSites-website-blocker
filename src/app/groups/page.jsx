"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { UserPlus, Trash2, X, Crown, User } from "lucide-react";
import { getBackendUrl } from "@/lib/env";

export default function GroupsPage() {
  const [members, setMembers] = useState([])
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");

  const fetchMembers = async () => {

    const res = await fetch(
      `${getBackendUrl()}/groups/members`,
      { credentials: "include" }
    )

    const data = await res.json()

    if (res.ok) {
      setMembers(data.members)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const invite = async () => {

    if (!email.trim()) return

    const res = await fetch(
      `${getBackendUrl()}/groups/invite`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      }
    )

    const data = await res.json()

    if (!res.ok) {
      alert(data.error)
      return
    }

    setMembers((prev) => [...prev, data.member])

    setEmail("")
    setShowInvite(false)
  }

  const removeMember = async (id) => {

    await fetch(
      `${getBackendUrl()}/groups/members/${id}`,
      {
        method: "DELETE",
        credentials: "include"
      }
    )

    setMembers((prev) =>
      prev.filter((m) => m.id !== id)
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in">
        {/* HEADER */}

        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground tracking-tighter">
              Group Members
            </h2>
            <p className="text-muted-foreground text-sm">
              Manage members who share your blocklist.
            </p>
          </div>

          <Button
            onClick={() => setShowInvite(true)}
            className="gap-2 self-start"
          >
            <UserPlus size={16} />
            Invite Member
          </Button>
        </div>

        {/* INVITE BOX */}

        {showInvite && (
          <div className="surface-card rounded-xl p-4">
            <div className="flex gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && invite()}
                placeholder="Enter email address"
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/40"
                autoFocus
              />

              <Button onClick={invite}>Send Invite</Button>

              <Button variant="ghost" onClick={() => setShowInvite(false)}>
                <X size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* MEMBERS TABLE */}

        <div className="surface-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-6 py-4 font-medium">Member</th>

                  <th className="px-6 py-4 font-medium hidden sm:table-cell">
                    Email
                  </th>

                  <th className="px-6 py-4 font-medium hidden md:table-cell">
                    Role
                  </th>

                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/30">
                {members.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-sm text-muted-foreground"
                    >
                      No members added yet
                    </td>
                  </tr>
                )}

                {members.map((m) => (
                  <tr
                    key={m.id}
                    className="group hover:bg-accent/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary/60 to-indigo-400/60 flex items-center justify-center text-primary-foreground text-xs font-bold">
                          {m.name.charAt(0)}
                        </div>

                        <span className="text-sm text-foreground font-medium">
                          {m.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground font-mono hidden sm:table-cell">
                      {m.email}
                    </td>

                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        {m.role === "Admin" ? (
                          <Crown size={10} />
                        ) : (
                          <User size={10} />
                        )}

                        {m.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {m.role !== "Admin" && (
                        <button
                          onClick={() => removeMember(m.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
