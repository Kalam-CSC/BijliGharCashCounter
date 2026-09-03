const DailyEntry = ({ editingId, date, cash, commission, receipt, receivedPayment, difference, setDate, setCash, setCommission, setReceipt, setReceivedPayment, saveEntry, clearForm }) => (
  <div className="entry-card">
    <h2>{editingId !== null ? "Edit Entry" : "Daily Entry"}</h2>
    <div className="form-grid">
      <div className="field"><label>Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div className="field"><label>Cash</label><input type="number" placeholder="Enter cash" value={cash} onChange={(e) => setCash(e.target.value)} /></div>
      <div className="field"><label>Commission</label><input type="number" placeholder="Enter commission" value={commission} onChange={(e) => setCommission(e.target.value)} /></div>
      <div className="field"><label>Receipt</label><input type="number" placeholder="Enter receipt" value={receipt} onChange={(e) => setReceipt(e.target.value)} /></div>
      <div className="field"><label>Received Payment</label><input type="number" placeholder="Enter received" value={receivedPayment} onChange={(e) => setReceivedPayment(e.target.value)} /></div>
    </div>
    <div className="field" style={{ marginTop: "15px", maxWidth: "220px" }}>
      <label>Difference</label><input className="difference" type="number" value={difference} readOnly />
    </div>
    <button className="save-btn" onClick={saveEntry}>{editingId !== null ? "Update Entry" : "Save Entry"}</button>
    {editingId !== null && <button className="save-btn" onClick={clearForm} style={{ marginLeft: "10px" }}>Cancel</button>}
  </div>
);

export default DailyEntry;