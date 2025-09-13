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
    .slice(0, 12).toUpperCase();
}

export default async function handler(req, res){
  if (req.method !== "POST") {
    res.setHeader("Allow","POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { hwid } = req.body || {};
  if (!hwid) return res.status(400).json({ error: "missing hwid" });

  const dateStr = utcDateStr(new Date());
  const keyToday = genDailyKey(hwid, dateStr, SERVER_SECRET);

  // also generate yesterday for small tolerance
  const yesterday = new Date(Date.now() - 86400000);
  const keyYesterday = genDailyKey(hwid, utcDateStr(yesterday), SERVER_SECRET);

  const expiresAt = new Date(Date.UTC(
    parseInt(dateStr.slice(0,4)),
    parseInt(dateStr.slice(5,7)) - 1,
    parseInt(dateStr.slice(8,10)),
    23, 59, 59
  )).toISOString();

  return res.status(200).json({
    key: keyToday,
    date: dateStr,
    expiresAt,
    alt: keyYesterday
  });
}
