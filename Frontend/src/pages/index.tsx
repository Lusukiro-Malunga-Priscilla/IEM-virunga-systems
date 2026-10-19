// moved from src/routes/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/context/AuthContext';

const slides = [
  { src: '/assets/med1.jpg', headline: "L'espace IEM Virunga à portée de main", sub: "Gérez les présences, les congés et le suivi scolaire avec une interface moderne." },
  { src: '/assets/med2.jpg', headline: "Une gestion simple et efficace", sub: "Suivez les données clés de votre établissement sans effort." },
  { src: '/assets/med3.webp', headline: "Chaque classe, un suivi clair", sub: "Restez informé sur les étudiants, les absences et les activités." },
  { src: '/assets/med4.webp', headline: "Une plateforme pensée pour l'éducation", sub: "Centralisez les informations importantes dans un seul tableau de bord." },
];

function Index() {
  const { user, isAuthenticated } = useAuth();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % slides.length);
        setAnimating(false);
      }, 500);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0..1
      const y = (e.clientY - rect.top) / rect.height; // 0..1
      setPointer({ x: x - 0.5, y: y - 0.5 });
    }
    function onLeave() {
      setPointer({ x: 0, y: 0 });
    }
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const goTo = (idx: number) => {
    if (idx === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 400);
  };

  return (
    <div className="index-root">
      <section className="hero">
        <div ref={heroRef} className="hero__scene">
          {slides.map((slide, i) => {
            const depth = 0.06 * (slides.length - i);
            const tx = Math.round(pointer.x * 40 * depth);
            const ty = Math.round(pointer.y * 30 * depth);
            return (
              <div
                key={i}
                className={`hero__slide ${i === current ? "hero__slide--active" : ""}`}
                style={{
                  backgroundImage: `url(${slide.src})`,
                  transform: `translate3d(${tx}px, ${ty}px, 0) scale(${i === current ? 1.02 : 1})`,
                }}
              />
            );
          })}
        </div>
        <div className="hero__overlay" />

        <div className={`hero__content ${animating ? "hero__content--out" : "hero__content--in"}`}>
          <div className="hero__logo">
            <span className="hero__logo-icon">IEM</span>
            <span className="hero__logo-text">Virunga</span>
          </div>
          <span className="hero__tag">Institut d'Enseignement Moderne</span>
          <h1 className="hero__headline">{slides[current]?.headline ?? ""}</h1>
          <p className="hero__sub">{slides[current]?.sub ?? ""}</p>

          <div className="hero__actions">
            <Link
              to={isAuthenticated ? (`/${user?.role || ''}` as any) : `/login`}
              className="hero__cta"
            >
              Accéder au tableau de bord →
            </Link>
            <a href="#features" className="hero__cta hero__cta--secondary">Découvrir</a>
          </div>
        </div>

        <div className="hero__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero__dot ${i === current ? "hero__dot--active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <div className="hero__progress">
          <div className="hero__progress-bar" key={current} />
        </div>
      </section>

      <section className="features">
        <div className="features-container">
          <h2 className="features__title">✨ Fonctionnalités clés</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card__icon">📚</div>
              <h3 className="feature-card__title">Gestion académique</h3>
              <p className="feature-card__desc">Suivez les cours, les notes et les présences des étudiants</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">👨‍🏫</div>
              <h3 className="feature-card__title">Gestion du personnel</h3>
              <p className="feature-card__desc">Gérez les enseignants, les employés et leurs affectations</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">📊</div>
              <h3 className="feature-card__title">Tableaux de bord</h3>
              <p className="feature-card__desc">Visualisez les statistiques et les rapports en temps réel</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="index-footer">
        <p>© 2026 IEM Virunga - Institut d'Enseignement Moderne. Tous droits réservés.</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .index-root { min-height: 100vh; font-family: 'Poppins', sans-serif; position: relative; background: linear-gradient(180deg,#07112a 0%, #0b2340 100%); color: #fff; }

        /* HERO */
        .hero { position: relative; height: 86vh; min-height: 520px; overflow: hidden; display: flex; align-items: center; }
        .hero__scene { position: absolute; inset: 0; z-index: 0; }
        .hero__slide { position: absolute; inset: 0; background-size: cover; background-position: center; background-repeat: no-repeat; opacity: 0; transition: opacity 900ms ease, transform 600ms ease; will-change: transform, opacity; filter: saturate(0.98) contrast(1.02); }
        .hero__slide--active { opacity: 1; }
        .hero__overlay { position: absolute; inset: 0; z-index: 1; background: linear-gradient(90deg, rgba(3,8,18,0.85) 0%, rgba(3,8,18,0.55) 50%, rgba(3,8,18,0.2) 100%); backdrop-filter: blur(2px); }

        .hero__content { position: relative; z-index: 3; padding: 0 6vw; max-width: 760px; transition: opacity 360ms ease, transform 360ms ease; }
        .hero__content--out { opacity: 0; transform: translateY(12px); }
        .hero__content--in { opacity: 1; transform: translateY(0); }

        .hero__logo { display:flex; align-items:center; gap:12px; margin-bottom: 14px; }
        .hero__logo-icon { background: linear-gradient(135deg,#1e3a8a,#2563eb); color:#fff; font-family: 'Nunito', sans-serif; font-weight:900; padding:6px 12px; border-radius:10px; }
        .hero__logo-text { color:#fff; font-weight:700; font-size:20px; }
        .hero__tag { display:inline-block; background: rgba(25,118,210,0.85); color:#fff; font-size:11px; font-weight:700; padding:6px 12px; border-radius:20px; margin-bottom:16px; }

        .hero__headline { font-family: 'Nunito', sans-serif; font-size: clamp(36px,5vw,56px); font-weight:900; color:#fff; line-height:1.06; margin-bottom:14px; text-shadow: 0 6px 24px rgba(2,6,23,0.6); }
        .hero__sub { font-size:16px; color: rgba(255,255,255,0.9); margin-bottom:28px; max-width:680px; }

        .hero__actions { display:flex; gap:12px; flex-wrap:wrap; }
        .hero__cta { display:inline-flex; align-items:center; gap:10px; background:#1565c0; color:#fff; border-radius:12px; padding:12px 22px; font-weight:700; text-decoration:none; transition: transform 220ms ease, box-shadow 220ms ease; }
        .hero__cta:hover { transform: translateY(-3px); box-shadow: 0 18px 46px rgba(21,101,192,0.28); }
        .hero__cta--secondary { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.06); }

        .hero__dots { position: absolute; right: 4vw; bottom: 36px; z-index: 4; display:flex; gap:8px; }
        .hero__dot { width:10px; height:10px; border-radius:50%; border:2px solid rgba(255,255,255,0.45); background:transparent; cursor:pointer; }
        .hero__dot--active { background:#fff; transform: scale(1.2); border-color:#fff; }

        .hero__progress { position:absolute; left:0; right:0; bottom:0; height:3px; background: rgba(255,255,255,0.06); z-index:4; }
        .hero__progress-bar { height:100%; background: linear-gradient(90deg,#60a5fa,#2563eb); animation: progress 4s linear forwards; }

        @keyframes progress { from{width:0%} to{width:100%} }

        /* FEATURES */
        .features { padding: 64px 6vw; position: relative; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); }
        .features-container { max-width:1200px; margin:0 auto; }
        .features__title { font-family:'Nunito',sans-serif; font-size:28px; font-weight:800; color:#e6eefc; text-align:center; margin-bottom:28px; }
        .features-grid { display:grid; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); gap:20px; }
        .feature-card { background: rgba(255,255,255,0.03); border-radius:16px; padding:28px; text-align:center; color:#e6eefc; backdrop-filter: blur(6px); border:1px solid rgba(255,255,255,0.02); }

        .index-footer { padding:28px 6vw; text-align:center; color:rgba(255,255,255,0.7); background: linear-gradient(180deg, rgba(2,6,23,0.02), rgba(2,6,23,0.06)); }

        /* responsive */
        @media (max-width: 768px) {
          .hero__content { padding: 0 4vw; }
          .hero__headline { font-size: 28px; }
          .hero { height: auto; padding: 48px 0; min-height: 420px; }
        }

      `}</style>
    </div>
  );
}
export default Index;
