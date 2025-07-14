import React, { useState } from 'react';
import DifficultySlider from './DifficultySlider';

function ReportModal({ snippet, onSubmit }) {
  const [wrongFields, setWrongFields] = useState({});
  const [suggestions, setSuggestions] = useState({});
  const [language, setLanguage] = useState('english');
  const [isBoring, setIsBoring] = useState(false);

  const toggleField = (field) => {
    setWrongFields({...wrongFields, [field]: !wrongFields[field]});
  };

    return (
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', minWidth: '300px' }}>
        <h3>Report Issues</h3>

        <div 
          onClick={() => toggleField('artist')}
          style={{
            textDecoration: wrongFields.artist ? 'line-through' : 'none',
            cursor: 'pointer'
        }}>
          Artist: {snippet?.artist}
        </div>
        {wrongFields.artist && (
          <input
            type="text"
            placeholder='Suggest artist'
            value={suggestions.artist || ''}
            onChange={(e) => setSuggestions({...suggestions, artist: e.target.value})}
            style={{ marginLeft: '1rem', marginTop: '0.5rem' }}
          />
        )}
        <div 
          onClick={() => toggleField('song')}
          style={{
            textDecoration: wrongFields.song ? 'line-through' : 'none',
            cursor: 'pointer'
          }}>
          Song: {snippet?.song}
        </div>
        {wrongFields.song && (
          <input
            type="text"
            placeholder='Suggest song'
            value={suggestions.song || ''}
            onChange={(e) => setSuggestions({...suggestions, song: e.target.value})}
            style={{ marginLeft: '1rem', marginTop: '0.5rem' }}
          />
        )}
        <div onClick={() => toggleField('snippet')}
          style={{
            textDecoration: wrongFields.snippet ? 'line-through' : 'none',
            cursor: 'pointer'
          }}>
          Snippet: {snippet?.snippet}
        </div>
        {wrongFields.snippet && (
          <input
            type="text"
            placeholder='Suggest snippet'
            value={suggestions.snippet || ''}
            onChange={(e) => setSuggestions({...suggestions, snippet: e.target.value})}
            style={{ marginLeft: '1rem', marginTop: '0.5rem' }}
          />
        )}
        <div onClick={() => toggleField('difficulty')}
          style={{
            textDecoration: wrongFields.difficulty ? 'line-through' : 'none',
            cursor: 'pointer'
          }}>
          Difficulty: {snippet?.difficulty}
        </div>
        {wrongFields.difficulty && (
          <div style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
            <DifficultySlider 
              value={suggestions.difficulty || 300}
              onChange={(value) => setSuggestions({...suggestions, difficulty: value})}
            />
          </div>
        )}
        <div style={{ marginTop: '1rem' }}>
          <label>
            <input 
              type="checkbox" 
              checked={wrongFields.language} 
              onChange={() => toggleField('language')} 
            />
            Wrong language (currently: {snippet?.language})
          </label>
          {wrongFields.language && (
            <select 
              value={suggestions.language || ''} 
              onChange={(e) => setSuggestions({...suggestions, language: e.target.value})}
              style={{ marginLeft: '1rem', marginTop: '0.5rem' }}
            >
              <option value="">Select correct language</option>
              <option value="English">English</option>
              <option value="German">German</option>
            </select>
          )}
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>
            <input 
              type="checkbox" 
              checked={isBoring} 
              onChange={(e) => setIsBoring(e.target.checked)} 
            />
            Too boring!
          </label>
        </div>
          <div>
            
          </div>
        <button onClick={() => console.log('Submit report')}>Submit</button>
      </div>
    );
  }

export default ReportModal;