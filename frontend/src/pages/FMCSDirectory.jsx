import React, { useState } from 'react';

export default function FMCSDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');

  const fmcsData = [
    { id: 'FM/L-7200012', manufacturer: 'Global Steel Works GmbH', country: 'Germany', standard: 'IS 2062', product: 'Structural Steel', status: 'Active' },
    { id: 'FM/L-7200458', manufacturer: 'Nippon Pipe Corp', country: 'Japan', standard: 'IS 1239', product: 'Steel Tubes for Water', status: 'Active' },
    { id: 'FM/L-7200981', manufacturer: 'Electro-Tech Industries', country: 'South Korea', standard: 'IS 694', product: 'PVC Insulated Cables', status: 'Under Renewal' },
    { id: 'FM/L-7201102', manufacturer: 'Apex Polymer Solutions', country: 'USA', standard: 'IS 4985', product: 'Unplasticized PVC Pipes', status: 'Active' },
    { id: 'FM/L-7201564', manufacturer: 'Sino-Valve Manufacturing', country: 'China', standard: 'IS 778', product: 'Copper Alloy Gate Valves', status: 'Active' },
  ];

  const filteredData = fmcsData.filter(item => {
    const matchesSearch = item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.standard.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'All' || item.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="space-y-6 text-[#ffffff] p-2">
      {/* Header */}
      <div className="bg-[#2b2b2b] backdrop-blur-md border border-[#4d4d4d] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#ffffff]">Foreign Manufacturer Certification Scheme (FMCS) Directory</h2>
          <p className="text-xs text-[#a3a3a3] mt-1">Audit and verify active BIS licenses issued to international manufacturers supplying to India.</p>
        </div>
        <div className="bg-[#4d4d4d] text-[#ffffff] border border-[#737373] px-3 py-1.5 rounded-lg text-xs font-medium">
          Total Active Licenses: {fmcsData.length}
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-[#2b2b2b] backdrop-blur-md border border-[#4d4d4d] p-4 rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
        <input
          type="text"
          placeholder="Search by License ID, Manufacturer, or IS Standard..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-96 bg-[#1a1a1a] border border-[#4d4d4d] rounded-lg px-4 py-2 text-xs text-[#ffffff] placeholder-[#737373] focus:outline-none focus:border-[#ffffff]"
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#a3a3a3] whitespace-nowrap">Country:</span>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-[#1a1a1a] border border-[#4d4d4d] rounded-lg px-3 py-2 text-xs text-[#ffffff] focus:outline-none focus:border-[#ffffff] w-full sm:w-auto"
          >
            <option value="All">All Countries</option>
            <option value="Germany">Germany</option>
            <option value="Japan">Japan</option>
            <option value="South Korea">South Korea</option>
            <option value="USA">USA</option>
            <option value="China">China</option>
          </select>
        </div>
      </div>

      {/* Data Grid Table */}
      <div className="bg-[#2b2b2b] backdrop-blur-md border border-[#4d4d4d] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#4d4d4d] bg-[#333333] text-xs text-[#e5e5e5] uppercase tracking-wider">
                <th className="p-4 font-semibold">License ID</th>
                <th className="p-4 font-semibold">Manufacturer</th>
                <th className="p-4 font-semibold">Country</th>
                <th className="p-4 font-semibold">IS Standard</th>
                <th className="p-4 font-semibold">Product Category</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4d4d4d] text-xs">
              {filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#333333] transition-colors">
                    <td className="p-4 font-mono text-[#f0f0f0]">{row.id}</td>
                    <td className="p-4 font-medium text-[#ffffff]">{row.manufacturer}</td>
                    <td className="p-4 text-[#a3a3a3]">{row.country}</td>
                    <td className="p-4 font-mono text-[#e5e5e5]">{row.standard}</td>
                    <td className="p-4 text-[#a3a3a3]">{row.product}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                        row.status === 'Active' 
                          ? 'bg-[#4d4d4d] text-[#ffffff] border-[#737373]' 
                          : 'bg-[#2b2b2b] text-[#a3a3a3] border-[#4d4d4d]'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#737373]">No matching FMCS records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}