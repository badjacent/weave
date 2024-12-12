// components/MoodManager.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { moodService } from '../services/moodService';

interface MoodManagerProps {
  moods: string[];
  onMoodsUpdated: () => Promise<void>;
}

const MoodManager: React.FC<MoodManagerProps> = ({ moods, onMoodsUpdated }) => {
  const [newMood, setNewMood] = useState('');
  const navigate = useNavigate();

  const handleAddMood = async () => {
    if (newMood.trim()) {
      await moodService.addMood(newMood.trim().toLowerCase());
      await onMoodsUpdated();
      setNewMood('');
    }
  };

  const handleDeleteMood = async (mood: string) => {
    if (window.confirm(`Are you sure you want to delete "${mood}"? This will remove the mood tag from all activities.`)) {
      await moodService.deleteMood(mood);
      await onMoodsUpdated();
    }
  };

  return (
    <div style={{ color: '#ffffff' }}>
      <h2>Manage Moods</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newMood}
          onChange={(e) => setNewMood(e.target.value)}
          placeholder="New mood name"
          style={{
            background: '#333',
            color: '#fff',
            border: '1px solid #666',
            padding: '5px',
            marginRight: '10px'
          }}
        />
        <button
          onClick={handleAddMood}
          style={{
            background: '#444',
            color: '#fff',
            border: 'none',
            padding: '5px 10px',
            cursor: 'pointer'
          }}
        >
          Add Mood
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {moods.map(mood => (
          <div
            key={mood}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '5px',
              background: '#333'
            }}
          >
            <span>{mood}</span>
            <button
              onClick={() => handleDeleteMood(mood)}
              style={{
                background: '#c42',
                color: '#fff',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodManager;