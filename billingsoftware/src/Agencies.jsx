// Agencies.jsx
import React, { useEffect, useState } from 'react';

const API_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';

function Agencies({ token }) {
  const [agencies, setAgencies] = useState([]);
  const [editing, setEditing] = useState([]);
  const [dirtyRows, setDirtyRows] = useState(new Set());
  const [dirtyFields, setDirtyFields] = useState({});
  const [deletedIds, setDeletedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [fadeOutLoader, setFadeOutLoader] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowContent(true);
  //   }, 100);
  //   return () => clearTimeout(timer);
  // }, []);

  const fetchData = async () => {
    setLoading(true);
    const start = Date.now();
    const res = await fetch(`${API_BASE}/agencydata`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const elapsed = Date.now() - start;
    const minDuration = 500;
    setTimeout(() => {
    const sorted = [...data].sort((a, b) =>
      (a.computer || '').localeCompare(b.computer || '', undefined, { sensitivity: 'base' })
    );
    setAgencies(sorted);
    setEditing(sorted);
    setDirtyRows(new Set());
    setDirtyFields({});
    setDeletedIds([]);
    setFadeOutLoader(true); // start fading out
    setTimeout(() => {
      setLoading(false);     // actually remove loader
      setShowContent(true);  // fade in content
    }, 200); // match the transition duration
  }, Math.max(0, minDuration - elapsed));
  };

  useEffect(() => {
    if (!hasFetched) fetchData();
  }, [token, hasFetched]);

  const handleChange = (index, key, value) => {
    const updated = [...editing];
    updated[index][key] = value;
    const newDirtyRows = new Set(dirtyRows);
    newDirtyRows.add(index);
    setDirtyRows(newDirtyRows);
    const newDirtyFields = { ...dirtyFields };
    if (!newDirtyFields[index]) newDirtyFields[index] = new Set();
    newDirtyFields[index].add(key);
    setDirtyFields(newDirtyFields);
    setEditing(updated);
  };

  const sanitizeRow = (row) => {
    const cleaned = { ...row };
    for (const key in cleaned) {
      const value = cleaned[key];
      if (value === '') cleaned[key] = null;
      if (typeof value === 'string' && value !== '') cleaned[key] = value.trim();
    }
    return cleaned;
  };

  const prepareChanges = () => {
    const updates = [];
    dirtyRows.forEach(index => {
      const row = editing[index];
      if (!row.id) {
        updates.push({ type: '➕ added', data: sanitizeRow(row) });
      } else {
        const fields = {};
        dirtyFields[index]?.forEach(field => {
          fields[field] = row[field];
        });
        updates.push({ type: '✏️ modified', data: sanitizeRow({ id: row.id, computer: row.computer, ...fields }) });
      }
    });
    deletedIds.forEach(id => {
      const deletedAgency = agencies.find(a => a.id === id);
      updates.push({ type: '❌ deleted', id, data: { computer: deletedAgency?.computer || '' } });
    });
    return updates;
  };

  const handleSave = () => {
    const changes = prepareChanges();
    setPendingChanges(changes);
    setShowModal(true);
  };

  const confirmSave = async () => {
    const rows = pendingChanges.filter(c => c.type !== '❌ deleted').map(c => c.data);
    const deletions = pendingChanges.filter(c => c.type === '❌ deleted').map(c => c.id);
    setFadeOutLoader(false);
    setLoading(true);
    const res = await fetch(`${API_BASE}/agencydata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rows, deletedIds: deletions }),
    });
    setFadeOutLoader(true);
    if (res.ok) {
      await fetchData();
      setShowModal(false);
    } else {
      alert('Error saving changes');
      setLoading(false);
    }
  };

  const cancelSave = () => {
    setShowModal(false);
    setPendingChanges([]);
  };

  const revertAllChanges = async () => {
    await fetchData();
    setShowModal(false);
  };

  const handleAdd = () => {
    setEditing([...editing, {
      id: null,
      computer: '', name: '', attention: '', address: '', city__state__zip_code: '',
      invoice_due: null, mileage: null, pteval: null, ptre_eval: null, ptdc: null, ptvisit: null,
      oteval: null, otre_eval: null, otdc: null, otvisit: null,
      steval: null, stre_eval: null, stdc: null, stvisit: null,
      extended: null, oot: null
    }]);
  };

  const handleRemove = (index) => {
    const updated = [...editing];
    const removed = updated.splice(index, 1);
    if (removed[0]?.id) {
      setDeletedIds([...deletedIds, removed[0].id]);
    }
    setEditing(updated);
  };

  const formatHeader = (key) => {
    return key
      .replace(/_+/g, ' ')
      .replace(/\bptre eval\b/gi, 'PT Re-Eval')
      .replace(/\bptdc\b/gi, 'PT DC')
      .replace(/\bptvisit\b/gi, 'PT Visit')
      .replace(/\bpteval\b/gi, 'PT Eval')
      .replace(/\botre eval\b/gi, 'OT Re-Eval')
      .replace(/\botdc\b/gi, 'OT DC')
      .replace(/\botvisit\b/gi, 'OT Visit')
      .replace(/\boteval\b/gi, 'OT Eval')
      .replace(/\bstre eval\b/gi, 'ST Re-Eval')
      .replace(/\bstdc\b/gi, 'ST DC')
      .replace(/\bstvisit\b/gi, 'ST Visit')
      .replace(/\bsteval\b/gi, 'ST Eval')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen space-y-4 max-w-fit min-w-full mx-auto p-8 bg-white shadow-xl rounded-lg border border-blue-100 transition-opacity duration-300 ${fadeOutLoader ? 'opacity-0' : 'opacity-100'}`}>
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`max-w-fit min-w-full mx-auto p-8 bg-white shadow-xl rounded-lg border border-blue-100 transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center tracking-wide pb-8 border-b-2">Manage Agencies</h2>

      <div className="w-full overflow-x-auto">
        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="border text-sm" style={{ tableLayout: 'auto', width: 'auto' }}>
            <thead className="bg-gray-100 text-left">
              <tr>
                {Object.keys(editing[0] || {}).filter(key => key !== 'id').map(key => (
                  <th key={key} className="px-2 py-1 text-center border-b border-gray-300 whitespace-nowrap">
                    {formatHeader(key)}
                  </th>
                ))}
                <th className="px-2 py-1 border-b text-center border-gray-300 whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              {editing.map((row, idx) => (
                <tr key={idx}>
                  {Object.keys(row).filter(key => key !== 'id').map(key => (
                    <td key={key} className="px-2 py-1 border-b whitespace-nowrap">
                      <input
                        className={`p-1 border border-gray-300 rounded text-sm w-full ${
                          ['computer', 'name', 'attention', 'address', 'city__state__zip_code'].includes(key)
                            ? 'min-w-[230px]'
                            : 'min-w-[40px]'
                        }`}
                        value={row[key] ?? ''}
                        onChange={(e) => handleChange(idx, key, e.target.value)}
                      />
                    </td>
                  ))}
                  <td className="px-2 py-1 border-b">
                    <button onClick={() => handleRemove(idx)} className="text-white bg-red-600 rounded-md py-1.5 px-2 hover:bg-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Button Below Table */}
      <div className="flex flex-col items-center space-y-4 min-w-full mt-2">
        <button onClick={handleAdd} className="text-2xl min-w-full rounded-md border-2 border-gray-400 text-gray-400 hover:text-gray-500 hover:border-gray-500">＋</button>
        <button onClick={handleSave} className="bg-blue-200 min-w-full text-blue-800 font-semibold px-4 py-2 rounded">Save Changes</button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full max-h-[80vh]">
            <h3 className="text-xl text-center font-bold mb-4 border-b-2 pb-2">Confirm Changes</h3>
            <div className="space-y-2 text-sm overflow-auto max-h-[50vh]">
              {pendingChanges.map((change, index) => (
                <div key={index} className="border p-2 rounded">
                  <p className="font-semibold">{change.type.toUpperCase()} – {change.data?.computer || `ID ${change.id}`}</p>
                  {change.type !== '❌ deleted' && (
                    <ul className="list-disc list-inside">
                      {Object.entries(change.data).filter(([k]) => k !== 'id').map(([k, v]) => (
                        <li key={k}><strong>{formatHeader(k)}:</strong> {v ?? '[empty]'}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-row items-center justify-center space-x-4 mt-4 pt-2 border-t-2">
              <button onClick={cancelSave} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={revertAllChanges} className="bg-blue-200 text-blue-950 font-semibold px-4 py-2 rounded">Revert All Changes</button>
              <button onClick={confirmSave} className="bg-blue-950 text-white font-semibold px-4 py-2 rounded">Confirm Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Agencies;