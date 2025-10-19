import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wardrobeService } from '../services/wardrobeService';
import Layout from '../components/Layout';
import ClothingCard from '../components/ClothingCard';
import FilterBar from '../components/FilterBar';
import styles from '../styles/Wardrobe.module.css';

const Wardrobe = () => {
  const [clothes, setClothes] = useState([]);
  const [filters, setFilters] = useState({ category: '', color: '', search: '', season: '', occasion: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    loadClothes();
  }, [filters]);
  
  const loadClothes = async () => {
    setLoading(true);
    const result = await wardrobeService.fetchClothes(filters);
    if (result.success) {
      setClothes(result.data);
    }
    setLoading(false);
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    wardrobeService.setFilters(newFilters);
  };
  
  return (
    <Layout>
      <div className={styles.wardrobe}>
        <div className={styles.mainContent}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : clothes.length === 0 ? (
            <div className={styles.empty}>
              No items found. Try adjusting your filters or add new items!
            </div>
          ) : (
            <div className={styles.grid}>
              {clothes.map(item => (
                <ClothingCard
                  key={item.id}
                  item={item}
                  onClick={(id) => navigate(`/wardrobe/item/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
        <div className={styles.sidebar}>
          <FilterBar filters={filters} onChange={handleFilterChange} />
        </div>
      </div>
    </Layout>
  );
};

export default Wardrobe;