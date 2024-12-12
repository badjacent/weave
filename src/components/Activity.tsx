import React from 'react';
import { FIELDS } from '../constants/fields';
import { useNavigate } from 'react-router-dom';

type ActivityProps = {
    id: string;
    name: string;
    fieldStrengths: Record<string, number>;
    isRandomMode?: boolean;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
  };
  
  const Activity: React.FC<ActivityProps> = ({ 
    id, 
    name, 
    fieldStrengths, 
    isRandomMode = false,
    isSelected = false,
    onSelect,
    onFieldClick
  }) => {
    const navigate = useNavigate();
  
    // Handler for the name/label click
    const handleNameClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isRandomMode && onSelect) {
        onSelect(id);
      } else {
        navigate(`/edit/${id}`);
      }
    };
  
    return (
      <div
        style={{
          padding: '5px',
          marginBottom: '2px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '30px',
        }}>
        <div 
          onClick={handleNameClick}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            cursor: 'pointer'
          }}
        >
          {isRandomMode && (
            <span style={{ 
              opacity: isSelected ? 1 : 0.3,
              fontSize: '16px'
            }}>
              🎲
            </span>
          )}
          <h3 style={{
            margin: 0,
            fontSize: '16px',
            color: '#ffffff'
          }}>
            {name}
          </h3>
        </div>
        <div 
          style={{
            display: 'flex',
            gap: '5px'
          }}
        >
          {Object.keys(FIELDS).map(fieldKey => (
            <div
              key={fieldKey}
              onClick={(e) => {
                e.stopPropagation();
                if (!isRandomMode && onFieldClick) {
                  onFieldClick(fieldKey);
                }
              }}
              title={`${FIELDS[fieldKey].name}: ${(fieldStrengths[fieldKey] || 0.05) * 100}%`}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: FIELDS[fieldKey].color,
                opacity: fieldStrengths[fieldKey] || 0.05,
                cursor: isRandomMode ? 'default' : 'pointer'
              }}
            />
          ))}
        </div>
      </div>
    );
  };

export default Activity;