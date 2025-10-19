import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wardrobeService } from '../services/wardrobeService';
import { CATEGORIES, COLORS } from '../utils/constants';
import Layout from '../components/Layout';
import ClothingForm from '../components/ClothingForm';
import styles from '../styles/AddItem.module.css';

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    color_id: '',
    size: '',
    brand: '',
    notes: '',
    pattern: '',
    material: '',
    style: '',
    fit: '',
    season: [],
    occasion: [],
    gender: '',
    features: []
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();
  
  const handleAnalyzeImage = async () => {
    if (!image) {
      alert('Please select an image first');
      return;
    }
    
    setAnalyzing(true);
    
    try {
      const result = await wardrobeService.analyzeClothingImage(image);
      
      if (result.success && result.data) {
        const analysis = result.data;
        
        // Map the analysis results to form data
        const categoryObj = CATEGORIES.find(c => c.name === analysis.category);
        const colorObj = COLORS.find(c => c.name === analysis.color);
        
        // Update form with analyzed data
        setFormData({
          name: analysis.name || '',
          category_id: categoryObj ? categoryObj.id.toString() : '',
          color_id: colorObj ? colorObj.id.toString() : '',
          size: analysis.suggested_size || formData.size || '',
          brand: analysis.brand || '',
          notes: analysis.notes || '',
          pattern: analysis.pattern || '',
          material: analysis.material || '',
          style: analysis.style || '',
          fit: analysis.fit || '',
          season: analysis.season || [],
          occasion: analysis.occasion || [],
          gender: analysis.gender || '',
          features: analysis.features || []
        });
        
        alert('Image analyzed successfully! Form has been auto-filled.');
      } else {
        alert(result.message || 'Analysis failed but returned default values');
        
        // Even on failure, if we have data, use it
        if (result.data) {
          const analysis = result.data;
          const categoryObj = CATEGORIES.find(c => c.name === analysis.category);
          const colorObj = COLORS.find(c => c.name === analysis.color);
          
          setFormData({
            name: analysis.name || '',
            category_id: categoryObj ? categoryObj.id.toString() : '',
            color_id: colorObj ? colorObj.id.toString() : '',
            size: analysis.suggested_size || formData.size || '',
            brand: analysis.brand || '',
            notes: analysis.notes || '',
            pattern: analysis.pattern || '',
            material: analysis.material || '',
            style: analysis.style || '',
            fit: analysis.fit || '',
            season: analysis.season || [],
            occasion: analysis.occasion || [],
            gender: analysis.gender || '',
            features: analysis.features || []
          });
        }
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze image: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };
  
  const handleSubmit = async (data) => {
    setLoading(true);
    
    const result = await wardrobeService.addClothingItem(data);
    
    if (result.success) {
      navigate('/wardrobe');
    } else {
      alert('Failed to add item: ' + result.error);
    }
    setLoading(false);
  };
  
  return (
    <Layout>
      <div className={styles.addItem}>
        <div className={styles.header}>
          <h2>Add New Item</h2>
          <button onClick={() => navigate('/wardrobe')} className={styles.backBtn}>
            Back to Wardrobe
          </button>
        </div>
        
        {/* AI Analysis Section */}
        {image && (
          <div className={styles.aiSection}>
            <button 
              onClick={handleAnalyzeImage}
              disabled={analyzing}
              className={styles.analyzeBtn}
            >
              {analyzing ? 'Analyzing...' : 'Analyze with AI'}
            </button>
          </div>
        )}
        
        <ClothingForm 
          formData={formData}
          setFormData={setFormData}
          image={image}
          setImage={setImage}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </Layout>
  );
};

export default AddItem;