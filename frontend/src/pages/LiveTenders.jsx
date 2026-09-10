import React, { useState } from 'react';

const LIVE_TENDERS = [
  { id: 'BIS-LT-2026-041', title: 'Bituminous Road Surfacing — IS 73 Compliance', department: 'National Highways Authority', deadline: '2026-09-15', daysLeft: 5, value: '₹7.4 Cr', category: 'Roadworks', bids: 12 },
  { id: 'BIS-LT-2026-042', title: 'RCC Pipe Culverts — IS 458 Grade', department: 'Rural Development Department', deadline: '2026-09-18', daysLeft: 8, value: '₹2.9 Cr', category: 'Concrete', bids: 7 },
  { id: 'BIS-LT-2026-043', title: 'Structural Glazing System — IS 2553', department: 'Central PWD', deadline: '2026-09-20', daysLeft: 10, value: '₹5.6 Cr', category: 'Structural', bids: 15 },
  { id: 'BIS-LT-2026-044', title: 'HDPE Piping for Water Supply — IS 4984', department: 'Jal Shakti Ministry', deadline: '2026-09-12', daysLeft: 2, value: '₹3.1 Cr', category: 'Piping', bids: 21 },
  { id: 'BIS-LT-2026-045', title: 'Transformer Substation Equipment — IS 2026', department: 'State Electricity Board', deadline: '2026-09-25', daysLeft: 15, value: '₹8.9 Cr', category: 'Electrical', bids: 4 },
  { id: 'BIS-LT-2026-046', title: 'Anti-Corrosion Coating for Bridge Girders', department: 'National Highways Authority', deadline: '2026-09-14', daysLeft: 4, value: '₹1.8 Cr', category: 'Coatings', bids: 9 },
];

const CATEGORIES = ['All', 'Roadworks', 'Concrete', 'Structural', 'Piping', 'Electrical', 'Coatings'];

function urgencyColor(days) {
  if (days <= 3) return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
  if (days <= 7) return { text: 'text-[#c4b5fd]', bg: 'bg-[#ffffff]/10', border: 'border-[#ffffff]/30' };
  return { text: 'text-[#737373]', bg: 'bg-[#737373]/10', border: 'border-[#737373]/30' };
}

export default function LiveTenders() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('deadline');

  let filtered = LIVE_TENDERS.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'deadline') return a.daysLeft - b.daysLeft;
    if (sortBy === 'bids') return b.bids - a.bids;
    return 0;
  });

  return (
    <>
      <header className="h-16 glass-panel border-t-0 border-l-0 border-r-0 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#ddd6fe] text-xs font-medium tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3] animate-pulse"></span>
            {LIVE_TENDERS.length} Tenders Open Now
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-serif-title text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-white to-[#a3a3a3] mb-2">
            Live Tenders
          </h1>
          <p className="text-white/70 text-sm mb-6">
            Currently open for bidding — sorted by closing deadline by default.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tender ID or title..."
              className="flex-1 glass-panel rounded-xl px-4 py-2.5 text-sm text-[#eef2ff] placeholder-white/40 focus:outline-none focus:border-[#ffffff]/60"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-panel rounded-xl px-4 py-2.5 text-sm text-[#eef2ff] focus:outline-none focus:border-[#ffffff]/60 [color-scheme:dark]"
            >
              <option value="deadline">Sort: Closing Soonest</option>
              <option value="bids">Sort: Most Bids</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                  activeCategory === cat
                    ? 'bg-[#ffffff]/20 border border-[#ffffff]/50 text-[#c4b5fd]'
                    : 'glass-panel text-white/70 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="glass-panel rounded-xl p-6 text-center text-white/50 text-sm">
                No live tenders match your search.
              </div>
            )}
            {filtered.map((tender) => {
              const urgency = urgencyColor(tender.daysLeft);
              return (
                <div key={tender.id} className="glass-panel rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#a3a3a3]/40 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-mono text-[#a3a3a3] bg-[#a3a3a3]/10 border border-[#a3a3a3]/30 px-2 py-0.5 rounded-full">
                        {tender.id}
                      </span>
                      <span className="text-[10px] text-white/50 uppercase tracking-wide">{tender.category}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${urgency.bg} ${urgency.border} ${urgency.text}`}>
                        {tender.daysLeft} {tender.daysLeft === 1 ? 'day' : 'days'} left
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-[#eef2ff] mb-1">{tender.title}</h3>
                    <p className="text-xs text-white/50">{tender.department} · {tender.bids} bids submitted</p>
                  </div>
                  <div className="flex sm:flex-col items-start sm:items-end gap-1 sm:gap-0 shrink-0">
                    <span className="text-xs text-white/50">Closes</span>
                    <span className="text-sm font-medium text-[#eef2ff]">{tender.deadline}</span>
                    <span className="text-xs text-white/60">{tender.value}</span>
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