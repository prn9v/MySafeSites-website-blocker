/**
 * @swagger
 * /api/blocklist/{siteId}:
 *   delete:
 *     summary: Remove a blocked site
 *     tags: [BlockList]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Blocked site ID
 *     responses:
 *       200:
 *         description: Site removed successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Site not found
 *       500:
 *         description: Internal server error
 */

import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { verifyAuth } from "@/lib/auth"
import BlockSite from "@/models/BlockSite"

export async function DELETE(req, context) {

  const { payload, error } = verifyAuth(req)
  if (error) return error

  // ✅ params must be awaited in Next.js 16
  const { siteId } = await context.params

  try {

    await connectDB()

    const deleted = await BlockSite.findOneAndDelete({
      _id: siteId,
      user: payload.userId
    })

    if (!deleted) {
      return NextResponse.json(
        { error: "Site not found or unauthorized" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true
    })

  } catch (err) {

    console.error("DELETE /api/blocklist error:", err)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )

  }
}