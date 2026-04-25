import React, { useState, useMemo } from 'react';

function Menu({ menuItems, onAddToCart, cart = [] }) {
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

  const renderItemCard = (item, index) => {
    const cartItem = cart.find(c => c.id === item.id);
    const count = cartItem ? cartItem.quantity : 0;
    return (
      <div 
        key={item.id} 
        className="pos-item-card" 
        onClick={() => onAddToCart(item)}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        {count > 0 && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'var(--success)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            zIndex: 10,
            boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)',
            animation: 'slideUpFade 0.2s ease forwards'
          }}>
            {count}
          </div>
        )}
        <div className="pos-item-image">
          {item.icon && (item.icon.startsWith('http') || item.icon.startsWith('data:')) ? (
            <img src={item.icon} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            item.icon
          )}
        </div>
        <div className="pos-item-details">
          <div style={{ fontSize: '0.75rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem', fontWeight: 'bold' }}>
            {item.category || 'Uncategorized'}
          </div>
          <h4>{item.name}</h4>
          <span className="pos-item-price">${item.price.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="menu-container" style={{ display: 'flex', flexDirection: 'column' }}>
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
          <div className="category-tabs">
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
          <div className="pos-menu-grid" style={{ flex: 1, marginTop: '1rem', paddingBottom: '2rem' }}>
            {filteredItems.length === 0 && <p className="empty-state" style={{ gridColumn: '1 / -1' }}>No matching items found.</p>}
            
            {activeCategory === 'All' && !searchQuery ? (
              categories.filter(c => c !== 'All').map(cat => {
                const itemsInCat = filteredItems.filter(i => (i.category || 'Uncategorized') === cat);
                if (itemsInCat.length === 0) return null;
                return (
                  <React.Fragment key={cat}>
                    <h3 style={{ gridColumn: '1 / -1', margin: '1.5rem 0 0.5rem 0', color: 'var(--text-secondary)', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem', fontSize: '1.3rem' }}>{cat}</h3>
                    {itemsInCat.map((item, index) => renderItemCard(item, index))}
                  </React.Fragment>
                );
              })
            ) : (
              filteredItems.map((item, index) => renderItemCard(item, index))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Menu;
