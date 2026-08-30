import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";
function App() {
 const [date, setDate] = useState(() => {
  const today = new Date();
  return today.toISOString().split("T")[0];
});
  const [cash, setCash] = useState("");
  const [commission, setCommission] = useState("");
  const [receipt, setReceipt] = useState("");
  const [receivedPayment, setReceivedPayment] = useState("");

  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem("bijliGharEntries");
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  const [editingId, setEditingId] = useState(null);
  // LOAD ENTRIES FROM SUPABASE
useEffect(() => {
  const loadEntries = async () => {
    const { data, error } = await supabase
      .from("cash_entries")
      .select("*")
      .order("entry_date", { ascending: true });

    if (error) {
      console.error("Supabase Load Error:", error);
      return;
    }

    const formattedEntries = data.map((entry) => ({
      id: entry.id,
      date: entry.entry_date,
      cash: entry.cash,
      commission: entry.commission,
      receipt: entry.receipt,
      receivedPayment: entry.received_payment,
      difference: entry.difference,
    }));

    setEntries(formattedEntries);
  };

  loadEntries();
}, []);
  const [reportType, setReportType] = useState("today");
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");

  const difference =
    cash !== "" && receivedPayment !== ""
      ? Number(receivedPayment) - Number(cash)
      : "";
      // ================================
// REPORT CALCULATION
// ================================

const getReportEntries = () => {
  const today = new Date().toISOString().split("T")[0];

  if (reportType === "today") {
    return entries.filter((entry) => entry.date === today);
  }

  if (reportType === "month") {
    const currentMonth = today.substring(0, 7);

    return entries.filter((entry) =>
      entry.date.startsWith(currentMonth)
    );
  }

  if (reportType === "range") {
    if (!fromDate || !toDate) {
      return [];
    }

    return entries.filter(
      (entry) =>
        entry.date >= fromDate &&
        entry.date <= toDate
    );
  }

  return entries;
};

const reportEntries = getReportEntries();

const reportCash = reportEntries.reduce(
  (total, entry) => total + Number(entry.cash),
  0
);

const reportCommission = reportEntries.reduce(
  (total, entry) => total + Number(entry.commission),
  0
);

const reportReceipt = reportEntries.reduce(
  (total, entry) => total + Number(entry.receipt),
  0
);

const reportReceived = reportEntries.reduce(
  (total, entry) => total + Number(entry.receivedPayment),
  0
);

const reportDifference = reportEntries.reduce(
  (total, entry) => total + Number(entry.difference),
  0
);

  // SAVE / UPDATE
  const saveEntry = async () => {
  if (!date || !cash || !commission || !receipt || !receivedPayment) {
    alert("Please fill all fields");
    return;
  }

  const entryData = {
    id: editingId !== null ? editingId : Date.now(),
    entry_date: date,
    cash: Number(cash),
    commission: Number(commission),
    receipt: Number(receipt),
    received_payment: Number(receivedPayment),
    difference: Number(difference),
  };

  try {
   if (editingId !== null) {
  const { data, error } = await supabase
    .from("cash_entries")
    .update(entryData)
    .eq("id", editingId)
    .select()
    .single();

  if (error) throw error;

  const updatedEntry = {
    id: data.id,
    date: data.entry_date,
    cash: data.cash,
    commission: data.commission,
    receipt: data.receipt,
    receivedPayment: data.received_payment,
    difference: data.difference,
  };

  setEntries((prevEntries) =>
    prevEntries.map((entry) =>
      entry.id === editingId ? updatedEntry : entry
    )
  );

  alert("Entry updated successfully");
} else {
      const { data, error } = await supabase
        .from("cash_entries")
        .insert([entryData])
        .select();

      if (error) throw error;

      const newEntry = {
        id: data[0].id,
        date: data[0].entry_date,
        cash: data[0].cash,
        commission: data[0].commission,
        receipt: data[0].receipt,
        receivedPayment: data[0].received_payment,
        difference: data[0].difference,
      };

      setEntries((prevEntries) => [
        ...prevEntries,
        newEntry,
      ]);

      alert("Entry saved successfully");
    }

    clearForm();

  } catch (error) {
    console.error("Supabase Error:", error);
    alert("Entry save nahi hui. Console me error check karein.");
  }
};

  // CLEAR FORM
  const clearForm = () => {
    setDate("");
    setCash("");
    setCommission("");
    setReceipt("");
    setReceivedPayment("");
    setEditingId(null);
  };

  // EDIT
  const editEntry = (entry) => {
    setDate(entry.date);
    setCash(entry.cash);
    setCommission(entry.commission);
    setReceipt(entry.receipt);
    setReceivedPayment(entry.receivedPayment);
    setEditingId(entry.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE
 const deleteEntry = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this entry?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const { error } = await supabase
      .from("cash_entries")
      .delete()
      .eq("id", id);

    if (error) throw error;

    const updatedEntries = entries.filter(
      (entry) => entry.id !== id
    );

    setEntries(updatedEntries);

    if (editingId === id) {
      clearForm();
    }

    alert("Entry deleted successfully");

  } catch (error) {
    console.error("Supabase Delete Error:", error);
    alert("Entry delete nahi hui.");
  }
};

  return (
    <div className="container">

      {/* HEADER */}
      {/* SUMMARY */}
<div className="summary-grid">

  <div className="summary-card">
    <span>Total Cash</span>
    <strong>
      ₹{entries.reduce((total, entry) => total + Number(entry.cash), 0)}
    </strong>
  </div>

  <div className="summary-card">
    <span>Total Commission</span>
    <strong>
      ₹{entries.reduce(
        (total, entry) => total + Number(entry.commission),
        0
      )}
    </strong>
  </div>

  <div className="summary-card">
    <span>Total Receipt</span>
    <strong>
      {entries.reduce(
        (total, entry) => total + Number(entry.receipt),
        0
      )}
    </strong>
  </div>

  <div className="summary-card">
    <span>Total Received</span>
    <strong>
      ₹{entries.reduce(
        (total, entry) => total + Number(entry.receivedPayment),
        0
      )}
    </strong>
  </div>

  <div className="summary-card">
    <span>Total Difference</span>
    <strong>
      ₹{entries.reduce(
        (total, entry) => total + Number(entry.difference),
        0
      )}
    </strong>
  </div>

</div>
      <div className="header">
        <h1>Bijli Ghar Cash Counter</h1>
        <p>Daily Entry System</p>
      </div>

      {/* ENTRY FORM */}
      <div className="entry-card">

        <h2>
          {editingId !== null ? "Edit Entry" : "Daily Entry"}
        </h2>

        <div className="form-grid">

          {/* DATE */}
          <div className="field">
            <label>Date</label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* CASH */}
          <div className="field">
            <label>Cash</label>

            <input
              type="number"
              placeholder="Enter cash"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
            />
          </div>

          {/* COMMISSION */}
          <div className="field">
            <label>Commission</label>

            <input
              type="number"
              placeholder="Enter commission"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
            />
          </div>

          {/* RECEIPT */}
          <div className="field">
            <label>Receipt</label>

            <input
              type="number"
              placeholder="Enter receipt"
              value={receipt}
              onChange={(e) => setReceipt(e.target.value)}
            />
          </div>

          {/* RECEIVED PAYMENT */}
          <div className="field">
            <label>Received Payment</label>

            <input
              type="number"
              placeholder="Enter received"
              value={receivedPayment}
              onChange={(e) =>
                setReceivedPayment(e.target.value)
              }
            />
          </div>

        </div>

        {/* DIFFERENCE */}
        <div
          className="field"
          style={{
            marginTop: "15px",
            maxWidth: "220px",
          }}
        >
          <label>Difference</label>

          <input
            className="difference"
            type="number"
            value={difference}
            readOnly
          />
        </div>

        {/* BUTTONS */}
        <button
          className="save-btn"
          onClick={saveEntry}
        >
          {editingId !== null ? "Update Entry" : "Save Entry"}
        </button>

        {editingId !== null && (
          <button
            className="save-btn"
            onClick={clearForm}
            style={{
              marginLeft: "10px",
            }}
          >
            Cancel
          </button>
        )}

      </div>
{/* REPORTS */}
<div className="entry-card">

  <h2>Reports</h2>

  <div className="report-controls">

    <select
      value={reportType}
      onChange={(e) => setReportType(e.target.value)}
    >
      <option value="today">Today</option>
      <option value="month">This Month</option>
      <option value="range">Date Range</option>
    </select>

    {reportType === "range" && (
      <>
        <div className="field">
          <label>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="field">
          <label>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </>
    )}

  </div>

  <div className="summary-grid">

    <div className="summary-card">
      <span>Total Cash</span>
      <strong>₹{reportCash}</strong>
    </div>

    <div className="summary-card">
      <span>Total Commission</span>
      <strong>₹{reportCommission}</strong>
    </div>

    <div className="summary-card">
      <span>Total Receipt</span>
      <strong>{reportReceipt}</strong>
    </div>

    <div className="summary-card">
      <span>Total Received</span>
      <strong>₹{reportReceived}</strong>
    </div>

    <div className="summary-card">
      <span>Total Difference</span>
      <strong>₹{reportDifference}</strong>
    </div>

  </div>

  <p style={{ color: "#64748b", fontSize: "14px" }}>
    Entries found: <strong>{reportEntries.length}</strong>
  </p>

</div>
      {/* SAVED ENTRIES */}
      {entries.length > 0 && (
        <div className="entry-card table-card">

          <h2>Saved Entries</h2>

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Cash</th>
                  <th>Commission</th>
                  <th>Receipt</th>
                  <th>Received Payment</th>
                  <th>Difference</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {entries.map((entry, index) => (
                  <tr key={entry.id}>

                    <td>{index + 1}</td>

                    <td>
  {new Date(entry.date).toLocaleDateString("en-GB").replace(/\//g, "-")}{" "}
  {new Date(entry.date).toLocaleDateString("en-US", {
    weekday: "short",
  }).toUpperCase()}
</td>

                    <td>{entry.cash}</td>

                    <td>{entry.commission}</td>

                    <td>{entry.receipt}</td>

                    <td>{entry.receivedPayment}</td>

                    <td>{entry.difference}</td>

                    <td>

                      <button
                        onClick={() => editEntry(entry)}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteEntry(entry.id)}
                        style={{
                          marginLeft: "6px",
                        }}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;