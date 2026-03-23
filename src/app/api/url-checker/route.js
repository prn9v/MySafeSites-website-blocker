import { GoogleGenerativeAI } from "@google/generative-ai";
import https from "https";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ── Helper: Get text from Gemini response ──────────────────────────────────
function getResponseText(result) {
  if (typeof result.response.text === "function") {
    return result.response.text();
  }
  return result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ── Helper: Extract JSON from Gemini text ──────────────────────────────────
function extractJSON(text) {
  const clean = text.replace(/```json|```/g, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}") + 1;
  if (start === -1 || end === 0) throw new Error("No JSON found in AI response");
  return JSON.parse(clean.slice(start, end).trim());
}

// ── Helper: SSL Check ──────────────────────────────────────────────────────
function checkSSL(hostname) {
  return new Promise((resolve) => {
    const req = https.request(
      { hostname, port: 443, method: "HEAD", path: "/", timeout: 5000 },
      () => resolve(true)
    );
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

// ── API Route Handler ──────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "Missing url field." }), {
        status: 400,
      });
    }

    const fullURL = /^https?:\/\//i.test(url) ? url : "https://" + url;

    let hostname;
    try {
      hostname = new URL(fullURL).hostname;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid URL format." }), {
        status: 400,
      });
    }

    try {
      // Run SSL check first
      const sslValid = await checkSSL(hostname);

      const prompt = `
You are a cybersecurity expert. Analyze this URL for safety.
Return ONLY a valid JSON object — no markdown, no backticks, no extra text.

URL: ${fullURL}
SSL Valid: ${sslValid}

Return EXACTLY this JSON structure (nothing else):
{
  "url": "${url}",
  "score": <number 0-100, higher means safer>,
  "classification": "<Low Risk | Potential Phishing | High Risk | Dangerous>",
  "risks": [
    { "label": "<short risk description>", "severity": "<safe | warning | high>" },
    { "label": "<short risk description>", "severity": "<safe | warning | high>" },
    { "label": "<short risk description>", "severity": "<safe | warning | high>" },
    { "label": "<short risk description>", "severity": "<safe | warning | high>" }
  ]
}

Rules:
- Always return exactly 4 risk items.
- severity must be one of: "safe", "warning", "high"
- classification must be one of: "Low Risk", "Potential Phishing", "High Risk", "Dangerous"
- score 80-100 = Low Risk, 60-79 = Potential Phishing, 40-59 = High Risk, 0-39 = Dangerous
- Analyze: SSL status, suspicious keywords, domain reputation, TLD trustworthiness,
  URL structure, brand impersonation, domain age, malware history.
- The "url" field in the response must be exactly: "${url}"
`;

      const result = await model.generateContent(prompt);
      const text = getResponseText(result);

      if (!text) throw new Error("Empty response from Gemini");

      const parsed = extractJSON(text);

      // Ensure url field is always the original input
      parsed.url = url;

      // Ensure risks array exists
      if (!Array.isArray(parsed.risks)) parsed.risks = [];

      // Ensure SSL risk is always present
      const hasSSLRisk = parsed.risks.some((r) =>
        r.label.toLowerCase().includes("ssl")
      );

      if (!hasSSLRisk) {
        parsed.risks.push({
          label: sslValid
            ? "SSL Certificate Valid"
            : "SSL Certificate Invalid or Missing",
          severity: sslValid ? "safe" : "high",
        });
      }

      // Return exact required structure
      return new Response(
        JSON.stringify({
          url: parsed.url,
          score: parsed.score,
          classification: parsed.classification,
          risks: parsed.risks,
        }),
        { status: 200 }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Analysis failed",
          details: error.message,
        }),
        { status: 500 }
      );
    }

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Invalid request",
        details: error.message,
      }),
      { status: 400 }
    );
  }
}