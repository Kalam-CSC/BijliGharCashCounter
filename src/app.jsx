import React, { useEffect, useState } from "react";
import DailyEntry from "./components/DailyEntry";
import Header from "./components/Header";
import Reports from "./components/Reports";
import SavedEntries from "./components/SavedEntries";
import TopSummary from "./components/TopSummary";
import { insertEntry, loadEntries, removeEntry, updateEntry } from "./services/entriesService";
import { calculateDifference, calculateTotals, filterReportEntries } from "./utils/calculations";
import { getToday } from "./utils/date";

function App() {
  const [date, setDate] = useState(getToday);
  const [cash, setCash] = useState("");
  const [commission, setCommission] = useState("");
  const [receipt, setReceipt] = useState("");
  const [receivedPayment, setReceivedPayment] = useState("");
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem("bijliGharEntries");
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  const [editingId, setEditingId] = useState(null);
  const [reportType, setReportType] = useState("today");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    loadEntries().then(setEntries).catch((error) => console.error("Supabase Load Error:", error));
  }, []);

  const difference = calculateDifference(cash, receivedPayment);
  const reportEntries = filterReportEntries(entries, reportType, fromDate, toDate);
  const totals = calculateTotals(entries);
  const reportTotals = calculateTotals(reportEntries);

  const clearForm = () => {
    setDate(""); setCash(""); setCommission(""); setReceipt(""); setReceivedPayment(""); setEditingId(null);
  };

  const saveEntry = async () => {
    if (!date || !cash || !commission || !receipt || !receivedPayment) {
      alert("Please fill all fields");
      return;
    }
    const entryData = {
      id: editingId !== null ? editingId : Date.now(), entry_date: date, cash: Number(cash),
      commission: Number(commission), receipt: Number(receipt), received_payment: Number(receivedPayment),
      difference: Number(difference),
    };
    try {
      if (editingId !== null) {
        const updatedEntry = await updateEntry(editingId, entryData);
        setEntries((previousEntries) => previousEntries.map((entry) => entry.id === editingId ? updatedEntry : entry));
        alert("Entry updated successfully");
      } else {
        const newEntry = await insertEntry(entryData);
        setEntries((previousEntries) => [...previousEntries, newEntry]);
        alert("Entry saved successfully");
      }
      clearForm();
    } catch (error) {
      console.error("Supabase Error:", error);
      alert("Entry save nahi hui. Console me error check karein.");
    }
  };

  const editEntry = (entry) => {
    setDate(entry.date); setCash(entry.cash); setCommission(entry.commission); setReceipt(entry.receipt);
    setReceivedPayment(entry.receivedPayment); setEditingId(entry.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await removeEntry(id);
      setEntries((previousEntries) => previousEntries.filter((entry) => entry.id !== id));
      if (editingId === id) clearForm();
      alert("Entry deleted successfully");
    } catch (error) {
      console.error("Supabase Delete Error:", error);
      alert("Entry delete nahi hui.");
    }
  };

  return <div className="container">
    <TopSummary totals={totals} />
    <Header />
    <DailyEntry editingId={editingId} date={date} cash={cash} commission={commission} receipt={receipt}
      receivedPayment={receivedPayment} difference={difference} setDate={setDate} setCash={setCash}
      setCommission={setCommission} setReceipt={setReceipt} setReceivedPayment={setReceivedPayment}
      saveEntry={saveEntry} clearForm={clearForm} />
    <Reports reportType={reportType} setReportType={setReportType} fromDate={fromDate} setFromDate={setFromDate}
      toDate={toDate} setToDate={setToDate} totals={reportTotals} entryCount={reportEntries.length} />
    <SavedEntries entries={entries} onEdit={editEntry} onDelete={deleteEntry} />
  </div>;
}

export default App;