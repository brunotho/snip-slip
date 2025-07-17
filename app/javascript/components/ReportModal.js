import React, { useState } from 'react';
import DifficultySlider from './DifficultySlider';

function ReportModal({ snippet, onSubmit, onClose }) {
  const [wrongFields, setWrongFields] = useState({});
  const [suggestions, setSuggestions] = useState({});  
  // todo make language use snippet.language
  const [language, setLanguage] = useState('english');
  const [isBoring, setIsBoring] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessfulReportView, setShowSuccessfulReportView] = useState(false);
  const [userName, setUserName] = useState('');

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
          } else if (field === 'language') {
            if (!suggestion || suggestion === snippet?.language) {
              return { valid: false, message: "Please select a different language" };
            }
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

  const getCSRFToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta && meta.getAttribute('content');
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
        suggested_artist: suggestions.artist || null,
        suggested_song: suggestions.song || null,
        suggested_snippet: suggestions.snippet || null,
        suggested_difficulty: suggestions.difficulty || null,
        suggested_language: suggestions.language || null,
      }
    }
  };

  const handleSubmit = async() => {
    const validation = validateSubmission();
    if (validation.valid) {
      try {
        const report = reportData(wrongFields, suggestions, isBoring);
        console.log(report);
        
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
          setErrorMessage('');
          setUserName(data.user_name);
          console.log('Report submitted successfully');

          setTimeout(() => {
            onClose();
          }, 2500);
        } else {
          const error = await response.json();
          setErrorMessage(error.message || 'Failed to submit report');
        }
      } catch (error) {
        console.error('Error submitting report:', error);
        setErrorMessage('Failed to submit report');
      }
    } else {
      setErrorMessage(validation.message);
    }
  };

  const toggleField = (field) => {
    setWrongFields({...wrongFields, [field]: !wrongFields[field]});
  };

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
        {errorMessage && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            {errorMessage}
          </div>
        )}
        <h3>Report Issues</h3>
        <h6>and suggest Edits</h6>

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
              <option value="English">English</option>
              <option value="German">German</option>
            </select>
          )}
        </div>
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
      {showSuccessfulReportView ? renderSuccessContent() : renderFormContent()}
    </div>
  );
}

export default ReportModal;