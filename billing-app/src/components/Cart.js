import React from 'react';

function Cart({ cart, onUpdateQuantity, onRemove, onClear, view, orderDetails, setOrderDetails }) {
  const handleChange = (field, value) => {
    setOrderDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="cart-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2>Order Details</h2>
      
      <div className="order-meta" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        {view === 'delivery' ? (
          <>
            <input type="text" placeholder="Customer Name" className="professional-input" value={orderDetails.customerName} onChange={(e) => handleChange('customerName', e.target.value)} />
            <input type="text" placeholder="Phone Number" className="professional-input" value={orderDetails.phone} onChange={(e) => handleChange('phone', e.target.value)} />
            <textarea placeholder="Delivery Address" className="professional-input" rows="2" value={orderDetails.address} onChange={(e) => handleChange('address', e.target.value)}></textarea>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label style={{ fontWeight: '600' }}>Table Number:</label>
            <input type="number" placeholder="e.g. 12" className="professional-input" style={{ width: '80px' }} value={orderDetails.tableNumber} onChange={(e) => handleChange('tableNumber', e.target.value)} />
          </div>
        )}
      </div>

      <h3 style={{ borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Cart Items</h3>
      {cart.length === 0 ? (
        <p className="empty-state">No items in cart.</p>
      ) : (
        <div className="cart-list">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p>${item.price.toFixed(2)}</p>
              </div>
              <div className="cart-actions">
                <button onClick={() => onUpdateQuantity(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, 1)}>+</button>
                <button className="remove-btn" onClick={() => onRemove(item.id)}>x</button>
              </div>
            </div>
          ))}
          <button className="clear-btn" onClick={onClear} style={{ marginTop: 'auto' }}>Clear Order</button>
        </div>
      )}
    </div>
  );
}

export default Cart;
