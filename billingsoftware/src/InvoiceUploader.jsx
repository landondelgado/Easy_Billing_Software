// InvoiceUploader.jsx
import React, { useState } from 'react';
import { parseInvoiceCSV, parseCalvertCSV } from './parseInvoiceData';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

const API_BASE = //connect frontend to backend
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : '';

const InvoiceUploader = () => {
  const [parsedData, setParsedData] = useState(null);
  const [pendingCity, setPendingCity] = useState(null);
  const [cityPromptResolve, setCityPromptResolve] = useState(null);
  const [step, setStep] = useState(1);
  const [calvertData, setCalvertData] = useState(null);
  const [showBillingPrompt, setShowBillingPrompt] = useState(false);
  const [isBilling, setIsBilling] = useState(null);
  
  function columnLetterToNumber(letter) {
      let col = 0;
      for (let i = 0; i < letter.length; i++) {
          col *= 26;
          col += letter.charCodeAt(i) - 64;  // 'A' = 65
      }
      return col;
  }

  function parseRange(range) {
      const [startCell, endCell] = range.split(':');
      const matchStart = startCell.match(/([A-Z]+)([0-9]+)/);
      const matchEnd = endCell.match(/([A-Z]+)([0-9]+)/);

      return {
          startRow: parseInt(matchStart[2], 10),
          endRow: parseInt(matchEnd[2], 10),
          startCol: columnLetterToNumber(matchStart[1]),
          endCol: columnLetterToNumber(matchEnd[1])
      };
  }

  function applyOutsideAndInsideBorders(worksheet, range) {
      const { startRow, endRow, startCol, endCol } = parseRange(range);

      for (let row = startRow; row <= endRow; row++) {
          for (let col = startCol; col <= endCol; col++) {
              const cell = worksheet.getCell(row, col);

              const border = {
                  top: { style: (row === startRow) ? 'medium' : 'thin' },
                  bottom: { style: (row === endRow) ? 'medium' : 'thin' },
                  left: { style: (col === startCol) ? 'medium' : 'thin' },
                  right: { style: (col === endCol) ? 'medium' : 'thin' }
              };

              cell.border = border;
          }
      }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (step === 1) {
      setShowBillingPrompt(true);
      // Step 1: Upload CSV
      const [citiesRes, agencyRes] = await Promise.all([
        fetch(`${API_BASE}/cities`),
        fetch(`${API_BASE}/agencydata`)
      ]);

      const citiesData = await citiesRes.json();
      const agencyData = await agencyRes.json();

      const reader = new FileReader();
      reader.onload = async (event) => {
        const csvText = event.target.result;
        const result = await parseInvoiceCSV(csvText, citiesData, agencyData, async (city) => {
          return new Promise((resolve) => {
            setPendingCity(city);
            setCityPromptResolve(() => resolve);
          });
        });

        const flattened = Object.entries(result.records).flatMap(([agency, records]) =>
          records.map((record) => ({ ...record, Agency: agency }))
        );

        setParsedData({ ...result, flattened, agencyData });
        setStep(2); // Move to next step
      };

      reader.readAsText(file);
    } else if (step === 2) {
      // Step 2: Upload Calvert file
      const buffer = await file.arrayBuffer();
      const calvertParsed = await parseCalvertCSV(buffer);
      setCalvertData(calvertParsed);
      setStep(3); // Done
    }
  };

  const handleCityTypeSelection = (type) => {
    if (cityPromptResolve) {
      cityPromptResolve(type);
      setPendingCity(null);
      setCityPromptResolve(null);
    }
  };

  const assignInvoiceNumbers = async () => {
    if (!isBilling) {
      // Return dummy values if billing is not being done
      const agencies = Object.keys(parsedData.matrix || parsedData.summary || {});
      const dummyMap = {};
      let dummyInvoice = 999999; // some placeholder number

      for (const agency of agencies) {
        dummyMap[agency] = dummyInvoice++;
      }

      return dummyMap;
    }

    // Billing is true — proceed with real database access
    const res = await fetch(`${API_BASE}/invoicenumber`);
    const json = await res.json();
    const { invoiceNumber: currentInvoiceRaw } = json;

    let currentInvoice = Number(currentInvoiceRaw);
    if (isNaN(currentInvoice)) {
      console.error('Fetched invoice number is not a valid number:', currentInvoiceRaw);
      return null;
    }

    const agencies = Object.keys(parsedData.matrix || parsedData.summary || {});
    const map = {};

    for (const agency of agencies) {
      map[agency] = currentInvoice++;
    }

    await fetch(`${API_BASE}/invoicenumber`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceNumber: currentInvoice })
    });

    return map;
  };

  const handleSummaryDownload = async (map) => {
    if (!parsedData) return;

    const summary = parsedData.flattened.reduce((acc, row) => {
      const agency = row.Agency;
      const patient = row['Patient'];
      const disc = row['Disc'];
      const cost = parseFloat(row['Total Cost'] || 0);

      if (!acc[agency]) acc[agency] = {
        Agency: agency,
        Visits: 0,
        Amount: 0,
        uPatients: new Set(),
        mPatients: new Set()
      };

      acc[agency].Visits++;
      acc[agency].Amount += cost;
      acc[agency].uPatients.add(patient);
      acc[agency].mPatients.add(`${patient}__${disc}`);

      return acc;
    }, {});

    const summaryArray = Object.values(summary).map(({ Agency, Visits, Amount, uPatients, mPatients }) => ({
      Agency,
      Visits,
      Amount: parseFloat(Amount.toFixed(2)),
      Upats: uPatients.size,
      Mpats: mPatients.size
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invoice Summary');

    const period = parsedData?.payPeriod ? `Billing Period ${parsedData.payPeriod.start} to ${parsedData.payPeriod.end}` : 'Billing Period';
    worksheet.addRow([period]);
    worksheet.mergeCells('A1:E1');
    worksheet.getRow(1).alignment = { horizontal: 'left' };

    worksheet.addRow([]);
    worksheet.addRow(['', 'Receivable', 'Amount', 'Visits', 'Upats', 'Mpats']);

    const totalAmount = summaryArray.reduce((acc, r) => acc + r.Amount, 0);
    const totalVisits = summaryArray.reduce((acc, r) => acc + r.Visits, 0);
    const totalUpats = summaryArray.reduce((acc, r) => acc + r.Upats, 0);
    const totalMpats = summaryArray.reduce((acc, r) => acc + r.Mpats, 0);

    worksheet.addRow(['', 'Total', totalAmount, totalVisits, totalUpats, totalMpats]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow(['Agency','', 'Amount', 'Visits', 'Upats', 'Mpats']);
    worksheet.mergeCells('A8:B8');

    const agencyStartRow = worksheet.lastRow.number + 1;

    summaryArray.forEach(({ Agency, Amount, Visits, Upats, Mpats }) => {
      worksheet.addRow([map?.[Agency] ?? '',Agency, Amount, Visits, Upats, Mpats]);
    });

    const agencyEndRow = worksheet.lastRow.number;

    worksheet.columns.forEach((col, idx) => {
      col.width = [15, 40, 15, 10, 10, 10][idx] || 15;
    });

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      row.height = 12.75;
      row.eachCell((cell, colNumber) => {
        const isDollar = colNumber === 3 && typeof cell.value === 'number';
        const baseBorder = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };

        // Apply medium border to the outer edge of the agency section
        if ((rowNumber >= agencyStartRow && rowNumber <= agencyEndRow) || (rowNumber === agencyStartRow-1)) {
          if (rowNumber === agencyStartRow || rowNumber === agencyStartRow-1) baseBorder.top = { style: 'medium' };
          if (rowNumber === agencyEndRow || rowNumber === agencyStartRow-1) baseBorder.bottom = { style: 'medium' };
          if (colNumber === 1) baseBorder.left = { style: 'medium' }; 
          if (colNumber ===2 ) baseBorder.right = {style: 'medium'};
          if (colNumber === 6) baseBorder.right = { style: 'medium' };
          if ((colNumber === 3 && rowNumber === 1) || (colNumber === 4 && rowNumber === 1)) cell.border = {};
        }

        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { name: 'Arial', size: 10 };
        cell.border = baseBorder;
        if (isDollar) cell.numFmt = '$#,##0.00';
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'AgencySummary.xlsx');
  };

  const handleMatrixDownload = async (map) => {
    if (!parsedData?.matrix) return;

    const loadHeaderImageBase64 = async () => {
        const response = await fetch('/ReboundRehabHeader.png');
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const workbook = new ExcelJS.Workbook();
    const imageBase64 = await loadHeaderImageBase64();
    const imageId = workbook.addImage({ base64: imageBase64, extension: 'png' });

    for (const [agency, records] of Object.entries(parsedData.matrix)) {
        const worksheet = workbook.addWorksheet(agency.substring(0, 31));
        worksheet.pageSetup = {
            orientation: 'landscape',
            margins: { left: 0.25, right: 0.15, top: 0.17, bottom: 0.2, header: 0.5, footer: 0.5 }
        };

        const minDate = new Date(parsedData.payPeriod.start);
        const maxDate = new Date(parsedData.payPeriod.end);

        const sortedDates = [];
        let current = new Date(minDate);
        while (current <= maxDate) {
            const yyyy = current.getFullYear();
            const mm = String(current.getMonth() + 1).padStart(2, '0');
            const dd = String(current.getDate()).padStart(2, '0');
            sortedDates.push(`${yyyy}-${mm}-${dd}`);
            current.setDate(current.getDate() + 1);
        }

        const getDiscOrder = (disc) => (disc === 'PT' ? 1 : disc === 'OT' ? 2 : disc === 'ST' ? 3 : 4);
        const sortedKeys = Object.keys(records).sort((a, b) => {
            const [pa, da] = a.split('__');
            const [pb, db] = b.split('__');
            return getDiscOrder(da) - getDiscOrder(db) || pa.localeCompare(pb);
        });

        const pageSize = 38;
        const numPages = Math.ceil(sortedKeys.length / pageSize) || 1;
        let headerRow = null;
        const headerRows = [];

        for (let page = 0; page < numPages; page++) {
            let rowPointer = 49*page + 1;
            worksheet.addImage(imageId, { tl: { col: 0, row: rowPointer - 1 }, ext: { width: 440, height: 85 } });
            rowPointer++;

            worksheet.getCell(`M${rowPointer}`).value = `Agency:`;
            worksheet.getCell(`N${rowPointer}`).value = `${agency}`;
            worksheet.getCell(`M${rowPointer}`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };
            worksheet.getCell(`N${rowPointer}`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };
            worksheet.getCell(`M${rowPointer}`).alignment = { vertical: 'middle', horizontal: 'right' };
            worksheet.getCell(`N${rowPointer}`).alignment = { vertical: 'middle', horizontal: 'left' };
            rowPointer++;

            const billingPeriod = parsedData?.payPeriod ? `${parsedData.payPeriod.start} to ${parsedData.payPeriod.end}` : 'N/A';
            worksheet.getCell(`M${rowPointer}`).value = `Billing Period:`;
            worksheet.getCell(`N${rowPointer}`).value = billingPeriod;
            worksheet.getCell(`M${rowPointer}`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };
            worksheet.getCell(`N${rowPointer}`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };
            worksheet.getCell(`M${rowPointer}`).alignment = { vertical: 'middle', horizontal: 'right' };
            worksheet.getCell(`N${rowPointer}`).alignment = { vertical: 'middle', horizontal: 'left' };
            rowPointer++;

            worksheet.getCell(`M${rowPointer}`).value = `Invoice:`;
            worksheet.getCell(`N${rowPointer}`).value = `${map[agency]}`;
            worksheet.getCell(`M${rowPointer}`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };
            worksheet.getCell(`N${rowPointer}`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };
            worksheet.getCell(`M${rowPointer}`).alignment = { vertical: 'middle', horizontal: 'right' };
            worksheet.getCell(`N${rowPointer}`).alignment = { vertical: 'middle', horizontal: 'left' };
            rowPointer += 2;

            worksheet.addRow([]);
            worksheet.addRow(['Name', 'Disc', 'Mileage', ...sortedDates.map(d => {
                const date = new Date(d);
                return `${date.getMonth() + 1}/${date.getDate() + 1}`;
            })]);

            worksheet.mergeCells(`A${rowPointer}:B${rowPointer}`);
            headerRow = rowPointer++;
            headerRows.push(headerRow);

            const pageKeys = sortedKeys.slice(page * pageSize, (page + 1) * pageSize);
            pageKeys.forEach(key => {
                const [patient, disc] = key.split('__');
                const dateMap = records[key];
                const mileage = parsedData.mileage?.[agency]?.[key] ?? 0;
                worksheet.addRow([
                    patient,
                    disc,
                    mileage,
                    ...sortedDates.map(d => {
                        const keys = Object.keys(dateMap);
                        const match = keys.find(k => {
                            const date = new Date(k);
                            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` === d;
                        });
                        return match ? dateMap[match] : '';
                    })
                ]);
            });

            const filledRows = pageKeys.length;
            for (let i = 0; i < pageSize - filledRows; i++) {
                worksheet.addRow(['', '', '', ...Array(sortedDates.length).fill('')]);
            }

            if (page < numPages - 1) rowPointer += pageSize + 5;

            if (page === numPages - 1) {
              rowPointer += pageSize + 1;
              const roleCounts = parsedData.roles?.[agency] ?? {};
              const summaryCounts = parsedData.summary?.[agency] ?? {};

              worksheet.getCell(`I${rowPointer}`).value = '';
              worksheet.getCell(`J${rowPointer}`).value = 'E';
              worksheet.getCell(`K${rowPointer}`).value = 'R';
              worksheet.getCell(`L${rowPointer}`).value = 'D';
              worksheet.getCell(`M${rowPointer}`).value = 'V';
              worksheet.getCell(`N${rowPointer}`).value = 'X';
              worksheet.getCell(`O${rowPointer}`).value = 'OOT';

              const disciplines = ['PT', 'OT', 'ST'];
              const summaryTypes = {
                  E: 'EVAL',
                  R: 'RE-EVAL',
                  D: 'DISCHARGE',
                  V: 'VISIT',
                  X: 'x',
                  OOT: 'o'
              };

              disciplines.forEach((disc, i) => {
                  rowPointer++;

                  worksheet.getCell(`I${rowPointer}`).value = disc;
                  Object.entries(summaryTypes).forEach(([colLetter, type], index) => {
                      const count = summaryCounts?.[type]?.[disc]?.count ?? 0;
                      // J=10, K=11,... O=15
                      worksheet.getCell(`${String.fromCharCode(74 + index)}${rowPointer}`).value = count;
                  });

                  // Only on first row add role counts (for PT, OT, ST in your original code)
                  if (i === 0) {
                      worksheet.getCell(`B${rowPointer}`).value = 'PT';
                      worksheet.getCell(`C${rowPointer}`).value = roleCounts.PT;
                      worksheet.getCell(`D${rowPointer}`).value = 'OT';
                      worksheet.getCell(`E${rowPointer}`).value = roleCounts.OT;
                      worksheet.getCell(`F${rowPointer}`).value = 'ST';
                      worksheet.getCell(`G${rowPointer}`).value = roleCounts.ST;
                  }
              });

              // Last row for PTA + OTA (unchanged)
              rowPointer--;
              worksheet.getCell(`B${rowPointer}`).value = 'PTA';
              worksheet.getCell(`C${rowPointer}`).value = roleCounts.PTA;
              worksheet.getCell(`D${rowPointer}`).value = 'OTA';
              worksheet.getCell(`E${rowPointer}`).value = roleCounts.OTA;
              worksheet.getCell(`F${rowPointer}`).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' }};
              worksheet.getCell(`G${rowPointer}`).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' }};
          }

            const sumCell = worksheet.getCell(headerRow + 39, 3);
            sumCell.value = { formula: `SUM(C${headerRow + 1}:C${headerRow + 38})` };
        }

        worksheet.columns = [
            { width: 25 },
            { width: 4 },
            { width: 9 },
            ...Array(sortedDates.length).fill({ width: 5.5 })
        ];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          row.height = 12;

          row.eachCell((cell, colNumber) => {
            if(!cell.font){
              cell.font = { name: 'Arial', size: 10 };
            }
            if(!cell.alignment){
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
            }
            
            if(row.number >= 6 && !headerRows.includes(row.number+2) && !headerRows.includes(row.number+3) && !headerRows.includes(row.number+4)){
              cell.border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' }
              };
            }

            // Main Table Formatting
            if (headerRows.includes(row.number)) 
              { 
                cell.border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'thin'}, right: {style: 'thin'} };
                cell.font = { name: 'Arial', size: 10, bold: true };
              }
            if (headerRows.includes(row.number-38))
              { cell.border = { top: {style: 'thin'}, bottom: {style: 'medium'}, left: {style: 'thin'}, right: {style: 'thin'} }; }
            if (colNumber === 1 || colNumber === 2 || colNumber === 3) 
              { cell.border = { top: {style: 'thin'}, bottom: {style: 'thin'}, left: {style: 'medium'}, right: {style: 'medium'} }; }
            if (colNumber === sortedDates.length+3) 
              { cell.border = { top: {style: 'thin'}, bottom: {style: 'thin'}, left: {style: 'thin'}, right: {style: 'medium'} }; }
            if ((colNumber === 1 && headerRows.includes(row.number)) || (colNumber === 2 && headerRows.includes(row.number)))
              { cell.border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} }; }
            if ((colNumber === sortedDates.length+3 && headerRows.includes(row.number)))
              { cell.border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'thin'}, right: {style: 'medium'} }; }
            if(colNumber === 1 && headerRows.includes(row.number-38))
              { cell.border = { top: {style: 'thin'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'thin'} }; }
            if(colNumber === sortedDates.length+3 && headerRows.includes(row.number-38))
              { cell.border = { top: {style: 'thin'}, bottom: {style: 'medium'}, left: {style: 'thin'}, right: {style: 'medium'} }; }
            if(colNumber === 2 && headerRows.includes(row.number-38))
              { cell.border = { top: {style: 'thin'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} }; }
            if(colNumber === 3 && headerRows.includes(row.number-39))
              { cell.border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} }; }
            if (colNumber === 3 && headerRows.includes(row.number))
              { cell.border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} }; }
            if (colNumber >= 4 && cell.value instanceof Date) {
              cell.numFmt = 'M/D';
            }
            // Role Table Formatting
            if (headerRows.includes(row.number-41) && colNumber < 8)
              { cell.border = { top: {style: 'medium'}, bottom: {style: 'thin'}, left: {style: 'thin'}, right: {style: 'thin'} }; }
            if (headerRows.includes(row.number-42) && colNumber < 8)
              { cell.border = { top: {style: 'thin'}, bottom: {style: 'medium'}, left: {style: 'thin'}, right: {style: 'thin'} }; }
            if ((colNumber === 2 || colNumber === 4 || colNumber === 6) && headerRows.includes(row.number-41))
              { cell.border = { top: {style: 'medium'}, bottom: {style: 'thin'}, left: {style: 'medium'}, right: {style: 'thin'} }; }
            if ((colNumber === 7) && headerRows.includes(row.number-41))
              { cell.border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'thin'}, right: {style: 'medium'} }; }
            if ((colNumber === 6) && headerRows.includes(row.number-41))
              { cell.border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'thin'} }; }
            if ((colNumber === 2 || colNumber === 4) && headerRows.includes(row.number-42))
              { cell.border = { top: {style: 'thin'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'thin'} }; }
            if ((colNumber === 5) && headerRows.includes(row.number-42))
              { cell.border = { top: {style: 'thin'}, bottom: {style: 'medium'}, left: {style: 'thin'}, right: {style: 'medium'} }; }
            
            // Discipline Table Formatting
            if (headerRows.includes(row.number-40) && colNumber > 8)
              { cell.border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'thin'}, right: {style: 'thin'} }; }
            if (headerRows.includes(row.number-43) && colNumber > 8)
              { cell.border = { top: {style: 'thin'}, bottom: {style: 'medium'}, left: {style: 'thin'}, right: {style: 'thin'} }; }
            if (colNumber === 9 && (headerRows.includes(row.number-41) || headerRows.includes(row.number-42)))
              {cell.border = { top: {style: 'thin'}, bottom: {style: 'thin'}, left: {style: 'medium'}, right: {style: 'medium'} };}
            if (colNumber === 15 && (headerRows.includes(row.number-41) || headerRows.includes(row.number-42)))
              {cell.border = { top: {style: 'thin'}, bottom: {style: 'thin'}, left: {style: 'thin'}, right: {style: 'medium'} };}
            if (colNumber === 9 && (headerRows.includes(row.number-40)))
              {cell.border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} };}
            if (colNumber === 9 && (headerRows.includes(row.number-43)))
              {cell.border = { top: {style: 'thin'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} };}
            if (colNumber === 15 && (headerRows.includes(row.number-40)))
              {cell.border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'thin'}, right: {style: 'medium'} };}
            if (colNumber === 15 && (headerRows.includes(row.number-43)))
              {cell.border = { top: {style: 'thin'}, bottom: {style: 'medium'}, left: {style: 'thin'}, right: {style: 'medium'} };}
          });
        });
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'AgencyDetail.xlsx');
  };


  const handleSummaryBreakdownDownload = async (map) => {
      if (!parsedData?.summary) return;

      const loadHeaderImageBase64 = async () => {
          const response = await fetch('/ReboundRehabHeaderCropped.png');
          const blob = await response.blob();

          return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result.split(',')[1]);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
          });
      };

      const workbook = new ExcelJS.Workbook();
      const imageBase64 = await loadHeaderImageBase64();
      const imageId = workbook.addImage({ base64: imageBase64, extension: 'png' });

      Object.entries(parsedData.summary).forEach(([agency, breakdown]) => {
          const agencyInfo = parsedData.agencyData.find(a => a.computer?.toLowerCase() === agency.toLowerCase());
          const worksheet = workbook.addWorksheet(agency.substring(0, 31));
          worksheet.properties.defaultRowHeight = 12;
          worksheet.pageSetup = {
              orientation: 'portrait',
              margins: { left: 0.17, right: 0.2, top: 0.17, bottom: 0.18, header: 0.17, footer: 0.18 }
          };

          worksheet.addImage(imageId, { tl: { col: 0, row: 2 }, ext: { width: 330, height: 100 } });

          worksheet.columns = [
              { width: 9.5 },
              { width: 9 },
              { width: 10 },
              { width: 11 },
              { width: 8.5 },
              { width: 6.5 },
              { width: 10 },
              { width: 9 },
              { width: 12 },
              { width: 16 }
          ];

          worksheet.getCell('H8').value = `Date: `;
          worksheet.getCell('I8').value = `${new Date().toLocaleDateString()}`;
          worksheet.getCell(`H8`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };
          worksheet.getCell(`I8`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };
          worksheet.getCell(`H8`).alignment = { vertical: 'middle', horizontal: 'right' };
          worksheet.getCell(`I8`).alignment = { vertical: 'middle', horizontal: 'left' };

          worksheet.getCell('H13').value = `Billing Period: `;
          worksheet.getCell('I13').value = `${parsedData.payPeriod.start} to ${parsedData.payPeriod.end}`;
          worksheet.getCell(`H13`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };
          worksheet.getCell(`I13`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };
          worksheet.getCell(`H13`).alignment = { vertical: 'middle', horizontal: 'right' };
          worksheet.getCell(`I13`).alignment = { vertical: 'middle', horizontal: 'left' };

          worksheet.getCell('H14').value = `Invoice: `;
          worksheet.getCell('I14').value = `${map[agency]}`;
          worksheet.getCell(`H14`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };
          worksheet.getCell(`I14`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };
          worksheet.getCell(`H14`).alignment = { vertical: 'middle', horizontal: 'right' };
          worksheet.getCell(`I14`).alignment = { vertical: 'middle', horizontal: 'left' };

          worksheet.getCell('H15').value = `Net due in (days): `;
          worksheet.getCell('I15').value = `30`;
          worksheet.getCell(`H15`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };
          worksheet.getCell(`I15`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };
          worksheet.getCell(`H15`).alignment = { vertical: 'middle', horizontal: 'right' };
          worksheet.getCell(`I15`).alignment = { vertical: 'middle', horizontal: 'left' };

          worksheet.getCell('B13').value = agencyInfo?.name ?? agency;
          worksheet.getCell(`B13`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };

          worksheet.getCell('B14').value = agencyInfo?.attention;
          worksheet.getCell(`B14`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };

          worksheet.getCell('B15').value = agencyInfo?.address ?? '';
          worksheet.getCell(`B15`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };

          worksheet.getCell('B16').value = agencyInfo?.city__state__zip_code ?? '';
          worksheet.getCell(`B16`).font = { size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };

          worksheet.getCell('B19').value = agencyInfo?.computer ?? agency;
          worksheet.getCell(`B19`).font = { bold: true, size: 10, name: 'Arial', color: { argb: 'FF002D6A' } };

          let startRow = 22;
          worksheet.mergeCells(`A${startRow}:J${startRow}`);
          worksheet.getCell(`A${startRow}`).value = `Current Pay Period    ${parsedData.payPeriod.start} to ${parsedData.payPeriod.end}`;
          worksheet.getCell(`A${startRow}`).font = { bold: true, color: { argb: 'FFFF0000'} };
          worksheet.getCell(`A${startRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
          worksheet.getCell(`A${startRow}`).border = 
            { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} };

          worksheet.getRow(startRow + 1).values = [
            'Type','PT','','','OT','','','ST'
          ];
          
          worksheet.mergeCells(`B${startRow + 1}:D${startRow + 1}`);
          worksheet.mergeCells(`E${startRow + 1}:G${startRow + 1}`);
          worksheet.mergeCells(`H${startRow + 1}:J${startRow + 1}`);
          worksheet.getCell(`B${startRow + 1}`).alignment = { horizontal: 'center'};
          worksheet.getCell(`E${startRow + 1}`).alignment = { horizontal: 'center'};
          worksheet.getCell(`H${startRow + 1}`).alignment = { horizontal: 'center'};
          worksheet.getCell(`A${startRow + 1}`).border = 
            { top: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} };
          worksheet.getCell(`B${startRow + 1}`).border = 
            { top: {style: 'medium'}, bottom: {style: 'thin'}, left: {style: 'medium'}, right: {style: 'medium'} };
          worksheet.getCell(`E${startRow + 1}`).border = 
            { top: {style: 'medium'}, bottom: {style: 'thin'}, left: {style: 'medium'}, right: {style: 'medium'} };
          worksheet.getCell(`H${startRow + 1}`).border = 
            { top: {style: 'medium'}, bottom: {style: 'thin'}, left: {style: 'medium'}, right: {style: 'medium'} };
          
          worksheet.getRow(startRow + 2).values = [
              '', 'Number', 'Rate', 'Total', 'Number', 'Rate', 'Total', 'Number', 'Rate', 'Total'
          ];
          worksheet.getRow(startRow + 2).font = { bold: true };
          worksheet.getRow(startRow + 2).alignment = { horizontal: 'center' };

          worksheet.getCell(`A${startRow + 2}`).border = 
            { bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} };

          const visitTypes = [
                                { key: 'EVAL', label: 'Eval' },
                                { key: 'RE-EVAL', label: 'Re-Eval' },
                                { key: 'DISCHARGE', label: 'Discharge' },
                                { key: 'VISIT', label: 'Visit' }
                            ];
          visitTypes.forEach((type, i) => {
              const row = worksheet.getRow(startRow + 3 + i);
              row.getCell(1).value = type.label;
              ['PT', 'OT', 'ST'].forEach((disc, j) => {
                  const record = breakdown[type.key]?.[disc];
                  if (record) {
                      row.getCell(2 + j * 3).value = record.count;
                      row.getCell(2 + j * 3).alignment = { horizontal: 'center' };
                      row.getCell(2 + j * 3).font = { color: { argb: 'FFFF0000'} };

                      row.getCell(3 + j * 3).value = record.rate;
                      row.getCell(3 + j * 3).alignment = { horizontal: 'center' };
                      row.getCell(3 + j * 3).numFmt = '$#,##0.00';

                      row.getCell(4 + j * 3).value = row.getCell(3 + j * 3).value * row.getCell(2 + j * 3).value;
                      row.getCell(4 + j * 3).alignment = { horizontal: 'center' };
                      row.getCell(4 + j * 3).numFmt = '$#,##0.00';

                  }
              });
          });

          [{key: 'o', label: 'OOT'}, {key: 'x', label: 'Extended'}].forEach((type, index) => {
              const row = worksheet.getRow(startRow + 8 + index);
              row.getCell(1).value = type.label;
              ['PT', 'OT', 'ST'].forEach((disc, j) => {
                  const record = breakdown[type.key]?.[disc];
                  if (record) {
                      const rate = type.key === 'x' || type.key === 'Extended'
                          ? parseFloat(agencyInfo?.extended ?? 0) 
                          : type.key === 'o' || type.key === 'OOT'
                              ? parseFloat(agencyInfo?.oot ?? 0) 
                              : 0;
                      row.getCell(2 + j * 3).value = record.count;
                      row.getCell(2 + j * 3).alignment = { horizontal: 'center' };
                      row.getCell(2 + j * 3).font = { color: { argb: 'FF0096D7'} };

                      row.getCell(3 + j * 3).value = rate
                      row.getCell(3 + j * 3).alignment = { horizontal: 'center' };
                      row.getCell(3 + j * 3).numFmt = '$#,##0.00';

                      row.getCell(4 + j * 3).value = row.getCell(3 + j * 3).value * row.getCell(2 + j * 3).value;
                      row.getCell(4 + j * 3).alignment = { horizontal: 'center' };
                      row.getCell(4 + j * 3).numFmt = '$#,##0.00';
                  }
              });
          });

          const mileageLabelRow = worksheet.getRow(startRow + 13);
          mileageLabelRow.values = ['Mileage', 'Rate', 'Total'];
          mileageLabelRow.alignment = { horizontal: 'center' };
          mileageLabelRow.font = {bold: true};

          const mileageRow = worksheet.getRow(startRow + 14);
          const agencyMileage = Object.values(parsedData.mileage?.[agency] ?? {}).reduce((a, b) => a + b, 0);
          const agencyRate = parseFloat(agencyInfo?.mileage ?? 0);
          const agencyMileageTotal = agencyMileage * agencyRate;

          // ======= Visits + Payment Due table (H36:J42) =======

          // Visits header
          worksheet.getCell('H36').value = '';
          worksheet.getCell(`H36`).border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} };
          worksheet.getCell('I36').value = 'Visits';
          worksheet.getCell(`I36`).border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} };
          worksheet.getCell('J36').value = 'Payment';
          worksheet.getCell(`J36`).border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} };
          worksheet.getRow(36).font = { bold: true };

          // PT Row
          worksheet.getCell('H37').value = 'PT';
          worksheet.getCell('I37').value = { formula: `SUM(B25:B28)` };
          worksheet.getCell('J37').value = { formula: `SUM(D25:D31)` };
          worksheet.getCell('J37').numFmt = '"$"#,##0.00';

          // OT Row
          worksheet.getCell('H38').value = 'OT';
          worksheet.getCell('I38').value = { formula: `SUM(E25:E28)` };
          worksheet.getCell('J38').value = { formula: `SUM(G25:G31)` };
          worksheet.getCell('J38').numFmt = '"$"#,##0.00';

          // ST Row
          worksheet.getCell('H39').value = 'ST';
          worksheet.getCell('I39').value = { formula: `SUM(H25:H28)` };
          worksheet.getCell('J39').value = { formula: `SUM(J25:J31)` };
          worksheet.getCell('J39').numFmt = '"$"#,##0.00';

          // Mileage row
          worksheet.getCell('H40').value = 'Mileage';
          worksheet.getCell('I40').value = agencyMileage;
          worksheet.getCell('J40').value = agencyMileageTotal;
          worksheet.getCell('J40').numFmt = '"$"#,##0.00';

          // Amount due
          worksheet.getCell('H41').value = 'AMOUNT DUE BY: ';
          worksheet.getCell('J41').value = { formula: `SUM(J37:J40)` };
          worksheet.getCell('J41').numFmt = '"$"#,##0.00';
          worksheet.getCell('H41').font = { bold: true, color: { argb: 'FFFF0000'} , size: 12 };
          worksheet.getCell('J41').font = { bold: true, color: { argb: 'FFFF0000'} , size: 14 };
          worksheet.getCell('H41').alignment = { horizontal: 'right', vertical: 'middle' };
          worksheet.getCell('J41').alignment = { horizontal: 'right', vertical: 'middle' };
          worksheet.getCell(`J41`).border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} };

          // Due date
          const endDate = new Date(parsedData.payPeriod.end);
          const dueDate = new Date(endDate.setMonth(endDate.getMonth() + 1));
          worksheet.getCell('I41').value = dueDate.toLocaleDateString();
          worksheet.getCell('I41').font = { bold: true, color: { argb: 'FFFF0000'}, size: 12 };
          worksheet.getCell('I41').alignment = { horizontal: 'left', vertical: 'middle'};

          applyOutsideAndInsideBorders(worksheet, 'H37:H40');
          applyOutsideAndInsideBorders(worksheet, 'I37:I40');
          applyOutsideAndInsideBorders(worksheet, 'J37:J40');

          mileageRow.alignment = { horizontal: 'center'};

          mileageRow.getCell(1).value = agencyMileage;
          mileageRow.getCell(1).font = { bold: false, color: { argb: 'FFFF0000'} };

          mileageRow.getCell(2).value = agencyRate;
          mileageRow.getCell(2).alignment = { horizontal: 'center' };
          mileageRow.getCell(2).numFmt = '"$"#,##0.00';
          mileageRow.getCell(2).font = { bold: false };

          mileageRow.getCell(3).value = agencyMileageTotal;
          mileageRow.getCell(3).numFmt = '"$"#,##0.00';
          mileageRow.getCell(3).font = { bold: false };

          worksheet.getRow(33).alignment = { horizontal: 'center' };
          worksheet.getCell('B33').value = { formula: `SUM(B25:B28)` };
          worksheet.getCell('B33').border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} };
          worksheet.getCell('B33').font = { color: { argb: 'FFFF0000'} };
          
          worksheet.getCell('D33').value = { formula: `SUM(D25:D31)` };
          worksheet.getCell('D33').border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} };
          worksheet.getCell('D33').numFmt = '"$"#,##0.00';

          worksheet.getCell('E33').value = { formula: `SUM(E25:E28)` };
          worksheet.getCell('E33').font = { color: { argb: 'FFFF0000'} };
          worksheet.getCell('E33').border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} };

          worksheet.getCell('G33').value = { formula: `SUM(G25:G31)` };
          worksheet.getCell('G33').border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} };
          worksheet.getCell('G33').numFmt = '"$"#,##0.00';

          worksheet.getCell('H33').value = { formula: `SUM(H25:H28)` };
          worksheet.getCell('H33').font ={ color: { argb: 'FFFF0000'} };
          worksheet.getCell('H33').border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} };

          worksheet.getCell('J33').value = { formula: `SUM(J25:J31)` };
          worksheet.getCell('J33').border = { top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'} };
          worksheet.getCell('J33').numFmt = '"$"#,##0.00';

          applyOutsideAndInsideBorders(worksheet, `A${startRow+3}:A${startRow+10}`);
          applyOutsideAndInsideBorders(worksheet, `B${startRow+1}:D${startRow+10}`);
          applyOutsideAndInsideBorders(worksheet, `E${startRow+1}:G${startRow+10}`);
          applyOutsideAndInsideBorders(worksheet, `H${startRow+1}:J${startRow+10}`);
          applyOutsideAndInsideBorders(worksheet, `A${startRow+13}:C${startRow+14}`);

          worksheet.eachRow({ includeEmpty: true }, row => {
              row.eachCell(cell => {
                  cell.alignment = { ...cell.alignment, vertical: 'middle' };
              });
          });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "AgencyInvoice.xlsx");
  };

  const handleDownloadAll = async () => {
    const map = await assignInvoiceNumbers();
    if (!map) return;

    await handleSummaryDownload(map);
    await handleMatrixDownload(map);
    await handleSummaryBreakdownDownload(map);
  };





  function stringSimilarity(str1 = '', str2 = '') {
    const a = str1.toLowerCase().trim();
    const b = str2.toLowerCase().trim();
    if (!a || !b) return 0;

    const matrix = Array.from({ length: b.length + 1 }, (_, i) =>
      Array.from({ length: a.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] =
          b[i - 1] === a[j - 1]
            ? matrix[i - 1][j - 1]
            : 1 + Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]);
      }
    }

    const distance = matrix[b.length][a.length];
    return 1 - distance / Math.max(a.length, b.length); // 1 = exact match
  }

  const normalize = (val) => (val || '').toString().trim().toLowerCase();
  const getDate = (val) => new Date(val || '').getTime();

  const getCalvertCost = (entry) => {
    const agencyInfo = parsedData.agencyData.find(a => a.computer?.toLowerCase() === entry.Agency?.toLowerCase());
    const mileageRate = parseFloat(agencyInfo?.mileage ?? 0);
    const rate = parseFloat(entry.Rate ?? 0);
    const miles = parseFloat(entry.miles ?? 0);
    return rate + mileageRate * miles;
  };

  const sortedCalvert = [...(calvertData || [])].sort((a, b) =>
    normalize(a.Name).localeCompare(normalize(b.Name)) ||
    getDate(a.Date) - getDate(b.Date) ||
    getCalvertCost(a) - getCalvertCost(b)
  );

  const getInvoiceCost = (entry) => {
    const agencyInfo = parsedData.agencyData.find(a => a.computer?.toLowerCase() === entry.Agency?.toLowerCase());
    const mileageRate = parseFloat(agencyInfo?.mileage ?? 0);
    const rate = parseFloat(entry.Rate ?? 0);
    const miles = parseFloat(entry.Miles ?? entry.miles ?? 0);
    return rate + mileageRate * miles;
  };

  const sortedInvoice = [...(parsedData?.flattened || [])]
    .filter((row) => row.Agency?.startsWith('Calvert'))
    .sort((a, b) =>
      normalize(a.Patient).localeCompare(normalize(b.Patient)) ||
      getDate(a.Date) - getDate(b.Date) ||
      getInvoiceCost(a) - getInvoiceCost(b)
    );

  const calvertRows = [];
  const invoiceRows = [];

  let calvertIndex = 0;
  let invoiceIndex = 0;

  while (calvertIndex < sortedCalvert.length || invoiceIndex < sortedInvoice.length) {
    const calvert = sortedCalvert[calvertIndex];
    const invoice = sortedInvoice[invoiceIndex];

    let costCal = 0;
    let costInv = 0;

    let costMismatch = false;

    if (!calvert) {
      // Only invoice rows left
      invoiceRows.push(
        <tr key={`invoice-${invoiceIndex}`} className="border-t">
          <td className="px-3 h-8">{invoice.Patient}</td>
          <td className="px-3 h-8">{invoice.Disc}</td>
          <td className="px-3 h-8">{invoice.Agency}</td>
          <td className="px-3 h-8">{invoice.Date}</td>
          <td className="px-3 h-8">{invoice['Base Rate']}</td>
          <td className="px-3 h-8">{invoice.Miles ?? invoice.miles}</td>
          <td className={`px-3 h-8 ${true ? 'bg-red-200 text-red-700 font-semibold' : ''}`}>
            {invoice['Total Cost']}
          </td>
        </tr>
      );
      calvertRows.push(
        <tr key={`missing-calvert-${invoiceIndex}`} className="bg-yellow-100 text-yellow-700 font-semibold">
          <td colSpan={7} className="px-3 h-8">⚠ Name not found in Calvert list</td>
        </tr>
      );
      invoiceIndex++;
      continue;
    }

    const agencyInfo = parsedData.agencyData.find(a => a.computer?.toLowerCase() === calvert.Agency?.toLowerCase());
    const mileageRate = parseFloat(agencyInfo?.mileage ?? 0);
    const rate = parseFloat(calvert.Rate ?? 0);
    const miles = parseFloat(calvert.miles ?? 0);
    const cost = (rate + mileageRate * miles).toFixed(2);

    if (!invoice) {
      // Only calvert rows left
      calvertRows.push(
        <tr key={`calvert-${calvertIndex}`} className="border-t">
          <td className="px-3 h-8">{calvert.Name}</td>
          <td className="px-3 h-8">{calvert.Disc}</td>
          <td className="px-3 h-8">{calvert.Agency}</td>
          <td className="px-3 h-8">{calvert.Date}</td>
          <td className="px-3 h-8">{calvert.Rate}</td>
          <td className="px-3 h-8">{calvert.miles}</td>
          <td className={`px-3 h-8 ${true ? 'bg-red-200 text-red-700 font-semibold' : ''}`}>
            {cost}
          </td>
        </tr>
      );
      invoiceRows.push(
        <tr key={`missing-invoice-${calvertIndex}`} className="bg-yellow-100 text-yellow-700 font-semibold">
          <td colSpan={7} className="px-3 h-8">⚠ Name not found in Invoice list</td>
        </tr>
      );
      calvertIndex++;
      continue;
    }

    const stripAndCapitalizeName = (name = '') => {
      // Remove parentheses
      name = name.replace(/\s*\([^)]*\)/g, '');

      // Remove middle name or initial after first name
      name = name.replace(/^([^,]+,\s+\w+)\s+\w+.*$/, '$1');

      // Title case each word
      name = name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .trim();

      return name;
    };

    costMismatch = cost !== invoice['Total Cost'];

    const calvertName = stripAndCapitalizeName(calvert.Name);
    const invoiceName = stripAndCapitalizeName(invoice.Patient || invoice.Name || '');

    if (calvertName < invoiceName) {
      // Calvert name not found in invoice list
      calvertRows.push(
        <tr key={`calvert-${calvertIndex}`} className="border-t">
          <td className="px-3 h-8">{calvert.Name}</td>
          <td className="px-3 h-8">{calvert.Disc}</td>
          <td className="px-3 h-8">{calvert.Agency}</td>
          <td className="px-3 h-8">{calvert.Date}</td>
          <td className="px-3 h-8">{calvert.Rate}</td>
          <td className="px-3 h-8">{calvert.miles}</td>
          <td className={`px-3 h-8 ${true ? 'bg-red-200 text-red-700 font-semibold' : ''}`}>
            {cost}
          </td>
        </tr>
      );
      invoiceRows.push(
        <tr key={`missing-invoice-${calvertIndex}`} className="bg-yellow-100 text-yellow-700 font-semibold">
          <td colSpan={7} className="px-3 h-8">⚠ Name not found in Invoice list</td>
        </tr>
      );
      calvertIndex++;
      continue;
    }

    if (invoiceName < calvertName) {
      // Invoice name not found in calvert list
      invoiceRows.push(
        <tr key={`invoice-${invoiceIndex}`} className="border-t">
          <td className="px-3 h-8">{invoiceName}</td>
          <td className="px-3 h-8">{invoice.Disc}</td>
          <td className="px-3 h-8">{invoice.Agency}</td>
          <td className="px-3 h-8">{invoice.Date}</td>
          <td className="px-3 h-8">{invoice['Base Rate']}</td>
          <td className="px-3 h-8">{invoice.Miles ?? invoice.miles}</td>
          <td className={`px-3 h-8 ${true ? 'bg-red-200 text-red-700 font-semibold' : ''}`}>
            {invoice['Total Cost']}
          </td>
        </tr>
      );
      calvertRows.push(
        <tr key={`missing-calvert-${invoiceIndex}`} className="bg-yellow-100 text-yellow-700 font-semibold">
          <td colSpan={7} className="px-3 h-8">⚠ Name not found in Calvert list</td>
        </tr>
      );
      invoiceIndex++;
      continue;
    }

    // Names match — now compare dates
    const sim = stringSimilarity(calvertName, invoiceName);
    if (sim < 0.8) {
      // Still a mismatch even if sorted the same
      calvertRows.push(
        <tr key={`name-mismatch-${calvertIndex}`} className="bg-yellow-100 text-yellow-700 font-semibold">
          <td colSpan={7} className="px-3 h-8">
            ⚠ Name mismatch: Calvert = {calvertName}, Invoice = {invoiceName}
          </td>
        </tr>
      );
      invoiceRows.push(
        <tr key={`invoice-${invoiceIndex}`} className="border-t">
          <td className="px-3 h-8">{invoiceName}</td>
          <td className="px-3 h-8">{invoice.Disc}</td>
          <td className="px-3 h-8">{invoice.Agency}</td>
          <td className="px-3 h-8">{invoice.Date}</td>
          <td className="px-3 h-8">{invoice['Base Rate']}</td>
          <td className="px-3 h-8">{invoice.Miles ?? invoice.miles}</td>
          <td className={`px-3 h-8 ${costMismatch ? 'bg-red-200 text-red-700 font-semibold' : ''}`}>
            {invoice['Total Cost']}
          </td>
        </tr>
      );
      invoiceIndex++;
      continue;
    }

    // Check date
    const calvertDate = new Date(calvert.Date).toISOString().split('T')[0];
    const invoiceDate = invoice?.Date ? new Date(invoice.Date).toISOString().split('T')[0] : '';
    const dateMatch = calvertDate === invoiceDate;

    if (!dateMatch) {
      invoiceRows.push(
        <tr key={`date-mismatch-${invoiceIndex}`} className="bg-yellow-100 text-yellow-700 font-semibold">
          <td colSpan={7} className="px-3 h-8">
            ⚠ Date mismatch: Calvert = {calvertDate}, Invoice = {invoiceDate}
          </td>
        </tr>
      );
      calvertRows.push(
        <tr key={`calvert-${calvertIndex}`} className="border-t">
          <td className="px-3 h-8">{calvertName}</td>
          <td className="px-3 h-8">{calvert.Disc}</td>
          <td className="px-3 h-8">{calvert.Agency}</td>
          <td className="px-3 h-8">{calvert.Date}</td>
          <td className="px-3 h-8">{calvert.Rate}</td>
          <td className="px-3 h-8">{calvert.miles}</td>
          <td className={`px-3 h-8 ${true ? 'bg-red-200 text-red-700 font-semibold' : ''}`}>
            {cost}
          </td>
        </tr>
      );
      calvertIndex++;
      continue;
    }

    // Everything matches
    calvertRows.push(
      <tr key={`calvert-${calvertIndex}`} className="border-t">
        <td className="px-3 h-8">{calvertName}</td>
        <td className="px-3 h-8">{calvert.Disc}</td>
        <td className="px-3 h-8">{calvert.Agency}</td>
        <td className="px-3 h-8">{calvert.Date}</td>
        <td className="px-3 h-8">{calvert.Rate}</td>
        <td className="px-3 h-8">{calvert.miles}</td>
        <td className={`px-3 h-8 ${costMismatch ? 'bg-red-200 text-red-700 font-semibold' : ''}`}>
          {cost}
        </td>
      </tr>
    );

    invoiceRows.push(
      <tr key={`invoice-${invoiceIndex}`} className="border-t">
        <td className="px-3 h-8">{invoiceName}</td>
        <td className="px-3 h-8">{invoice.Disc}</td>
        <td className="px-3 h-8">{invoice.Agency}</td>
        <td className="px-3 h-8">{invoice.Date}</td>
        <td className="px-3 h-8">{invoice['Base Rate']}</td>
        <td className="px-3 h-8">{invoice.Miles ?? invoice.miles}</td>
        <td className={`px-3 h-8 ${costMismatch ? 'bg-red-200 text-red-700 font-semibold' : ''}`}>
          {invoice['Total Cost']}
        </td>
      </tr>
    );

    calvertIndex++;
    invoiceIndex++;
  }

  return (
    <div className="max-w-fit min-w-full mx-auto p-8 bg-white shadow-xl rounded-lg border border-blue-100">
      <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center tracking-wide">
        Upload Invoice File
      </h2>

      <input
        type="file"
        accept={step === 1 ? ".csv" : ".xlsx"}
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-sky-100 file:text-blue-900
                  hover:file:bg-sky-200 mb-6"
      />

      <p className="text-sm text-gray-700 mb-2">
        {step === 1 ? "Step 1: Upload Invoice File" : step === 2 ? "Step 2: Upload Calvert Excel file" : "Both files uploaded."}
      </p>

      {pendingCity && (
        <div className="mb-6 border border-yellow-400 p-5 rounded-md bg-yellow-50">
          <p className="mb-3 text-sm font-medium text-gray-800">
            City "<span className="font-semibold">{pendingCity}</span>" not found. Please classify it:
          </p>
          <div className="flex gap-3">
            {['In Town', 'Out of Town', 'Extended'].map((label) => (
              <button
                key={label}
                onClick={() => handleCityTypeSelection(label)}
                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {parsedData && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleDownloadAll}
            className="max-w-4xl mx-auto w-full px-6 py-4 text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-base font-semibold"
          >
            Download Biling Excel Files
          </button>
        </div>
      )}

      {calvertData && parsedData?.flattened && (
        <div className="mt-10 grid grid-cols-2 gap-6">
          {/* Calvert Table */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-blue-900">Calvert Data</h3>
            <div className="overflow-x-auto border border-gray-200 rounded">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Disc</th>
                    <th className="px-3 py-2">Agency</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Rate</th>
                    <th className="px-3 py-2">Miles</th>
                    <th className="px-3 py-2">Cost</th>
                  </tr>
                </thead>
                <tbody>{calvertRows}</tbody>
              </table>
            </div>
          </div>

          {/* Invoice Data Table */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-blue-900">Invoice Data</h3>
            <div className="overflow-x-auto border border-gray-200 rounded">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Disc</th>
                    <th className="px-3 py-2">Agency</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Rate</th>
                    <th className="px-3 py-2">Miles</th>
                    <th className="px-3 py-2">Cost</th>
                  </tr>
                </thead>
                <tbody>{invoiceRows}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showBillingPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow max-w-72">
            <p className="mb-2 text-lg font-bold text-blue-900">Are you doing billing?</p>
            <hr className="mb-3 border-t-2 border-blue-200" />
            <p className="mb-12 text-sm text-gray-700">
              Selecting <strong className="text-blue-900">Yes</strong> will update the invoice number in the database.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="bg-blue-200 text-blue-900 font-medium px-4 py-2 rounded"
                onClick={() => {
                  setIsBilling(true);
                  setShowBillingPrompt(false);
                }}
              >
                Yes
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => {
                  setIsBilling(false);
                  setShowBillingPrompt(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceUploader;
