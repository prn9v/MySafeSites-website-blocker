// src/app/api/safety/route.js

/**
 * @swagger
 * /api/safety:
 *   post:
 *     summary: Check if a URL is safe or phishing using AI
 *     tags: [Safety]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [url]
 *             properties:
 *               url:
 *                 type: string
 *                 example: https://suspicious-bank-login.com
 *     responses:
 *       200:
 *         description: Safety result
 */

import { NextResponse } from "next/server";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

// ─────────────────────────────────────────────────────────────────────────────
// MODEL: ealvaradob/bert-finetuned-phishing
//   • Fine-tuned BERT-large on URLs, emails, SMS, and websites
//   • Binary output: label 0 = Benign, label 1 = Phishing
//   • Confirmed on HuggingFace hf-inference supported list
//
// CORRECT URL FORMAT (as of 2025):
//   https://router.huggingface.co/hf-inference/models/{model_id}
//   (the old api-inference.huggingface.co domain is fully shut down — 410 Gone)
// ─────────────────────────────────────────────────────────────────────────────
const HF_MODEL_URL =
  "https://router.huggingface.co/hf-inference/models/ealvaradob/bert-finetuned-phishing";

const DANGER_THRESHOLD = 50; // maliciousScore >= this → hard block

export async function POST(req) {
  try {
    const { url } = await req.json();

    // ── Validate input ─────────────────────────────
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Skip localhost / internal addresses — always safe
    const hostname = parsedUrl.hostname;
    if (
      hostname === "localhost"  ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".local")
    ) {
      return NextResponse.json({
        url,
        label:          "Benign",
        score:          100,
        maliciousScore: 0,
        danger:         false,
        message:        "Local URL — skipped",
      });
    }

    // ── Call HuggingFace Inference Router ──────────
    const hfRes = await fetch(HF_MODEL_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type":  "application/json",
        "X-Wait-For-Model": "true", // wait instead of 503 on cold start
      },
      body: JSON.stringify({
        inputs: url,
        parameters: { return_all_scores: true },
      }),
    });

    if (!hfRes.ok) {
      const errText = await hfRes.text();
      console.error(`HuggingFace error: ${hfRes.status}`, errText);
      throw new Error(`HuggingFace API error: ${hfRes.status}`);
    }

    // ── Parse response ─────────────────────────────
    // Shape: [[{ label: "LABEL_0", score: 0.97 }, { label: "LABEL_1", score: 0.03 }]]
    // LABEL_0 = Benign, LABEL_1 = Phishing
    const raw = await hfRes.json();

    // Handle both [[{...}]] and [{...}] response shapes
    const results = Array.isArray(raw[0]) ? raw[0] : raw;

    // Map numeric labels to names
    const labelMap = {
      "LABEL_0": "Benign",
      "LABEL_1": "Phishing",
      // Some versions of this model use named labels directly
      "benign":   "Benign",
      "phishing": "Phishing",
    };

    const benignEntry   = results.find((r) =>
      r.label === "LABEL_0" || r.label?.toLowerCase() === "benign"
    ) || { score: 0 };

    const phishingEntry = results.find((r) =>
      r.label === "LABEL_1" || r.label?.toLowerCase() === "phishing"
    ) || { score: 0 };

    const safePercent      = Math.round(benignEntry.score   * 100);
    const maliciousPercent = Math.round(phishingEntry.score * 100);
    const isDangerous      = maliciousPercent >= DANGER_THRESHOLD;
    const label            = maliciousPercent > safePercent ? "Phishing" : "Benign";

    // ── Human-readable message ─────────────────────
    let message;
    if (maliciousPercent >= 80) {
      message = "⛔ High phishing risk — this site may steal your credentials";
    } else if (maliciousPercent >= 50) {
      message = "⚠️ Suspicious site — possible phishing or spoofing attempt";
    } else if (maliciousPercent >= 20) {
      message = "🟡 Slightly suspicious — proceed with caution";
    } else {
      message = "✅ Site looks safe";
    }

    return NextResponse.json({
      url,
      label,
      score:          safePercent,       // 0-100  (higher = safer)
      maliciousScore: maliciousPercent,  // 0-100  (higher = more dangerous)
      danger:         isDangerous,
      threshold:      DANGER_THRESHOLD,
      message,
    });

  } catch (err) {
    console.error("Safety check error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}