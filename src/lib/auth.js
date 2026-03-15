import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
 
const JWT_SECRET = process.env.JWT_SECRET;

export function verifyAuth(req) {
  const token = req.cookies.get("token")?.value;
 
  if (!token) {
    return {
      payload: null,
      error: NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      ),
    };
  }
 
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return { payload, error: null };
  } catch {
    return {
      payload: null,
      error: NextResponse.json(
        { error: "Invalid or expired session. Please log in again." },
        { status: 401 }
      ),
    };
  }
}