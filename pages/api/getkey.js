// pages/getkey.js
import { useEffect, useState } from "react";

export default function GetKeyPage() {
  const [hwid, setHwid] = useState("");
  const [key, setKey] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hw = params.get("hwid");
    if (!hw) {
      setError("Missing hwid in URL. Example: ?hwid=HWID123");
      return;
    }
    setHwid(hw);

    // Directly fetch key from your API (no ad/redirect)
    fetch(`/api/request-key?hwid=${encodeURIComponent(hw)}`)
      .then(r => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(data => {
        if (data && data.key) setKey(data.key);
        else setError("Failed to fetch key (no key in response)");
      })
      .catch(e => setError("Error: " + e.message));
  }, []);

  return (
    <div style={{fontFamily:"Arial",padding:24,background:"#0f1720",color:"#fff",minHeight:"100vh"}}>
      <h1>Get Your Key</h1>
      { error && <p style={{color:"#f88"}}>{error}</p> }
      { key ? (
        <div>
          <p><b>HWID:</b> {hwid}</p>
          <p><b>Key (copy this):</b></p>
          <pre style={{background:"#111",padding:12,borderRadius:8,fontSize:18, userSelect: "all"}}>{key}</pre>
          <p style={{opacity:0.8}}>Key valid until 23:59 UTC today.</p>
        </div>
      ) : (!error && <p>Fetching your key…</p>) }
    </div>
  );
  }
