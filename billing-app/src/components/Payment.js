import React, { useState } from 'react';

function Payment({ cart, total, onCompletePayment, onCancel }) {
  const [method, setMethod] = useState('Cash');
  const [amountGiven, setAmountGiven] = useState('');

  const handlePay = () => {
    onCompletePayment(method, amountGiven ? parseFloat(amountGiven) : total);
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <h2>Complete Payment</h2>
        <div className="payment-total">
          <span>Amount Due:</span>
          <span className="amount">${total.toFixed(2)}</span>
        </div>
        
        <div className="payment-methods">
          <button className={`pay-method-btn ${method === 'Cash' ? 'active' : ''}`} onClick={() => setMethod('Cash')}>💵 Cash</button>
          <button className={`pay-method-btn ${method === 'Card' ? 'active' : ''}`} onClick={() => setMethod('Card')}>💳 Card</button>
          <button className={`pay-method-btn ${method === 'UPI' ? 'active' : ''}`} onClick={() => setMethod('UPI')}>📱 UPI / Wallet</button>
        </div>

        {method === 'Cash' && (
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Amount Tendered ($)</label>
            <input type="number" value={amountGiven} onChange={e => setAmountGiven(e.target.value)} placeholder={`e.g. ${Math.ceil(total)}`} />
            {amountGiven && parseFloat(amountGiven) >= total && (
              <p style={{ color: 'var(--success)', marginTop: '0.5rem', fontWeight: 'bold' }}>Change: ${(parseFloat(amountGiven) - total).toFixed(2)}</p>
            )}
          </div>
        )}

        <div className="payment-actions">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="primary-btn" onClick={handlePay}>Confirm & Print</button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
