export const calculateDifference = (cash, receivedPayment) =>
  cash !== "" && receivedPayment !== ""
    ? Number(receivedPayment) - Number(cash)
    : "";

export const calculateTotals = (entries) => ({
  cash: entries.reduce((total, entry) => total + Number(entry.cash), 0),
  commission: entries.reduce((total, entry) => total + Number(entry.commission), 0),
  receipt: entries.reduce((total, entry) => total + Number(entry.receipt), 0),
  received: entries.reduce((total, entry) => total + Number(entry.receivedPayment), 0),
  difference: entries.reduce((total, entry) => total + Number(entry.difference), 0),
});

export const filterReportEntries = (entries, reportType, fromDate, toDate) => {
  const today = new Date().toISOString().split("T")[0];
  if (reportType === "today") return entries.filter((entry) => entry.date === today);
  if (reportType === "month") {
    const currentMonth = today.substring(0, 7);
    return entries.filter((entry) => entry.date.startsWith(currentMonth));
  }
  if (reportType === "range") {
    if (!fromDate || !toDate) return [];
    return entries.filter((entry) => entry.date >= fromDate && entry.date <= toDate);
  }
  return entries;
};