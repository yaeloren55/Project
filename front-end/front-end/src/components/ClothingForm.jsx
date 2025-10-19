import React from 'react';
import { 
  CATEGORIES, 
  COLORS, 
  PATTERNS, 
  MATERIALS, 
  STYLES, 
  FITS, 
  SEASONS, 
  OCCASION_OPTIONS, 
  GENDERS 
} from '../utils/constants';
import styles from '../styles/ClothingForm.module.css';

const ClothingForm = ({ formData, setFormData, image, setImage, onSubmit, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    if (image) data.append('image', image);
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        if (Array.isArray(formData[key])) {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      }
    });
    
    // Add category and color names for mock data
    const category = CATEGORIES.find(c => c.id === parseInt(formData.category_id));
    const color = COLORS.find(c => c.id === parseInt(formData.color_id));
    if (category) data.append('category_name', category.name);
    if (color) data.append('color_name', color.name);
    
    onSubmit(data);
  };
  
  const handleMultiSelect = (field, value) => {
    const currentValues = formData[field] || [];
    if (currentValues.includes(value)) {
      setFormData({
        ...formData,
        [field]: currentValues.filter(v => v !== value)
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...currentValues, value]
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.imageUpload}>
        <label className={styles.uploadLabel}>Image</label>
        <div className={styles.uploadArea}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            id="image-upload"
            className={styles.hiddenInput}
          />
          <label htmlFor="image-upload" className={styles.uploadButton}>
            {image ? (
              <>
                <svg className={styles.uploadIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>{image.name}</span>
              </>
            ) : (
              <>
                <svg className={styles.uploadIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span>Choose Image</span>
                <span className={styles.uploadHint}>or drag and drop</span>
              </>
            )}
          </label>
        </div>
      </div>
      
      {/* Row 1: Name and Category */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Category *</label>
          <select
            value={formData.category_id}
            onChange={(e) => setFormData({...formData, category_id: e.target.value})}
            required
          >
            <option value="">Select</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Row 2: Color and Pattern */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Color *</label>
          <select
            value={formData.color_id}
            onChange={(e) => setFormData({...formData, color_id: e.target.value})}
            required
          >
            <option value="">Select</option>
            {COLORS.map(color => (
              <option key={color.id} value={color.id}>{color.name}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>Pattern</label>
          <select
            value={formData.pattern}
            onChange={(e) => setFormData({...formData, pattern: e.target.value})}
          >
            <option value="">Select</option>
            {PATTERNS.map(pattern => (
              <option key={pattern} value={pattern}>{pattern}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Row 3: Material and Style */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Material</label>
          <select
            value={formData.material}
            onChange={(e) => setFormData({...formData, material: e.target.value})}
          >
            <option value="">Select</option>
            {MATERIALS.map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>Style</label>
          <select
            value={formData.style}
            onChange={(e) => setFormData({...formData, style: e.target.value})}
          >
            <option value="">Select</option>
            {STYLES.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Row 4: Fit and Size */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Fit</label>
          <select
            value={formData.fit}
            onChange={(e) => setFormData({...formData, fit: e.target.value})}
          >
            <option value="">Select</option>
            {FITS.map(fit => (
              <option key={fit} value={fit}>{fit}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>Size</label>
          <input
            type="text"
            value={formData.size}
            onChange={(e) => setFormData({...formData, size: e.target.value})}
            placeholder="e.g., M, L, 38"
          />
        </div>
      </div>
      
      {/* Row 5: Gender and Brand */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}
          >
            <option value="">Select</option>
            {GENDERS.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>Brand</label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => setFormData({...formData, brand: e.target.value})}
          />
        </div>
      </div>
      
      {/* Multi-select sections */}
      <div className={styles.multiSelectSection}>
        <label>Seasons</label>
        <div className={styles.checkboxGroup}>
          {SEASONS.map(season => (
            <label key={season} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={(formData.season || []).includes(season)}
                onChange={() => handleMultiSelect('season', season)}
              />
              <span>{season}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className={styles.multiSelectSection}>
        <label>Occasions</label>
        <div className={styles.checkboxGroup}>
          {OCCASION_OPTIONS.map(occasion => (
            <label key={occasion} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={(formData.occasion || []).includes(occasion)}
                onChange={() => handleMultiSelect('occasion', occasion)}
              />
              <span>{occasion}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Features and Notes */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Features</label>
          <input
            type="text"
            value={(formData.features || []).join(', ')}
            onChange={(e) => setFormData({
              ...formData, 
              features: e.target.value.split(',').map(f => f.trim()).filter(f => f)
            })}
            placeholder="e.g., pockets, buttons, zipper"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Notes</label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Item'}
      </button>
    </form>
  );
};

export default ClothingForm;