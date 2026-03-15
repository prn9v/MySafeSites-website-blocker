/**
 * @swagger
 * /api/groups/members:
 *   get:
 *     summary: Get members of user's group
 */

import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { verifyAuth } from "@/lib/auth"

import User from "@/models/User"
import Group from "@/models/Group"

export async function GET(req) {

  const { payload, error } = verifyAuth(req)
  if (error) return error

  await connectDB()

  const user = await User.findById(payload.userId)

  if (!user.group) {
    return NextResponse.json({ members: [] })
  }

  const group = await Group.findById(user.group).populate("members")

  const members = group.members.map((m) => ({
    id: m._id,
    name: m.name,
    email: m.email,
    role: m.role
  }))

  return NextResponse.json({ members })
}