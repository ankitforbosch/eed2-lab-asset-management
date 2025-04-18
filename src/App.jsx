import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import Dashboard from './components/Dashboard';

const firebaseConfig = {
  apiKey: 'AIzaSyBkHwXBdCeRZIC5EipN6EB7EG1KTFaWqr0',
  authDomain: 'eed2-lab-asset-management.firebaseapp.com',
  projectId: 'eed2-lab-asset-management',
  storageBucket: 'eed2-lab-asset-management.firebasestorage.app',
  messagingSenderId: '440273155973',
  appId: '1:440273155973:web:24355d802e20b7936df6ec'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    signInAnonymously(auth)
      .then((result) => setUser(result.user))
      .catch((error) => console.error('Authentication error:', error));
  }, []);

  if (!user) {
    return <div className="container mt-4"><div className="alert alert-info">Loading...</div></div>;
  }

  return (
    <div className="min-vh-100 bg-light">
      <Dashboard db={db} user={user} />
    </div>
  );
}

export default App;
