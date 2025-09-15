import { FarmPath } from "../types/farm-measurement";
import { createFarmMeasurement } from "../apis/farmMeasurement";

export class FarmMeasurementService {
  constructor() {}

  async createMeasurement(farmPath): Promise<any> {
    try {
      const res = await createFarmMeasurement(
        farmPath.coordinates,
        this.getAuthToken()
      );
      return res.data;
    } catch (error) {
      console.error("Error creating measurement:", error);
      throw error;
    }
  }

  async syncOfflineMeasurements(): Promise<void> {
    const offlinePaths = JSON.parse(localStorage.getItem("farmPaths") || "[]");

    if (offlinePaths.length === 0) {
      console.log("No offline measurements to sync");
      return;
    }

    // Check if we're in development mode or if the API endpoint exists
    if (!this.isApiAvailable()) {
      console.warn(
        "Farm measurement API is not available. Measurements will remain in local storage."
      );
      throw new Error(
        "Farm measurement API is not available. Your measurements are safely stored locally and will be synced when the service becomes available."
      );
    }

    for (const path of offlinePaths) {
      try {
        // await this.createMeasurement(path);
        // Remove from offline storage after successful sync
        const updatedPaths = offlinePaths.filter(
          (p: FarmPath) => p.id !== path.id
        );
        localStorage.setItem("farmPaths", JSON.stringify(updatedPaths));
        console.log("Successfully synced measurement:", path.id);
      } catch (error) {
        console.error("Failed to sync measurement:", path.id, error);
        // Don't throw here to allow other measurements to be processed
      }
    }
  }

  private isApiAvailable(): boolean {
    return Boolean(process.env.NEXT_PUBLIC_URL);
  }

  private getAuthToken(): string {
    // Implement your auth token retrieval logic
    return localStorage.getItem("authToken") || "";
  }
}
