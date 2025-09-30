// index.js
const RAW_SCRIPT_URL = "https://raw.githubusercontent.com/sinret/rbxscript.com-scripts-reuploads-/main/ak47";
const TIKTOK_URL = "https://www.tiktok.com/@imyoo__19";

function looksLikeRoblox(req) {
  const ua = (req.headers["user-agent"] || "").toLowerCase();
  return ua.includes("robloxgamecloud") || typeof req.headers["roblox-id"] !== "undefined";
}

export default async function handler(req, res) {
  if (!looksLikeRoblox(req)) return res.redirect(302, TIKTOK_URL);

  try {
    const r = await fetch(RAW_SCRIPT_URL);
    if (!r.ok) return res.redirect(302, TIKTOK_URL);
    const body = await r.text();
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(body);
  } catch (err) {
    return res.redirect(302, TIKTOK_URL);
  }
}
