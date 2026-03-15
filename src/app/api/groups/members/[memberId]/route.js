/**
 * @swagger
 * /api/groups/members/{memberId}:
 *   delete:
 *     summary: Remove member from group
 */

import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { verifyAuth } from "@/lib/auth"

import Group from "@/models/Group"
import User from "@/models/User"

export async function DELETE(req, context) {

  const { payload, error } = verifyAuth(req)
  if (error) return error

  const { memberId } = await context.params

  await connectDB()

  const user = await User.findById(payload.userId)

  if (!user.group) {
    return NextResponse.json(
      { error: "No group found" },
      { status: 404 }
    )
  }

  const group = await Group.findById(user.group)

  if (group.admin.toString() !== payload.userId) {
    return NextResponse.json(
      { error: "Only admin can remove members" },
      { status: 403 }
    )
  }

  group.members = group.members.filter(
    (id) => id.toString() !== memberId
  )

  await group.save()

  await User.findByIdAndUpdate(memberId, {
    group: null,
    role: "member",
  })

  return NextResponse.json({ success: true })
}