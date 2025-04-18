import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';

function AddEquipmentForm({ db }) {
  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !serialNumber || quantity < 1) {
      alert('Please fill all fields correctly');
      return;
    }
    try {
      const equipmentRef = await addDoc(collection(db, 'equipments'), {
        name,
        serialNumber,
        status: 'available',
        quantity,
        createdAt: new Date().toISOString()
      });
      await addDoc(collection(db, 'history'), {
        equipmentId: equipmentRef.id,
        action: 'added',
        userId: 'system',
        userName: 'System',
        date: new Date().toISOString()
      });
      alert('Equipment added successfully!');
      setName('');
      setSerialNumber('');
      setQuantity(1);
      document.querySelector('#addEquipmentModal .btn-close').click();
    } catch (error) {
      console.error('Add equipment error:', error);
      alert('Failed to add equipment');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Equipment Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Serial Number</label>
        <input
          type="text"
          className="form-control"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Quantity</label>
        <input
          type="number"
          className="form-control"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min="1"
          required
        />
      </div>
      <button type="submit" className="btn btn-success w-100">
        <i className="bi bi-plus-lg me-1"></i>Add Equipment
      </button>
    </form>
  );
}

export default AddEquipmentForm;
