import React, { useMemo, useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { parsePayrollCSV, parsePayrollExcel } from './parsePayrollData';
import TherapistRatesTable from './TherapistRatesTable';

/**
 * Payroll.jsx
 *
 * Flow:
 * 1) Upload Payroll Detail CSV/XLSX
 * 2) Parse with parsePayrollCSV/parsePayrollExcel
 * 3) Load DB reference data (therapists, cities->billing areas, visit_types, therapist_rates)
 * 4) Compute owed amounts (rate payments + mileage payments)
 * 5) If any rate is missing: prompt user to enter/update the rate(s), save to DB, then retry
 * 6) Build an Excel file mirroring the screenshot layout (best-effort initial layout)
 */

// --- Helpers ---------------------------------------------------------------

const API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : '';

function authHeaders() {
  const token = localStorage.getItem('id_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function normalizeTherapistName(name) {
  return (name || '').replace(/\s+/g, ' ').trim();
}

function normalizeCityName(city) {
  return (city || '').toString().trim();
}

function normalizeVisitGroupToVisitCode(visitGroupRaw) {
  const v = (visitGroupRaw || '').toString().trim().toLowerCase();
  if (!v) return null;

  // Common formats seen in payroll export
  if (v.includes('re-eval') || v.includes('reeval') || v.includes('re eval')) return 'RE_EVAL';
  if (v.includes('eval')) return 'EVAL';
  if (v.includes('discharge')) return 'DISCHARGE';
  if (v.includes('extended')) return 'EXTENDED';
  if (v.includes('out of town') || v.includes('out-of-town') || v.includes('oot')) return 'OOT';
  if (v.includes('visit')) return 'VISIT';

  // If your system has more visit groups, add mapping here.
  return null;
}

function money(n) {
  const x = Number(n || 0);
  return x.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

function num(n) {
  const x = Number(n || 0);
  return Number.isFinite(x) ? x : 0;
}

function parseMiles(miles) {
  // miles may come in as string, empty, etc.
  const x = Number((miles || '').toString().replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(x) ? x : 0;
}

function extractPayPeriodFromFileText(csvText) {
  // User spec: cell A1 formatted like:
  // "Rebound Rehab Contractors (<start_date> - <end_date>)"
  // CSV: first row, first cell.
  const firstLine = csvText.split(/\r?\n/)[0] || '';
  const firstCell = firstLine.split(',')[0] || '';

  const m = firstCell.match(/\(([^)]+?)\s*-\s*([^)]+?)\)/);
  if (!m) return { start: null, end: null, raw: firstCell };
  return { start: m[1].trim(), end: m[2].trim(), raw: firstCell };
}

function sortTherapistsByFirstName(byTherapistId) {
  return Object.values(byTherapistId || {}).sort((a, b) =>
    (a.therapist.first_name || '').localeCompare(
      b.therapist.first_name || '',
      undefined,
      { sensitivity: 'base' }
    )
  );
}

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error(`${path} failed (${res.status})`);
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${path} failed (${res.status}): ${text}`);
  }
  return res.json();
}

/**
 * Build in-memory indexes from DB reference data.
 */
function buildIndexes({ therapists, billingCities, billingAreas, visitTypes, therapistRates }) {
  // therapist: key by "First Last" + role (best-effort)
  const therapistByName = new Map();
  for (const t of therapists) {
    const key1 = normalizeTherapistName(`${t.first_name} ${t.last_name}`);
    const key2 = normalizeTherapistName(`${t.last_name}, ${t.first_name}`);
    therapistByName.set(key1.toLowerCase(), t);
    therapistByName.set(key2.toLowerCase(), t);
  }

  const billingAreaById = new Map();
  const billingAreaByName = new Map();
  for (const a of billingAreas) {
    billingAreaById.set(a.billing_area_id, a);
    billingAreaByName.set((a.area_name || '').toLowerCase(), a);
  }

  // city -> billing_area_id
  const cityInfoByCity = new Map();
  for (const c of billingCities) {
    cityInfoByCity.set(
      normalizeCityName(c.city_name).toLowerCase(),
      {
        billingAreaId: c.billing_area_id,
        classification: (c.city_classification || 'IN').toUpperCase()
      }
    );

    console.log('[INDEX BUILD]', {
      city: c.city_name,
      rawClassification: c.city_classification,
    });
  }

  const visitTypeById = new Map();
  const visitTypeByCode = new Map();
  for (const vt of visitTypes) {
    visitTypeById.set(vt.visit_type_id, vt);
    visitTypeByCode.set((vt.visit_code || '').toUpperCase(), vt);
  }

  // rates indexed by therapist_id + billing_area_id + visit_type_id
  const rateByKey = new Map();
  for (const r of therapistRates) {
    const k = `${r.therapist_id}|${r.billing_area_id}|${r.visit_type_id}`;
    rateByKey.set(k, Number(r.rate));
  }

  return {
    therapistByName,
    billingAreaById,
    billingAreaByName,
    cityInfoByCity,
    visitTypeById,
    visitTypeByCode,
    rateByKey,
  };
}

function getOrInit(obj, key, initFn) {
  if (!obj[key]) obj[key] = initFn();
  return obj[key];
}

/**
 * Compute payroll aggregations.
 *
 * Output:
 * {
 *   byTherapistId: {
 *     [id]: { therapist, visits, rate_payments, mileage_payments, comment_rate_adj, comment_mileage_adj }
 *   },
 *   byLocationRole: {
 *     [location]: {
 *        [role]: { rate_payments, mileage_payments, visits, miles }
 *     }
 *   },
 *   totals: { amount, visits }
 * }
 */
function computePayroll({ parsed, indexes, commentAdjustments }) {
  const byTherapistId = {};
  const byLocationRole = {};
  const missingRates = [];
  const missingRateKeys = new Set();

  let totalVisits = 0;

  const getOrInit = (obj, key, initFn) => {
    if (!obj[key]) obj[key] = initFn();
    return obj[key];
  };

  for (const [therapistNameRaw, payload] of Object.entries(parsed.therapists)) {
    const therapistName = normalizeTherapistName(therapistNameRaw);
    const therapist = indexes.therapistByName.get(therapistName.toLowerCase());

    if (!therapist) {
      missingRates.push({
        kind: 'THERAPIST_NOT_FOUND',
        therapistName,
        details: 'Therapist not found in therapists table.',
      });
      continue;
    }

    const tAgg = getOrInit(byTherapistId, therapist.therapist_id, () => ({
      therapist,
      visits: 0,
      miles: 0,
      rate_payments: 0,
      mileage_payments: 0,
      comment_payment: 0,
      comment: payload?.comments || '',
      breakdown: {
        VISIT: { count: 0, rate: 0, total: 0 },
        EVAL: { count: 0, rate: 0, total: 0 },
        RE_EVAL: { count: 0, rate: 0, total: 0 },
        DISCHARGE: { count: 0, rate: 0, total: 0 },
        OOT: { count: 0, rate: 0, total: 0 },
        EXTENDED: { count: 0, rate: 0, total: 0 },
      },
    }));

    // ---- MILEAGE RATE CHECK (THERAPIST-LEVEL) ----
    const hasMileageRate =
      therapist.mileage_rate != null &&
      Number.isFinite(Number(therapist.mileage_rate));

    if (!hasMileageRate) {
      const key = `MILEAGE|${therapist.therapist_id}`;

      if (!missingRateKeys.has(key)) {
        missingRateKeys.add(key);
        missingRates.push({
          kind: 'MILEAGE_RATE_MISSING',
          therapist,
          details: 'Mileage rate missing',
        });
      }
    }

    const visits = payload?.visits || [];

    for (const v of visits) {
      const city = normalizeCityName(v['City']);
      const visitGroup = v['Visit Group'];
      const visitCode = normalizeVisitGroupToVisitCode(visitGroup);
      const miles = parseMiles(v['Miles']);

      // ---- COUNTING (always happens) ----
      tAgg.visits += 1;
      tAgg.miles += miles;
      totalVisits += 1;

      const location = therapist.home_location || 'Unknown';
      const role = therapist.role || 'Unknown';

      const lrAgg = getOrInit(byLocationRole, location, () => ({}));
      const roleAgg = getOrInit(lrAgg, role, () => ({
        rate_payments: 0,
        mileage_payments: 0,
        visits: 0,
        miles: 0,
      }));

      roleAgg.visits += 1;
      roleAgg.miles += miles;

      console.log('[DEBUG] Pre-mileage visit', {
        therapist: `${therapist.first_name} ${therapist.last_name}`,
        city,
        classification: indexes.cityInfoByCity.get(city.toLowerCase())?.classification,
      });

      // // ---- MILEAGE PAY ----
      // if (therapist.mileage_rate == null || Number.isNaN(Number(therapist.mileage_rate))) {
      //   const key = `MILEAGE|${therapist.therapist_id}`;

      //   if (!missingRateKeys.has(key)) {
      //     missingRateKeys.add(key);
      //     missingRates.push({
      //       kind: 'MILEAGE_RATE_MISSING',
      //       therapist,
      //       details: 'Mileage rate missing',
      //     });
      //   }
      //   continue;
      // }

      const mileageRate = num(therapist.mileage_rate);
      const mileagePay = miles * mileageRate;
      tAgg.mileage_payments += mileagePay;
      roleAgg.mileage_payments += mileagePay;

      // ---- VISIT TYPE ----
      const visitType = visitCode
        ? indexes.visitTypeByCode.get(visitCode)
        : null;

      if (!visitType) {
        missingRates.push({
          kind: 'VISIT_TYPE_UNKNOWN',
          therapist,
          visitGroup,
          details: 'Visit group did not map to a known visit type.',
        });
        continue;
      }

      // ---- CITY → BILLING AREA + CLASSIFICATION ----
      const cityInfo = indexes.cityInfoByCity.get(city.toLowerCase());
      if (!cityInfo) {
        missingRates.push({
          kind: 'CITY_NOT_MAPPED',
          therapist,
          city,
          details: 'City is not mapped to a billing area.',
        });
        continue;
      }

      const { billingAreaId, classification } = cityInfo;

      // ---- BASE VISIT RATE ----
      const baseCode = visitType.visit_code.toUpperCase(); // VISIT, EVAL, etc

      const baseRateKey =
        `${therapist.therapist_id}|${billingAreaId}|${visitType.visit_type_id}`;

      const baseRateRaw = indexes.rateByKey.get(baseRateKey);

      if (baseRateRaw == null || Number.isNaN(baseRateRaw)) {
        const key = `RATE|${therapist.therapist_id}|${billingAreaId}|${visitType.visit_type_id}`;
        if (!missingRateKeys.has(key)) {
          missingRateKeys.add(key);
          missingRates.push({
            kind: 'RATE_MISSING',
            therapist,
            billingAreaId,
            visitTypeId: visitType.visit_type_id,
            visitCode: visitType.visit_code,
            visitGroup,
            city,
            details: 'Missing base visit rate.',
          });
        }
        continue;
      }

      const baseRate = num(baseRateRaw);

      // Base visit
      tAgg.breakdown[baseCode].count += 1;
      tAgg.breakdown[baseCode].rate = baseRate;
      tAgg.breakdown[baseCode].total += baseRate;

      let totalRate = baseRate;

      if (classification === 'OUT' || classification === 'EXT') {
        const surchargeCode = classification === 'OUT' ? 'OOT' : 'EXTENDED';

        const surchargeType = indexes.visitTypeByCode.get(surchargeCode);
        if (!surchargeType) {
          missingRates.push({
            kind: 'VISIT_TYPE_UNKNOWN',
            therapist,
            visitGroup: surchargeCode,
            details: `Missing visit type ${surchargeCode}.`,
          });
          continue;
        }

        const surchargeKey =
          `${therapist.therapist_id}|${billingAreaId}|${surchargeType.visit_type_id}`;

        const surchargeRate = indexes.rateByKey.get(surchargeKey);

        if (surchargeRate == null || Number.isNaN(surchargeRate)) {
          const key = `SURCHARGE|${therapist.therapist_id}|${billingAreaId}|${surchargeCode}`;

          if (!missingRateKeys.has(key)) {
            missingRateKeys.add(key);
            missingRates.push({
              kind: 'RATE_MISSING',
              therapist,
              billingAreaId,
              visitTypeId: surchargeType.visit_type_id,
              visitCode: surchargeCode,
              visitGroup,
              city,
              details: `Missing ${surchargeCode} surcharge rate.`,
            });
          }
          continue;
        }

        // ✅ record surcharge breakdown
        tAgg.breakdown[surchargeCode].count += 1;
        tAgg.breakdown[surchargeCode].rate = num(surchargeRate);
        tAgg.breakdown[surchargeCode].total += num(surchargeRate);

        // ✅ add to visit total
        totalRate += num(surchargeRate);

        console.log('[DEBUG] Visit processed', {
          therapist: `${therapist.first_name} ${therapist.last_name}`,
          city,
          classification,
          visitGroup,
          breakdown: {
            VISIT: tAgg.breakdown.VISIT,
            EVAL: tAgg.breakdown.EVAL,
            RE_EVAL: tAgg.breakdown.RE_EVAL,
            DISCHARGE: tAgg.breakdown.DISCHARGE,
            OOT: tAgg.breakdown.OOT,
            EXTENDED: tAgg.breakdown.EXTENDED,
          },
        });
      }

      tAgg.rate_payments += totalRate;
      roleAgg.rate_payments += totalRate;
    }

    console.log('[FINAL BREAKDOWN]', {
      therapist: `${therapist.first_name} ${therapist.last_name}`,
      breakdown: tAgg.breakdown,
      rate_payments: tAgg.rate_payments,
      mileage_payments: tAgg.mileage_payments,
      comment_payment: tAgg.comment_payment,
    });

    // ---- COMMENT ADJUSTMENTS ----
    const adj = commentAdjustments?.[therapist.therapist_id];
    if (adj) {
      const paymentAdj = num(adj.payment);

      // IMPORTANT:
      // Do NOT mix this into rate or mileage.
      // Keep it separate, but include in totals later.
      tAgg.comment_payment = paymentAdj;

      const location = therapist.home_location || 'Unknown';
      const role = therapist.role || 'Unknown';
    }
  }

  const totalAmount = Object.values(byTherapistId).reduce(
    (sum, t) =>
      sum +
      num(t.rate_payments) +
      num(t.mileage_payments) +
      num(t.comment_payment),
    0
  );

  return {
    byTherapistId,
    byLocationRole,
    totals: {
      amount: totalAmount,
      visits: totalVisits,
    },
    missingRates,
  };
}

/**
 * Create the payroll workbook (best-effort layout based on screenshot).
 */
async function buildWorkbook({ payPeriod, payrollAgg }) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Summary');

  // Column widths (roughly matching screenshot)
  ws.columns = [
    { key: 'A', width: 19 },
    { key: 'B', width: 16 },
    { key: 'C', width: 10 },
    { key: 'D', width: 3 },
    { key: 'E', width: 19 },
    { key: 'F', width: 16 },
    { key: 'G', width: 10 },
    { key: 'H', width: 3 },
    { key: 'I', width: 14 },
    { key: 'J', width: 6 },
    { key: 'K', width: 17 },
    { key: 'L', width: 8 },
    { key: 'M', width: 10 },
    { key: 'N', width: 14 },
    { key: 'O', width: 10 },
    { key: 'P', width: 10 },
  ];

  // Title
  ws.getCell('A1').value = 'Payroll Period';
  ws.getCell('B1').value = payPeriod?.start && payPeriod?.end
    ? `${payPeriod.start} to ${payPeriod.end}`
    : '';

  // Summary box (A3:C6)
  ws.getCell('A3').value = '';
  ws.getCell('B3').value = 'Amount';
  ws.getCell('C3').value = 'Visits';

  const totals = payrollAgg.totals;

  ws.getCell('A4').value = 'Total';
  ws.getCell('A4').alignment = { horizontal: 'center'};
  ws.getCell('B4').value = num(totals.amount);
  ws.getCell('B4').numFmt = '$#,##0.00';
  ws.getCell('C4').value = totals.visits;
  ws.getCell('C4').alignment = { horizontal: 'center'}

  // Location totals: sum across roles
  const locationSums = {};
  for (const [loc, byRole] of Object.entries(payrollAgg.byLocationRole)) {
    const sum = { amount: 0, visits: 0 };
    for (const roleAgg of Object.values(byRole)) {
      sum.amount += num(roleAgg.rate_payments) + num(roleAgg.mileage_payments);
      sum.visits += num(roleAgg.visits);
    }
    locationSums[loc] = sum;
  }

  const locations = Object.keys(locationSums);
  // Put first two locations under Total (like screenshot), but support more.
  for (let idx = 0; idx < locations.length; idx++) {
    const row = 5 + idx;
    const loc = locations[idx];
    ws.getCell(`A${row}`).value = loc;
    ws.getCell(`A${row}`).alignment = { horizontal: 'center'};
    ws.getCell(`B${row}`).value = num(locationSums[loc].amount);
    ws.getCell(`B${row}`).numFmt = '$#,##0.00';
    ws.getCell(`B${row}`).alignment = { horizontal: 'right'};
    ws.getCell(`C${row}`).value = num(locationSums[loc].visits);
    ws.getCell(`C${row}`).alignment = { horizontal: 'center'};
  }

  // Therapist lists: split into two columns like screenshot
  // const therapists = Object.values(payrollAgg.byTherapistId)
  //   .sort((a, b) => {
  //     const an = `${a.therapist.last_name || ''}, ${a.therapist.first_name || ''}`.toLowerCase();
  //     const bn = `${b.therapist.last_name || ''}, ${b.therapist.first_name || ''}`.toLowerCase();
  //     return an.localeCompare(bn);
  //   });

  const therapists = Object.values(payrollAgg.byTherapistId || {})
  .sort((a, b) =>
    (a.therapist.first_name || '').localeCompare(
      b.therapist.first_name || '',
      undefined,
      { sensitivity: 'base' }
    )
  );

  // Headers
  ws.getCell('A8').value = 'Therapist';
  ws.getCell('A8').alignment = { horizontal: 'center'};
  ws.getCell('B8').value = 'Amount';
  ws.getCell('B8').alignment = { horizontal: 'center'};
  ws.getCell('C8').value = 'Visit';
  ws.getCell('C8').alignment = { horizontal: 'center'};
  ws.getCell('E8').value = 'Therapist';
  ws.getCell('E8').alignment = { horizontal: 'center'};
  ws.getCell('F8').value = 'Amount';
  ws.getCell('F8').alignment = { horizontal: 'center'};
  ws.getCell('G8').value = 'Visit';
  ws.getCell('G8').alignment = { horizontal: 'center'};

  const leftCount = Math.ceil(therapists.length / 2);
  const left = therapists.slice(0, leftCount);
  const right = therapists.slice(leftCount);

  const startRow = 9;
  let numTherapists = 0;
  const writeTherapistRow = (tAgg, colOffset, row) => {
    const name = `${tAgg.therapist.first_name} ${tAgg.therapist.last_name}`.trim();
    const amount = num(tAgg.rate_payments) + num(tAgg.mileage_payments) + num(tAgg.comment_payment);

    ws.getCell(row, colOffset + 1).value = name;
    ws.getCell(row, colOffset + 2).value = amount;
    ws.getCell(row, colOffset + 2).alignment = { horizontal: 'right'};
    ws.getCell(row, colOffset + 2).numFmt = '$#,##0.00';
    ws.getCell(row, colOffset + 3).value = num(tAgg.visits);
    ws.getCell(row, colOffset + 3).alignment = { horizontal: 'center'};

    numTherapists++;
  };

  left.forEach((tAgg, idx) => writeTherapistRow(tAgg, 0, startRow + idx));
  right.forEach((tAgg, idx) => writeTherapistRow(tAgg, 4, startRow + idx));

  // Role-by-location breakdown tables (right side like screenshot)
  // We will place them starting around column I.
  let blockTop = 2;
  ws.getCell(blockTop, 11).value = 'Cost (no mileage)';
  ws.getCell(blockTop, 12).value = 'Visits';
  ws.getCell(blockTop, 13).value = 'Cost/Visit';
  ws.getCell(blockTop, 14).value = 'Cost (mileage)';
  ws.getCell(blockTop, 15).value = 'Miles';
  ws.getCell(blockTop, 16).value = 'Cost/Mile';
  
  const totalsByLocation = {};
  const grandTotal = {
    rate_payments: 0,
    mileage_payments: 0,
    visits: 0,
    miles: 0,
  };

  for (const [loc, byRole] of Object.entries(payrollAgg.byLocationRole)) {
    totalsByLocation[loc] = {
      rate_payments: 0,
      mileage_payments: 0,
      visits: 0,
      miles: 0,
    };

    for (const r of Object.values(byRole)) {
      totalsByLocation[loc].rate_payments += num(r.rate_payments);
      totalsByLocation[loc].mileage_payments += num(r.mileage_payments);
      totalsByLocation[loc].visits += num(r.visits);
      totalsByLocation[loc].miles += num(r.miles);

      grandTotal.rate_payments += num(r.rate_payments);
      grandTotal.mileage_payments += num(r.mileage_payments);
      grandTotal.visits += num(r.visits);
      grandTotal.miles += num(r.miles);
    }
  }

  const totalHeaderRow = blockTop + 1;

  ws.getCell(totalHeaderRow, 9).value = 'Total';

  ws.getCell(totalHeaderRow, 11).value = grandTotal.rate_payments;
  ws.getCell(totalHeaderRow, 11).numFmt = '$#,##0.00';

  ws.getCell(totalHeaderRow, 12).value = grandTotal.visits;

  ws.getCell(totalHeaderRow, 13).value =
    grandTotal.visits ? grandTotal.rate_payments / grandTotal.visits : 0;
  ws.getCell(totalHeaderRow, 13).numFmt = '$#,##0.00';

  ws.getCell(totalHeaderRow, 14).value = grandTotal.mileage_payments;
  ws.getCell(totalHeaderRow, 14).numFmt = '$#,##0.00';

  ws.getCell(totalHeaderRow, 15).value = grandTotal.miles;

  ws.getCell(totalHeaderRow, 16).value =
    grandTotal.miles ? grandTotal.mileage_payments / grandTotal.miles : 0;
  ws.getCell(totalHeaderRow, 16).numFmt = '$#,##0.00';

  let locRow = totalHeaderRow + 1;

  Object.keys(totalsByLocation).sort().forEach(loc => {
    const r = totalsByLocation[loc];

    ws.getCell(locRow, 9).value = loc;

    ws.getCell(locRow, 11).value = r.rate_payments;
    ws.getCell(locRow, 11).numFmt = '$#,##0.00';

    ws.getCell(locRow, 12).value = r.visits;

    ws.getCell(locRow, 13).value =
      r.visits ? r.rate_payments / r.visits : 0;
    ws.getCell(locRow, 13).numFmt = '$#,##0.00';

    ws.getCell(locRow, 14).value = r.mileage_payments;
    ws.getCell(locRow, 14).numFmt = '$#,##0.00';

    ws.getCell(locRow, 15).value = r.miles;

    ws.getCell(locRow, 16).value =
      r.miles ? r.mileage_payments / r.miles : 0;
    ws.getCell(locRow, 16).numFmt = '$#,##0.00';

    locRow += 1;
  });

  const allLocationsByRole = {};

  for (const byRole of Object.values(payrollAgg.byLocationRole)) {
    for (const [role, r] of Object.entries(byRole)) {
      if (!allLocationsByRole[role]) {
        allLocationsByRole[role] = {
          rate_payments: 0,
          mileage_payments: 0,
          visits: 0,
          miles: 0,
        };
      }

      allLocationsByRole[role].rate_payments += num(r.rate_payments);
      allLocationsByRole[role].mileage_payments += num(r.mileage_payments);
      allLocationsByRole[role].visits += num(r.visits);
      allLocationsByRole[role].miles += num(r.miles);
    }
  }

  const allHeaderRow = locRow + 1;
  ws.getCell(allHeaderRow, 9).value = 'Total';

  const allRoles = Object.keys(allLocationsByRole).sort();

  allRoles.forEach((role, idx) => {
    const r = allLocationsByRole[role];
    const row = allHeaderRow + idx;

    const ratePayments = num(r.rate_payments);
    const mileagePayments = num(r.mileage_payments);
    const visits = num(r.visits);
    const miles = num(r.miles);

    ws.getCell(row, 10).value = role;

    ws.getCell(row, 11).value = ratePayments;
    ws.getCell(row, 11).numFmt = '$#,##0.00';

    ws.getCell(row, 12).value = visits;

    ws.getCell(row, 13).value = visits ? ratePayments / visits : 0;
    ws.getCell(row, 13).numFmt = '$#,##0.00';

    ws.getCell(row, 14).value = mileagePayments;
    ws.getCell(row, 14).numFmt = '$#,##0.00';

    ws.getCell(row, 15).value = miles;

    ws.getCell(row, 16).value = miles ? mileagePayments / miles : 0;
    ws.getCell(row, 16).numFmt = '$#,##0.00';
  });

  // Advance blockTop so location blocks start after this
  blockTop = allHeaderRow + allRoles.length + 1;
  
  for (const [loc, byRole] of Object.entries(payrollAgg.byLocationRole)) {
    const locHeaderRow = blockTop;
    ws.getCell(locHeaderRow, 9).value = loc;

    const roles = Object.keys(byRole).sort();
    roles.forEach((role, idx) => {
      const r = byRole[role];
      const row = locHeaderRow + idx;
      const ratePayments = num(r.rate_payments);
      const mileagePayments = num(r.mileage_payments);
      const visits = num(r.visits);
      const miles = num(r.miles);

      ws.getCell(row, 10).value = role;
      ws.getCell(row, 11).value = ratePayments;
      ws.getCell(row, 11).numFmt = '$#,##0.00';
      ws.getCell(row, 12).value = visits;
      ws.getCell(row, 13).value = visits ? ratePayments / visits : 0;
      ws.getCell(row, 13).numFmt = '$#,##0.00';
      ws.getCell(row, 14).value = mileagePayments;
      ws.getCell(row, 14).numFmt = '$#,##0.00';
      ws.getCell(row, 15).value = miles;
      ws.getCell(row, 16).value = miles ? mileagePayments / miles : 0;
      ws.getCell(row, 16).numFmt = '$#,##0.00';
    });

    // Add a blank row between blocks
    blockTop = locHeaderRow + roles.length + 1;
  }

  // Basic borders for readability
  const border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  ws.eachRow({ includeEmpty: false }, (row) => {
    row.eachCell({ includeEmpty: false }, (cell) => {
      cell.border = border;
      // cell.alignment = { vertical: 'middle'};
    });
  });

  // Totals table borders
  for (let i = 3; i < 7; i++) {
    boldBorder(ws, i, 1, ['left', 'right']);
    boldBorder(ws, i, 3, ['right']);

    if (i < 6) {
      boldBorder(ws, 3, i-2, ['top', 'bottom'])
      boldBorder(ws, 6, i-2, ['bottom'])
    }
  }

  for (let i = 8; i < Math.ceil(numTherapists/2) + 9; i++) {
    boldBorder(ws, i, 1, ['left']);
    boldBorder(ws, i, 2, ['left']);
    boldBorder(ws, i, 3, ['left', 'right']);

    if (i < 11){
      boldBorder(ws, 8, i-7, ['top', 'bottom']);
      boldBorder(ws, Math.ceil(numTherapists/2) + 8, i-7, ['bottom']);

      boldBorder(ws, 8, i-3, ['top', 'bottom']);
      boldBorder(ws, Math.floor(numTherapists/2) + 8, i-3, ['bottom']);
    }

    if (numTherapists % 2 == 1 & i == Math.ceil(numTherapists/2) + 8) {
      continue;
    }
    else
    {
      boldBorder(ws, i, 5, ['left']);
      boldBorder(ws, i, 6, ['left']);
      boldBorder(ws, i, 7, ['left', 'right']);
    }
  }

  ws.getCell(3, 9).border = {bottom: { style: 'thin' }, right: undefined}
  ws.getCell(4, 9).border = {bottom: { style: 'thin' }, right: undefined}
  ws.getCell(5, 9).border = {bottom: { style: 'thin' }, right: undefined}

  ws.getCell(3, 10).border = {bottom: { style: 'thin' }}
  ws.getCell(4, 10).border = {bottom: { style: 'thin' }}
  ws.getCell(5, 10).border = {bottom: { style: 'thin' }}

  ws.getCell(2, 11).border = {right: { style: 'thin' }, left: undefined}

  ws.getCell(7, 9).border = {bottom: undefined}
  ws.getCell(13, 9).border = {bottom: undefined}
  ws.getCell(19, 9).border = {bottom: undefined}

  for(let i = 9; i <= 16; i++){
    boldBorder(ws, 2, i, ['top', 'bottom']);
    boldBorder(ws, 5, i, ['bottom']);

    boldBorder(ws, 7, i, ['top']);
    boldBorder(ws, 11, i, ['bottom']);

    boldBorder(ws, 13, i, ['top']);
    boldBorder(ws, 17, i, ['bottom']);

    boldBorder(ws, 19, i, ['top']);
    boldBorder(ws, 23, i, ['bottom']);

    if(i < 13){
      boldBorder(ws, i - 7, 9, ['left']);
      boldBorder(ws, i - 7, 16, ['right']);
    }

    if(i < 12){
      boldBorder(ws, i - 6, 11, ['left']);
    }
  }

  for(let i = 1; i <= 5; i++){
    boldBorder(ws, i + 6, 9, ['left', 'right']);
    boldBorder(ws, i + 6, 10, ['left', 'right']);
    boldBorder(ws, i + 6, 16, ['right']);

    boldBorder(ws, i + 12, 9, ['left', 'right']);
    boldBorder(ws, i + 12, 10, ['left', 'right']);
    boldBorder(ws, i + 12, 16, ['right']);

    boldBorder(ws, i + 18, 9, ['left', 'right']);
    boldBorder(ws, i + 18, 10, ['left', 'right']);
    boldBorder(ws, i + 18, 16, ['right']);
  }

  ws.pageSetup.margins = {
    left: 0.59,
    right: 0.56,
    top: 0.22,
    bottom: 0.24,
    header: 0.5,
    footer: 0.5,
  };

  // -----------------------------------------------------------------------------
  //                           Squares Worksheet
  // -----------------------------------------------------------------------------

  const squaresWs = wb.addWorksheet('Therapist Squares');

  // column widths for 5-col squares + spacer
  squaresWs.columns = [
    { width: 16 }, // A
    { width: 14 }, // B
    { width: 12 }, // C
    { width: 14 }, // D
    { width: 4 },  // E spacer
    { width: 16 }, // F
    { width: 14 }, // G
    { width: 12 }, // H
    { width: 14 }, // I
    { width: 4 },  // J spacer
  ];

  function box(ws, r1, c1, r2, c2) {
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        ws.getCell(r, c).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    }
  }

  function formatMoney(ws, row, col, green = false) {
    const cell = ws.getCell(row, col);
    cell.numFmt = '$#,##0.00';
    cell.font = {
      ...(green ? {color: { argb: 'FF00CC00' }} : {}), // dark green text
    };
  }

  function boldBorder(ws, row, col, sides = []) {
    const cell = ws.getCell(row, col);

    const border = { ...cell.border };

    if (sides.includes('top')) {
      border.top = { style: 'medium' };
    }
    if (sides.includes('bottom')) {
      border.bottom = { style: 'medium' };
    }
    if (sides.includes('left')) {
      border.left = { style: 'medium' };
    }
    if (sides.includes('right')) {
      border.right = { style: 'medium' };
    }

    cell.border = border;
  }

  function writeTherapistSquare(ws, tAgg, rowStart, colStart, payPeriod) {
    box(ws, rowStart + 1, colStart, rowStart + 16, colStart + 3);

    // HEADER
    ws.getCell(rowStart, colStart).value = 'Therapist';
    boldBorder(ws, rowStart, colStart, ['top', 'bottom', 'left', 'right']);
    ws.getCell(rowStart, colStart).font = { bold: true };
    ws.getCell(rowStart, colStart + 1).value =
      `${tAgg.therapist.first_name} ${tAgg.therapist.last_name}`;
    ws.getCell(rowStart, colStart + 3).value =
      `${payPeriod.start} to ${payPeriod.end}`;
    ws.getCell(rowStart, colStart + 3).alignment = { horizontal: 'right' };

    for (let i = 1; i < 4; i++){
      boldBorder(ws, rowStart, colStart + i, ['top', 'bottom']);
    }
    boldBorder(ws, rowStart, colStart + 3, ['right']);

    for (let j = 0; j <= 3; ++j){
      for (let i = rowStart + 2; i <= rowStart + 16; i++) {
        boldBorder(ws, i, colStart + j, ['left', 'right']);
      }
    }

    for (let i = 0; i <= 3; ++ i){
      boldBorder(ws, rowStart + 6, colStart + i, ['bottom']);
    }
    for (let i = 0; i <= 3; ++ i){
      boldBorder(ws, rowStart + 8, colStart + i, ['bottom']);
    }
    for (let i = 0; i <= 3; ++ i){
      boldBorder(ws, rowStart + 12, colStart + i, ['bottom']);
    }
    for (let i = 0; i <= 3; ++ i){
      boldBorder(ws, rowStart + 16, colStart + i, ['bottom']);
    }

    boldBorder(ws, rowStart + 17, colStart + 1, ['top', 'bottom', 'left', 'right']);
    boldBorder(ws, rowStart + 17, colStart + 3, ['top', 'bottom', 'left', 'right']);

    // LABELS
    ['Type', 'Number', 'Rate', 'Total'].forEach((v, i) => {
      ws.getCell(rowStart + 1, colStart + i).value = v;
      ws.getCell(rowStart + 1, colStart + i).font = { bold: true };
      boldBorder(ws, rowStart + 1, colStart + i, ['top', 'bottom', 'left', 'right']);
    });

    const map = [
      ['VISIT', 'Visit', 2],
      ['EVAL', 'Eval', 3],
      ['RE_EVAL', 'Re-Eval', 4],
      ['DISCHARGE', 'Discharge', 5],
      ['OOT', 'OOT', 7],
      ['EXTENDED', 'Extended', 8],
    ];

    map.forEach(([key, label, off]) => {
      const d = tAgg.breakdown[key];
      const r = rowStart + off;
      ws.getCell(r, colStart).value = label;
      ws.getCell(r, colStart).font = { bold: true };
      ws.getCell(r, colStart + 1).value = d.count;
      ws.getCell(r, colStart + 2).value = d.rate;
      ws.getCell(r, colStart + 3).value = d.total;

      ws.getCell(r, colStart + 1).alignment = { horizontal: 'center' };
      ws.getCell(r, colStart + 1).font = { color: { argb: '6495ED'}}
      ws.getCell(r, colStart + 2).alignment = { horizontal: 'center' };
      formatMoney(ws, r, colStart + 2, true);
      formatMoney(ws, r, colStart + 3, false);
    });

    // Mileage
    ws.getCell(rowStart + 9, colStart).value = 'Mileage';
    ws.getCell(rowStart + 9, colStart + 1).value = tAgg.miles;
    ws.getCell(rowStart + 9, colStart + 2).value = Number(tAgg.therapist.mileage_rate);
    ws.getCell(rowStart + 9, colStart + 3).value = tAgg.mileage_payments;
    ws.getCell(rowStart + 9, colStart).font = { bold: true };
    formatMoney(ws, rowStart + 9, colStart + 2, true)
    formatMoney(ws, rowStart + 9, colStart + 3, false);
    ws.getCell(rowStart + 9, colStart + 1).font = { color: { argb: '6495ED'}}
    ws.getCell(rowStart + 9, colStart + 1).alignment = { horizontal: 'center'}
    ws.getCell(rowStart + 9, colStart + 2).alignment = { horizontal: 'center'}

    // Misc
    ws.getCell(rowStart + 13, colStart).value = 'Misc.';
    ws.getCell(rowStart + 13, colStart + 2).value = tAgg.comment_payment;
    ws.getCell(rowStart + 13, colStart + 3).value = tAgg.comment_payment;
    ws.getCell(rowStart + 13, colStart).font = { bold: true };
    formatMoney(ws, rowStart + 13, colStart + 2, true)
    formatMoney(ws, rowStart + 13, colStart + 3, false);
    ws.getCell(rowStart + 13, colStart + 2).alignment = { horizontal: 'center'}

    // Totals
    ws.getCell(rowStart + 17, colStart + 1).value =
      Object.entries(tAgg.breakdown)
        .filter(([key]) => key !== 'OOT' && key !== 'EXTENDED')
        .reduce((sum, [, d]) => sum + d.count, 0);
    ws.getCell(rowStart + 17, colStart + 1).font = { color: { argb: '6495ED'}}
    ws.getCell(rowStart + 17, colStart + 1).alignment = { horizontal: 'center'}

    ws.getCell(rowStart + 17, colStart + 3).value =
      tAgg.rate_payments + tAgg.mileage_payments + tAgg.comment_payment;
    formatMoney(ws, rowStart + 17, colStart + 3, false);

    for(let i = 1; i < 19; i++){
      ws.getRow(rowStart + i).height = 13.5;
    }
    // for(let i = 18; i < 20; i++){
    //   ws.getRow(rowStart + i).height = 8;
    // }
  }

  const sortedTherapists = sortTherapistsByFirstName(payrollAgg.byTherapistId);

  sortedTherapists.forEach((tAgg, idx) => {
    const rowStart = Math.floor(idx / 2) * 19 + 1;
    const colStart = idx % 2 === 0 ? 1 : 6;
    writeTherapistSquare(squaresWs, tAgg, rowStart, colStart, payPeriod);
  });

  for (let c = 1; c <= 4; c++) {
    squaresWs.getColumn(c).width = 12;
  }

  squaresWs.getColumn(5).width = 2;

  for (let c = 6; c <= 9; c++) {
    squaresWs.getColumn(c).width = 12;
  }
  squaresWs.pageSetup.margins = {
    left: 0.4,
    right: 0.22,
    top: 0.25,
    bottom: 0.27,
    header: 0.55,
    footer: 0.5,
  };

  return wb;
}

// --- Modal for missing therapist rates -------------------------------------

function RateModal({ open, onClose, therapist, billingAreas, visitTypes, existingRates, missingRates, onSave }) {
  const [draft, setDraft] = useState(() => ({}));

  const missingKeySet = React.useMemo(() => {
    const s = new Set();
    for (const m of missingRates || []) {
      s.add(`${m.billingAreaId}|${m.visitTypeId}`);
    }
    return s;
  }, [missingRates]);

  // Initialize draft when therapist changes
  React.useEffect(() => {
    if (!open || !therapist) return;
    const next = {
      __mileage_rate: therapist.mileage_rate ?? '',
    };
    for (const a of billingAreas) {
      for (const vt of visitTypes) {
        const k = `${a.billing_area_id}|${vt.visit_type_id}`;
        const ex = existingRates?.get(`${therapist.therapist_id}|${a.billing_area_id}|${vt.visit_type_id}`);
        next[k] = ex != null ? String(ex) : '';
      }
    }
    setDraft(next);
  }, [open, therapist, billingAreas, visitTypes, existingRates]);

  if (!open || !therapist) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-[min(1000px,95vw)] max-h-[90vh] overflow-auto p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Missing rate(s) for therapist</h2>
            <div className="text-gray-700 mt-1">
              <div><span className="font-semibold">Name:</span> {therapist.first_name} {therapist.last_name}</div>
              <div><span className="font-semibold">Role:</span> {therapist.role}</div>
              <div><span className="font-semibold">Home location:</span> {therapist.home_location}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            Close
          </button>
        </div>

        {missingRates?.length > 0 && (
          <div className="mb-4 p-3 rounded bg-yellow-50 border border-yellow-300 text-sm">
            <div className="font-semibold mb-1">Missing rate(s):</div>

            <ul className="list-disc pl-5 space-y-1">
              {missingRates.map((m, idx) => {
                if (m.kind === 'MILEAGE_RATE_MISSING') {
                  return (
                    <li key={idx}>
                      Mileage rate missing for{' '}
                      <span className="font-semibold">
                        {m.therapist.first_name} {m.therapist.last_name}
                      </span>
                    </li>
                  );
                }

                if (m.kind === 'RATE_MISSING') {
                  const area =
                    billingAreas.find(a => a.billing_area_id === m.billingAreaId)?.area_name ??
                    'Unknown area';

                  const visit =
                    visitTypes.find(v => v.visit_type_id === m.visitTypeId)?.visit_code ??
                    'Unknown visit type';

                  return (
                    <li key={idx}>
                      {area} → {visit}
                    </li>
                  );
                }

                return (
                  <li key={idx}>
                    {m.details || 'Missing rate information'}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4">
          Enter rates for this therapist. Existing rates are prefilled. When you click “Save rates”,
          the app will upsert them in the database and then retry payroll generation.
        </p>

        <div className="border rounded-lg p-4 mb-6">
          <div className="font-semibold text-gray-900 mb-2">
            Mileage Rate
          </div>

          <label className="text-sm">
            <div className="text-gray-700 mb-1">Rate per mile</div>
            <input
              value={draft.__mileage_rate ?? therapist.mileage_rate ?? ''}
              onChange={(e) =>
                setDraft(d => ({ ...d, __mileage_rate: e.target.value }))
              }
              className={`w-full border rounded px-3 py-2 ${
                missingRates.some(m => m.kind === 'MILEAGE_RATE_MISSING')
                  ? 'border-red-500 bg-red-50'
                  : ''
              }`}
              placeholder="0.00"
            />
          </label>
        </div>

        <div className="space-y-6">
          {billingAreas.map(area => (
            <div key={area.billing_area_id} className="border rounded-lg p-4">
              <div className="font-semibold text-gray-900 mb-3">{area.area_name}</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {visitTypes.map(vt => {
                  const key = `${area.billing_area_id}|${vt.visit_type_id}`;
                  const isMissing = missingKeySet.has(key);
                  return (
                    <label key={key} className="text-sm">
                      <div className="text-gray-700 mb-1">{vt.visit_code}</div>
                      <input
                        value={draft[key] ?? ''}
                        onChange={(e) => setDraft(d => ({ ...d, [key]: e.target.value }))}
                        className={`w-full border rounded px-3 py-2 ${
                          isMissing ? 'border-red-500 bg-red-50' : ''
                        }`}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(draft)}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save rates
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentAdjustmentsModal({ open, onClose, therapistAggs, therapistRates, billingAreas, visitTypes, onSave }) {
  const [draft, setDraft] = React.useState({});
  const [openRatesFor, setOpenRatesFor] = React.useState(null);

  React.useEffect(() => {
    if (!open) return;

    const next = {};
    for (const tAgg of therapistAggs) {
      next[tAgg.therapist.therapist_id] = {
        payment: tAgg.comment_payment || 0,
      };
    }
    setDraft(next);
  }, [open, therapistAggs]);

  function getRatesForTherapist(therapistId) {
    return therapistRates
      .filter(r => r.therapist_id === therapistId)
      .map(r => {
        const area =
          billingAreas.find(a => a.billing_area_id === r.billing_area_id)?.area_name
            ?? 'Unknown Area';

        const visit =
          visitTypes.find(v => v.visit_type_id === r.visit_type_id)?.visit_code
            ?? 'Unknown Visit';

        return {
          key: `${area}-${visit}`,
          area,
          visit,
          rate: Number(r.rate),
        };
      })
      .sort((a, b) =>
        `${a.area} ${a.visit}`.localeCompare(`${b.area} ${b.visit}`)
      );
  }

  if (!open) return null;

  const withComments = therapistAggs.filter(
    t => (t.comment || '').trim()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-[min(900px,95vw)] max-h-[90vh] overflow-auto p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Therapist comment adjustments
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              For therapists with comments, enter any additional payment amount
              you want to apply.
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            Close
          </button>
        </div>

        {withComments.length === 0 ? (
          <div className="text-gray-700">
            No therapist comments were found in this payroll file.
          </div>
        ) : (
          <div className="space-y-3">
            {withComments.map(t => {
              const id = t.therapist.therapist_id;
              const cur = draft[id] || { payment: 0 };

              return (
                <div key={id} className="border rounded-lg p-4">
                  <div className="font-semibold text-gray-900">
                    {t.therapist.first_name} {t.therapist.last_name} ({t.therapist.role})
                  </div>

                  <div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                    <span className="font-semibold">Comment:</span> {t.comment}
                  </div>

                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenRatesFor(openRatesFor === id ? null : id)
                      }
                      className="flex items-center gap-0 text-sm text-gray-800 hover:text-gray-900 select-none"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          openRatesFor === id ? 'rotate-90 translate-y-0.5' : ''
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M6 6l6 4-6 4V6z" />
                      </svg>
                      <span>
                        Rates
                      </span>
                    </button>

                    {openRatesFor === id && (
                      <div className="mt-2 ml-4 border rounded bg-gray-50 p-3 text-sm">
                        {getRatesForTherapist(id).length === 0 ? (
                          <div className="text-gray-500">No rates found.</div>
                        ) : (
                          <ul className="space-y-1">
                            {getRatesForTherapist(id).map(r => (
                              <li
                                key={r.key}
                                className="flex justify-between gap-4"
                              >
                                <span className="text-gray-700">
                                  {r.area} — {r.visit}
                                </span>
                                <span className="font-mono font-semibold">
                                  ${r.rate.toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <label className="text-sm">
                      <div className="text-gray-700 mb-1">
                        Additional Payment
                      </div>
                      <input
                        value={cur.payment}
                        onChange={(e) => {
                          const v = e.target.value;
                          setDraft(d => ({
                            ...d,
                            [id]: { payment: v },
                          }));
                        }}
                        className="w-full border rounded px-3 py-2"
                        placeholder="0.00"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(draft)}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save adjustments
          </button>
        </div>
      </div>
    </div>
  );
}

function CityMappingModal({
  open,
  city,
  billingAreas,
  onClose,
  onSave
}) {
  const [billingAreaId, setBillingAreaId] = React.useState('');
  const [classification, setClassification] = React.useState('IN');

  React.useEffect(() => {
    if (open) {
      setBillingAreaId(billingAreas[0]?.billing_area_id ?? '');
      setClassification('IN');
    }
  }, [open, billingAreas]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-[420px] p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          Map City to Billing Area
        </h2>

        <div className="text-sm text-gray-700 mb-4">
          City <span className="font-semibold">"{city}"</span> is not mapped yet.
        </div>

        <label className="block text-sm mb-3">
          <div className="mb-1">Billing Area</div>
          <select
            value={billingAreaId}
            onChange={e => setBillingAreaId(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {billingAreas.map(a => (
              <option key={a.billing_area_id} value={a.billing_area_id}>
                {a.area_name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm mb-4">
          <div className="mb-1">City Classification</div>
          <select
            value={classification}
            onChange={e => setClassification(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
            <option value="EXT">EXT</option>
          </select>
        </label>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSave({
                city_name: city,
                billing_area_id: billingAreaId,
                city_classification: classification
              })
            }
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function AddTherapistModal({ open, initial, onClose, onSave }) {
  const [firstName, setFirstName] = useState(initial.firstName || '');
  const [lastName, setLastName] = useState(initial.lastName || '');
  const [role, setRole] = useState('');
  const [homeLocation, setHomeLocation] = useState('');

  React.useEffect(() => {
    if (open) {
      setFirstName(initial.firstName || '');
      setLastName(initial.lastName || '');
      setRole('');
      setHomeLocation('');
    }
  }, [open, initial]);

  if (!open) return null;

  const canSave =
    firstName.trim() &&
    lastName.trim() &&
    role.trim() &&
    homeLocation.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-[420px] p-6">
        <h2 className="text-lg font-bold mb-4">Add New Therapist</h2>

        <div className="space-y-3">
          <label className="block text-sm">
            First Name *
            <input
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            Last Name *
            <input
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            Role *
            <input
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="PT / PTA / OT / COTA"
            />
          </label>

          <label className="block text-sm">
            Home Location *
            <input
              value={homeLocation}
              onChange={e => setHomeLocation(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Clinic or city"
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100"
          >
            Cancel
          </button>
          <button
            disabled={!canSave}
            onClick={() =>
              onSave({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                role: role.trim(),
                home_location: homeLocation.trim(),
              })
            }
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            Save Therapist
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main component ---------------------------------------------------------

export default function Payroll({ token }) {
  const [file, setFile] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [payPeriod, setPayPeriod] = useState({ start: null, end: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [excelBuffer, setExcelBuffer] = useState(null);
  const [addTherapistModal, setAddTherapistModal] = useState({
    open: false,
    firstName: '',
    lastName: '',
  });

  // DB reference data
  const [refData, setRefData] = useState(null);

  // UI modals
  const [rateModalState, setRateModalState] = useState({ open: false, therapist: null, missingRates: [] });
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [cityModal, setCityModal] = useState({ open: false, city: null });

  // User-entered adjustments per therapist_id
  const [commentAdjustments, setCommentAdjustments] = useState({});

  // Latest computed aggregation
  const [payrollAgg, setPayrollAgg] = useState(null);

  const existingRatesMap = useMemo(() => {
    if (!refData) return new Map();
    const m = new Map();
    for (const r of refData.therapistRates) {
      m.set(`${r.therapist_id}|${r.billing_area_id}|${r.visit_type_id}`, Number(r.rate));
    }
    return m;
  }, [refData]);

  async function loadReferenceData() {
    // NOTE: These endpoints may not exist yet in your server.js.
    // You should add them on the backend to return these tables.
    //
    // Required tables:
    // - therapists (includes therapist_id, first_name, last_name, role, home_location, mileage_rate)
    // - billing_cities (city_name, billing_area_id)
    // - billing_areas (billing_area_id, area_name)
    // - visit_types (visit_type_id, visit_code)
    // - therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)

    const [therapists, billingCities, billingAreas, visitTypes, therapistRates] = await Promise.all([
      apiGet(`/therapists`),
      apiGet(`/billing_cities`),
      apiGet(`/billing_areas`),
      apiGet(`/visit_types`),
      apiGet(`/therapist_rates`),
    ]);

    return { therapists, billingCities, billingAreas, visitTypes, therapistRates };
  }

  async function handleFileUpload(e) {
    const f = e.target.files?.[0];
    if (!f) return;

    setError(null);
    setFile(f);
    setParsed(null);
    setPayrollAgg(null);

    try {
      let parsedData;
      let pp = { start: null, end: null };

      if (f.name.toLowerCase().endsWith('.csv')) {
        const text = await f.text();
        pp = extractPayPeriodFromFileText(text);
        parsedData = await parsePayrollCSV(text);
      } else if (f.name.toLowerCase().endsWith('.xlsx')) {
        const buffer = await f.arrayBuffer();
        // For xlsx, pay period is typically in A1; parsePayrollExcel currently returns only visits.
        // If you updated parsePayrollData.js to include pay period, you can pull it from parsedData.
        parsedData = await parsePayrollExcel(buffer);
      } else {
        throw new Error('Unsupported file type. Upload a .csv or .xlsx payroll file.');
      }

      setPayPeriod({ start: pp.start, end: pp.end });
      setParsed(parsedData);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to parse payroll file');
    }
  }

  async function recomputeAndMaybePromptRates({ ref, parsedData, adjustments }) {
    const indexes = buildIndexes(ref);
    const agg = computePayroll({ parsed: parsedData, indexes, commentAdjustments: adjustments });
    setPayrollAgg(agg);

    const missingForTherapist = agg.missingRates.filter(
      m => m.kind === 'RATE_MISSING' || m.kind === 'MILEAGE_RATE_MISSING'
    );

    if (missingForTherapist.length > 0) {
      setRateModalState({
        open: true,
        therapist: missingForTherapist[0].therapist,
        missingRates: missingForTherapist.filter(
          m => m.therapist.therapist_id === missingForTherapist[0].therapist.therapist_id
        )
      });
      return { agg, needsRates: true };
    }

    // If city mapping missing, show a helpful error for now.
    // (You can extend this to a UI that lets you map cities to areas.)
    const cityMissing = agg.missingRates.find(m => m.kind === 'CITY_NOT_MAPPED');
    if (cityMissing) {
      setCityModal({
        open: true,
        city: cityMissing.city
      });
      return { agg, needsCity: true };
    }

    const unknownVisitType = agg.missingRates.find(m => m.kind === 'VISIT_TYPE_UNKNOWN');
    if (unknownVisitType) {
      throw new Error(`Unknown visit group: "${unknownVisitType.visitGroup}". Add mapping in Payroll.jsx (normalizeVisitGroupToVisitCode).`);
    }

    const therapistNotFound = agg.missingRates.find(m => m.kind === 'THERAPIST_NOT_FOUND');

    if (therapistNotFound) {
      const raw = therapistNotFound.therapistName || '';
      let firstName = '';
      let lastName = '';

      if (raw.includes(',')) {
        // "Last, First"
        const [l, f] = raw.split(',').map(s => s.trim());
        firstName = f || '';
        lastName = l || '';
      } else {
        // "First Last"
        const parts = raw.split(' ');
        firstName = parts[0] || '';
        lastName = parts.slice(1).join(' ') || '';
      }

      setAddTherapistModal({
        open: true,
        firstName,
        lastName,
      });

      return { agg, needsTherapist: true };
    }

    await buildExcelInMemory({ agg });

    return { agg, needsRates: false };
  }

  async function buildExcelInMemory({ agg }) {
    const wb = await buildWorkbook({
      payPeriod,
      payrollAgg: agg,
    });

    const buffer = await wb.xlsx.writeBuffer();
    setExcelBuffer(buffer);
  }

  async function handleComputePayroll() {
    if (!parsed || !file) return;

    setLoading(true);
    setError(null);

    try {
      const ref = refData || (await loadReferenceData());
      setRefData(ref);

      const { agg, needsRates } = await recomputeAndMaybePromptRates({
        ref,
        parsedData: parsed,
        adjustments: commentAdjustments,
      });

      if (needsRates) return;

      const therapistAggs = Object.values(agg.byTherapistId);
      const hasComments = therapistAggs.some(t => (t.comment || '').trim());

      if (hasComments && !commentModalOpen && Object.keys(commentAdjustments).length === 0) {
        setCommentModalOpen(true);
        return;
      }

      // 🔑 Excel is already built inside recompute
    } catch (err) {
      setError(err.message || 'Failed to compute payroll');
    } finally {
      setLoading(false);
    }
  }

  function formatDateWithLeadingZeros(date) {
    const d = new Date(date);

    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();

    return `${mm}_${dd}_${yyyy}`;
  }

  function handleDownloadExcel() {
    if (!excelBuffer) return;

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // const namePart =
    //   payPeriod?.start && payPeriod?.end
    //     ? `${payPeriod.start}_${payPeriod.end}`
    //     : 'payroll';

    const formattedEndDate = formatDateWithLeadingZeros(payPeriod.end);

    saveAs(blob, `Payroll_${formattedEndDate}.xlsx`);
  }

  async function saveRatesForTherapist(draft) {
    // Convert draft into a list of upserts
    // draft key = "billing_area_id|visit_type_id".
    try {
      setLoading(true);
      setError(null);

      const therapist = rateModalState.therapist;
      if (!therapist) return;

      const upserts = [];
      if ('__mileage_rate' in draft) {
        const mileage = Number(draft.__mileage_rate);
        if (Number.isFinite(mileage)) {
          await apiPost(`/therapists/update_mileage`, {
            therapist_id: therapist.therapist_id,
            mileage_rate: mileage,
          });
        }
      }
      for (const [k, v] of Object.entries(draft)) {
        // 🚨 mileage is NOT a therapist_rate
        if (k === '__mileage_rate') continue;

        const rate = v === '' ? null : Number(v);
        if (rate == null || Number.isNaN(rate)) continue;

        const parts = k.split('|');
        if (parts.length !== 2) continue; // safety guard

        const billing_area_id = Number(parts[0]);
        const visit_type_id = Number(parts[1]);

        if (!Number.isFinite(billing_area_id) || !Number.isFinite(visit_type_id)) {
          continue;
        }

        upserts.push({
          therapist_id: therapist.therapist_id,
          billing_area_id,
          visit_type_id,
          rate,
        });
      }

      if (upserts.length === 0) {
        setRateModalState({ open: false, therapist: null });
        return;
      }

      // NOTE: You must implement this endpoint on the backend.
      // It should upsert into therapist_rates.
      await apiPost(`/therapist_rates/upsert_many`, { rows: upserts });

      // Reload rates and retry
      const newRef = { ...refData };
      const [therapistRates, therapists] = await Promise.all([
        apiGet(`/therapist_rates`),
        apiGet(`/therapists`),
      ]);

      newRef.therapistRates = therapistRates;
      newRef.therapists = therapists;
      setRefData(newRef);

      setRateModalState({ open: false, therapist: null });

      await recomputeAndMaybePromptRates({
        ref: newRef,
        parsedData: parsed,
        adjustments: commentAdjustments,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save rates');
    } finally {
      setLoading(false);
    }

    setRefData(null);
    setRateModalState({ open: false, therapist: null, missingRates: [] });
    await handleComputePayroll();
  }

  async function saveCityMapping(data) {
    try {
      setLoading(true);

      await apiPost(`/billing_cities`, data);

      // reload billing cities
      const billingCities = await apiGet(`/billing_cities`);

      const newRef = { ...refData, billingCities };
      setRefData(newRef);

      setCityModal({ open: false, city: null });

      // retry payroll generation automatically
      await recomputeAndMaybePromptRates({
        ref: newRef,
        parsedData: parsed,
        adjustments: commentAdjustments
      });
    } catch (err) {
      setError(err.message || 'Failed to save city mapping');
    } finally {
      setLoading(false);
    }
  }

  async function saveNewTherapist(data) {
    try {
      setLoading(true);

      await apiPost(`/therapists`, data);

      const therapists = await apiGet(`/therapists`);
      const newRef = { ...refData, therapists };
      setRefData(newRef);

      setAddTherapistModal({ open: false, firstName: '', lastName: '' });

      await recomputeAndMaybePromptRates({
        ref: newRef,
        parsedData: parsed,
        adjustments: commentAdjustments,
      });
    } catch (err) {
      setError(err.message || 'Failed to add therapist');
    } finally {
      setLoading(false);
    }
  }

  function therapistAggsForCommentModal() {
    if (!payrollAgg) return [];
    return sortTherapistsByFirstName(payrollAgg.byTherapistId);
  }

  return (
    <div className="max-w-fit min-w-full mx-auto p-8 bg-white shadow-xl rounded-lg border border-blue-100">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center tracking-wide pb-8 border-b-2">Payroll</h1>

      <TherapistRatesTable
        token={token}
        onRatesSaved={() => {
          setRefData(null);
        }}
      />

      <div className="bg-white rounded-xl shadow p-4 border mb-6 mt-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-base file:font-semibold
                  file:bg-sky-100 file:text-blue-900
                  hover:file:bg-sky-200 mb-6"
            />
            {file && (
              <div className="text-sm text-gray-700">
                <div className="font-semibold">Selected:</div>
                <div>{file.name}</div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCommentModalOpen(true)}
              disabled={!parsed || loading}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              title="Review comment adjustments"
            >
              Comments
            </button>

            <button
              onClick={handleComputePayroll}
              disabled={!parsed || loading}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Working…' : 'Compute Payroll'}
            </button>

            <button
              onClick={handleDownloadExcel}
              disabled={!excelBuffer}
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              Download Payroll Excel
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-700">
          {payPeriod?.start && payPeriod?.end ? (
            <div>
              <span className="font-semibold">Pay period:</span> {payPeriod.start} to {payPeriod.end}
            </div>
          ) : (
            <div className="text-gray-500">Pay period: </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded border border-red-200 bg-red-50 text-red-800">
          {error}
        </div>
      )}

      {payrollAgg && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4 border">
            <div className="font-semibold text-gray-900 mb-2">Totals</div>
            <div className="text-sm text-gray-700 space-y-1">
              <div><span className="font-semibold">Amount:</span> {money(payrollAgg.totals.amount)}</div>
              <div><span className="font-semibold">Visits:</span> {payrollAgg.totals.visits}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 border">
            <div className="font-semibold text-gray-900 mb-2">Missing data checks</div>
            {payrollAgg.missingRates.length === 0 ? (
              <div className="text-sm text-green-700">All required rates and mappings were found.</div>
            ) : (
              <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                {payrollAgg.missingRates.slice(0, 8).map((m, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{m.kind}:</span> {m.details}
                  </li>
                ))}
                {payrollAgg.missingRates.length > 8 && (
                  <li>…and {payrollAgg.missingRates.length - 8} more</li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}

      <RateModal
        open={rateModalState.open}
        onClose={() => setRateModalState({ open: false, therapist: null })}
        therapist={rateModalState.therapist}
        billingAreas={refData?.billingAreas || []}
        visitTypes={refData?.visitTypes || []}
        existingRates={existingRatesMap}
        missingRates={rateModalState.missingRates}
        onSave={saveRatesForTherapist}
      />

      <CommentAdjustmentsModal
        open={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        therapistAggs={therapistAggsForCommentModal()}
        therapistRates={refData?.therapistRates || []}
        billingAreas={refData?.billingAreas || []}
        visitTypes={refData?.visitTypes || []}
        onSave={async (draft) => {
          setCommentAdjustments(draft);
          setCommentModalOpen(false);

          if (refData && parsed) {
            await recomputeAndMaybePromptRates({
              ref: refData,
              parsedData: parsed,
              adjustments: draft,
            });
          }
        }}
      />

      <CityMappingModal
        open={cityModal.open}
        city={cityModal.city}
        billingAreas={refData?.billingAreas || []}
        onClose={() => setCityModal({ open: false, city: null })}
        onSave={saveCityMapping}
      />

      <AddTherapistModal
        open={addTherapistModal.open}
        initial={addTherapistModal}
        onClose={() => setAddTherapistModal({ open: false, firstName: '', lastName: '' })}
        onSave={saveNewTherapist}
      />

      {/* When comment modal closes after save, user can click Generate Excel again. */}
    </div>
  );
}
