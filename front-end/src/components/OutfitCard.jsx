import React from 'react';
import styles from '../styles/OutfitCard.module.css';

const OutfitCard = ({ outfit }) => {
  return (
    <div className={styles.outfitCard}>
      <h3 className={styles.title}>Outfit Suggestion</h3>
      <div className={styles.items}>
        {Object.entries(outfit).map(([type, item]) => {
          // Use base64 image if available, fallback to image_url for backward compatibility
          const imageUrl = item.image || item.image_url;
            
          return (
            <div key={type} className={styles.itemSection}>
              <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
              <div className={styles.item}>
                <img src={imageUrl} alt={item.name} />
                <p>{item.name}</p>
                <span>{item.brand}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OutfitCard;