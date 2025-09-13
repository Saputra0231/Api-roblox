// pages/api/verify.js
import crypto from "crypto";

const SERVER_SECRET = process.env.SERVER_SECRET || "please-change-this-secret";

function utcDateStr(d = new Date()){
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth()+1).padStart(2,"0");
  const dd = String(d.getUTCDate()).padStart(2,"0");
  return `${yyyy}-${mm}-${dd}`;
}

function genDailyKey(hwid, dateStr, secret){
  return crypto.createHmac("sha256", secret)
    .update(hwid + "|" + dateStr)
    .digest("base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
    .slice(0, 16).toUpperCase();
}

export default function handler(req, res){
  if (req.method !== "GET") {
    res.setHeader("Allow","GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const hwid = (req.query.hwid || "").toString();
  const key = (req.query.key || "").toString();
  if (!hwid || !key) return res.status(400).json({ ok:false, reason: "MISSING_PARAMS" });

  const today = utcDateStr(new Date());
  const yesterday = utcDateStr(new Date(Date.now() - 86400000));

  const expectedToday = genDailyKey(hwid, today, SERVER_SECRET);
  if (key === expectedToday) return res.status(200).json({ ok: true, reason: "VALID", expired: false });

  const expectedYesterday = genDailyKey(hwid, yesterday, SERVER_SECRET);
  if (key === expectedYesterday) return res.status(200).json({ ok: false, reason: "EXPIRED_YESTERDAY_VALID", expired: true });

  return res.status(200).json({ ok: false, reason: "INVALID", expired: true });
      }
