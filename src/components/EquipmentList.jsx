import React, { useEffect } from 'react';
import JsBarcode from 'jsbarcode';

function EquipmentList({ equipments, searchTerm, cart, setCart }) {
  const filteredEquipments = equipments.filter(equipment =>
    equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    searchTerm === equipment.status
  );

  const addToCart = (equipment, quantity) => {
    if (equipment.status === 'available' && !cart.find(item => item.id === equipment.id)) {
      setCart([...cart, { ...equipment, requestedQty: quantity }]);
    }
  };

  useEffect(() => {
    filteredEquipments.forEach(equipment => {
      if (equipment.status === 'available') {
        JsBarcode(`#barcode-${equipment.id}`, equipment.serialNumber, {
          format: 'CODE128',
          lineColor: '#000',
          width: 1.5,
          height: 40,
          displayValue: false
        });
      }
    });
  }, [filteredEquipments]);

  return (
    <div className="modal-grid">
      {filteredEquipments.map(equipment => (
        <div key={equipment.id} className="equipment-card">
          <h5>{equipment.name}</h5>
          <p><strong>Serial:</strong> {equipment.serialNumber}</p>
          <p><strong>Quantity:</strong> {equipment.quantity}</p>
          {equipment.status === 'borrowed' && (
            <p><strong>Borrower:</strong> {equipment.borrowerName}</p>
          )}
          {equipment.status === 'available' && (
            <svg className="barcode" id={`barcode-${equipment.id}`}></svg>
          )}
          {equipment.status === 'available' && (
            <div className="quantity-control mt-2">
              <input
                type="number"
                className="form-control form-control-sm"
                min="1"
                max={equipment.quantity}
                defaultValue="1"
                id={`qty-${equipment.id}`}
              />
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  const qty = parseInt(document.getElementById(`qty-${equipment.id}`).value);
                  if (qty > 0 && qty <= equipment.quantity) {
                    addToCart(equipment, qty);
                  } else {
                    alert('Invalid quantity');
                  }
                }}
              >
                <i className="bi bi-cart-plus"></i> Add
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default EquipmentList;
