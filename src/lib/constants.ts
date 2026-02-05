export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const LAST_50_YEARS: string[] = Array.from({ length: 50 }, (_, i) =>
  (new Date().getFullYear() - i).toString()
);
