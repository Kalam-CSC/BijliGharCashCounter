export const getToday = () => new Date().toISOString().split("T")[0];

export const formatEntryDate = (date) =>
  `${new Date(date).toLocaleDateString("en-GB").replace(/\//g, "-")} ${new Date(
    date
  ).toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}`;