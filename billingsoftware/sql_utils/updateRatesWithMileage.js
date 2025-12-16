import ExcelJS from 'exceljs';
import fs from 'fs';

const FILE = 'mileage_rates.xlsx';
const OUTPUT = 'update_therapist_mileage.sql';

function sqlEscape(value) {
  return value.replace(/'/g, "''");
}

(async () => {
  const workbook = new ExcelJS.Workbook();
  
  // 🔑 THIS IS THE FIX
  const buffer = fs.readFileSync(FILE);
  await workbook.xlsx.load(buffer);
  const sheet = workbook.worksheets[0];

  const lines = [];
  lines.push('-- AUTO-GENERATED: Update therapist mileage rates');
  lines.push('BEGIN;');

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber < 2) return;

    const first = row.getCell(2).text?.trim(); // Column B
    const last = row.getCell(3).text?.trim();  // Column C
    const mileageRaw = row.getCell(13).value;  // Column M

    if (!first || !last || mileageRaw == null || mileageRaw === '') {
      return;
    }

    const mileage = Number(mileageRaw);
    if (isNaN(mileage)) return;

    lines.push(`
UPDATE therapists
SET mileage_rate = ${mileage}
WHERE first_name = '${sqlEscape(first)}'
  AND last_name = '${sqlEscape(last)}';
`.trim());
  });

  lines.push('COMMIT;');

  fs.writeFileSync(OUTPUT, lines.join('\n\n'));
  console.log(`✅ SQL file written to ${OUTPUT}`);
})();
