import React, { useState } from 'react';

const CONTRACTORS = [
  { name: 'Meridian Infra Pvt. Ltd.', trustScore: 94, projectsCompleted: 38, onTimeRate: 96, specialization: 'Precast & Structural', yearsActive: 12, rating: 4.8 },
  { name: 'Vantage Structures Co.', trustScore: 91, projectsCompleted: 29, onTimeRate: 90, specialization: 'Bridges & Highways', yearsActive: 9, rating: 4.6 },
  { name: 'Suraksha Fire Systems', trustScore: 89, projectsCompleted: 51, onTimeRate: 93, specialization: 'Fire Safety Systems', yearsActive: 15, rating: 4.7 },
  { name: 'Ganga Pipeline Works', trustScore: 87, projectsCompleted: 22, onTimeRate: 88, specialization: 'Water & Sewage Piping', yearsActive: 7, rating: 4.5 },
  { name: 'Coretech Coatings', trustScore: 82, projectsCompleted: 34, onTimeRate: 85, specialization: 'Flooring & Coatings', yearsActive: 6, rating: 4.3 },
  { name: 'Suryaputra Engineering', trustScore: 71, projectsCompleted: 18, onTimeRate: 72, specialization: 'Renewable Energy Structures', yearsActive: 5, rating: 3.9 },
];

function trustColor(score) {
  if (score >= 90) return { bar: 'bg-[#a3a3a3]', text: 'text-[#a3a3a3]' };
  if (score >= 80) return { bar: 'bg-[#ffffff]', text: 'text-[#c4b5fd]' };
  return { bar: 'bg-red-500', text: 'text-red-400' };
}

export default function TopContractors() {
  const [sortBy, setSortBy] = useState('trustScore');

  const sorted = [...CONTRACTORS].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <>
      <header className="h-16 glass-panel border-t-0 border-l-0 border-r-0 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#ddd6fe] text-xs font-medium tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffffff]"></span>
            Contractor Rankings
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-serif-title text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-white to-[#a3a3a3] mb-2">
            Top Contractors
          </h1>
          <p className="text-white/70 text-sm mb-6">
            Ranked by trust score — based on project history, on-time delivery, and compliance record.
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-[10px] text-white/40 uppercase tracking-wide mr-1 self-center">Sort by:</span>
            {[
              { key: 'trustScore', label: 'Trust Score' },
              { key: 'projectsCompleted', label: 'Projects Completed' },
              { key: 'onTimeRate', label: 'On-Time Rate' },
              { key: 'rating', label: 'Rating' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                  sortBy === opt.key
                    ? 'bg-[#ffffff]/20 border border-[#ffffff]/50 text-[#c4b5fd]'
                    : 'glass-panel text-white/70 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {sorted.map((c, idx) => {
              const colors = trustColor(c.trustScore);
              return (
                <div key={c.name} className="glass-panel rounded-xl p-5 hover:border-[#ffffff]/40 transition-colors">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-serif-title font-bold text-sm ${
                        idx === 0 ? 'bg-[#ffffff]/20 text-[#c4b5fd] border border-[#ffffff]/50' :
                        idx === 1 ? 'bg-white/10 text-white/80 border border-white/30' :
                        idx === 2 ? 'bg-[#c0692a]/20 text-[#e0a06a] border border-[#c0692a]/40' :
                        'glass-panel text-white/50'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#eef2ff]">{c.name}</h3>
                        <p className="text-xs text-white/50 mt-0.5">{c.specialization} · {c.yearsActive} yrs active</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-white/60">
                          <span>{c.projectsCompleted} projects</span>
                          <span>·</span>
                          <span>{c.onTimeRate}% on-time</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-[#ffffff]" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                            </svg>
                            {c.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-2xl font-bold font-serif-title ${colors.text}`}>{c.trustScore}</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wide">Trust Score</div>
                    </div>
                  </div>

                  <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors.bar} rounded-full transition-all`}
                      style={{ width: `${c.trustScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}