import axios from 'axios';
import { Opportunity, SwipeResult, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Get unswiped opportunities
  async getOpportunities(userId: string = 'default'): Promise<Opportunity[]> {
    try {
      const response = await api.get<Opportunity[]>(`/opportunities?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      throw error;
    }
  },

  // Record a swipe
  async recordSwipe(swipe: SwipeResult & { userId?: string }): Promise<void> {
    try {
      await api.post('/swipe', {
        userId: swipe.userId || 'default',
        opportunityId: swipe.opportunityId,
        direction: swipe.direction,
      });
    } catch (error) {
      console.error('Error recording swipe:', error);
      throw error;
    }
  },

  // Get liked opportunities
  async getLikedOpportunities(userId: string = 'default'): Promise<Opportunity[]> {
    try {
      const response = await api.get<Opportunity[]>(`/liked?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching liked opportunities:', error);
      throw error;
    }
  },

  // Trigger scraping for new opportunities
  async scrapeNewOpportunities(): Promise<ApiResponse<any>> {
    try {
      const response = await api.post<ApiResponse<any>>('/scrape');
      return response.data;
    } catch (error) {
      console.error('Error triggering scrape:', error);
      throw error;
    }
  },

  // Remove a liked opportunity
  async removeLikedOpportunity(opportunityId: number, userId: string = 'default'): Promise<void> {
    try {
      await api.delete(`/liked/${opportunityId}?userId=${userId}`);
    } catch (error) {
      console.error('Error removing liked opportunity:', error);
      throw error;
    }
  },
};

export default apiService;