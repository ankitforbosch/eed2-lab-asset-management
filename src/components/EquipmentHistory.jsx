import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';

function EquipmentHistory({ db, equipments }) {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'history'), (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(historyData);
    }, (error) => {
      console.error('Error fetching history:', error);
      alert('Failed to load history');
    });
    return () => unsubscribe();
  }, [db]);

  const filteredHistory = history.filter(record => {
    const equipment = equipments.find(e => e.id === record.equipmentId);
    const matchesSearch = searchTerm
      ? (equipment && equipment.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.userName && record.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.purpose && record.purpose.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    const matchesFilter = filterType === 'all'
      ? true
      : filterType === record.action;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5><i className="bi bi-clock-history me-1"></i>History Log</h5>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="all">All</option>
            <option value="borrowed">Borrow</option>
            <option value="returned">Return</option>
            <option value="added">Add</option>
          </select>
        </div>
      </div>
      <div className="card-body history-log">
        {filteredHistory.length === 0 ? (
          <div className="alert alert-info">No history records found</div>
        ) : (
          filteredHistory.map(record => (
            <div key={record.id} className={`log-entry ${record.action}`}>
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{record.userName}</strong> {record.action} <strong>{equipments.find(e => e.id === record.equipmentId)?.name || 'Unknown'}</strong>
                  <br />
                  <small>Date: {new Date(record.date).toLocaleString()}</small>
                </div>
                <span className={`badge bg-${record.action === 'returned' ? 'success' : record.action === 'borrowed' ? 'primary' : 'info'}`}>
                  {record.action.charAt(0).toUpperCase() + record.action.slice(1)}
                </span>
              </div>
              {record.purpose && <p className="mt-1"><em>Purpose: {record.purpose}</em></p>}
              {record.notes && <p className="mt-1"><em>Notes: {record.notes}</em></p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EquipmentHistory;
