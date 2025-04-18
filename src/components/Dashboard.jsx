import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import EquipmentList from './EquipmentList';
import BorrowForm from './BorrowForm';
import ReturnForm from './ReturnForm';
import SearchBar from './SearchBar';
import EquipmentHistory from './EquipmentHistory';
import AddEquipmentForm from './AddEquipmentForm';

function Dashboard({ db, user }) {
  const [equipments, setEquipments] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'equipments'), (snapshot) => {
      const equipmentData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEquipments(equipmentData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching equipments:', error);
      alert('Failed to load equipment data');
      setLoading(false);
    });
    return () => unsubscribe();
  }, [db]);

  const availableCount = equipments.filter(e => e.status === 'available').length;
  const borrowedCount = equipments.filter(e => e.status === 'borrowed').length;
  const maintenanceCount = equipments.filter(e => e.status === 'maintenance').length;

  if (loading) {
    return <div className="container mt-4"><div className="alert alert-info">Loading...</div></div>;
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container">
          <a className="navbar-brand" href="#" onClick={() => setCurrentView('dashboard')}>
            <i className="bi bi-pc-display-horizontal me-2"></i>EED2_LAB_ASSETS
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`} href="#" onClick={() => setCurrentView('dashboard')}>
                  <i className="bi bi-speedometer2 me-1"></i>Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${currentView === 'history' ? 'active' : ''}`} href="#" onClick={() => setCurrentView('history')}>
                  <i className="bi bi-clock-history me-1"></i>History Log
                </a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${currentView === 'return' ? 'active' : ''}`} href="#" onClick={() => setCurrentView('return')}>
                  <i className="bi bi-arrow-return-left me-1"></i>Return
                </a>
              </li>
            </ul>
            <a className="nav-link me-3" href="#" data-bs-toggle="modal" data-bs-target="#cartModal">
              <i className="bi bi-cart3 me-1"></i>Cart <span id="cartBadge" className="badge bg-danger">{cart.length}</span>
            </a>
            <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addEquipmentModal">
              <i className="bi bi-plus-lg me-1"></i>Add Equipment
            </button>
          </div>
        </div>
      </nav>

      <div className={`container view-container ${currentView === 'dashboard' ? 'active' : ''}`}>
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card text-white bg-success clickable-card" data-bs-toggle="modal" data-bs-target="#itemsModal" onClick={() => setSearchTerm('available')}>
              <div className="card-body text-center">
                <h5><i className="bi bi-check-circle me-1"></i>Available</h5>
                <h2>{availableCount}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-danger clickable-card" data-bs-toggle="modal" data-bs-target="#itemsModal" onClick={() => setSearchTerm('borrowed')}>
              <div className="card-body text-center">
                <h5><i className="bi bi-box-seam me-1"></i>Borrowed</h5>
                <h2>{borrowedCount}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-warning clickable-card" data-bs-toggle="modal" data-bs-target="#itemsModal" onClick={() => setSearchTerm('maintenance')}>
              <div className="card-body text-center">
                <h5><i className="bi bi-tools me-1"></i>Maintenance</h5>
                <h2>{maintenanceCount}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`container view-container ${currentView === 'history' ? 'active' : ''}`}>
        <EquipmentHistory db={db} equipments={equipments} />
      </div>

      <div className={`container view-container ${currentView === 'return' ? 'active' : ''}`}>
        <ReturnForm db={db} user={user} equipments={equipments} />
      </div>

      <div className="modal fade" id="itemsModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Equipment List</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <SearchBar setSearchTerm={setSearchTerm} />
              <EquipmentList equipments={equipments} searchTerm={searchTerm} cart={cart} setCart={setCart} />
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="cartModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Cart</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <BorrowForm db={db} user={user} cart={cart} setCart={setCart} equipments={equipments} />
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="addEquipmentModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Equipment</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <AddEquipmentForm db={db} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
