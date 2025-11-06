export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function calculatePolygonArea(coordinates: [number, number][]): number {
  if (coordinates.length < 3) return 0;

  // Calculate area using shoelace formula with proper coordinate handling
  let area = 0;
  const n = coordinates.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += coordinates[i][0] * coordinates[j][1];
    area -= coordinates[j][0] * coordinates[i][1];
  }

  area = Math.abs(area) / 2;

  // Convert from square degrees to square meters using proper projection
  const earthRadius = 6378137; // meters
  const degToRad = Math.PI / 180;
  const avgLat = coordinates.reduce((sum, coord) => sum + coord[1], 0) / n;
  const latFactor = Math.cos(avgLat * degToRad);
  
  return area * Math.pow(earthRadius * degToRad, 2) * latFactor;
}

export function calculatePerimeter(coordinates: [number, number][]): number {
  if (coordinates.length < 2) return 0;

  // Calculate perimeter by summing distances between consecutive points
  let perimeter = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const distance = calculateDistance(
      coordinates[i][1],
      coordinates[i][0],
      coordinates[i + 1][1],
      coordinates[i + 1][0]
    );
    perimeter += distance;
  }

  return perimeter;
}