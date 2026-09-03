import TopSummary from "./TopSummary";

const Reports = ({ reportType, setReportType, fromDate, setFromDate, toDate, setToDate, totals, entryCount }) => (
  <div className="entry-card">
    <h2>Reports</h2>
    <div className="report-controls">
      <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
        <option value="today">Today</option><option value="month">This Month</option><option value="range">Date Range</option>
      </select>
      {reportType === "range" && <>
        <div className="field"><label>From Date</label><input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></div>
        <div className="field"><label>To Date</label><input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} /></div>
      </>}
    </div>
    <TopSummary totals={totals} />
    <p style={{ color: "#64748b", fontSize: "14px" }}>Entries found: <strong>{entryCount}</strong></p>
  </div>
);

export default Reports;