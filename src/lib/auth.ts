import fs from "fs";
import path from "path";

const CONFIG_FILE = path.join(process.cwd(), "src", "data", "admin.json");

export function getAdminPasscode(): string {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
      if (data && data.passcode) {
        return String(data.passcode).trim();
      }
    }
  } catch (e) {
    console.error("Error reading admin.json:", e);
  }

  return (process.env.ADMIN_PASSCODE || process.env.ADMIN_KEY || "shhh14").trim();
}

export function setAdminPasscode(newPasscode: string): void {
  const dir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(
    CONFIG_FILE,
    JSON.stringify(
      {
        passcode: newPasscode.trim(),
        updatedAt: new Date().toISOString(),
      },
      null,
      2
    ),
    "utf-8"
  );
}
