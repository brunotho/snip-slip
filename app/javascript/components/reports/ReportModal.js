import React, { useState, useEffect } from 'react';
import DifficultySlider from '../shared/DifficultySlider';
import ImageSelector from './ImageSelector';
import Loading from '../shared/Loading';

function ReportModal({ snippet, onClose }) {
  // UI State
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [loadingCovers, setLoadingCovers] = useState(false);
  const [error, setError] = useState(null);
  
  // Form State
  const [suggestions, setSuggestions] = useState({
    artist: '',
    song: '',
    snippet: '',
    difficulty: null,
    language: '',
    image: null
  });
  const [wrongFields, setWrongFields] = useState({
    artist: false,
    song: false,
    snippet: false,
    difficulty: false,
    language: false,
    image: false
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isBoring, setIsBoring] = useState(false);
  
  // External Data
  const [languages, setLanguages] = useState([]);
  const [alternativeCovers, setAlternativeCovers] = useState([]);
  
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

  useEffect(() => {
    const difficultyChanged = suggestions.difficulty && suggestions.difficulty !== snippet?.difficulty;
    if (difficultyChanged && !wrongFields.difficulty) {
      setWrongFields(prev => ({...prev, difficulty: true}));
    }
  }, [suggestions.difficulty, snippet?.difficulty]);
  
  const selectableLanguages = languages.filter(lang => lang !== snippet?.language);

  const buildFieldClasses = (fieldName) => {
    let classes = 'report-field';
    
    if (wrongFields[fieldName]) {
      classes += ' report-field--selected';
    }
    
    return classes;
  };

  const calculateWordSimilarity = (original, suggestion) => {
    const originalWords = original.toLowerCase().split(/\s+/);
    const suggestedWords = suggestion.toLowerCase().split(/\s+/); 
    const matches = originalWords.filter(word => suggestedWords.includes(word));
    
    return matches.length / originalWords.length;
  };

  const getMetaContent = (name) => {
    const meta = document.querySelector(`meta[name="${name}"]`);
    return meta && meta.getAttribute('content');
  };

  const toggleField = (field) => {
    if (field === 'difficulty') return;
    setWrongFields({...wrongFields, [field]: !wrongFields[field]});
  };

  const validateForm = () => {
    const errors = {};
    const needSuggestion = (field) => wrongFields[field] && !suggestions[field];

    const difficultyChanged = suggestions.difficulty && suggestions.difficulty !== snippet?.difficulty;
    if (difficultyChanged && !wrongFields.difficulty) {
      setWrongFields(prev => ({...prev, difficulty: true}));
    }

    if (needSuggestion('artist')) errors.artist = 'Please suggest the correct artist';
    if (needSuggestion('song')) errors.song = 'Please suggest the correct song';
    if (needSuggestion('snippet')) errors.snippet = 'Please suggest the corrected snippet';
    
    if (wrongFields.snippet && suggestions.snippet) {
      const similarity = calculateWordSimilarity(snippet.snippet, suggestions.snippet);
      if (similarity < 0.5) errors.snippet = 'Keep at least half of the original words';
    }
    
    if (wrongFields.language) {
      if (!suggestions.language) errors.language = 'Please select the correct language';
      else if (suggestions.language === snippet?.language) errors.language = 'Language must be different';
    }

    const hasIssues = Object.values(wrongFields).some(Boolean) || difficultyChanged;
    if (!hasIssues) return { valid: false, fieldErrors: {}, message: 'Select at least one issue' };

    const valid = Object.keys(errors).length === 0;
    return { valid, fieldErrors: errors, message: valid ? null : 'Please fix 🤓' };
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const validation = validateForm();
    if (!validation.valid) {
      setError(validation.message);
      if (validation.fieldErrors) {
        setFieldErrors(validation.fieldErrors);
      }
      setLoading(false);
      return;
    }

    try {
      const payload = isBoring ? {
        boring: true,
        lyric_snippet_id: snippet.id
      } : {
        lyric_snippet_id: snippet.id,
        wrong_artist: wrongFields.artist,
        wrong_song: wrongFields.song,
        wrong_snippet: wrongFields.snippet,
        wrong_difficulty: wrongFields.difficulty,
        wrong_language: wrongFields.language,
        wrong_image: wrongFields.image,
        suggested_artist: suggestions.artist || null,
        suggested_song: suggestions.song || null,
        suggested_snippet: suggestions.snippet || null,
        suggested_difficulty: suggestions.difficulty || null,
        suggested_language: suggestions.language || null,
        suggested_image: suggestions.image || null
      };

      const response = await fetch(`/snippets/${snippet.id}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getMetaContent('csrf-token')
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowThankYou(true);
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          setError(`Server error (${response.status}) - please try again`);
          setLoading(false);
          return;
        }
        
        if (response.status === 422) {
          if (errorData.errors) {
            setFieldErrors(errorData.errors);
          }
          
          if (errorData.errors && errorData.errors.includes("User can only have one pending report per snippet")) {
            setError('You have already reported this snippet. Each user can only report a snippet once.');
          } else if (errorData.errors && errorData.errors.length > 0) {
            setError(errorData.errors[0]);
          } else {
            setError('Please fix 🤓');
          }
        } else {
          if (errorData.errors) {
            setFieldErrors(errorData.errors);
            setError('Please fix 🤓');
          } else {
            setError('Failed to submit report');
          }
        }
      }
    } catch (err) {
      setError('Network error - please try again');
    } finally {
      setLoading(false);
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
      <div className="report-success-content">
        <div className="modal-header">
          <h3>Thank you! 😊</h3>
        </div>
        <div className="modal-body">
          <p>Your report has been submitted! 🎉</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-accent" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  };

  const renderFormContent = () => {
    return (
      <>
        <div className="modal-header-subtext">Tap a field to suggest a fix.</div>
        <div className={isBoring ? 'form-section--disabled' : ''}>
          {error && (
            <div className="inline-error">{error}</div>
          )}

          <div 
            className={buildFieldClasses('artist')}
            onClick={() => !isBoring && toggleField('artist')}
          >
            <span className="report-field-label">Artist:</span>
            <span className={`report-field-content ${wrongFields.artist ? 'report-field-content--selected' : ''}`}>
              {snippet?.artist}
            </span>
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
          {fieldErrors.artist && <div className="inline-error">{fieldErrors.artist}</div>}

          <div 
            className={buildFieldClasses('song')}
            onClick={() => !isBoring && toggleField('song')}
          >
            <span className="report-field-label">Song:</span>
            <span className={`report-field-content ${wrongFields.song ? 'report-field-content--selected' : ''}`}>
              {snippet?.song}
            </span>
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
          {fieldErrors.song && <div className="inline-error">{fieldErrors.song}</div>}

          <div 
            className={buildFieldClasses('snippet')}
            onClick={() => !isBoring && toggleField('snippet')}
          >
            <span className="report-field-label">Snippet:</span>
            <span className={`report-field-content ${wrongFields.snippet ? 'report-field-content--selected' : ''}`}>
              {snippet?.snippet}
            </span>
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
          {fieldErrors.snippet && <div className="inline-error">{fieldErrors.snippet}</div>}

          <div className={`difficulty-section ${isBoring ? 'form-section--disabled' : ''}`}>
            <div className="difficulty-suggestion">
              <DifficultySlider 
                value={suggestions.difficulty || snippet?.difficulty}
                onChange={(value) => setSuggestions({...suggestions, difficulty: value})}
              />
            </div>
          </div>
          {fieldErrors.difficulty && <div className="inline-error">{fieldErrors.difficulty}</div>}

          <div className={`form-section ${isBoring ? 'form-section--disabled' : ''}`}>
            <div className="report-field" onClick={() => !isBoring && toggleField('language')}>
              <span className="report-field-label">Language:</span>
              <span className={`report-field-content ${wrongFields.language ? 'report-field-content--selected' : ''}`}>
                {snippet?.language}
              </span>
              {wrongFields.language && (
                <div className="report-field-suggestion">
                  <select 
                    value={suggestions.language || ''} 
                    onChange={(e) => setSuggestions({...suggestions, language: e.target.value})}
                    className="modal-suggestion-input form-select"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">Select correct language</option>
                    {selectableLanguages.map(language => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            {fieldErrors.language && <div className="inline-error">{fieldErrors.language}</div>}
          </div>

          <div className="form-section">
            <div className="image-row">
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
        </div>

        <div className='form-section'>
          <div className="report-field" onClick={() => setIsBoring(!isBoring)}>
            <input 
              type="checkbox" 
              id="boring-checkbox"
              className="form-check-input visually-hidden"
              checked={isBoring} 
              onChange={(e) => setIsBoring(e.target.checked)} 
            />
            <span className="report-field-content">
              {isBoring ? 'Boring! Delete this snippet! 😈' : 'Boring! Delete this snippet!'}
            </span>
          </div>
        </div>

        <div className='modal-button-group'> 
          <button 
            className='btn btn-neutral'
            onClick={onClose}>Cancel
          </button>
          <button 
            className='btn btn-accent'
            onClick={handleSubmit}
            disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </>
    )
  };

  if (loading) {
    return (
      <div className="report-modal-frame report-modal-frame--loading">
        <div className="loading-container">
          <Loading message="Loading report form..." />
        </div>
      </div>
    );
  }

  return (
    <div className="report-modal-frame">
      {showThankYou ? (
        <div className="report-modal-frame--success">
          {renderSuccessContent()}
        </div>
      ) : (
        renderFormContent()
      )}
    </div>
  );
}

export default ReportModal;