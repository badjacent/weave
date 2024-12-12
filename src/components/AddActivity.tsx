// AddActivity.tsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { activityService } from '../services/activityService';
import { FIELDS } from '../constants/fields';

interface AddActivityProps {
  onActivityAdded: () => Promise<void>;
  moods: string[];  // Add this
}

const AddActivity: React.FC<AddActivityProps> = ({ onActivityAdded, moods }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedMood = searchParams.get('mood');
  
  const [name, setName] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>(
    preselectedMood ? [preselectedMood] : []
  );
  const [fieldStrengths, setFieldStrengths] = useState<Record<string, number>>(
    Object.keys(FIELDS).reduce((acc, field) => ({
      ...acc,
      [field]: 0
    }), {})
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newActivity = {
      id: Date.now().toString(),
      name,
      moods: selectedMoods,
      fieldStrengths
    };

    await activityService.addActivity(newActivity);
    await onActivityAdded();
    navigate(-1);
  };

  return (
    <div style={{ color: '#ffffff' }}>
      <h2>Add New Activity</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                marginLeft: '10px',
                background: '#333',
                color: '#fff',
                border: '1px solid #666',
                padding: '5px'
              }}
            />
          </label>
        </div>

        {/* Mood Selection */}
        <div style={{ marginBottom: '20px' }}>
          <div>Moods:</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {moods.map(mood => (
              <label key={mood} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
                <input
                  type="checkbox"
                  checked={selectedMoods.includes(mood)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMoods([...selectedMoods, mood]);
                    } else {
                      setSelectedMoods(selectedMoods.filter(m => m !== mood));
                    }
                  }}
                  style={{ marginRight: '5px' }}
                />
                {mood}
              </label>
            ))}
          </div>
        </div>

        {/* Field Strength Sliders */}
        {Object.entries(FIELDS).map(([fieldKey, field]) => (
          <div key={fieldKey} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '100px',
                color: field.color 
              }}>
                {field.name}:
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={fieldStrengths[fieldKey]}
                onChange={(e) => setFieldStrengths(prev => ({
                  ...prev,
                  [fieldKey]: parseFloat(e.target.value)
                }))}
                style={{ 
                  marginLeft: '10px',
                  flexGrow: 1
                }}
              />
              <span style={{ 
                marginLeft: '10px',
                minWidth: '40px'
              }}>
                {fieldStrengths[fieldKey].toFixed(1)}
              </span>
            </label>
          </div>
        ))}

        <button 
          type="submit"
          style={{
            background: '#444',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Add Activity
        </button>
      </form>
    </div>
  );
};

export default AddActivity;