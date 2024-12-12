import React from 'react';
import { Link } from 'react-router-dom';

// Add this interface at the top of the file
interface MoodListProps {
  moods: string[];
}

// Update component to use the interface and receive moods as prop
const MoodList: React.FC<MoodListProps> = ({ moods }) => {
  return (
    <div>
      {moods.map((mood) => (
        <Link
          key={mood}
          to={`/mood/${mood}`}
          style={{
            color: '#ffffff',
            textDecoration: 'none',
            display: 'block',
            marginBottom: '10px'
          }}
        >
          {mood}
        </Link>
      ))}
    </div>
  );
};

export default MoodList;