// Parse Invoice With Roles

import Papa from 'papaparse';

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

      let cityMatch = citiesData.find(c => c.name?.toLowerCase().trim() === City?.toLowerCase().trim());
      let cityType = 'In Town';

      if (!cityMatch && City) {
        cityType = await promptForCityType(City);
        const newCity = { name: City, intown: false, oot: false, extended: false };
        if (cityType === 'In Town') newCity.intown = true;
        else if (cityType === 'Out of Town') newCity.oot = true;
        else if (cityType === 'Extended') newCity.extended = true;

        await fetch('http://localhost:5000/cities', {
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

  return { records: groupedData, matrix: matrixData, mileage: mileageData, summary: summaryTable, payPeriod, roles };
}