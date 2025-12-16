// parsePayrollData.js
// Parses Payroll Detail CSV with therapist visit sections
// Also extracts therapist-level comments and pay period dates

import Papa from 'papaparse';
import ExcelJS from 'exceljs';

/**
 * Extract pay period dates from cell A1
 * Format:
 * "Rebound Rehab Contractors (MM/DD/YYYY - MM/DD/YYYY)"
 */
function extractPayPeriod(rows) {
  const cellA1 = rows?.[0]?.[0];
  if (!cellA1 || typeof cellA1 !== 'string') {
    return { startDate: null, endDate: null };
  }

  const match = cellA1.match(
    /\((\d{1,2}\/\d{1,2}\/\d{4})\s*-\s*(\d{1,2}\/\d{1,2}\/\d{4})\)/
  );

  if (!match) {
    return { startDate: null, endDate: null };
  }

  return {
    startDate: match[1],
    endDate: match[2]
  };
}

function canonicalTherapistKey(name) {
  if (!name) return '';

  let s = String(name).trim();

  // Remove wrapping brackets like: [something]
  s = s.replace(/^\s*\[/, '').replace(/\]\s*$/, '').trim();

  // If format is "Last, First ..." convert to "First ... Last"
  if (s.includes(',')) {
    const [last, first] = s.split(',').map(part => part.trim());
    if (first && last) s = `${first} ${last}`.trim();
  }

  // Collapse whitespace and lowercase
  s = s.replace(/\s+/g, ' ').trim().toLowerCase();

  return s;
}

/**
 * Extract therapist comments from the top summary section
 */
function extractTherapistComments(rows) {
  const comments = {};

  // Rows are 0-based:
  // Row 2 (index 1) = headers
  // Data starts at row 3 (index 2)
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];

    const therapistRaw = row?.[0];
    const commentRaw = row?.[11]; // your column L (0-based index 11) if that's how you're reading it

    // Stop once therapist column is blank
    if (!therapistRaw) break;

    const key = canonicalTherapistKey(therapistRaw);
    if (!key) continue;

    const cleanedComment = (commentRaw || '')
      .toString()
      .replace(/^\s*\[/, '')
      .replace(/\]\s*$/, '')
      .trim();

    comments[key] = cleanedComment;
  }

  return comments;
}

export async function parsePayrollCSV(csvText) {
  const rows = Papa.parse(csvText, { skipEmptyLines: false }).data;

  const payPeriod = extractPayPeriod(rows);
  const therapistComments = extractTherapistComments(rows);

  const therapists = {};
  let i = 0;

  const isBlankRow = (row) =>
    !row || row.every(cell => !cell || String(cell).trim() === '');

  while (i < rows.length) {
    const row = rows[i];

    if (row?.[0] && typeof row[0] === 'string') {
      const visitsMatch = row[0].match(/^Visits for (.+)$/i);
      const nonVisitsMatch = row[0].match(/^Non-visits for (.+)$/i);

      // Stop parsing entirely on Non-visits
      if (nonVisitsMatch) {
        break;
      }

      if (visitsMatch) {
        const therapistName = visitsMatch[1].trim();
        const key = canonicalTherapistKey(therapistName);

        therapists[therapistName] = {
          comments: therapistComments[key] || '',
          visits: []
        };

        // Header row is next row
        const headers = rows[i + 1].map(h => h?.trim());
        i += 2;

        let blankCount = 0;

        while (i < rows.length) {
          const dataRow = rows[i];

          if (isBlankRow(dataRow)) {
            blankCount++;
            if (blankCount >= 2) break;
            i++;
            continue;
          }

          blankCount = 0;

          if (dataRow.length === headers.length) {
            const record = {};
            headers.forEach((h, idx) => {
              record[h] = dataRow[idx];
            });

            therapists[therapistName].visits.push(record);
          }

          i++;
        }
      }
    }

    i++;
  }

  return {
    payPeriod,
    therapists
  };
}

/**
 * Optional helper if this file is provided as Excel (.xlsx)
 */
export async function parsePayrollExcel(buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.worksheets[0];

  const rows = [];
  worksheet.eachRow({ includeEmpty: true }, row => {
    rows.push(row.values.slice(1)); // remove ExcelJS leading empty cell
  });

  const csvText = Papa.unparse(rows);
  return parsePayrollCSV(csvText);
}
