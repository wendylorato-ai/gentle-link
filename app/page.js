"use client";

import { useEffect, useMemo, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const fallbackProfile = { display_name: "Gentle link", bio: "A little space for everything I share.", profile_image_url: "", background_type: "starfield", background_url: "" };

export default function Home() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [links, setLinks] = useState([]);
  const [tab, setTab] = useState("links");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!supabaseUrl || !publishableKey) { setLoading(false); return; }
      const headers = { apikey: publishableKey, Authorization: `Bearer ${publishableKey}` };
      try {
        const [settingsRes, linksRes] = await Promise.all([
          fetch(`${supabaseUrl}/rest/v1/site_settings?select=*&id=eq.1`, { headers, cache: "no-store" }),
          fetch(`${supabaseUrl}/rest/v1/links?select=*&is_active=eq.true&order=sort_order.asc`, { headers, cache: "no-store" })
        ]);
        if (!settingsRes.ok || !linksRes.ok) throw new Error("Content unavailable");
        const settings = await settingsRes.json();
        const rows = await linksRes.json();
        if (alive) {
          if (settings[0]) setProfile({ ...fallbackProfile, ...settings[0] });
          setLinks(Array.isArray(rows) ? rows : []);
        }
      } catch { /* Keep the graceful starter profile visible if the database is unavailable. */ }
      finally { if (alive) setLoading(false); }
    }
    load();
    return () => { alive = false; };
  }, []);

  const visibleLinks = useMemo(() => links.filter((item) => item.section === tab), [links, tab]);

  async function trackClick(id) {
    try { await fetch("/api/click", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ link_id: id }) }); } catch {}
  }

  return (
    <main className={profile.background_type === "image" || profile.background_type === "video" ? "page-shell custom-background" : "page-shell"}>
      {profile.background_type === "image" && profile.background_url && <div className="custom-bg-image" style={{ backgroundImage: `url("${profile.background_url}")` }} />}
      {profile.background_type === "video" && profile.background_url && <video className="custom-bg-video" src={profile.background_url} autoPlay muted loop playsInline />}
      <div className="starfield" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <div className="nebula nebula-a" /><div className="nebula nebula-b" />
      <section className="profile-card" aria-label="Gentle link profile">
        <div className="avatar-wrap">
          {profile.profile_image_url ? <img className="avatar" src={profile.profile_image_url} alt={profile.display_name || "Profile"} /> : <div className="avatar avatar-placeholder">g.</div>}
          <span className="online-dot" />
        </div>
        <h1>{profile.display_name || "Gentle link"}</h1>
        {profile.bio && <p className="bio">{profile.bio}</p>}
        <nav className="tabs" aria-label="Profile sections">
          <button className={tab === "links" ? "tab active" : "tab"} onClick={() => setTab("links")}>Links</button>
          <button className={tab === "shop" ? "tab active" : "tab"} onClick={() => setTab("shop")}>Shop</button>
        </nav>
        <div className="link-list">
          {visibleLinks.map((item) => (
            <a className="link-card" href={item.destination_url} target="_blank" rel="noopener noreferrer" key={item.id} onClick={() => trackClick(item.id)}>
              {item.thumbnail_url ? <img className="link-thumb" src={item.thumbnail_url} alt="" /> : <span className="link-thumb thumb-fallback">{tab === "shop" ? "✦" : "↗"}</span>}
              <span className="link-title">{item.title}</span><span className="link-arrow">↗</span>
            </a>
          ))}
          {!visibleLinks.length && <div className="empty-state">{loading ? "Finding the good things…" : tab === "shop" ? "Shop updates are coming soon." : "Links will appear here soon."}</div>}
        </div>
        <footer className="footer">Made with <span>♥</span> · Gentle link</footer>
      </section>
      <a className="admin-shortcut" href="/admin" aria-label="Open admin dashboard">•••</a>
    </main>
  );
}
