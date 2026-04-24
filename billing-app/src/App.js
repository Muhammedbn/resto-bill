import React, { useState, useEffect } from 'react';
import './App.css';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Bill from './components/Bill';
import AdminPanel from './components/AdminPanel';
import OrderHistory from './components/OrderHistory';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Payment from './components/Payment';

const DEFAULT_MENU = [
  { id: 1, name: 'Burger', price: 5.99, icon: '🍔', category: 'Mains' },
  { id: 2, name: 'Pizza', price: 12.99, icon: '🍕', category: 'Mains' },
  { id: 3, name: 'Pasta', price: 8.99, icon: '🍝', category: 'Mains' },
  { id: 4, name: 'Salad', price: 6.50, icon: '🥗', category: 'Starters' },
  { id: 5, name: 'Soda', price: 1.99, icon: '🥤', category: 'Drinks' },
  { id: 6, name: 'Coffee', price: 2.50, icon: '☕', category: 'Drinks' },
  { id: 7, name: 'Fries', price: 3.50, icon: '🍟', category: 'Sides' },
  { id: 8, name: 'Sandwich', price: 7.99, icon: '🥪', category: 'Mains' },
];

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'pos', 'delivery', 'admin', 'history'
  const [showPayment, setShowPayment] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    tableNumber: '',
    customerName: '',
    phone: '',
    address: ''
  });
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU);

  useEffect(() => {
    // Fetch menu from backend on load
    fetch('http://localhost:5001/api/menu')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setMenuItems(data);
        }
      })
      .catch(err => console.error('Failed to fetch menu:', err));
  }, []);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('restaurant_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const syncOfflineOrders = async () => {
      const offlineOrders = JSON.parse(localStorage.getItem('offline_orders') || '[]');
      if (offlineOrders.length === 0) return;

      try {
        // Sync with our new local backend
        for (const order of offlineOrders) {
          await fetch('http://localhost:5001/api/orders', {
            method: 'POST',
            body: JSON.stringify(order),
            headers: { 'Content-type': 'application/json' },
          });
        }
        localStorage.removeItem('offline_orders');
        alert('Back online! Successfully synced ' + offlineOrders.length + ' offline orders.');
      } catch (error) {
        console.error('Failed to sync offline orders:', error);
      }
    };

    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineOrders();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Sync menu with local storage as a backup
    localStorage.setItem('restaurant_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  const syncMenuToBackend = async (newMenu) => {
    try {
      await fetch('http://localhost:5001/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItems: newMenu })
      });
    } catch (error) {
      console.error('Failed to sync menu to backend', error);
    }
  };

  useEffect(() => {
    localStorage.setItem('restaurant_cart', JSON.stringify(cart));
  }, [cart]);

  const addMenuItem = (item) => {
    const newMenu = [...menuItems, { ...item, id: Date.now() }];
    setMenuItems(newMenu);
    syncMenuToBackend(newMenu);
  };

  const deleteMenuItem = (id) => {
    const newMenu = menuItems.filter(item => item.id !== id);
    setMenuItems(newMenu);
    setCart(prev => prev.filter(item => item.id !== id));
    syncMenuToBackend(newMenu);
  };

  const updateMenuItem = (id, updatedItem) => {
    const newMenu = menuItems.map(item => item.id === id ? { ...item, ...updatedItem } : item);
    setMenuItems(newMenu);
    setCart(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item));
    syncMenuToBackend(newMenu);
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setOrderDetails({ tableNumber: '', customerName: '', phone: '', address: '' });
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) return alert('Cart is empty!');
    setShowPayment(true);
  };

  const handleCompletePayment = async (method, amountGiven) => {
    setShowPayment(false);
    
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const vat = subtotal * 0.05;
    const total = subtotal + vat;

    const orderData = {
      items: cart,
      subtotal,
      vat,
      total,
      paymentMethod: method,
      amountGiven,
      orderType: view === 'delivery' ? 'Delivery' : 'Dine-In',
      orderDetails,
      createdAt: new Date().toISOString(),
    };

    const saveOrderOffline = () => {
      const offlineOrders = JSON.parse(localStorage.getItem('offline_orders') || '[]');
      offlineOrders.push(orderData);
      localStorage.setItem('offline_orders', JSON.stringify(offlineOrders));
      alert('You are offline! Order saved locally. It will sync automatically when back online.');
      clearCart();
    };

    if (isOnline) {
      try {
        // Attempt backend checkout
        const response = await fetch('http://localhost:5001/api/orders', {
          method: 'POST',
          body: JSON.stringify(orderData),
          headers: { 'Content-type': 'application/json' },
        });
        
        if (!response.ok) throw new Error('Backend failed');
        
        alert('Order successfully saved to Backend Database!');
        clearCart();
      } catch (error) {
        saveOrderOffline();
      }
    } else {
      saveOrderOffline();
    }
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const renderContent = () => {
    if (view === 'dashboard') {
      return <Dashboard setView={setView} />;
    } else if (view === 'admin') {
      if (user.role === 'Cashier') {
        return <div className="offline-banner" style={{position:'static'}}>Access Denied. Administrator or Manager role required.</div>;
      }
      return (
        <AdminPanel 
          menuItems={menuItems} 
          onAddMenuItem={addMenuItem} 
          onDeleteMenuItem={deleteMenuItem} 
          onUpdateMenuItem={updateMenuItem} 
        />
      );
    } else if (view === 'history') {
      return <OrderHistory />;
    } else {
      // 'pos' or 'delivery' view
      return (
        <div className="pos-layout">
          <div className="left-pane no-print">
            <Menu menuItems={menuItems} onAddToCart={addToCart} />
          </div>
          <div className="middle-pane no-print">
            <Cart 
              cart={cart} 
              onUpdateQuantity={updateQuantity} 
              onRemove={removeFromCart} 
              onClear={clearCart}
              view={view}
              orderDetails={orderDetails}
              setOrderDetails={setOrderDetails}
            />
          </div>
          <div className="right-pane print-only">
            <Bill cart={cart} onCheckout={handleCheckoutClick} isOnline={isOnline} view={view} orderDetails={orderDetails} />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="app-container professional-layout">
      <Sidebar view={view} setView={setView} onLogout={() => setUser(null)} user={user} />
      
      <main className="app-main-content">
        <header className="content-header no-print">
          <h1>{view === 'pos' ? 'Dine-In POS' : view === 'delivery' ? 'Delivery Orders' : view.charAt(0).toUpperCase() + view.slice(1)}</h1>
          <div className="header-status">
            {isOnline ? <span className="status online">🟢 Online</span> : <span className="status offline">🔴 Offline Mode</span>}
          </div>
        </header>
        
        <div className="content-scroll">
          {renderContent()}
        </div>
      </main>

      {showPayment && (
        <Payment 
          cart={cart} 
          total={cart.reduce((t, i) => t + i.price * i.quantity, 0) * 1.05} 
          onCancel={() => setShowPayment(false)} 
          onCompletePayment={handleCompletePayment} 
        />
      )}
      
      {!isOnline && (
        <div className="offline-banner">
          You are currently offline. Orders will be saved locally and synced when you reconnect.
        </div>
      )}
    </div>
  );
}

export default App;
