import React from 'react';
import { CATEGORIES, COLORS, SEASONS, OCCASION_OPTIONS } from '../utils/constants';
import styles from '../styles/FilterBar.module.css';

const FilterBar = ({ filters, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };
  
  return (
    <div className={styles.filterBar}>
      <h3 className={styles.filterTitle}>FILTERS</h3>
      
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>SEARCH</label>
        <input
          type="text"
          placeholder="Search items..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className={styles.searchInput}
        />
      </div>
      
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>CATEGORY</label>
        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className={styles.select}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>
      
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>COLOR</label>
        <select
          value={filters.color}
          onChange={(e) => handleChange('color', e.target.value)}
          className={styles.select}
        >
          <option value="">All Colors</option>
          {COLORS.map(color => (
            <option key={color.id} value={color.name}>{color.name}</option>
          ))}
        </select>
      </div>
      
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>SEASON</label>
        <select
          value={filters.season || ''}
          onChange={(e) => handleChange('season', e.target.value)}
          className={styles.select}
        >
          <option value="">All Seasons</option>
          {SEASONS.map(season => (
            <option key={season} value={season}>{season}</option>
          ))}
        </select>
      </div>
      
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>OCCASION</label>
        <select
          value={filters.occasion || ''}
          onChange={(e) => handleChange('occasion', e.target.value)}
          className={styles.select}
        >
          <option value="">All Occasions</option>
          {OCCASION_OPTIONS.map(occasion => (
            <option key={occasion} value={occasion}>{occasion}</option>
          ))}
        </select>
      </div>
      
      <button
        onClick={() => onChange({ category: '', color: '', search: '', season: '', occasion: '' })}
        className={styles.clearBtn}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterBar;