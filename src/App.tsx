import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import Activity from './components/Activity';
import MoodList from './components/MoodList';
import MoodManager from './components/MoodManager';
import { moodService } from './services/moodService';

import { getAllMoods } from './data/sampleData';
import { activityService, initializeData } from './services/activityService';
import AddActivity from './components/AddActivity';
import EditActivity from './components/EditActivity';


const LandingPage: React.FC<{ moods: string[] }> = ({ moods }) => (
  <div>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <h2 style={{ color: '#ffffff', margin: 0 }}>moods</h2>
      <Link 
        to="/manage-moods" 
        style={{ 
          color: '#ffffff', 
          textDecoration: 'none'
        }}
      >
        Manage Moods
      </Link>
    </div>
    <MoodList moods={moods} />
  </div>
);

// Modify wrapper to receive and pass activities
const ActivityListWrapper: React.FC<{ activities: ActivityType[] }> = ({ activities }) => {
  const { mood } = useParams();
  return mood ? <ActivityList mood={mood} activities={activities} /> : null;
};

// Add activities to props
const ActivityList: React.FC<{ mood: string; activities: ActivityType[] }> = ({ mood, activities }) => {
  const [isRandomMode, setIsRandomMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [flashingId, setFlashingId] = useState<string | null>(null);
  const [flashCount, setFlashCount] = useState(0);
  const [sortField, setSortField] = useState<string | null>(null);

  const filteredActivities = activities.filter(
    activity => activity.moods.includes(mood)
  );

  const sortedActivities = useMemo(() => {
    if (!sortField) return filteredActivities;
    
    return [...filteredActivities].sort((a, b) => {
      const valueA = a.fieldStrengths[sortField] || 0;
      const valueB = b.fieldStrengths[sortField] || 0;
      return valueB - valueA; // Descending order
    });
  }, [filteredActivities, sortField]);

  const handleFieldClick = (field: string) => {
    setSortField(field);
  };
  
  const toggleRandomMode = () => {
    if (isRandomMode && selectedIds.length > 0) {
      // Exiting random mode with selections - start flashing
      const randomId = selectedIds[Math.floor(Math.random() * selectedIds.length)];
      setFlashingId(randomId);
      setFlashCount(0);
    }
    setIsRandomMode(!isRandomMode);
    setSelectedIds([]);
  };

  // Add this function
  const handleActivityClick = (id: string) => {
    if (isRandomMode) {
      setSelectedIds(prev => 
        prev.includes(id) 
          ? prev.filter(selectedId => selectedId !== id)
          : [...prev, id]
      );
    }
  };  

  const toggleSelection = (id: string) => {
    if (!isRandomMode) return;
    
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    if (flashingId && flashCount < 10) {
      const timer = setTimeout(() => {
        setFlashCount(prev => prev + 1);
      }, 300); // Flash every 300ms
      return () => clearTimeout(timer);
    } else if (flashCount >= 10) {
      setFlashingId(null);
      setFlashCount(0);
    }
  }, [flashingId, flashCount]);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        {/* Navigation row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <Link to="/" style={{ 
            color: '#ffffff', 
            textDecoration: 'none' 
          }}>
            ← Back
          </Link>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link 
              to={`/add?mood=${mood}`}
              style={{ 
                color: '#ffffff', 
                textDecoration: 'none'
              }}
            >
              +
            </Link>
            <button
              onClick={toggleRandomMode}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {isRandomMode ? '🎲 Done' : '🎲'}
            </button>
          </div>
        </div>
        
        {/* Mood title row */}
        <h1 style={{ 
          color: '#ffffff', 
          margin: 0,
          textAlign: 'center'
        }}>
          {mood}
        </h1>
      </div>

      {sortedActivities.map((activity) => (
        <div
          key={activity.id}
          style={{
            backgroundColor: flashingId === activity.id 
              ? (flashCount % 2 === 0 ? '#444' : 'transparent')
              : selectedIds.includes(activity.id) ? '#333' : 'transparent',
            transition: 'background-color 0.15s ease',
            borderRadius: '4px'
          }}
        >
          <Activity 
            {...activity}
            isRandomMode={isRandomMode}
            isSelected={selectedIds.includes(activity.id)}
            onSelect={handleActivityClick}
            onFieldClick={handleFieldClick}  // Add this prop
          />
        </div>
      ))}

    </div>
  );
};

const App: React.FC = () => {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moods, setMoods] = useState<string[]>([]);  

  const refreshActivities = async () => {
    const data = await activityService.getAllActivities();
    setActivities(data);
  };  

  const refreshMoods = async () => {
    const data = await moodService.getAllMoods();
    setMoods(data);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await initializeData();
        await moodService.initializeDefaultMoods(['morning', 'exercise', 'quiet', 'evening', 'social', 'learning']);
        await refreshActivities();
        await refreshMoods();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);


  if (isLoading) {
    return <div style={{ color: '#ffffff' }}>Loading...</div>;
  }

  return (
    <Router>
      <div style={{
        padding: '20px',
        backgroundColor: '#1a1a1a',
        minHeight: '100vh'
      }}>
        <Routes>
        <Route path="/" element={<LandingPage moods={moods} />} />
        <Route
            path="/mood/:mood"
            element={<ActivityListWrapper activities={activities} />}
          />
          <Route path="/add" element={<AddActivity onActivityAdded={refreshActivities} moods={moods}/>} /> {/* Add this line */}          
          <Route 
            path="/edit/:id" 
            element={<EditActivity onActivityUpdated={refreshActivities}  moods={moods}/>} 
          />    
          <Route path="/manage-moods" element={<MoodManager moods={moods} onMoodsUpdated={refreshMoods}/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;