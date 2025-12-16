import fs from 'fs';
import ExcelJS from 'exceljs';

const FILE = 'Rebound Program Therapists.xlsx';

const AREAS = [
  { name: 'Lubbock', startCol: 5 },
  { name: 'Amarillo', startCol: 11 },
  { name: 'New Mexico', startCol: 17 }
];

const VISIT_TYPES = [
  { code: 'EVAL', offset: 0 },
  { code: 'RE_EVAL', offset: 1 },
  { code: 'DISCHARGE', offset: 2 },
  { code: 'VISIT', offset: 3 },
  { code: 'OOT', offset: 4 },
  { code: 'EXTENDED', offset: 5 }
];

function sqlEscape(value) {
  return value.replace(/'/g, "''");
}

(async () => {
  const workbook = new ExcelJS.Workbook();

  // 🔑 THIS IS THE FIX
  const buffer = fs.readFileSync(FILE);
  await workbook.xlsx.load(buffer);

  const sheet = workbook.worksheets[0];

  console.log('-- AUTO-GENERATED THERAPIST RATE SEED FILE\n');

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber < 3) return;

    const first = row.getCell(1).text?.trim();
    const last = row.getCell(2).text?.trim();
    const role = row.getCell(3).text?.trim();
    const location = row.getCell(4).text?.trim();

    if (!first || !last || !role) return;

    console.log(`
INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('${sqlEscape(first)}', '${sqlEscape(last)}', '${sqlEscape(role)}', '${sqlEscape(location)}')
ON CONFLICT DO NOTHING;
`);

    for (const area of AREAS) {
      for (const visit of VISIT_TYPES) {
        const cell = row.getCell(area.startCol + visit.offset);
        const rate = Number(cell.value);

        if (!rate || isNaN(rate)) continue;

        console.log(`
INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  ${rate}
FROM therapists t
JOIN billing_areas a ON a.area_name = '${sqlEscape(area.name)}'
JOIN visit_types vt ON vt.visit_code = '${sqlEscape(visit.code)}'
WHERE
  t.first_name = '${sqlEscape(first)}'
  AND t.last_name = '${sqlEscape(last)}'
  AND t.role = '${sqlEscape(role)}';
`);
      }
    }
  });
})();
