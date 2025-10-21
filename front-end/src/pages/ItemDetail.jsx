import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { wardrobeService } from '../services/wardrobeService';
import Layout from '../components/Layout';
import styles from '../styles/ItemDetail.module.css';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadItem();
  }, [id]);
  
  const loadItem = async () => {
    setLoading(true);
    const result = await wardrobeService.getClothingItem(id);
    if (result.success) {
      setItem(result.data);
    } else {
      alert('Item not found');
      navigate('/wardrobe');
    }
    setLoading(false);
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const result = await wardrobeService.deleteClothingItem(id);
      if (result.success) {
        navigate('/wardrobe');
      } else {
        alert('Failed to delete item');
      }
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className={styles.loading}>Loading...</div>
      </Layout>
    );
  }
  
  if (!item) {
    return (
      <Layout>
        <div className={styles.notFound}>Item not found</div>
      </Layout>
    );
  }
  
  // Use base64 image if available, fallback to image_url for backward compatibility
  const imageUrl = item.image || item.image_url;
  
  return (
    <Layout>
      <div className={styles.itemDetail}>
        <div className={styles.header}>
          <button onClick={() => navigate('/wardrobe')} className={styles.backBtn}>
            ← Back
          </button>
          <button onClick={handleDelete} className={styles.deleteBtn}>
            Delete Item
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.imageSection}>
            <img src={imageUrl} alt={item.name} />
          
          </div>
          
          <div className={styles.infoSection}>
            <div className={styles.titleSection}>
              <h1>{item.name}</h1>
              {item.brand && <span className={styles.brand}>{item.brand}</span>}
            </div>
            
            <div className={styles.primaryDetails}>
              <div className={styles.detailGroup}>
                <h3>Basic Information</h3>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Category</span>
                  <span className={styles.value}>{item.category}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Color</span>
                  <span className={styles.value}>{item.color}</span>
                </div>
                {item.pattern && item.pattern !== 'None' && (
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Pattern</span>
                    <span className={styles.value}>{item.pattern}</span>
                  </div>
                )}
                {item.material && (
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Material</span>
                    <span className={styles.value}>{item.material}</span>
                  </div>
                )}
              </div>
              
              <div className={styles.detailGroup}>
                <h3>Fit & Style</h3>
                {item.style && (
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Style</span>
                    <span className={styles.value}>{item.style}</span>
                  </div>
                )}
                {item.fit && (
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Fit</span>
                    <span className={styles.value}>{item.fit}</span>
                  </div>
                )}
                {item.gender && (
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Gender</span>
                    <span className={styles.value}>{item.gender}</span>
                  </div>
                )}
              </div>
            </div>
            
            {(item.season && item.season.length > 0) && (
              <div className={styles.tagSection}>
                <h3>Seasons</h3>
                <div className={styles.tags}>
                  {item.season.map((season, index) => (
                    <span key={index} className={styles.tag}>
                      {season}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {(item.occasion && item.occasion.length > 0) && (
              <div className={styles.tagSection}>
                <h3>Occasions</h3>
                <div className={styles.tags}>
                  {item.occasion.map((occasion, index) => (
                    <span key={index} className={styles.tag}>
                      {occasion}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {item.notes && (
              <div className={styles.notesSection}>
                <h3>Notes</h3>
                <p>{item.notes}</p>
              </div>
            )}
            
            {item.created_at && (
              <div className={styles.metadata}>
                <span>Added on {new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;