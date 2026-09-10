import React, { useState } from 'react';

const PAST_TENDERS = [
  { id: 'BIS-PT-2026-002', title: 'Precast Boundary Wall Panels — IS 15916', department: 'Rural Development Department', awardedTo: 'Meridian Infra Pvt. Ltd.', awardedOn: '2026-08-02', value: '₹2.4 Cr', category: 'Precast', status: 'Completed' },
  { id: 'BIS-PT-2026-003', title: 'Bridge Bearing Assemblies — IS 9877', department: 'National Highways Authority', awardedTo: 'Vantage Structures Co.', awardedOn: '2026-07-21', value: '₹6.1 Cr', category: 'Structural', status: 'In Progress' },
  { id: 'BIS-PT-2026-004', title: 'Fire Hydrant Systems — IS 908', department: 'Central PWD', awardedTo: 'Suraksha Fire Systems', awardedOn: '2026-07-10', value: '₹1.3 Cr', category: 'Fire Safety', status: 'Completed' },
  { id: 'BIS-PT-2026-005', title: 'Epoxy Flooring for Warehouse Complex', department: 'State Logistics Board', awardedTo: 'Coretech Coatings', awardedOn: '2026-06-28', value: '₹0.9 Cr', category: 'Coatings', status: 'Completed' },
  { id: 'BIS-PT-2026-006', title: 'Solar Panel Mounting Structures — IS 800', department: 'Ministry of New & Renewable Energy', awardedTo: 'Suryaputra Engineering', awardedOn: '2026-06-15', value: '₹4.7 Cr', category: 'Structural', status: 'Disputed' },
  { id: 'BIS-PT-2026-007', title: 'Sewage Treatment Plant Piping — IS 4984', department: 'Jal Shakti Ministry', awardedTo: 'Ganga Pipeline Works', awardedOn: '2026-05-30', value: '₹5.5 Cr', category: 'Piping', status: 'Completed' },
];

const CATEGORIES = ['All', 'Precast', 'Structural', 'Fire Safety', 'Coatings', 'Piping'];
const STATUSES = ['All', 'Completed', 'In Progress', 'Disputed'];

function statusStyle(status) {
  if (status === 'Completed') return 'text-[#a3a3a3] bg-[#a3a3a3]/10 border-[#a3a3a3]/30';
  if (status === 'In Progress') return 'text-[#737373] bg-[#737373]/10 border-[#737373]/30';
  return 'text-red-400 bg-red-500/10 border-red-500/30';
}

export default function PastTenders() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = PAST_TENDERS.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesStatus = activeStatus === 'All' || t.status === activeStatus;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()) || t.awardedTo.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <>
      <header className="h-16 glass-panel border-t-0 border-l-0 border-r-0 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#ddd6fe] text-xs font-medium tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
            Tender Archive
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-serif-title text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-white to-[#a3a3a3] mb-2">
            Past Tenders
          </h1>
          <p className="text-white/70 text-sm mb-6">
            Awarded and closed tenders — reference past outcomes and contractor performance.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tender ID, title, or contractor..."
              className="flex-1 glass-panel rounded-xl px-4 py-2.5 text-sm text-[#eef2ff] placeholder-white/40 focus:outline-none focus:border-[#ffffff]/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[10px] text-white/40 uppercase tracking-wide mr-1">Category:</span>
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

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[10px] text-white/40 uppercase tracking-wide mr-1">Status:</span>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                  activeStatus === s
                    ? 'bg-[#737373]/20 border border-[#737373]/50 text-[#737373]'
                    : 'glass-panel text-white/70 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="glass-panel rounded-xl p-6 text-center text-white/50 text-sm">
                No past tenders match your search.
              </div>
            )}
            {filtered.map((tender) => (
              <div key={tender.id} className="glass-panel rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-mono text-white/60 bg-white/5 border border-white/15 px-2 py-0.5 rounded-full">
                      {tender.id}
                    </span>
                    <span className="text-[10px] text-white/50 uppercase tracking-wide">{tender.category}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusStyle(tender.status)}`}>
                      {tender.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-[#eef2ff] mb-1">{tender.title}</h3>
                  <p className="text-xs text-white/50">{tender.department} · Awarded to <span className="text-white/70">{tender.awardedTo}</span></p>
                </div>
                <div className="flex sm:flex-col items-start sm:items-end gap-1 sm:gap-0 shrink-0">
                  <span className="text-xs text-white/50">Awarded</span>
                  <span className="text-sm font-medium text-[#eef2ff]">{tender.awardedOn}</span>
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