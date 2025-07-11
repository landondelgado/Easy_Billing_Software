// Agencies.jsx
import React, { useEffect, useState } from 'react';
import { usePrompt } from './hooks/usePrompt';

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
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  usePrompt(dirtyRows.size > 0 || deletedIds.length > 0);

  const dollarFields = [
    'mileage', 'pteval', 'ptre_eval', 'ptdc', 'ptvisit',
    'oteval', 'otre_eval', 'otdc', 'otvisit',
    'steval', 'stre_eval', 'stdc', 'stvisit',
    'extended', 'oot'
  ];

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (dirtyRows.size > 0 || deletedIds.length > 0) {
        e.preventDefault();
        e.returnValue = ''; // Chrome requires this to show the prompt
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dirtyRows, deletedIds]);

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
    const minDuration = 0;
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
    }, 300); // match the transition duration
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

  const confirmRemove = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleConfirmedRemove = () => {
    const updated = [...editing];
    const removed = updated.splice(deleteIndex, 1);
    if (removed[0]?.id) {
      setDeletedIds([...deletedIds, removed[0].id]);
    }
    setEditing(updated);
    setShowDeleteModal(false);
    setDeleteIndex(null);
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

      <div className="w-full overflow-x-auto">
        <div className="overflow-x-auto border border-gray-200 rounded overflow-y-auto max-h-[78vh]">
          <table className="text-sm w-full" style={{ tableLayout: 'auto', width: 'auto' }}>
            <thead className="bg-gray-100 text-left sticky top-0 z-50">
              <tr>
                {Object.keys(editing[0] || {}).filter(key => key !== 'id').map(key => (
                  <th key={key} className={`pl-4 py-1 text-center border-b border-gray-300 whitespace-nowrap ${key === 'computer' ? 'z-50 py-0 sticky left-0 border-b-2 bg-gray-100' : ''}`}>
                    {formatHeader(key)}
                  </th>
                ))}
                <th className="px-2 py-1 border-b text-center border-gray-300 whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              {editing.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-blue-100' : ''}>
                  {Object.keys(row).filter(key => key !== 'id').map(key => (
                    <td key={key} className={`px-2 py-1 border-b whitespace-nowrap ${key === 'computer' ? `z-10 sticky left-0 border-y-2 bg-blue-950 text-white border-none ` : ''}`}>
                      <div className="relative w-full">
                        {dollarFields.includes(key) && (
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        )}
                        <input
                          className={`pl-5 pr-1 py-1 border-l bg-transparent border-gray-400 text-sm w-full ${
                            ['computer', 'name', 'attention', 'address', 'city__state__zip_code'].includes(key)
                              ? `min-w-[230px]`
                              : `min-w-[60px]`
                          }`}
                          value={row[key] ?? ''}
                          onChange={(e) => handleChange(idx, key, e.target.value)}
                        />
                      </div>
                    </td>
                  ))}
                  <td className="px-2 py-1 border-b">
                    <button onClick={() => confirmRemove(idx)} className="text-white bg-red-600 rounded-md py-1.5 px-2 hover:bg-red-800">Delete</button>
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

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-72 w-full">
            <h3 className="mb-2 text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-2">Confirm Delete</h3>
            <p className="mb-6 text-base text-gray-700">
              Are you sure you want to delete this agency?
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={handleConfirmedRemove} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Agencies;