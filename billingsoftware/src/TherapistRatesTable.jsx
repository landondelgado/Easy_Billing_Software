import React, { useEffect, useState } from 'react';

const API_BASE = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000'
  : '';

function TherapistRatesTable({ token, onRatesSaved, reloadKey }) {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState([]);
  const [dirtyRows, setDirtyRows] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState([]);
  const [types, setTypes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveSummary, setSaveSummary] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [expandedAreas, setExpandedAreas] = useState(new Set());

  useEffect(() => {
    fetchData();
  }, [reloadKey]);

  const formatVisitLabel = (code) => {
    if (!code) return '';

    return code
      .toLowerCase()
      .split('_')
      .map(part =>
        part === 'oot'
          ? 'OOT' // preserve acronym
          : part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join('-');
  };

  const toggleArea = (areaId) => {
    setExpandedAreas(prev => {
      const next = new Set(prev);
      next.has(areaId) ? next.delete(areaId) : next.add(areaId);
      return next;
    });
  };

  async function fetchData() {
    try {
      setLoading(true);

      const authHeaders = {
        Authorization: `Bearer ${token}`,
      };

      const [therapistsRes, ratesRes, areasRes, visitTypesRes] = await Promise.all([
        fetch(`${API_BASE}/therapists`, { headers: authHeaders }),
        fetch(`${API_BASE}/therapist_rates`, { headers: authHeaders }),
        fetch(`${API_BASE}/billing_areas`, { headers: authHeaders }),
        fetch(`${API_BASE}/visit_types`, { headers: authHeaders }),
      ]);

      console.log(
        therapistsRes.status,
        ratesRes.status,
        areasRes.status,
        visitTypesRes.status
      );

      const therapists = await therapistsRes.json();

      console.log('therapists:', therapists);

      therapists.sort((a, b) =>
        a.first_name.localeCompare(b.first_name, undefined, {
          sensitivity: 'base',
        })
      );

      const rates = await ratesRes.json();
      console.log('rates:', rates);
      const fetchedBillingAreas = await areasRes.json();
      console.log('areas:', fetchedBillingAreas);
      const fetchedVisitTypes = await visitTypesRes.json();
      
      
      
      console.log('visitTypes:', fetchedVisitTypes);

      setAreas(fetchedBillingAreas);
      setTypes(fetchedVisitTypes);

      // Build lookup maps
      const areaById = Object.fromEntries(
        fetchedBillingAreas.map(a => [a.billing_area_id, a.area_name])
      );
      const visitTypeById = Object.fromEntries(
        fetchedVisitTypes.map(v => [v.visit_type_id, v.visit_code])
      );

      // Attach rates to therapists
      const enriched = therapists.map(t => {
        const tRates = rates.filter(r => r.therapist_id === t.therapist_id);

        const rateMap = {};
        tRates.forEach(r => {
          const key = `${r.billing_area_id}|${r.visit_type_id}`;
          rateMap[key] = r.rate;
        });

        return {
          ...t,
          rates: rateMap
        };
      });

      setRows(
        enriched.map(t => ({
          ...t,
          rates: { ...t.rates },
        }))
      );

      setEditing(
        enriched.map(t => ({
          ...t,
          rates: { ...t.rates },
        }))
      );
      setDirtyRows(new Set());
    } catch (err) {
      console.error(err);
      alert('Failed to load therapist rates');
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (idx, key, value) => {
    const updated = [...editing];
    updated[idx] = { ...updated[idx], [key]: value };
    setEditing(updated);

    const dr = new Set(dirtyRows);
    dr.add(idx);
    setDirtyRows(dr);
  };

  const buildSaveSummary = ({ therapistUpdates, rateUpserts }) => {
    const summary = [];

    therapistUpdates.forEach(t => {
      const therapist = rows.find(r => r.therapist_id === t.therapist_id);
      if (!therapist) return;

      Object.keys(t).forEach(field => {
        if (field === 'therapist_id') return;

        summary.push({
          type: 'therapist',
          therapist: `${therapist.first_name} ${therapist.last_name}`,
          field,
          value: t[field],
        });
      });
    });

    rateUpserts.forEach(r => {
      const therapist = rows.find(t => t.therapist_id === r.therapist_id);
      const areaName =
        areas.find(a => a.billing_area_id === r.billing_area_id)?.area_name;
      const visitCode =
        types.find(v => v.visit_type_id === r.visit_type_id)?.visit_code;

      summary.push({
        type: 'rate',
        therapist: therapist
          ? `${therapist.first_name} ${therapist.last_name}`
          : 'Unknown therapist',
        field: `${areaName} ${visitCode}`,
        value: r.rate,
      });
    });

    return summary;
  };

  const handleSave = async () => {
    console.log('[SAVE] handleSave called');
    try {
      if (dirtyRows.size === 0) return;

      // 1️⃣ Separate therapist updates and rate updates
      const therapistUpdates = [];
      const rateUpserts = [];

      dirtyRows.forEach(idx => {
        const t = editing[idx];

        const original = rows[idx];
        const update = { therapist_id: t.therapist_id };
        let changed = false;

        [
          'first_name',
          'last_name',
          'role',
          'home_location',
          'mileage_rate',
        ].forEach(field => {
          const normalize = (field, val) => {
            if (field === 'mileage_rate') {
              return val === '' || val == null ? null : Number(val);
            }
            return val?.trim?.() ?? null;
          };

          const oldVal = normalize(field, original[field]);
          const newVal = normalize(field, t[field]);

          if (oldVal !== newVal) {
            update[field] = newVal;
            changed = true;
          }
        });

        if (changed) {
          therapistUpdates.push(update);
        }

        // --- therapist rates ---
        const editedRates = t.rates || {};
        const originalRates = original.rates || {};

        Object.entries(editedRates).forEach(([key, value]) => {
          if (value === '' || value == null) return;

          console.log('RATE DIFF CHECK', {
            key,
            old: originalRates[key],
            new: editedRates[key],
            sameObject: originalRates === editedRates,
          });

          const newRate = Number(value);
          const oldRate =
            originalRates[key] == null
              ? null
              : Number(originalRates[key]);

          if (oldRate === newRate) return;

          // 🚫 Skip unchanged rates
          if (Number.isFinite(oldRate) && oldRate === newRate) {
            return;
          }

          const [billing_area_id, visit_type_id] = key.split('|').map(Number);

          rateUpserts.push({
            therapist_id: t.therapist_id,
            billing_area_id,
            visit_type_id,
            rate: newRate,
          });
        });
      });

      const summary = buildSaveSummary({ therapistUpdates, rateUpserts });

      setSaving(true);

      // 2️⃣ Persist therapist updates
      if (therapistUpdates.length > 0) {
        await fetch(`${API_BASE}/therapists/update_many`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rows: therapistUpdates }),
        });
      }

      // 3️⃣ Persist rate updates
      if (rateUpserts.length > 0) {
        await fetch(`${API_BASE}/therapist_rates/upsert_many`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rows: rateUpserts }),
        });
      }

      // refresh silently
      fetchData();

      onRatesSaved();

      // show modal
      setSaveSummary(summary);
      setShowSaveModal(true);
      setSaving(false);

    } catch (err) {
      console.error(err);
      alert('Failed to save therapist updates');
    }
  };

  const areaColumns = React.useMemo(() => {
    const map = new Map();

    editing.forEach(t => {
      Object.keys(t.rates || {}).forEach(key => {
        const [areaId, visitTypeId] = key.split('|').map(Number);

        if (!map.has(areaId)) {
          map.set(areaId, new Set());
        }
        map.get(areaId).add(visitTypeId);
      });
    });

    return Array.from(map.entries()).map(([areaId, visitTypeSet]) => ({
      billing_area_id: areaId,
      visit_type_ids: Array.from(visitTypeSet).sort(),
    }));
  }, [editing]);

  const tableColumns = React.useMemo(() => {
    const cols = [];

    areaColumns.forEach(({ billing_area_id, visit_type_ids }) => {
      const area = areas.find(a => a.billing_area_id === billing_area_id);
      const areaName = area?.area_name ?? 'Unknown Area';

      const isExpanded = expandedAreas.has(billing_area_id);

      // ✅ ALWAYS render the area column
      cols.push({
        type: 'area',
        billing_area_id,
        label: areaName,
        expanded: isExpanded,
      });

      // ✅ If expanded, render rate columns AFTER it
      if (isExpanded) {
        visit_type_ids.forEach(visitTypeId => {
          const visit = types.find(v => v.visit_type_id === visitTypeId);
          cols.push({
            type: 'rate',
            billing_area_id,
            visit_type_id: visitTypeId,
            label: visit?.visit_code ?? 'Unknown',
            areaLabel: areaName,
          });
        });
      }
    });

    return cols;
  }, [areaColumns, expandedAreas, areas, types]);

  // const renderRateHeader = (key) => {
  //   const [billingAreaId, visitTypeId] = key.split('|').map(Number);

  //   const areaName =
  //     areas.find(a => a.billing_area_id === billingAreaId)?.area_name
  //       ?? 'Unknown Area';

  //   const visitCode =
  //     types.find(v => v.visit_type_id === visitTypeId)?.visit_code
  //       ?? 'Unknown Visit';

  //   return `${areaName} ${visitCode}`;
  // };

  if (loading && rows.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-3.5 space-y-4 mx-auto p-8 bg-white shadow-xl rounded-lg border border-blue-100 transition-opacity`}>
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow">
      <div className="overflow-x-auto w-full max-h-[60vh] border rounded">
        <table className="text-sm min-w-full">
          <thead className="bg-gray-100 text-left sticky top-0 z-50 text-base">
            <tr>
              <th className="pl-4 text-center border-gray-300 whitespace-nowrap z-50 py-0 sticky left-0 border-b-2 bg-gray-100">First Name</th>
              <th className="pl-4 py-1 text-center border-b border-gray-300 whitespace-nowrap">Last Name</th>
              <th className="pl-4 py-1 text-center border-b border-gray-300 whitespace-nowrap">Role</th>
              <th className="pl-4 py-1 text-center border-b border-gray-300 whitespace-nowrap">Home Location</th>
              <th className="pl-4 py-1 text-center border-b border-gray-300 whitespace-nowrap">Mileage Rate</th>

              {tableColumns.map(col => {
                if (col.type === 'area') {
                  return (
                    <th key={`area-${col.billing_area_id}`} className={`text-center ${!col.expanded ? 'w-24' : ''}`}>
                      <button
                        type="button"
                        onClick={() => toggleArea(col.billing_area_id)}
                        className="flex items-center justify-center gap-1 mx-auto min-w-[125px]"
                      >
                        <svg
                          className={`w-3 h-3 transition-transform ${
                            col.expanded ? '' : 'rotate-90 translate-y-0.5'
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M6 6l6 4-6 4V6z" />
                        </svg>
                        <span>{col.label}</span>
                      </button>
                    </th>
                  );
                }

                return (
                  <th
                    key={`rate-${col.billing_area_id}-${col.visit_type_id}`}
                    className="pl-4 py-1 text-center border-b border-gray-300 whitespace-nowrap text-sm"
                  >
                  {formatVisitLabel(col.label)}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className='text-base'>
            {editing.map((t, idx) => (
              <tr key={t.therapist_id} className={idx % 2 === 0 ? 'bg-blue-100' : ''}>
                <td className={`px-2 py-1 border-b whitespace-nowrap z-10 sticky left-0 border-y-2 bg-blue-950 text-white border-none min-w-[100px] max-w-[200px]`}><input className="pl-3 pr-1 py-1 border-l bg-transparent border-gray-400 text-sm w-full" value={t.first_name} onChange={e => handleChange(idx, 'first_name', e.target.value)} /></td>
                <td className="px-2 py-1 border-b whitespace-nowrap"><input className='pl-5 pr-1 py-1 border-l bg-transparent border-gray-400 text-sm w-full min-w-[100px]' value={t.last_name} onChange={e => handleChange(idx, 'last_name', e.target.value)} /></td>
                <td className="px-2 py-1 border-b whitespace-nowrap"><input className='pl-5 pr-1 py-1 border-l bg-transparent border-gray-400 text-sm w-full min-w-[60px]' value={t.role} onChange={e => handleChange(idx, 'role', e.target.value)} /></td>
                <td className="px-2 py-1 border-b whitespace-nowrap"><input className='pl-5 pr-1 py-1 border-l bg-transparent border-gray-400 text-sm w-full min-w-[100px]' value={t.home_location} onChange={e => handleChange(idx, 'home_location', e.target.value)} /></td>
                <td className="px-2 py-1 border-b whitespace-nowrap">
                  <div className="relative w-full">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input
                      className='pl-5 py-1 border-l bg-transparent border-gray-400 text-sm w-full'
                      value={t.mileage_rate ?? ''}
                      onChange={e => handleChange(idx, 'mileage_rate', e.target.value)}
                    />
                  </div>
                </td>

                {tableColumns.map(col => {
                  if (col.type === 'area') {
                    return (
                      <td
                        key={`area-${col.billing_area_id}`}
                        className={`bg-blue-950 text-center text-gray-400 italic {${!col.expanded ? `w-24` : ``}}`}
                      >
                        —
                      </td>
                    );
                  }

                  const rateKey = `${col.billing_area_id}|${col.visit_type_id}`;

                  return (
                    <td key={rateKey} className="px-2 py-1">
                      <div className="relative w-full">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input
                          className="pl-5 py-1 border-l bg-transparent border-gray-400 text-sm min-w-[75px] max-w-[75px]"
                          value={t.rates?.[rateKey] ?? ''}
                          onChange={e => {
                            const updated = [...editing];
                            const nextRates = { ...(updated[idx].rates || {}) };

                            nextRates[rateKey] = e.target.value;

                            updated[idx] = {
                              ...updated[idx],
                              rates: nextRates,
                            };

                            setEditing(updated);

                            const dr = new Set(dirtyRows);
                            dr.add(idx);
                            setDirtyRows(dr);
                          }}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        disabled={dirtyRows.size === 0}
        onClick={handleSave}
        className="mt-4 w-full bg-blue-900 text-white py-2 rounded disabled:opacity-40"
      >
        Save Therapist Changes
      </button>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[500px] max-h-[70vh] overflow-y-auto p-6">
            <h3 className="text-lg font-bold mb-4">Changes Saved</h3>

            {saveSummary?.length === 0 ? (
              <p>No changes were detected.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {saveSummary.map((item, idx) => (
                  <li key={idx} className="border-b pb-2">
                    <strong>{item.therapist}</strong>
                    <div className="text-gray-600">
                      {item.type === 'rate'
                        ? `Rate updated: ${item.field} → $${item.value}`
                        : `${item.field.replace('_', ' ')} updated → ${item.value}`}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setShowSaveModal(false)}
              className="mt-4 w-full bg-blue-900 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TherapistRatesTable;