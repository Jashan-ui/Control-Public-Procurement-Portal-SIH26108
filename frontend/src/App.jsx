import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import Home from './pages/Home.jsx';
import LiveTenders from './pages/LiveTenders.jsx';
import FutureTenders from './pages/FutureTenders.jsx';
import PastTenders from './pages/PastTenders.jsx';
import QualityTimeline from './pages/QualityTimeline.jsx';
import TopContractors from './pages/TopContractors.jsx';
import FMCSDirectory from './pages/FMCSDirectory.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="live-tenders" element={<LiveTenders />} />
        <Route path="future-tenders" element={<FutureTenders />} />
        <Route path="past-tenders" element={<PastTenders />} />
        <Route path="quality-timeline" element={<QualityTimeline />} />
        <Route path="top-contractors" element={<TopContractors />} />
        <Route path="fmcs-directory" element={<FMCSDirectory />} />
      </Route>
    </Routes>
  );
}