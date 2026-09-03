import { supabase } from "../supabase";

export const formatEntry = (entry) => ({
  id: entry.id,
  date: entry.entry_date,
  cash: entry.cash,
  commission: entry.commission,
  receipt: entry.receipt,
  receivedPayment: entry.received_payment,
  difference: entry.difference,
});

export const loadEntries = async () => {
  const { data, error } = await supabase.from("cash_entries").select("*").order("entry_date", { ascending: true });
  if (error) throw error;
  return data.map(formatEntry);
};

export const insertEntry = async (entryData) => {
  const { data, error } = await supabase.from("cash_entries").insert([entryData]).select();
  if (error) throw error;
  return formatEntry(data[0]);
};

export const updateEntry = async (id, entryData) => {
  const { data, error } = await supabase.from("cash_entries").update(entryData).eq("id", id).select().single();
  if (error) throw error;
  return formatEntry(data);
};

export const removeEntry = async (id) => {
  const { error } = await supabase.from("cash_entries").delete().eq("id", id);
  if (error) throw error;
};