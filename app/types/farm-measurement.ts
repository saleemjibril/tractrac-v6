export interface Position {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface FarmPath {
  id: string;
  coordinates: [number, number][];
  timestamp: number;
  areaSquareMeters?: number;
  perimeterMeters?: number;
}

export interface FarmMeasurementModel {
  id: string;
  userId: string;
  farmName?: string;
  coordinates: [number, number][];
  areaSquareMeters: number;
  createdAt: string;
  isSynced: boolean;
  filteredCoordinates: [number, number][];
  validationInfo: ValidationInfo;
}

export interface ValidationInfo {
  valid: boolean;
  perimeterMeters: number;
  centroid: [number, number];
  numPoints: number;
  isClosed: boolean;
  selfIntersecting: boolean;
}

export interface MeasurementUnit {
  fullname: string;
  unit: string;
}