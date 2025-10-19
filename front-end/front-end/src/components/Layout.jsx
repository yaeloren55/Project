import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import styles from '../styles/Layout.module.css';

const Layout = ({ children }) => {
  const user = authService.getUser();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    authService.logout();
  };
  
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1>Digital Wardrobe</h1>
        <nav>
          <Link to="/wardrobe">My Wardrobe</Link>
          <Link to="/outfits">Outfit Ideas</Link>
          <button 
            onClick={() => navigate('/wardrobe/add')} 
            className={styles.addItemBtn}
          >
            + Add Item
          </button>
          {user && <span className={styles.username}>Hi, {user.name}</span>}
          <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
        </nav>
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;