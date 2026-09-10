import React, { useState } from 'react';

const FUTURE_TENDERS = [
  { id: 'BIS-FT-2026-014', title: 'Supply of Structural Steel — IS 2062 Grade', department: 'Public Works Department', opensOn: '2026-09-22', value: '₹4.2 Cr', category: 'Steel & Metals' },
  { id: 'BIS-FT-2026-015', title: 'Ready Mix Concrete for Flyover Extension', department: 'National Highways Authority', opensOn: '2026-09-28', value: '₹9.8 Cr', category: 'Concrete' },
  { id: 'BIS-FT-2026-016', title: 'Fire-Rated Door Sets — IS 3614 Compliance', department: 'Central PWD', opensOn: '2026-10-03', value: '₹1.1 Cr', category: 'Fire Safety' },
  { id: 'BIS-FT-2026-017', title: 'Seismic Retrofitting Materials — IS 1893', department: 'Urban Development Authority', opensOn: '2026-10-09', value: '₹6.5 Cr', category: 'Structural' },
  { id: 'BIS-FT-2026-018', title: 'Electrical Conduits & Cabling — IS 694', department: 'State Electricity Board', opensOn: '2026-10-14', value: '₹2.7 Cr', category: 'Electrical' },
  { id: 'BIS-FT-2026-019', title: 'Waterproofing Compounds for Reservoir', department: 'Jal Shakti Ministry', opensOn: '2026-10-20', value: '₹3.3 Cr', category: 'Waterproofing' },
];

const CATEGORIES = ['All', 'Steel & Metals', 'Concrete', 'Fire Safety', 'Structural', 'Electrical', 'Waterproofing'];

export default function FutureTenders() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = FUTURE_TENDERS.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <header className="h-16 glass-panel border-t-0 border-l-0 border-r-0 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#ddd6fe] text-xs font-medium tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#737373] animate-pulse"></span>
            Upcoming Procurement
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-serif-title text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-white to-[#a3a3a3] mb-2">
            Future Tenders
          </h1>
          <p className="text-white/70 text-sm mb-6">
            Tenders opening soon — plan ahead and prepare compliant documentation in advance.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tender ID or title..."
              className="flex-1 glass-panel rounded-xl px-4 py-2.5 text-sm text-[#eef2ff] placeholder-white/40 focus:outline-none focus:border-[#ffffff]/60"
            />
            <div className="flex flex-wrap gap-2">
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
          </div>

          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="glass-panel rounded-xl p-6 text-center text-white/50 text-sm">
                No upcoming tenders match your search.
              </div>
            )}
            {filtered.map((tender) => (
              <div key={tender.id} className="glass-panel rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#737373]/40 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-[#737373] bg-[#737373]/10 border border-[#737373]/30 px-2 py-0.5 rounded-full">
                      {tender.id}
                    </span>
                    <span className="text-[10px] text-white/50 uppercase tracking-wide">{tender.category}</span>
                  </div>
                  <h3 className="text-sm font-medium text-[#eef2ff] mb-1">{tender.title}</h3>
                  <p className="text-xs text-white/50">{tender.department}</p>
                </div>
                <div className="flex sm:flex-col items-start sm:items-end gap-1 sm:gap-0 shrink-0">
                  <span className="text-xs text-white/50">Opens</span>
                  <span className="text-sm font-medium text-[#c4b5fd]">{tender.opensOn}</span>
                  <span className="text-xs text-white/60">{tender.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}