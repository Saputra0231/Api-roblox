// api/index.js
// Siap deploy ke Vercel. Endpoint akan:
// - Jika request berasal dari Roblox (deteksi lewat header) -> proxy file raw dan kembalikan plain lua
// - Jika bukan -> redirect 302 ke TIKTOK_URL

const RAW_SCRIPT_URL = process.env.RAW_SCRIPT_URL || "https://raw.githubusercontent.com/sinret/rbxscript.com-scripts-reuploads-/main/ak47";
const TIKTOK_URL = process.env.TIKTOK_URL || "https://www.tiktok.com/@youraccount";

// Helper: apakah request dari Roblox?
function looksLikeRoblox(req) {
  const ua = (req.headers["user-agent"] || "").toString().toLowerCase();
  const hasRobloxId = typeof req.headers["roblox-id"] !== "undefined";
  // cek substring karena user-agent umumnya: "RobloxGameCloud/1.0 (+http://www.roblox.com)"
  if (ua.includes("robloxgamecloud")) return true;
  if (hasRobloxId) return true;
  return false;
}

export default async function handler(req, res) {
  try {
    if (!looksLikeRoblox(req)) {
      // Bukan Roblox -> redirect ke TikTok
      return res.redirect(302, TIKTOK_URL);
    }

    // Jika Roblox, ambil konten raw dari RAW_SCRIPT_URL
    const resp = await fetch(RAW_SCRIPT_URL);
    if (!resp.ok) {
      // kalau gagal ambil raw, untuk safety redirect juga
      console.error("Failed to fetch raw:", resp.status, resp.statusText);
      return res.redirect(302, TIKTOK_URL);
    }

    const body = await resp.text();

    // Kembalikan sebagai plain text (Lua)
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(body);

  } catch (err) {
    console.error("Error in handler:", err);
    return res.redirect(302, TIKTOK_URL);
  }
}