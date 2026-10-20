import { NextRequest, NextResponse } from "next/server";
import { getAdminPasscode, setAdminPasscode } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { currentPasscode, newPasscode } = await req.json();

    const expected = getAdminPasscode();
    const authHeader = req.headers.get("x-admin-key");

    // Check that either the header or currentPasscode matches
    const isAuthorized = (authHeader && authHeader.trim() === expected) || (currentPasscode && currentPasscode.trim() === expected);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Current passcode is incorrect." }, { status: 401 });
    }

    if (!newPasscode || typeof newPasscode !== "string" || newPasscode.trim().length < 4) {
      return NextResponse.json({ error: "New passcode must be at least 4 characters long." }, { status: 400 });
    }

    setAdminPasscode(newPasscode.trim());

    return NextResponse.json({
      success: true,
      message: "Passcode updated successfully.",
    });
  } catch (e: any) {
    console.error("Change passcode error:", e);
    return NextResponse.json({ error: "Failed to update passcode." }, { status: 500 });
  }
}
