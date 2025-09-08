import { NextRequest, NextResponse } from 'next/server';

// This is a simple mock API endpoint for farm measurements
// Replace this with your actual backend integration

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.coordinates || !body.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: coordinates and timestamp' },
        { status: 400 }
      );
    }

    // Mock response - replace with actual database storage
    const measurement = {
      id: Date.now().toString(),
      coordinates: body.coordinates,
      timestamp: body.timestamp,
      areaSquareMeters: calculatePolygonArea(body.coordinates),
      createdAt: new Date().toISOString(),
      status: 'saved'
    };

    console.log('Farm measurement saved:', measurement);

    return NextResponse.json({
      success: true,
      data: measurement,
      message: 'Farm measurement saved successfully'
    });

  } catch (error) {
    console.error('Error saving farm measurement:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Farm measurements API endpoint',
    endpoints: {
      POST: '/api/v1/farm/measurements - Save a new farm measurement'
    }
  });
}

// Simple polygon area calculation (Shoelace formula)
function calculatePolygonArea(coordinates: [number, number][]): number {
  if (coordinates.length < 3) return 0;

  let area = 0;
  const n = coordinates.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += coordinates[i][0] * coordinates[j][1];
    area -= coordinates[j][0] * coordinates[i][1];
  }

  area = Math.abs(area) / 2;
  
  // Convert from degrees to square meters (approximate)
  // This is a rough approximation - for production use proper geospatial calculations
  const metersPerDegree = 111320; // approximate meters per degree at equator
  return area * metersPerDegree * metersPerDegree;
}
