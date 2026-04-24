import React, { useState, useMemo } from 'react';

function Menu({ menuItems, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const cats = new Set(menuItems.map(item => item.category || 'Uncategorized'));
    return ['All', ...Array.from(cats)];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = activeCategory === 'All' || (item.category || 'Uncategorized') === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, searchQuery]);

  return (
    <div className="menu-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Menu</h2>
        <input 
          type="text" 
          placeholder="Search items..." 
          className="professional-input" 
          style={{ width: '250px' }}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      
      {menuItems.length === 0 ? (
         <p className="empty-state">No items in the menu. Please add some from the Admin Panel.</p>
      ) : (
        <>
          <div className="category-tabs" style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--surface-border)' }}>
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="pos-menu-grid" style={{ overflowY: 'auto', flex: 1, marginTop: '1rem', paddingBottom: '2rem' }}>
            {filteredItems.length === 0 && <p className="empty-state">No matching items found.</p>}
            {filteredItems.map(item => (
              <div key={item.id} className="pos-item-card" onClick={() => onAddToCart(item)}>
                <div className="pos-item-image">
                  {item.icon && item.icon.startsWith('http') ? (
                    <img src={item.icon} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    item.icon
                  )}
                </div>
                <div className="pos-item-details">
                  <h4>{item.name}</h4>
                  <span className="pos-item-price">${item.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Menu;
