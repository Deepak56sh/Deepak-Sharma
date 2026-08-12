// Generic array-of-objects -> CSV string converter. No external dependency needed.
// Handles nested objects/arrays by JSON.stringify-ing them into a single cell.

const escapeCell = (value) => {
  if (value === null || value === undefined) return '';
  let str = typeof value === 'object' ? JSON.stringify(value) : String(value);
  str = str.replace(/"/g, '""');
  if (/[",\n]/.test(str)) str = `"${str}"`;
  return str;
};

const toCSV = (rows, columns) => {
  if (!rows || rows.length === 0) return columns ? columns.join(',') + '\n' : '';
  const cols = columns || Object.keys(rows[0]);
  const header = cols.join(',');
  const lines = rows.map((row) => cols.map((c) => escapeCell(row[c])).join(','));
  return [header, ...lines].join('\n');
};

module.exports = { toCSV };