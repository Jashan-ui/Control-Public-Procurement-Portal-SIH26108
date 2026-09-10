import React, { useRef, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const IS_CODES = ['IS 456', 'IS 875', 'IS 800', 'IS 1893', 'IS 2062', 'IS 383', 'IS 269', 'IS 1786', 'IS 3370', 'IS 13920', 'IS 4326', 'IS 9013', 'IS 12269', 'IS 10262', 'IS 516', 'IS 1199', 'IS 2386', 'IS 4031'];

function FloatingCodesCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    let w, h, items = [], animId;
    const COUNT = isMobile ? 10 : 20;
    const LINK = (isMobile ? 170 : 260) * dpr;

    function resize() {
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    }

    function spawn() {
      items = [];
      for (let i = 0; i < COUNT; i++) {
        items.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4 * dpr,
          vy: (Math.random() - 0.5) * 0.4 * dpr,
          code: IS_CODES[Math.floor(Math.random() * IS_CODES.length)],
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function roundRect(c, x, y, rw, rh, r) {
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + rw, y, x + rw, y + rh, r);
      c.arcTo(x + rw, y + rh, x, y + rh, r);
      c.arcTo(x, y + rh, x, y, r);
      c.arcTo(x, y, x + rw, y, r);
      c.closePath();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const dx = items[i].x - items[j].x, dy = items[i].y - items[j].y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            const a = (1 - d / LINK) * 0.35;
            ctx.strokeStyle = `rgba(200,215,255,${a})`;
            ctx.beginPath();
            ctx.moveTo(items[i].x, items[i].y);
            ctx.lineTo(items[j].x, items[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.font = `600 ${12 * dpr}px 'Inter', system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      items.forEach((t) => {
        t.x += t.vx; t.y += t.vy;
        if (t.x < 0 || t.x > w) t.vx *= -1;
        if (t.y < 0 || t.y > h) t.vy *= -1;
        t.pulse += 0.03;
        const glow = 0.5 + Math.sin(t.pulse) * 0.35;

        ctx.beginPath();
        ctx.arc(t.x, t.y, 3 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,153,51,${glow})`;
        ctx.shadowColor = 'rgba(255,153,51,.9)';
        ctx.shadowBlur = 18 * dpr;
        ctx.fill();
        ctx.shadowBlur = 0;

        const label = t.code;
        const padX = 9 * dpr;
        const labelW = ctx.measureText(label).width;
        const bx = t.x - labelW / 2 - padX, by = t.y + 10 * dpr;
        const bw = labelW + padX * 2, bh = 18 * dpr, r = 9 * dpr;

        ctx.fillStyle = 'rgba(10,15,40,.7)';
        ctx.strokeStyle = `rgba(200,215,255,${0.2 + glow * 0.25})`;
        roundRect(ctx, bx, by, bw, bh, r);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(240,246,255,.95)';
        ctx.fillText(label, t.x, by + bh / 2 + 1 * dpr);
      });

      animId = requestAnimationFrame(draw);
    }

    function handleResize() {
      resize();
      spawn();
    }

    resize();
    spawn();
    draw();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-1] pointer-events-none" />;
}

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/live-tenders', label: 'Live Tenders', icon: '●' },
  { to: '/future-tenders', label: 'Future Tenders', icon: '◔' },
  { to: '/past-tenders', label: 'Past Tenders', icon: '◐' },
  { to: '/quality-timeline', label: 'Quality Control Timeline', icon: '✓' },
  { to: '/top-contractors', label: 'Top Contractors', icon: '★' },
  { to: '/fmcs-directory', label: 'FMCS Directory', icon: '🏢' },
];

export default function Layout() {
  return (
    <>
      <div className="bg-beam" />
      <div className="bg-aurora">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <div className="blob b4" />
        <div className="blob b5" />
      </div>
      <div className="bg-grid" />
      <FloatingCodesCanvas />
      <div className="bg-vignette" />

      <div className="text-[#eef2ff] font-sans antialiased h-screen flex overflow-hidden w-full relative z-10">
        <aside className="w-64 glass-panel border-r border-t-0 border-b-0 border-l-0 hidden md:flex flex-col justify-between p-4">
          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center gap-3 px-1 py-3 mb-6">
              <div className="p-2 bg-gradient-to-tr from-[#ffffff] to-[#2b2b2b] rounded-xl shadow-lg shadow-orange-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div>
                <span className="font-serif-title font-bold text-sm tracking-wide text-white block">BIS ENGINE</span>
                <span className="text-[10px] text-[#ffffff] font-medium tracking-wider uppercase">Govt. of India</span>
              </div>
            </div>

            <div className="text-[10px] font-semibold text-white/50 px-2 uppercase tracking-wider mb-2">Navigate</div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-2.5 text-left text-xs px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#ffffff]/15 text-[#c4b5fd] border border-[#ffffff]/30'
                        : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent'
                    }`
                  }
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="px-1 py-3 border-t border-white/10 text-xs text-white/50 flex items-center justify-between shrink-0">
            <span>Secure BIS Link</span>
            <span className="w-2 h-2 rounded-full bg-[#a3a3a3] animate-pulse"></span>
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-full relative overflow-hidden">
          <Outlet />
        </main>
      </div>
    </>
  );
}