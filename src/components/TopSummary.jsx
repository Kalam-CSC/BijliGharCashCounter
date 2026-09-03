const TopSummary = ({ totals }) => (
  <div className="summary-grid">
    <div className="summary-card"><span>Total Cash</span><strong>₹{totals.cash}</strong></div>
    <div className="summary-card"><span>Total Commission</span><strong>₹{totals.commission}</strong></div>
    <div className="summary-card"><span>Total Receipt</span><strong>{totals.receipt}</strong></div>
    <div className="summary-card"><span>Total Received</span><strong>₹{totals.received}</strong></div>
    <div className="summary-card"><span>Total Difference</span><strong>₹{totals.difference}</strong></div>
  </div>
);

export default TopSummary;