// Parse Invoice With Roles

import Papa from 'papaparse';
import ExcelJS from 'exceljs';

const API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : '';

const disciplineMap = {
  'PT': 'PT',
  'PTA': 'PT',
  'OT': 'OT',
  'COTA': 'OT',
  'ST': 'ST'
};

const agencyMap = {
  'LUB': 'Calvert-Lubbock',
  'LVL': 'Calvert-Levelland',
  'LAM': 'Calvert-Lamesa',
  'LIT': 'Calvert-Littlefield',
  '5LU': 'Calvert-Hospice',
  'PTB': 'Calvert-Petersburg',
  'CRS': 'Calvert-Crosbyton',
  'POS': 'Calvert-Post',
  'PLV': 'Calvert-Plainview',
  'VEN': 'Calvert-Ventura'
};

export async function parseCalvertCSV(fileBuffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(fileBuffer);
  const worksheet = workbook.worksheets[0];

  if (!worksheet) throw new Error("Excel file has no worksheets.");

  // Find header row and build header index
  let headerRow = worksheet.getRow(1);
  const headers = {};

  headerRow.eachCell((cell, colNumber) => {
    headers[cell.text.trim()] = colNumber;
  });

  const requiredHeaders = [
    'Primary Job Desc',
    'Client Branch',
    'Client Name',
    'Service Date',
    'Rate',
    'Travel- AM'
  ];

  for (let field of requiredHeaders) {
    if (!headers[field]) {
      throw new Error(`Missing column: ${field}`);
    }
  }

  const data = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    try {
      const jobDesc = row.getCell(headers['Primary Job Desc'])?.text?.trim();
      const branch = row.getCell(headers['Client Branch'])?.text?.trim();
      const name = row.getCell(headers['Client Name'])?.text?.trim();
      const date = row.getCell(headers['Service Date'])?.text?.trim();
      const rate = parseFloat(row.getCell(headers['Rate'])?.value) || 0;
      const miles = parseFloat(row.getCell(headers['Travel- AM'])?.value) || 0;

      if (!jobDesc || !branch || !name || !date) return;

      const Disc = disciplineMap[jobDesc.toUpperCase()] || jobDesc;
      const Agency = agencyMap[branch.toUpperCase()] || branch;

      data.push({ Disc, Agency, Name: name, Date: date, Rate: rate, miles });
    } catch (err) {
      console.warn(`Skipping row ${rowNumber}:`, err.message);
    }
  });

  data.sort((a, b) => {
    const agencyCompare = a.Agency.toLowerCase().localeCompare(b.Agency.toLowerCase());
    if (agencyCompare !== 0) return agencyCompare;
    return a.Name.toLowerCase().localeCompare(b.Name.toLowerCase());
  });

  return data;
}

export async function parseInvoiceCSV(csvText, citiesData, agencyData, promptForCityType) {
  const groupedData = {};
  const matrixData = {};
  const mileageData = {};
  const summaryTable = {};
  const roles = {};
  let currentAgency = null;
  let currentHeaders = [];
  let skipUntilNextAgency = false;
  let allDates = [];

  const lines = csvText.split(/\r?\n/);

  for (let line of lines) {
    const trimmed = line.trim();
    const agencyMatch = trimmed.match(/^(.+?)\s+\((\d{1,2}\/\d{1,2}\/\d{4})/);
    if (agencyMatch) {
      currentAgency = agencyMatch[1].trim();
      if (!groupedData[currentAgency]) groupedData[currentAgency] = [];
      if (!matrixData[currentAgency]) matrixData[currentAgency] = {};
      if (!mileageData[currentAgency]) mileageData[currentAgency] = {};
      if (!summaryTable[currentAgency]) summaryTable[currentAgency] = {};
      if (!roles[currentAgency]) roles[currentAgency] = { PT: 0, OT: 0, ST: 0, PTA: 0, OTA: 0 };
      currentHeaders = [];
      skipUntilNextAgency = false;
      continue;
    }

    if (skipUntilNextAgency) continue;

    if (trimmed.toLowerCase().startsWith('patient')) {
      currentHeaders = Papa.parse(trimmed).data[0];
      continue;
    }

    if (!currentAgency) continue;

    if (!trimmed) {
      skipUntilNextAgency = true;
      continue;
    }

    const parsed = Papa.parse(trimmed).data[0];
    const hasTotal = parsed.some(field => typeof field === 'string' && field.toLowerCase().includes('total'));
    if (hasTotal) continue;

    if (currentHeaders.length && parsed.length === currentHeaders.length) {
      const record = Object.fromEntries(parsed.map((value, idx) => [currentHeaders[idx], value]));

      const role = (record['Role'] ?? '').trim().toUpperCase().replace(/\s+/g, '');
      if (!roles[currentAgency]) roles[currentAgency] = { PT: 0, OT: 0, ST: 0, PTA: 0, OTA: 0 };
      if (['PT', 'OT', 'ST', 'PTA', 'OTA'].includes(role)) {
          roles[currentAgency][role]++;
      }

      const { Disc, Miles, City, 'Visit Group': visitGroup } = record;
      const patient = record['Patient'] || 'Unknown';
      const date = record['Date of Service'] || record['Date'] || 'Unknown';
      allDates.push(date);
      const miles = parseFloat(Miles) || 0;
      const discKey = Disc?.trim().toUpperCase();
      let groupKey = visitGroup?.replace(/[-\s]/g, '_');
      if (groupKey?.toUpperCase() === 'DISCHARGE') groupKey = 'DC';

      console.log("citiesData:", citiesData, Array.isArray(citiesData));
      let cityMatch = citiesData.find(c => c.name?.toLowerCase().trim() === City?.toLowerCase().trim());
      let cityType = 'In Town';

      if (!cityMatch && City) {
        cityType = await promptForCityType(City);
        const newCity = { name: City, intown: false, oot: false, extended: false };
        if (cityType === 'In Town') newCity.intown = true;
        else if (cityType === 'Out of Town') newCity.oot = true;
        else if (cityType === 'Extended') newCity.extended = true;

        await fetch(`${API_BASE}/cities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCity)
        });

        citiesData.push(newCity);
      } else {
        if (cityMatch?.extended === true || cityMatch?.extended === 't') cityType = 'Extended';
        else if (cityMatch?.outtown === true || cityMatch?.outtown === 't') cityType = 'Out of Town';
      }

      const agency = agencyData.find(a => a.computer?.toLowerCase() === currentAgency?.toLowerCase());
      let baseRate = 0;
      let cityAdj = 0;
      let totalRate = 0;

      if (agency) {
        const rateKey = `${discKey}${groupKey}`;
        baseRate = parseFloat(agency[rateKey.toLowerCase()]) || 0;

        if (cityType.toLowerCase() === 'extended' && agency.extended != null) cityAdj = parseFloat(agency.extended);
        else if (cityType.toLowerCase() === 'out of town' && agency.oot != null) cityAdj = parseFloat(agency.oot);

        const mileageRate = parseFloat(agency.mileage) || 0;
        totalRate = baseRate + cityAdj + miles * mileageRate;

        record['City Type'] = cityType;
        record['Base Rate'] = baseRate;
        record['City Adj'] = cityAdj;
        record['Mileage Rate'] = mileageRate;
        record['Total Cost'] = totalRate.toFixed(2);
        
      } else {
        record['Error'] = 'Agency not found';
      }

      groupedData[currentAgency].push(record);

      const matrixKey = `${patient}__${discKey}`;
      if (!matrixData[currentAgency][matrixKey]) matrixData[currentAgency][matrixKey] = {};
      if (!mileageData[currentAgency][matrixKey]) mileageData[currentAgency][matrixKey] = 0;
      mileageData[currentAgency][matrixKey] += miles;

      const visitCode = (() => {
        const key = groupKey?.toUpperCase();
        if (key === 'EVAL') return 'EVAL';
        if (key === 'RE_EVAL' || key === 'RE-EVAL') return 'RE-EVAL';
        if (key === 'DC') return 'DISCHARGE';
        return 'VISIT';
      })();

      const extendedRate = parseFloat(agency?.extended ?? 0);
      const ootRate = parseFloat(agency?.oot ?? 0);

      let prefix = null;
      if (cityType.toLowerCase() === 'extended' && extendedRate > 0) {
          prefix = 'x';
      } else if (cityType.toLowerCase() === 'out of town' && ootRate > 0) {
          prefix = 'o';
      }

      // console.log(`City: ${City}, Matched: ${cityMatch?.name}, OOT: ${cityMatch?.outtown}, Extended: ${cityMatch?.extended}`);
      // console.log(`Agency: ${agency?.computer}, OOT Rate: ${agency?.oot}, CityType: ${cityType}`);

      const visitTypes = [visitCode];
      if (prefix) visitTypes.push(prefix);

      visitTypes.forEach(type => {
        if (!summaryTable[currentAgency][type]) summaryTable[currentAgency][type] = {};
        if (!summaryTable[currentAgency][type][discKey]) {
          summaryTable[currentAgency][type][discKey] = { count: 0, rate: 0 };
        }
        summaryTable[currentAgency][type][discKey].count++;
        summaryTable[currentAgency][type][discKey].rate = baseRate;
      });

      matrixData[currentAgency][matrixKey][date] = `${prefix ?? ''}${visitCode[0]}`;
    }
  }

  const payPeriod = {
    start: allDates.length ? new Date(Math.min(...allDates.map(d => new Date(d)))).toLocaleDateString() : '',
    end: allDates.length ? new Date(Math.max(...allDates.map(d => new Date(d)))).toLocaleDateString() : ''
  };

  // Remove agencies with no visits
  for (const agency of Object.keys(groupedData)) {
    if (groupedData[agency].length === 0) {
      delete groupedData[agency];
      delete matrixData[agency];
      delete mileageData[agency];
      delete summaryTable[agency];
      delete roles[agency];
    }
  }

  return { records: groupedData, matrix: matrixData, mileage: mileageData, summary: summaryTable, payPeriod, roles };
}