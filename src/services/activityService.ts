import AsyncStorage from '@react-native-async-storage/async-storage';
import { activities } from '../data/sampleData'; // Add this import

const STORAGE_KEY = 'activities';

class ActivityService {
  // Local storage methods
  private async saveToLocal(activities: Activity[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving activities:', error);
      throw error;
    }
  }

  private async getFromLocal(): Promise<Activity[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting activities:', error);
      throw error;
    }
  }

  // API methods (to be implemented later)
  private async syncWithBackend(activities: Activity[]): Promise<void> {
    // TODO: Implement API sync
    // This will be where you add the API calls later
    console.log('Backend sync not implemented yet');
  }

  // Public methods that your app will use
  async getAllActivities(): Promise<Activity[]> {
    return this.getFromLocal();
  }

  async addActivity(activity: Activity): Promise<void> {
    const activities = await this.getFromLocal();
    activities.push(activity);
    await this.saveToLocal(activities);
    // When ready to sync with backend:
    // await this.syncWithBackend(activities);
  }

  async updateActivity(updatedActivity: Activity): Promise<void> {
    const activities = await this.getFromLocal();
    const index = activities.findIndex(a => a.id === updatedActivity.id);
    if (index !== -1) {
      activities[index] = updatedActivity;
      await this.saveToLocal(activities);
      // When ready to sync with backend:
      // await this.syncWithBackend(activities);
    }
  }

  async deleteActivity(activityId: string): Promise<void> {
    const activities = await this.getFromLocal();
    const filteredActivities = activities.filter(a => a.id !== activityId);
    await this.saveToLocal(filteredActivities);
    // When ready to sync with backend:
    // await this.syncWithBackend(filteredActivities);
  }

  
}

// services/activityService.ts
export const initializeData = async () => {
    console.log('Initializing data...');
    const existingData = await activityService.getAllActivities();
    console.log('Existing data:', existingData);
    
    if (existingData.length === 0) {
      console.log('No existing data, initializing with sample data');
      for (const activity of activities) {
        await activityService.addActivity(activity);
      }
    } else {
      console.log('Found existing data in storage');
    }
  };
  
export const activityService = new ActivityService();