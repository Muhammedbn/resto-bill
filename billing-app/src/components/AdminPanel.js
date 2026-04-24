import React, { useState } from 'react';

function AdminPanel({ menuItems, onAddMenuItem, onDeleteMenuItem, onUpdateMenuItem }) {
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Mains');
  const [icon, setIcon] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;
    
    if (editId) {
      onUpdateMenuItem(editId, {
        name,
        price: parseFloat(price),
        category,
        icon
      });
      setEditId(null);
    } else {
      onAddMenuItem({
        name,
        price: parseFloat(price),
        category,
        icon
      });
    }
    
    setName('');
    setPrice('');
    setCategory('Mains');
    setIcon('🍽️');
  };

  const handleEditClick = (item) => {
    setEditId(item.id);
    setName(item.name);
    setPrice(item.price.toString());
    setCategory(item.category || 'Mains');
    setIcon(item.icon);
    
    // Scroll to top or to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setName('');
    setPrice('');
    setCategory('Mains');
    setIcon('🍽️');
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <div className="admin-content">
        <div className="add-item-form-container">
          <h3>{editId ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
          <form className="add-item-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Item Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Steak" />
            </div>
            <div className="form-group">
              <label>Price ($)</label>
              <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required placeholder="e.g. 15.99" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input type="text" value={category} onChange={e => setCategory(e.target.value)} required placeholder="e.g. Mains, Drinks" />
            </div>
            <div className="form-group">
              <label>Image URL (or Emoji)</label>
              <input type="text" value={icon} onChange={e => setIcon(e.target.value)} required placeholder="e.g. https://... or 🍔" />
            </div>
            <div className="form-actions" style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="add-btn">
                {editId ? 'Update Item' : 'Add to Menu'}
              </button>
              {editId && (
                <button type="button" className="cancel-btn" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="manage-items-container">
          <h3>Manage Items</h3>
          {menuItems.length === 0 ? (
             <p className="empty-state">No items in the menu.</p>
          ) : (
            <div className="manage-list">
              {menuItems.map(item => (
                <div key={item.id} className="manage-item">
                  <div className="manage-info">
                    {item.icon && item.icon.startsWith('http') ? (
                      <img src={item.icon} alt="icon" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <span className="manage-icon">{item.icon}</span>
                    )}
                    <div className="manage-name-group">
                      <span className="manage-name">{item.name}</span>
                      <span className="manage-category-label">{item.category || 'Uncategorized'}</span>
                    </div>
                  </div>
                  <div className="manage-actions">
                    <span className="manage-price">${item.price.toFixed(2)}</span>
                    <button className="edit-btn" onClick={() => handleEditClick(item)}>Edit</button>
                    <button className="delete-btn" onClick={() => onDeleteMenuItem(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
