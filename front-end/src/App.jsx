import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { authService } from './services/authService';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Wardrobe from './pages/Wardrobe';
import AddItem from './pages/AddItem';
import ItemDetail from './pages/ItemDetail';
import Outfits from './pages/Outfits';
import TryOutfits from './pages/TryOutfits';

// Protected Route Component
const ProtectedRoute = () => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/wardrobe" />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/wardrobe/add" element={<AddItem />} />
          <Route path="/wardrobe/item/:id" element={<ItemDetail />} />
          <Route path="/outfits" element={<Outfits />} />
          <Route path="/try-outfits" element={<TryOutfits />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;