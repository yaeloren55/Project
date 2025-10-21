import React from 'react';
import styles from '../styles/ClothingCard.module.css';

const ClothingCard = ({ item, onClick }) => {
  // Handle both MongoDB _id and regular id
  const itemId = item._id || item.id;

  // Use base64 image if available, fallback to image_url for backward compatibility
  const imageUrl = item.image || item.image_url;
  
  // Format season array
  const seasonText = item.season?.length > 0 
    ? item.season.join(' • ') 
    : null;
  
  // Format occasion array (show first 2)
  const occasionText = item.occasion?.length > 0 
    ? item.occasion.slice(0, 2).join(', ') + (item.occasion.length > 2 ? '...' : '')
    : null;
  
  return (
    <div className={styles.card} onClick={() => onClick(itemId)}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={item.name} />

      </div>
      <div className={styles.info}>
        <div className={styles.mainInfo}>
          <h3>{item.name}</h3>
          {item.brand && <span className={styles.brand}>{item.brand}</span>}
        </div>
        
        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.category}>{item.category}</span>
            <span className={styles.dot}>•</span>
            <span className={styles.color}>{item.color}</span>
            {item.pattern && item.pattern !== 'None' && (
              <>
                <span className={styles.dot}>•</span>
                <span className={styles.pattern}>{item.pattern}</span>
              </>
            )}
          </div>
          
          {(item.material || item.fit) && (
            <div className={styles.detailRow}>
              {item.material && <span className={styles.material}>{item.material}</span>}
              {item.material && item.fit && <span className={styles.dot}>•</span>}
              {item.fit && <span className={styles.fit}>{item.fit} fit</span>}
            </div>
          )}
          
          {item.style && (
            <div className={styles.detailRow}>
              <span className={styles.style}>{item.style}</span>
            </div>
          )}
          
          {seasonText && (
            <div className={styles.seasonRow}>
              <span className={styles.seasonLabel}>Seasons:</span>
              <span className={styles.seasons}>{seasonText}</span>
            </div>
          )}
          
          {occasionText && (
            <div className={styles.occasionRow}>
              <span className={styles.occasionLabel}>For:</span>
              <span className={styles.occasions}>{occasionText}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClothingCard;