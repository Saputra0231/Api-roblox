// pages/getkey.js
import { useEffect, useState } from "react";

export default function GetKeyPage({ query }) {
  // Next.js server-side query wont be available if using static export; this is simple client-side
  // We'll read query param from window.location
  const [hwid, setHwid] = useState("");
  const [key, setKey] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hw = params.get("hwid");
    if (!hw) {
      setErr("Missing hwid in URL. Example: ?hwid=HWID123");
      return;
    }
    setHwid(hw);
    // fetch the API
    fetch(`/api/request-key?hwid=${encodeURIComponent(hw)}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.key) setKey(data.key);
        else setErr("Failed to get key");
      })
      .catch(e => setErr("Error: " + e.message));
  }, []);

  return (
    <div style={{fontFamily:"Arial",padding:24,background:"#0f1720",color:"#fff",minHeight:"100vh"}}>
      <h1>Get Your Key</h1>
      { err && <p style={{color:"#f88"}}>{err}</p> }
      { key ? (
        <div>
          <p><b>HWID:</b> {hwid}</p>
          <p><b>Key (copy this):</b></p>
          <pre style={{background:"#111",padding:12,borderRadius:8,fontSize:18}}>{key}</pre>
          <p style={{opacity:0.8}}>Key valid for today only (UTC).</p>
        </div>
      ) : (!err && <p>Loading key…</p>) }
    </div>
  );
                         }
