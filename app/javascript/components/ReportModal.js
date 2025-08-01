import React, { useState, useEffect } from 'react';
import DifficultySlider from './DifficultySlider';
import ImageSelector from './ImageSelector';

function ReportModal({ snippet, onClose }) {
  // UI State
  const [loading, setLoading] = useState(true);
  const [showSuccessfulReportView, setShowSuccessfulReportView] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [loadingCovers, setLoadingCovers] = useState(false);
  const [error, setError] = useState(null);
  
  // Form State
  const [wrongFields, setWrongFields] = useState({});
  const [suggestions, setSuggestions] = useState({});  
  const [isBoring, setIsBoring] = useState(false);
  
  // External Data
  const [languages, setLanguages] = useState([]);
  const [alternativeCovers, setAlternativeCovers] = useState([]);
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/languages')
        if (response.ok) {
          const data = await response.json()
          setLanguages(data)
        } else {
          setError('Failed to load languages - Please try again');
        }
      } catch (error) {
        setError('Failed to load languages - Please try again');
      } finally {
        setLoading(false);
      }
    }

    fetchLanguages();
  }, [])

  // Computed Values
  const selectableLanguages = languages.filter(lang => lang !== snippet?.language);

  // Utility/Helper Functions
  const buildFieldClasses = (fieldName) => {
    let classes = 'report-field';
    
    if (wrongFields[fieldName]) {
      classes += ' report-field--selected';
    }
    
    if (isBoring) {
      classes += ' report-field--disabled';
    }
    
    return classes;
  };

  const calculateWordSimilarity = (original, suggestion) => {
    const originalWords = original.toLowerCase().split(/\s+/);
    const suggestedWords = suggestion.toLowerCase().split(/\s+/); 
    const matches = originalWords.filter(word => suggestedWords.includes(word));
    
    return matches.length / originalWords.length;
  };

  const getCSRFToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta && meta.getAttribute('content');
  };

  // Form Logic
  const toggleField = (field) => {
    setWrongFields({...wrongFields, [field]: !wrongFields[field]});
  };

  const validateSubmission = () => {
    if (isBoring) {
      return { valid: true };
    }

    const fieldsNeedingSuggestions = ['artist', 'song', 'snippet', 'difficulty', 'language'];
      for (const field of fieldsNeedingSuggestions) {
        if (wrongFields[field]) {
          const suggestion = suggestions[field];
          if (field === 'difficulty') {
            if (!suggestion) {
              return { valid: false, message: "Please adjust the difficulty slider" };
            }
          // } else if (field === 'language') {
          //   if (!suggestion || suggestion === snippet?.language) {
          //     return { valid: false, message: "Please select a different language" };
          //   }
          } else {
            if (!suggestion) {
              return { valid: false, message: `Please provide a suggestion for ${field}` };
            }
          }
        }
      }
  
    if (wrongFields.snippet && suggestions.snippet) {
      const similarity = calculateWordSimilarity(snippet.snippet, suggestions.snippet);
      if (similarity < 0.5) {
        return { valid: false, message: "Snippet changes must be minor (keep half of the original words)" };
      }
    }
  
    const hasIssues = Object.values(wrongFields).some(val => val);
    return hasIssues ? { valid: true } : { valid: false, message: "Select at least one issue" };
  };

  const reportData = (wrongFields, suggestions, isBoring) => {
    return {
      snippet_report: {
        is_boring: isBoring,
        wrong_artist: wrongFields.artist || false,
        wrong_song: wrongFields.song || false,
        wrong_snippet: wrongFields.snippet || false,
        wrong_difficulty: wrongFields.difficulty || false,
        wrong_language: wrongFields.language || false,
        wrong_image: wrongFields.image || false,
        suggested_artist: suggestions.artist || null,
        suggested_song: suggestions.song || null,
        suggested_snippet: suggestions.snippet || null,
        suggested_difficulty: suggestions.difficulty || null,
        suggested_language: suggestions.language || null,
        suggested_image: suggestions.image || null,
      }
    }
  };

  // API/Side Effects
  const handleSubmit = async() => {
    const validation = validateSubmission();
    if (validation.valid) {
      try {
        const report = reportData(wrongFields, suggestions, isBoring);
        
        const response = await fetch(`/snippets/${snippet.id}/reports`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCSRFToken()
          },
          body: JSON.stringify(report)
        });
        
        if (response.ok) {
          const data = await response.json();
          setShowSuccessfulReportView(true);
          setError(null);
          setUserName(data.user_name);


          setTimeout(() => {
            onClose();
          }, 2500);
        } else {
          const error = await response.json();
          setError(error.message || 'Unable to submit report - Please try again');
        }
      } catch (error) {
        setError(error.message || 'Unable to submit report - Please try again');
      }
    } else {
      setError(validation.message);
    }
  };

  const fetchAlternativeCovers = async () => {
    if (alternativeCovers.length > 0) return;
    setLoadingCovers(true);
    try {
      const response = await fetch(`/snippets/${snippet.id}/alternative_album_covers`);
      const data = await response.json();
      setAlternativeCovers(data);
    } catch (error) {
      // Silently handle error - alternative covers are optional
    } finally {
      setLoadingCovers(false);
    }
  };

  // Render Helpers
  const renderSuccessContent = () => {
    return (
      <div className="text-center">
        <h3>Thanks {userName}! 😍</h3>
        <p>Report submitted!</p>
        <button className="btn btn-neutral" onClick={onClose}>
          Close
        </button>
      </div>
    );
  };

  const renderFormContent = () => {
    return (
      <>
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        <h3>Report Issues</h3>
        <h6>and suggest Edits</h6>

        {/* ARTIST */}
        <div 
          className={buildFieldClasses('artist')}
          onClick={() => !isBoring && toggleField('artist')}
        >
          Artist: {snippet?.artist}
        </div>
        {wrongFields.artist && (
          <input
            type="text"
            placeholder='Suggest artist'
            value={suggestions.artist || ''}
            onChange={(e) => setSuggestions({...suggestions, artist: e.target.value})}
            className={`${isBoring ? 'input-field--disabled' : ''} modal-suggestion-input form-control`}
            />
        )}

        {/* SONG */}
        <div 
          className={buildFieldClasses('song')}
          onClick={() => !isBoring && toggleField('song')}
        >
          Song: {snippet?.song}
        </div>
        {wrongFields.song && (
          <input
            type="text"
            placeholder='Suggest song'
            value={suggestions.song || ''}
            onChange={(e) => setSuggestions({...suggestions, song: e.target.value})}
            className={`${isBoring ? 'input-field--disabled' : ''} modal-suggestion-input form-control`}
            />
        )}

        {/* SNIPPET */}
        <div 
          className={buildFieldClasses('snippet')}
          onClick={() => !isBoring && toggleField('snippet')}
        >
          Snippet: {snippet?.snippet}
        </div>
        {wrongFields.snippet && (
          <input
            type="text"
            placeholder='Suggest snippet'
            value={suggestions.snippet || ''}
            onChange={(e) => setSuggestions({...suggestions, snippet: e.target.value})}
            className={`${isBoring ? 'input-field--disabled' : ''} modal-suggestion-input form-control`}
            />
        )}

        {/* DIFFICULTY */}
        <div 
          className={buildFieldClasses('difficulty')}
          onClick={() => !isBoring && toggleField('difficulty')}
        >
          Difficulty: {snippet?.difficulty}
        </div>
        {wrongFields.difficulty && (
          <div 
            className={`form-section ${isBoring ? 'form-section--disabled' : ''} suggestion-section`}
          >
            <DifficultySlider 
              value={suggestions.difficulty || snippet?.difficulty}
              onChange={(value) => setSuggestions({...suggestions, difficulty: value})}
            />
          </div>
        )}

        {/* LANGUAGE */}
        <div className={`form-section ${isBoring ? 'form-section--disabled' : ''}`}>
          <label>
            <input 
              type="checkbox" 
              className="form-check-input"
              checked={wrongFields.language || false} 
              onChange={() => !isBoring && toggleField('language')} 
            />
            Wrong language (currently: {snippet?.language})
          </label>
          {wrongFields.language && (
            <select 
              value={suggestions.language || ''} 
              onChange={(e) => setSuggestions({...suggestions, language: e.target.value})}
              className="modal-suggestion-input form-select"
            >
              <option value="">Select correct language</option>
              {selectableLanguages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          )}
        </div>

        {/* IMAGE */}
        <div className="form-section">
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="image-container">
              <div className={`
                ${suggestions.image ? 'image-crossed-out' : ''} 
                ${isBoring ? ' report-field--disabled' : ''}
              `}>
                <img 
                  src={snippet?.image_url} 
                  onClick={() => {
                    if (isBoring) return;
            
                    if (suggestions.image) {
                      setSuggestions({...suggestions, image: null});
                      setWrongFields({...wrongFields, image: false});
                    } else {
                      fetchAlternativeCovers();
                      setShowImageSelector(true);
                    }
                  }}
                  className={`report-image`}
                  alt="Current album cover"
                />
              </div>
            </div>
            
            {suggestions.image && (
              <div className="image-container">
                <img 
                  src={suggestions.image} 
                  className={`report-image ${isBoring ? 'report-field--disabled' : ''}`}
                  alt="Selected album cover"
                />
              </div>
            )}
          </div>
        </div>

        <ImageSelector 
          isOpen={showImageSelector}
          alternativeCovers={alternativeCovers}
          loadingCovers={loadingCovers}
          onSelect={(imageUrl) => {
            setSuggestions({...suggestions, image: imageUrl});
            setWrongFields({...wrongFields, image: true});
            setShowImageSelector(false);
          }}
          onClose={() => setShowImageSelector(false)}
        />

        {/* BORING */}
        <div className='form-section'>
          <label>
            <input 
              type="checkbox" 
              className="form-check-input"
              checked={isBoring} 
              onChange={(e) => setIsBoring(e.target.checked)} 
            />
            Too boring! - Delete!
          </label>
        </div>

        {/* BUTTONS */}
        <div className='modal-button-group'> 
          <button 
            className='btn btn-neutral'
            onClick={onClose}>Cancel
          </button>
          <button 
            className='btn btn-accent'
            onClick={handleSubmit}>Submit
          </button>
        </div>
      </>
    )
  };

  return (
    <div className="report-modal-frame">
      {loading ? 
        <div>Loading...</div> : 
        showSuccessfulReportView ? renderSuccessContent() : renderFormContent()
      }
    </div>
  );
}

export default ReportModal;