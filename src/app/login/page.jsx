"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Shield, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { getBackendUrl } from "@/lib/env";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  <GoogleLogin
    onSuccess={async (res) => {
      await fetch("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({
          credential: res.credential,
        }),
      });

      router.push("/dashboard");
    }}
  />;
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${getBackendUrl()}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_ID}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.08)_0%,_transparent_50%)]" />

      <div className="w-full max-w-sm relative">
        {/* Header */}

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground mx-auto mb-4">
            <Shield size={24} />
          </div>

          <h1 className="text-2xl font-bold text-foreground tracking-tighter">
            Welcome back
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your MySafeSites account
          </p>
        </div>

        {/* Form */}

        <form
          onSubmit={handleLogin}
          className="surface-card rounded-xl p-6 space-y-4"
        >
          {/* Email */}

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/40"
            />
          </div>

          {/* Password */}

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/40 pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {/* Submit */}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 flex gap-3">
          {/* Google */}
          <div className="flex-1">
            <GoogleLogin
              width="50%"
              onSuccess={async (res) => {
                await fetch("/api/auth/google", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    credential: res.credential,
                  }),
                });

                router.push("/dashboard");
              }}
              onError={() => {
                setError("Google login failed");
              }}
            />
          </div>

          {/* GitHub */}
          <button
            onClick={handleGithubLogin}
            className="flex-1 flex items-center justify-center gap-2 border border-border rounded-lg px-3 py-1.5 text-sm font-medium bg-background hover:bg-muted transition-colors"
          >
            {/* GitHub Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="currentColor"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.21 11.44c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.34-1.75-1.34-1.75-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.25 1.86 1.25 1.08 1.85 2.84 1.32 3.53 1.01.11-.78.42-1.32.76-1.62-2.67-.3-5.48-1.34-5.48-5.95 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.4 11.4 0 016 0c2.28-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.62-2.81 5.65-5.49 5.95.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>

        <p className="text-center mt-4 text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
