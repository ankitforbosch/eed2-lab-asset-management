import React, { useState } from 'react';
import { updateDoc, doc, addDoc, collection } from 'firebase/firestore';

function ReturnForm({ db, user, equipments }) {
  const [ntid, setNtid] = useState('');
  const [returnNotes, setReturnNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const borrowedItems = equipments.filter(e => e.status === 'borrowed' && e.borrowerId === user.uid);

  const handleReturn = async () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to return');
      return;
    }

    try {
      for (const equipmentId of selectedItems) {
        const equipment = equipments.find(e => e.id === equipmentId);
        await updateDoc(doc(db, 'equipments', equipmentId), {
          status: 'available',
          borrowerId: null,
          borrowerName: null,
          checkoutDate: null,
          expectedReturnDate: null,
          actualReturnDate: new Date().toISOString(),
          quantity: equipment.quantity + 1
        });

        await addDoc(collection(db, 'history'), {
          equipmentId,
          action: 'returned',
          userId: user.uid,
          userName: user.displayName || 'Anonymous',
          date: new Date().toISOString(),
          notes: returnNotes
        });
      }
      alert('Equipment returned successfully!');
      setSelectedItems([]);
      setNtid('');
      setReturnNotes('');
    } catch (error) {
      console.error('Return error:', error);
      alert('Failed to return equipment');
    }
  };

  const extendReturnDate = async (equipmentId, newDate) => {
    if (!newDate) {
      alert('Please select a new return date');
      return;
    }
    try {
      await updateDoc(doc(db, 'equipments', equipmentId), {
        expectedReturnDate: newDate
      });
      alert('Return date extended successfully!');
    } catch (error) {
      console.error('Extend date error:', error);
      alert('Failed to extend return date');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5><i className="bi bi-arrow-return-left me-1"></i>Return Equipment</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">NTID</label>
          <input
            type="text"
            className="form-control"
            value={ntid}
            onChange={(e) => setNtid(e.target.value)}
            placeholder="Enter your NTID"
          />
        </div>
        <div className="mb-3">
          {borrowedItems.length === 0 ? (
            <div className="alert alert-info">No borrowed items found</div>
          ) : (
            borrowedItems.map(equipment => (
              <div key={equipment.id} className="border rounded p-3 mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input return-item-checkbox"
                    id={`return-${equipment.id}`}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems([...selectedItems, equipment.id]);
                      } else {
                        setSelectedItems(selectedItems.filter(id => id !== equipment.id));
                      }
                    }}
                  />
                  <label className="form-check-label" htmlFor={`return-${equipment.id}`}>
                    <strong>{equipment.name}</strong> (Serial: {equipment.serialNumber})
                    <br />
                    <small>Borrowed: {new Date(equipment.checkoutDate).toLocaleString()}</small>
                    <br />
                    <small>Due: {equipment.expectedReturnDate}</small>
                  </label>
                </div>
                <div className="mt-2">
                  <label className="form-label">Extend Return Date</label>
                  <input
                    type="date"
                    className="form-control"
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => extendReturnDate(equipment.id, e.target.value)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Return Notes (Optional)</label>
          <textarea
            className="form-control"
            rows="3"
            value={returnNotes}
            onChange={(e) => setReturnNotes(e.target.value)}
          ></textarea>
        </div>
        <button
          className="btn btn-success w-100"
          onClick={handleReturn}
          disabled={selectedItems.length === 0}
        >
          <i className="bi bi-check-circle me-1"></i>Return Selected Items
        </button>
      </div>
    </div>
  );
}

export default ReturnForm;
