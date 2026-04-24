import React from 'react';

function Sidebar({ view, setView, onLogout, user }) {
  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'pos', icon: '🍽️', label: 'POS System' },
    { id: 'delivery', icon: '🛵', label: 'Delivery' },
    { id: 'history', icon: '📖', label: 'Orders' },
    ...(user.role !== 'Cashier' ? [{ id: 'admin', icon: '⚙️', label: 'Admin' }] : []),
  ];

  return (
    <aside className="sidebar no-print">
      <div className="sidebar-header">
        <div className="brand-logo">RB</div>
        <h2>RestoBill</h2>
      </div>
      
      <div className="sidebar-user">
        <div className="user-avatar">👤</div>
        <div className="user-info">
          <span className="user-name">{user.username}</span>
          <span className="user-role">{user.role}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button 
            key={item.id} 
            className={`sidebar-nav-btn ${view === item.id ? 'active' : ''}`}
            onClick={() => setView(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-nav-btn logout" onClick={onLogout}>
          <span className="nav-icon">🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
