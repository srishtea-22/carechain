import { NextResponse } from "next/server";
import { verifyMessage } from "ethers";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, signature, message, name, email, role } = body;

    if (!address || !signature || !message || !name || !email || !role) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const recoveredAddress = verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOneAndUpdate(
      { address: address.toLowerCase() },
      { name, email, role },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ message: "Auth success", user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
