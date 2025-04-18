import React, { useState } from 'react';
import { updateDoc, doc, addDoc, collection } from 'firebase/firestore';

function BorrowForm({ db, user, cart, setCart, equipments }) {
  const [purpose, setPurpose] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const handleBorrow = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      for (const item of cart) {
        const equipmentRef = doc(db, 'equipments', item.id);
        await updateDoc(equipmentRef, {
          status: 'borrowed',
          borrowerId: user.uid,
          borrowerName: user.displayName || 'Anonymous',
          checkoutDate: new Date().toISOString(),
          expectedReturnDate: returnDate,
          quantity: item.quantity - item.requestedQty
        });

        await addDoc(collection(db, 'history'), {
          equipmentId: item.id,
          action: 'borrowed',
          userId: user.uid,
          userName: user.displayName || 'Anonymous',
          date: new Date().toISOString(),
          purpose
        });
      }
      setCart([]);
      setPurpose('');
      setReturnDate('');
      alert('Equipment borrowed successfully!');
      document.querySelector('#cartModal .btn-close').click();
    } catch (error) {
      console.error('Borrow error:', error);
      alert('Failed to borrow equipment');
    }
  };

  return (
    <div>
      <h6>Cart Items:</h6>
      {cart.length === 0 ? (
        <div className="alert alert-info">Cart is empty</div>
      ) : (
        cart.map((item, index) => (
          <div key={item.id} className="cart-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{item.name}</strong>
                <br />
                <small>Serial: {item.serialNumber} | Qty: {item.requestedQty}</small>
              </div>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => setCart(cart.filter((_, i) => i !== index))}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        ))
      )}
      <div className="mt-3">
        <label className="form-label">Purpose (Optional)</label>
        <input
          type="text"
          className="form-control"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        />
      </div>
      <div className="mt-3">
        <label className="form-label">Expected Return Date</label>
        <input
          type="date"
          className="form-control"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>
      <button
        className="btn btn-success w-100 mt-3"
        onClick={handleBorrow}
        disabled={cart.length === 0}
      >
        <i className="bi bi-check-circle me-1"></i>Checkout
      </button>
    </div>
  );
}

export default BorrowForm;
