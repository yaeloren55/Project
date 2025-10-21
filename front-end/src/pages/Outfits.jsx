import React, { useState } from 'react';
import { wardrobeService } from '../services/wardrobeService';
import Layout from '../components/Layout';
import OutfitCard from '../components/OutfitCard';
import styles from '../styles/Outfits.module.css';

const Outfits = () => {
  const [query, setQuery] = useState('');
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [useAI, setUseAI] = useState(true);
  const [occasion, setOccasion] = useState('');

  const generateOutfitsWithAI = async () => {
    if (!query.trim()) {
      alert('Please describe what kind of outfit you need');
      return;
    }

    setLoading(true);
    try {
      const result = await wardrobeService.getAIOutfitSuggestions(query);
      if (result.success && result.data) {
        setAiResponse(result.data);
        setOutfits(result.data.outfits || []);

        if (result.data.outfits.length === 0) {
          alert('No suitable outfits found. Try a different query or add more items to your wardrobe!');
        }
      } else {
        alert('Failed to get AI suggestions: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      alert('Error getting outfit suggestions. Please try again.');
    }
    setLoading(false);
  };

  const generateOutfitsClassic = async () => {
    if (!occasion) {
      alert('Please select an occasion');
      return;
    }

    setLoading(true);
    const result = await wardrobeService.getOutfitSuggestions(occasion);
    if (result.success) {
      setOutfits(result.data);
      if (result.data.length === 0) {
        alert('Not enough items in your wardrobe for this occasion. Add more items!');
      }
    } else {
      alert('Failed to get suggestions: ' + result.error);
    }
    setLoading(false);
  };

  const exampleQueries = [
    "What should I wear for a job interview tomorrow?",
    "I need a casual outfit for a weekend brunch",
    "Help me dress for a beach vacation",
    "What's good for a first date at a nice restaurant?",
    "I'm going to a wedding as a guest",
    "Need something comfortable for working from home",
    "What can I wear to the gym?",
    "Business casual for a conference"
  ];

  const handleExampleClick = (example) => {
    setQuery(example);
  };

  return (
    <Layout>
      <div className={styles.outfits}>
        <h2>Outfit Suggestions</h2>

        <div className={styles.formContainer}>
          <div className={styles.modeSection}>
            <label className={styles.modeLabel}>Mode</label>
            <div className={styles.modeOptions}>
              <button
                className={`${styles.modeBtn} ${useAI ? styles.active : ''}`}
                onClick={() => {
                  setUseAI(true);
                  setOutfits([]);
                  setAiResponse(null);
                }}
              >
                AI Assistant
              </button>
              <button
                className={`${styles.modeBtn} ${!useAI ? styles.active : ''}`}
                onClick={() => {
                  setUseAI(false);
                  setOutfits([]);
                  setAiResponse(null);
                }}
              >
                Classic
              </button>
            </div>
          </div>

          {useAI ? (
            <>
              <div className={styles.inputGroup}>
                <label htmlFor="query">What outfit do you need?</label>
                <textarea
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe the occasion or style you need..."
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.examples}>
                <label>Quick Examples:</label>
                <div className={styles.exampleList}>
                  {exampleQueries.slice(0, 4).map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      className={styles.exampleBtn}
                      onClick={() => handleExampleClick(example)}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  onClick={generateOutfitsWithAI}
                  disabled={loading}
                  className={styles.submitBtn}
                >
                  {loading ? 'Generating...' : 'Generate Outfits'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.inputGroup}>
                <label htmlFor="occasion">Select Occasion</label>
                <select
                  id="occasion"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Choose an occasion...</option>
                  <option value="casual">Casual</option>
                  <option value="work">Work</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              <div className={styles.actions}>
                <button
                  onClick={generateOutfitsClassic}
                  disabled={loading || !occasion}
                  className={styles.submitBtn}
                >
                  {loading ? 'Generating...' : 'Get Suggestions'}
                </button>
              </div>
            </>
          )}
        </div>

        {aiResponse && useAI && (
          <div className={styles.aiInsights}>
            {aiResponse.general_advice && (
              <div className={styles.advice}>
                <h3>Style Advice</h3>
                <p>{aiResponse.general_advice}</p>
              </div>
            )}

            {aiResponse.missing_items && aiResponse.missing_items.length > 0 && (
              <div className={styles.missing}>
                <h3>Consider Adding to Your Wardrobe:</h3>
                <ul>
                  {aiResponse.missing_items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {outfits.length > 0 && (
          <div className={styles.suggestions}>
            <h3>Suggested Outfits</h3>
            {outfits.map((outfit, index) => (
              <div key={index} className={styles.outfitContainer}>
                {useAI && outfit.name && (
                  <h4 className={styles.outfitName}>{outfit.name}</h4>
                )}

                {useAI && outfit.itemDetails ? (
                  <div className={styles.aiOutfitItems}>
                    {outfit.itemDetails.map((item) => (
                      <div key={item._id} className={styles.aiItem}>
                        <img
                          src={item.image || item.image_url || 'https://via.placeholder.com/300x400/f0f0f0/767676?text=No+Image'}
                          alt={item.name}
                          className={styles.itemImage}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x400/f0f0f0/767676?text=No+Image';
                          }}
                        />
                        <div className={styles.itemInfo}>
                          <p className={styles.itemName}>{item.name}</p>
                          <p className={styles.itemDetails}>
                            {item.color} {item.category}
                            {item.brand && ` • ${item.brand}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <OutfitCard outfit={outfit} />
                )}
              </div>
            ))}
          </div>
        )}

        {outfits.length === 0 && !loading && (
          <div className={styles.empty}>
            {useAI
              ? "Ask me what you should wear, and I'll suggest outfits from your wardrobe!"
              : "Select an occasion to get outfit suggestions based on your wardrobe"
            }
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Outfits;