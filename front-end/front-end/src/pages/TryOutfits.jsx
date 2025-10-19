import React, { useState, useEffect } from 'react';
import { wardrobeService } from '../services/wardrobeService';
import { tryOnService } from '../services/tryOnService';
import Layout from '../components/Layout';
import styles from '../styles/TryOutfits.module.css';

const TryOutfits = () => {
  const [userImage, setUserImage] = useState(null);
  const [userImagePreview, setUserImagePreview] = useState(null);
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  useEffect(() => {
    loadWardrobeItems();
  }, []);

  const loadWardrobeItems = async () => {
    try {
      const result = await wardrobeService.fetchClothes();
      if (result.success) {
        setWardrobeItems(result.data);
      }
    } catch (error) {
      console.error('Error loading wardrobe items:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleGenerate = async () => {
    if (!userImage) {
      alert('Please upload an image of yourself');
      return;
    }
    if (selectedItems.length === 0) {
      alert('Please select at least one clothing item');
      return;
    }

    setLoading(true);

    try {
      const result = await tryOnService.generateTryOn(
        userImagePreview, // Send base64 image
        selectedItems,    // Send array of clothing IDs
        prompt
      );

      if (result.success) {
        setGeneratedImage(result.image);
      } else {
        alert('Failed to generate try-on: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error generating try-on:', error);
      alert('Error generating try-on. Please try again.');
    }

    setLoading(false);
  };

  const handleRemoveUserImage = () => {
    setUserImage(null);
    setUserImagePreview(null);
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `try-on-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearResult = () => {
    setGeneratedImage(null);
  };

  return (
    <Layout>
      <div className={styles.tryOutfits}>
        <h2>Try On Outfits</h2>

        <div className={styles.mainContainer}>
          {/* Left Side - Upload and Controls */}
          <div className={styles.leftSide}>
            {/* Upload Section */}
            <div className={styles.uploadSection}>
              <label className={styles.sectionLabel}>Your Photo</label>
              {!userImagePreview ? (
                <div className={styles.uploadBox}>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.fileInput}
                  />
                  <label htmlFor="imageUpload" className={styles.uploadLabel}>
                    <div className={styles.uploadIcon}>📷</div>
                    <p>Click to upload</p>
                    <span className={styles.uploadHint}>JPG, PNG up to 10MB</span>
                  </label>
                </div>
              ) : (
                <div className={styles.imagePreview}>
                  <img src={userImagePreview} alt="Your photo" />
                  <button
                    onClick={handleRemoveUserImage}
                    className={styles.removeBtn}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Prompt Section */}
            <div className={styles.promptSection}>
              <label className={styles.sectionLabel}>Instructions (Optional)</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Casual look, adjust fit..."
                className={styles.promptInput}
                rows={2}
              />
            </div>

            {/* Generate Button */}
            <div className={styles.generateSection}>
              <button
                onClick={handleGenerate}
                disabled={loading || !userImage || selectedItems.length === 0}
                className={styles.generateBtn}
              >
                {loading ? 'Generating...' : 'Generate Try-On'}
              </button>
              {selectedItems.length > 0 && (
                <p className={styles.selectedCount}>
                  {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          </div>

          {/* Middle - Result Area */}
          <div className={styles.middleSection}>
            <label className={styles.sectionLabel}>Generated Result</label>
            <div className={styles.resultArea}>
              <div className={styles.resultContent}>
                {loading ? (
                  <div className={styles.resultPlaceholder}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Generating your try-on...</p>
                    <p>This may take a few seconds</p>
                  </div>
                ) : generatedImage ? (
                  <div className={styles.resultImage}>
                    <img src={generatedImage} alt="Generated try-on" />
                  </div>
                ) : (
                  <div className={styles.resultPlaceholder}>
                    <div className={styles.placeholderIcon}>👔</div>
                    <p>Your generated try-on will appear here</p>
                    <p>Upload a photo and select clothes to start</p>
                  </div>
                )}
              </div>
              {generatedImage && !loading && (
                <div className={styles.resultActions}>
                  <button onClick={handleClearResult} className={styles.clearBtn}>
                    Clear
                  </button>
                  <button onClick={handleDownload} className={styles.downloadBtn}>
                    Download
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Wardrobe */}
          <div className={styles.rightSide}>
            <div className={styles.wardrobeHeader}>
              <label className={styles.sectionLabel}>Select Clothes from Wardrobe</label>
            </div>
            <div className={styles.wardrobeScroll}>
              <div className={styles.wardrobeGrid}>
                {wardrobeItems.map((item) => (
                  <div
                    key={item._id}
                    className={`${styles.wardrobeItem} ${
                      selectedItems.includes(item._id) ? styles.selected : ''
                    }`}
                    onClick={() => toggleItemSelection(item._id)}
                  >
                    <img
                      src={item.image_url || 'https://via.placeholder.com/150'}
                      alt={item.name}
                    />
                    <div className={styles.itemOverlay}>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemCategory}>{item.category}</p>
                    </div>
                    {selectedItems.includes(item._id) && (
                      <div className={styles.selectedMark}>✓</div>
                    )}
                  </div>
                ))}
              </div>
              {wardrobeItems.length === 0 && (
                <div className={styles.emptyWardrobe}>
                  <p>No items in wardrobe</p>
                  <p className={styles.emptyHint}>Add clothes to your wardrobe first</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TryOutfits;