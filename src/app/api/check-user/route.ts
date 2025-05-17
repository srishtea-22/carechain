import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/user";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  try {
    await dbConnect();
    const user = await User.findOne({ address: address.toLowerCase() });

    if (user) {
      return NextResponse.json({ registered: true, role: user.role });
    } else {
      return NextResponse.json({ registered: false });
    }
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
