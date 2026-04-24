import React, { useState, useEffect } from 'react';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders from backend');
      const data = await response.json();
      
      // Sort orders by most recent first
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="history-container"><div className="history-status">Loading history...</div></div>;
  if (error) return <div className="history-container"><div className="history-status error">Error: {error}</div></div>;

  return (
    <div className="history-container">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p className="empty-state">No past orders found.</p>
      ) : (
        <div className="history-list">
          {orders.map(order => (
            <div key={order.id} className="history-card">
              <div className="history-header">
                <div>
                  <span className="history-id" style={{ display: 'block' }}>Order #{order.id}</span>
                  <span className="history-date" style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: '600', color: 'var(--accent)', display: 'block' }}>
                    {order.orderType === 'Delivery' ? 'Delivery' : 'Dine-In'}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {order.orderType === 'Delivery' 
                      ? (order.orderDetails?.customerName || 'No Name')
                      : `Table ${order.orderDetails?.tableNumber || 'N/A'}`
                    }
                  </span>
                </div>
              </div>
              
              <div className="history-items">
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} className="history-item">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="history-footer">
                <span>Total (incl. VAT)</span>
                <span className="history-total">${order.total ? order.total.toFixed(2) : '0.00'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
