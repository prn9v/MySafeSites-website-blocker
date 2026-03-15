/**
 * @swagger
 * tags:
 *   name: BlockList
 *   description: Manage blocked sites for a user or group
 *
 * /api/blocklist:
 *   get:
 *     summary: Get all blocked sites for the logged-in user
 *     tags: [BlockList]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of blocked sites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sites:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlockSite'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Add a new blocked site
 *     tags: [BlockList]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - domain
 *             properties:
 *               domain:
 *                 type: string
 *                 example: youtube.com
 *               groupId:
 *                 type: string
 *                 description: Optional — block for a group instead of personal list
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       201:
 *         description: Site blocked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 site:
 *                   $ref: '#/components/schemas/BlockSite'
 *       400:
 *         description: Invalid domain
 *       401:
 *         description: Not authenticated
 *       409:
 *         description: Domain already blocked
 *       500:
 *         description: Internal server error
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: token
 *   schemas:
 *     BlockSite:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         domain:
 *           type: string
 *           example: youtube.com
 *         user:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d2
 *         group:
 *           type: string
 *           nullable: true
 *         addedBy:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d2
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
 
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { verifyAuth } from "@/lib/auth";

import BlockSite from "@/models/BlockSite";
import User from "@/models/User";
import Group from "@/models/Group"

export async function GET(req) {

  const { payload, error } = verifyAuth(req);
  if (error) return error;

  try {

    await connectDB();

    const user = await User.findById(payload.userId).populate("group");

    let adminId = user._id

    if (user.group && user.group.admin) {
      adminId = user.group.admin
    }

    const sites = await BlockSite.find({
      user: adminId
    }).sort({ createdAt: -1 });

    return NextResponse.json({ sites });

  } catch (err) {

    console.error("GET /api/blocklist error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
 
// ── POST /api/blocklist ──────────────────────────
// Adds a new blocked site for the user (or group if groupId provided)
export async function POST(req) {
  const { payload, error } = verifyAuth(req);
  if (error) return error;
 
  try {
    const { domain, groupId } = await req.json();
 
    // ── Validate ───────────────────────────────────
    if (!domain || typeof domain !== "string") {
      return NextResponse.json(
        { error: "domain is required" },
        { status: 400 }
      );
    }
 
    // Clean: strip protocol, www., and any paths
    const cleanDomain = domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/.*$/, "");
 
    if (!cleanDomain.includes(".")) {
      return NextResponse.json(
        { error: "Invalid domain — must include a TLD (e.g. youtube.com)" },
        { status: 400 }
      );
    }
 
    await connectDB();
 
    // ── Duplicate check ────────────────────────────
    const existing = await BlockSite.findOne({
      domain: cleanDomain,
      user: payload.userId,
      group: groupId ?? null,
    });
 
    if (existing) {
      return NextResponse.json(
        { error: `${cleanDomain} is already blocked` },
        { status: 409 }
      );
    }
 
    // ── Create ─────────────────────────────────────
    const site = await BlockSite.create({
      domain: cleanDomain,
      user: payload.userId,
      group: groupId ?? null,
      addedBy: payload.userId,
    });
 
    return NextResponse.json({ site }, { status: 201 });
  } catch (err) {
    console.error("POST /api/blocklist error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}