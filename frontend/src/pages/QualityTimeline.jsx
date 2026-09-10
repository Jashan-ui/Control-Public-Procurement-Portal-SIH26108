import React, { useState } from 'react';

const QC_ORDERS = [
  {
    id: 'QC-ORD-2026-118',
    material: 'Structural Steel — IS 2062 Grade E350',
    tenderRef: 'BIS-LT-2026-041',
    currentStage: 3,
    stages: [
      { name: 'Order Placed', date: '2026-08-20', note: 'Purchase order issued to vendor, quantity confirmed at 480 MT.', standard: null },
      { name: 'Material Procurement', date: '2026-08-25', note: 'Material received at site, mill test certificates cross-checked.', standard: null },
      { name: 'Sample Collection', date: '2026-08-28', note: 'Random samples drawn from 6 batches per IS 2062 sampling protocol.', standard: 'IS 2062' },
      { name: 'Lab Testing', date: '2026-09-03', note: 'Tensile strength and yield point testing in progress at accredited lab.', standard: 'IS 1608' },
      { name: 'Quality Report', date: null, note: 'Awaiting lab results before report generation.', standard: null },
      { name: 'Approval', date: null, note: 'Pending quality report submission.', standard: null },
      { name: 'Dispatch to Site', date: null, note: 'Not yet started.', standard: null },
    ],
  },
  {
    id: 'QC-ORD-2026-119',
    material: 'Ready Mix Concrete — M30 Grade',
    tenderRef: 'BIS-FT-2026-015',
    currentStage: 6,
    stages: [
      { name: 'Order Placed', date: '2026-07-10', note: 'Batching plant contract confirmed for flyover extension.', standard: null },
      { name: 'Material Procurement', date: '2026-07-14', note: 'Cement, aggregate, and admixture sourcing verified.', standard: null },
      { name: 'Sample Collection', date: '2026-07-20', note: 'Cube samples cast on-site per IS 1199 procedure.', standard: 'IS 1199' },
      { name: 'Lab Testing', date: '2026-08-01', note: '28-day compressive strength testing completed — passed at 34.2 MPa.', standard: 'IS 516' },
      { name: 'Quality Report', date: '2026-08-04', note: 'Report generated, strength exceeds M30 requirement.', standard: null },
      { name: 'Approval', date: '2026-08-06', note: 'Approved by site engineer and BIS quality officer.', standard: null },
      { name: 'Dispatch to Site', date: '2026-08-09', note: 'Cleared for continuous pour, delivered in 4 batches.', standard: null },
    ],
  },
  {
    id: 'QC-ORD-2026-120',
    material: 'Fire-Rated Door Sets — IS 3614',
    tenderRef: 'BIS-FT-2026-016',
    currentStage: 1,
    stages: [
      { name: 'Order Placed', date: '2026-09-05', note: 'Order confirmed with vendor for 42 door sets.', standard: null },
      { name: 'Material Procurement', date: null, note: 'Procurement in progress, expected completion in 5 days.', standard: null },
      { name: 'Sample Collection', date: null, note: 'Not yet started.', standard: null },
      { name: 'Lab Testing', date: null, note: 'Not yet started.', standard: null },
      { name: 'Quality Report', date: null, note: 'Not yet started.', standard: null },
      { name: 'Approval', date: null, note: 'Not yet started.', standard: null },
      { name: 'Dispatch to Site', date: null, note: 'Not yet started.', standard: null },
    ],
  },
];

export default function QualityTimeline() {
  const [selectedOrderId, setSelectedOrderId] = useState(QC_ORDERS[0].id);
  const [activeStageIdx, setActiveStageIdx] = useState(QC_ORDERS[0].currentStage);

  const order = QC_ORDERS.find(o => o.id === selectedOrderId);
  const activeStage = order.stages[activeStageIdx];

  const selectOrder = (id) => {
    setSelectedOrderId(id);
    const newOrder = QC_ORDERS.find(o => o.id === id);
    setActiveStageIdx(newOrder.currentStage);
  };

  const stageState = (idx) => {
    if (idx < order.currentStage) return 'done';
    if (idx === order.currentStage) return 'current';
    return 'pending';
  };

  return (
    <>
      <header className="h-16 glass-panel border-t-0 border-l-0 border-r-0 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#ddd6fe] text-xs font-medium tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#737373] animate-pulse"></span>
            Quality Control
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-serif-title text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-white to-[#a3a3a3] mb-2">
            Quality Control Order Timeline
          </h1>
          <p className="text-white/70 text-sm mb-6">
            Track material testing progress against IS standards for each QC order. Click a stage to see details.
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {QC_ORDERS.map((o) => (
              <button
                key={o.id}
                onClick={() => selectOrder(o.id)}
                className={`text-left px-4 py-2.5 rounded-xl text-xs transition-all ${
                  selectedOrderId === o.id
                    ? 'bg-[#ffffff]/20 border border-[#ffffff]/50 text-[#c4b5fd]'
                    : 'glass-panel text-white/70 hover:text-white'
                }`}
              >
                <div className="font-mono">{o.id}</div>
                <div className="text-white/50 text-[10px] mt-0.5">{o.material}</div>
              </button>
            ))}
          </div>

          <div className="glass-panel rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
              <h2 className="text-sm font-medium text-[#eef2ff]">{order.material}</h2>
              <span className="text-[10px] font-mono text-white/50">Tender Ref: {order.tenderRef}</span>
            </div>

            <div className="mt-6 overflow-x-auto pb-2">
              <div className="flex items-center min-w-max">
                {order.stages.map((stage, idx) => {
                  const state = stageState(idx);
                  return (
                    <React.Fragment key={stage.name}>
                      <button
                        onClick={() => setActiveStageIdx(idx)}
                        className="flex flex-col items-center gap-2 group"
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                          state === 'done'
                            ? 'bg-[#a3a3a3] border-[#a3a3a3] text-white'
                            : state === 'current'
                            ? 'bg-[#ffffff]/20 border-[#ffffff] text-[#c4b5fd] animate-pulse'
                            : 'bg-white/5 border-white/20 text-white/40'
                        } ${activeStageIdx === idx ? 'ring-2 ring-offset-2 ring-offset-transparent ring-[#737373]' : ''}`}>
                          {state === 'done' ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                            </svg>
                          ) : (
                            <span className="text-xs font-semibold">{idx + 1}</span>
                          )}
                        </div>
                        <span className={`text-[10px] text-center w-20 leading-tight ${
                          activeStageIdx === idx ? 'text-[#737373]' : 'text-white/60'
                        } group-hover:text-white transition-colors`}>
                          {stage.name}
                        </span>
                      </button>
                      {idx < order.stages.length - 1 && (
                        <div className={`h-0.5 w-10 shrink-0 mb-6 ${
                          idx < order.currentStage ? 'bg-[#a3a3a3]' : 'bg-white/15'
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h3 className="text-sm font-semibold text-[#eef2ff]">{activeStage.name}</h3>
              <div className="flex items-center gap-2">
                {activeStage.standard && (
                  <span className="text-[10px] font-mono text-[#737373] bg-[#737373]/10 border border-[#737373]/30 px-2 py-0.5 rounded-full">
                    {activeStage.standard}
                  </span>
                )}
                <span className="text-xs text-white/50">
                  {activeStage.date || 'Pending'}
                </span>
              </div>
            </div>
            <p className="text-sm text-white/75 leading-relaxed">{activeStage.note}</p>
          </div>
        </div>
      </div>
    </>
  );
}