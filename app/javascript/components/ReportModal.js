import React, { useState } from 'react';
import DifficultySlider from './DifficultySlider';

function ReportModal({ snippet, onSubmit, onClose }) {
  const [wrongFields, setWrongFields] = useState({});
  const [suggestions, setSuggestions] = useState({});  
  // todo make language use snippet.language
  const [language, setLanguage] = useState('english');
  const [isBoring, setIsBoring] = useState(false);

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

  const validateSubmission = () => {
    if (isBoring && Object.values(wrongFields).some(val => val)) {
      return { valid: false, message: "If marking as boring, don't select other issues" };
    }
  
    if (wrongFields.snippet && suggestions.snippet) {
      const similarity = calculateWordSimilarity(snippet.snippet, suggestions.snippet);
      if (similarity < 0.5) {
        return { valid: false, message: "Snippet changes must be minor (keep most original words)" };
      }
    }
  
    const hasIssues = isBoring || Object.values(wrongFields).some(val => val);
    if (!hasIssues) {
      return { valid: false, message: "Select at least one issue to report" };
    }
  
    return { valid: true };
  };

  const toggleField = (field) => {
    setWrongFields({...wrongFields, [field]: !wrongFields[field]});
  };

    return (
      <div className="report-modal-frame">
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
            className={`input-field ${isBoring ? 'input-field--disabled' : ''} suggestion-input form-control`}
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
            className={`input-field ${isBoring ? 'input-field--disabled' : ''} suggestion-input form-control`}
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
            className={`input-field ${isBoring ? 'input-field--disabled' : ''} suggestion-input form-control`}
            />
        )}
        <div 
          className={`form-section ${isBoring ? 'form-section--disabled' : ''}`}
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
        <div className={`form-section ${isBoring ? 'form-section--disabled' : ''} suggestion-section`}>
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
              className="input-field suggestion-input form-select"
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
            onClick={() => console.log('Submit report')}>Submit
          </button>
        </div>
      </div>
    );
  }

export default ReportModal;