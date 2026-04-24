import React, { useState, useEffect } from 'react';

function Dashboard({ setView }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, []);
  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
  const todaySales = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome back! Here is your summary for today.</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Today's Sales</h3>
            <p>${todaySales.toFixed(2)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🧾</div>
          <div className="stat-info">
            <h3>Today's Orders</h3>
            <p>{todayOrders.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛵</div>
          <div className="stat-info">
            <h3>Deliveries</h3>
            <p>{todayOrders.filter(o => o.orderType === 'Delivery').length}</p>
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Quick Actions</h3>
      <div className="dashboard-actions">
        <button className="dash-action-btn" onClick={() => setView('pos')}>
          <span className="action-icon">🍽️</span>
          <span>Dine-In / POS</span>
        </button>
        <button className="dash-action-btn" onClick={() => setView('delivery')}>
          <span className="action-icon">🛵</span>
          <span>Delivery</span>
        </button>
        <button className="dash-action-btn" onClick={() => setView('history')}>
          <span className="action-icon">📖</span>
          <span>Order History</span>
        </button>
        <button className="dash-action-btn" onClick={() => setView('admin')}>
          <span className="action-icon">⚙️</span>
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
