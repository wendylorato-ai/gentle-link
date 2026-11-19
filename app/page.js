"use client";

const links = [
  { title: "Cloud CODM", href: "https://cloudcodm.vercel.app", mark: "C", tone: "mint" },
  { title: "Veryfast TopItUp", href: "https://veryfast-topitup.vercel.app", mark: "V", tone: "lavender" }
];

export default function Home() {
  return (
    <main className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className="link-page" aria-label="Gentle link">
        <div className="brand-mark" aria-hidden="true">g.</div>
        <h1>Gentle link</h1>
        <div className="link-list">
          {links.map((link) => (
            <a className="link-card" href={link.href} target="_blank" rel="noreferrer" key={link.title}>
              <span className={`link-icon ${link.tone}`}>{link.mark}</span>
              <span className="link-title">{link.title}</span>
              <span className="link-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
        <footer className="footer">Gentle link</footer>
      </section>
    </main>
  );
}
