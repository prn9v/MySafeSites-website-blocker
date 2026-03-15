/**
 * @swagger
 * /api/groups/invite:
 *   post:
 *     summary: Invite a user to group
 *     tags: [Groups]
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { verifyAuth } from "@/lib/auth";

import User from "@/models/User";
import Group from "@/models/Group";

export async function POST(req) {
  const { payload, error } = verifyAuth(req);
  if (error) return error;

  await connectDB();

  const { email } = await req.json();

  const invited = await User.findOne({ email });

  if (!invited) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const currentUser = await User.findById(payload.userId);

  let group;

  if (!currentUser.group) {
    group = await Group.create({
      name: `${currentUser.name}'s Group`,
      admin: currentUser._id,
      members: [currentUser._id, invited._id],
    });

    currentUser.group = group._id;
    currentUser.role = "admin";
    await currentUser.save();
  } else {
    group = await Group.findById(currentUser.group);

    if (!group.members.includes(invited._id)) {
      group.members.push(invited._id);
      await group.save();
    }
  }

  invited.group = group._id;
  invited.role = "member";
  await invited.save();

  return NextResponse.json({
    member: {
      id: invited._id,
      name: invited.name,
      email: invited.email,
      role: "Member",
    },
  });
}
