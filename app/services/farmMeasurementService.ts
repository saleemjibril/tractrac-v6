import { FarmPath } from "../types/farm-measurement";

export class FarmMeasurementService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/v1') {
    this.baseUrl = baseUrl;
  }

  async createMeasurement(farmPath: FarmPath): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/farm/measurements/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          coordinates: farmPath.coordinates,
          timestamp: farmPath.timestamp,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating measurement:', error);
      throw error;
    }
  }

  async syncOfflineMeasurements(): Promise<void> {
    const offlinePaths = JSON.parse(localStorage.getItem('farmPaths') || '[]');
    
    for (const path of offlinePaths) {
      try {
        await this.createMeasurement(path);
        // Remove from offline storage after successful sync
        const updatedPaths = offlinePaths.filter((p: FarmPath) => p.id !== path.id);
        localStorage.setItem('farmPaths', JSON.stringify(updatedPaths));
      } catch (error) {
        console.error('Failed to sync measurement:', path.id, error);
      }
    }
  }

  private getAuthToken(): string {
    // Implement your auth token retrieval logic
    return localStorage.getItem('authToken') || '';
  }
}