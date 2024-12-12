// EditActivity.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { activityService } from '../services/activityService';
import { FIELDS } from '../constants/fields';
import { Activity } from '../types';

interface EditActivityProps {
  onActivityUpdated: () => Promise<void>;
  moods: string[];  // Add this
}

const EditActivity: React.FC<EditActivityProps> = ({ onActivityUpdated, moods }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [fieldStrengths, setFieldStrengths] = useState<Record<string, number>>(
    Object.keys(FIELDS).reduce((acc, field) => ({
      ...acc,
      [field]: 0
    }), {})
  );

  useEffect(() => {
    const loadActivity = async () => {
      if (!id) return;
      const activities = await activityService.getAllActivities();
      const activity = activities.find(a => a.id === id);
      if (activity) {
        setName(activity.name);
        setSelectedMoods(activity.moods);
        setFieldStrengths(activity.fieldStrengths);
      }
    };
    loadActivity();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const updatedActivity: Activity = {
      id,
      name,
      moods: selectedMoods,
      fieldStrengths
    };

    await activityService.updateActivity(updatedActivity);
    await onActivityUpdated();
    navigate(-1);
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this activity?')) {
      await activityService.deleteActivity(id);
      await onActivityUpdated();
      navigate(-1);
    }
  };

  return (
    <div style={{ color: '#ffffff' }}>
      <h2>Edit Activity</h2>
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

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button 
            type="submit"
            style={{
              background: '#444',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer'
            }}
          >
            Save Changes
          </button>
          <button 
            type="button"
            onClick={handleDelete}
            style={{
              background: '#c42',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer'
            }}
          >
            Delete Activity
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditActivity;