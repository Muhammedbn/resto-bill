import React from 'react';

function Bill({ cart, onCheckout, isOnline, view, orderDetails }) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vat = subtotal * 0.05; // 5% VAT
  const total = subtotal + vat;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bill-container">
      <h2>Receipt</h2>
      
      {orderDetails && (
        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed #ccc', fontSize: '0.9rem' }}>
          {view === 'delivery' ? (
            <>
              <div><strong>Type:</strong> Delivery</div>
              <div><strong>Name:</strong> {orderDetails.customerName || 'N/A'}</div>
              <div><strong>Phone:</strong> {orderDetails.phone || 'N/A'}</div>
              <div><strong>Address:</strong> {orderDetails.address || 'N/A'}</div>
            </>
          ) : (
            <>
              <div><strong>Type:</strong> Dine-In</div>
              <div><strong>Table No:</strong> {orderDetails.tableNumber || 'N/A'}</div>
            </>
          )}
        </div>
      )}

      {cart.length === 0 ? (
        <p className="empty-state">Your cart is empty.</p>
      ) : (
        <div className="bill-details">
          <div className="bill-items">
            {cart.map(item => (
              <div key={item.id} className="bill-item">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <hr />
          <div className="bill-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>VAT (5%):</span>
              <span>${vat.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="bill-actions no-print" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="print-btn" onClick={handlePrint} style={{ marginTop: 0 }}>Print Bill</button>
            <button className={`checkout-btn ${!isOnline ? 'offline' : ''}`} onClick={onCheckout}>
              {isOnline ? 'Checkout (Sync)' : 'Checkout (Offline)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bill;
