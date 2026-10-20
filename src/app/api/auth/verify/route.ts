import { NextRequest, NextResponse } from "next/server";
import { getAdminPasscode } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();
    const expected = getAdminPasscode();
    if (passcode && passcode.trim() === expected) {
      return NextResponse.json({ valid: true });
    }
    return NextResponse.json({ valid: false, error: "Incorrect passcode" }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
