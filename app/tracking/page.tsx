"use client"
import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  GoogleMap,
  Marker,
  Polyline,
  Polygon,
  Circle,
  useJsApiLoader,
} from '@react-google-maps/api';
import { getGeoFences, getTrackedTractors, getHistory, addGeoFence, updateGeoFence, deleteGeoFence, CreateGeoFenceData, createAlert, getAlerts, getAlertById, editAlert } from '../apis/tracker';

// Types based on your API response
interface TrackedDevice {
  id: number;
  name: string;
  online: string;
  alarm: string;
  time: string;
  timestamp: number;
  speed: number;
  lat: number;
  lng: number;
  course: string;
  power: string;
  altitude: number;
  address: string;
  protocol: string;
  driver: string;
  total_distance: number;
  unit_of_distance: string;
  sensors: Array<{
    id: number;
    type: string;
    name: string;
    show_in_popup: number;
    value: string;
    val: number;
    scale_value: number | null;
    tag_name: string;
  }>;
  tail: Array<{ 
    lat: string;
    lng: string;
  }>;
  device_data: {
    tail_color: string;
    tail_length: string;
    distance_unit_hour: string;
    [key: string]: any;
  };
}

interface TrackedGroup {
  title: string;
  items: TrackedDevice[];
}

interface GeofenceItem {
  id: number;
  type: string;
  user_id: number;
  group_id: number | null;
  active: number;
  name: string;
  center: {
    lat: number;
    lng: number;
  };
  radius: number;
  coordinates: string;
  polygon_color: string;
  created_at: string;
  updated_at: string;
  device_id?: number;
  speed_limit?: number;
  diem_rate_id?: number | null;
  additional?: any;
}

interface HistoryItem {
  id: number;
  device_id: number;
  item_id: string;
  time: string;
  raw_time: string;
  altitude: number;
  course: number;
  speed: number;
  latitude: number;
  longitude: number;
  lat: number;
  lng: number;
  distance: number;
  other: string;
  color: string;
  valid: number;
  device_time: string;
  server_time: string;
  other_arr: string[];
  sensors_data: Array<{
    id: string;
    value: number;
  }>;
}

interface HistoryResponse {
  items: Array<{
    status: number;
    time: string | null;
    show: string;
    raw_time: string;
    distance: number;
    driver: string | null;
    items: HistoryItem[];
  }>;
}

interface AlertNotification {
  email: {
    active: number;
    input: string;
  };
}

interface AlertItem {
  id: number;
  user_id: number;
  active: number;
  name: string;
  type: string;
  for_all_user_devices: number;
  schedules: any;
  notifications: AlertNotification;
  created_at: string;
  updated_at: string;
  zone: number;
  schedule: number;
  command: any;
  devices: number[];
  drivers: any[];
  geofences: number[];
  events_custom: any[];
}

interface AlertsResponse {
  status: number;
  items: {
    alerts: AlertItem[];
  };
}

interface CreateAlertData {
  name: string;
  devices: number[];
  geofences: number[];
  notifications?: AlertNotification;
  type?: string;
}

const libraries: ('places' | 'geometry' | 'drawing')[] = ['places', 'geometry'];

const mapContainerStyle = {
  width: '100%',
  height: '90vh', 
};

const center = {
  lat: 9.082,
  lng: 8.6753,
};

// Satellite map options
const mapOptions: google.maps.MapOptions = {
  mapTypeId: 'satellite',
  zoom: 8,
  center,
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  fullscreenControl: true,
};

// Helper function to parse coordinates string
const parseCoordinates = (coordinatesString: string): Array<{ lat: number; lng: number }> => {
  try {
    // Handle different coordinate formats
    if (coordinatesString.startsWith('[') || coordinatesString.startsWith('{')) {
      const parsed = JSON.parse(coordinatesString);
      if (Array.isArray(parsed)) {
        return parsed.map(coord => ({
          lat: typeof coord.lat === 'number' ? coord.lat : parseFloat(coord.lat),
          lng: typeof coord.lng === 'number' ? coord.lng : parseFloat(coord.lng),
        }));
      }
    }
    
    // Handle comma-separated coordinates like "lat1,lng1;lat2,lng2"
    if (coordinatesString.includes(';')) {
      return coordinatesString.split(';').map(pair => {
        const [lat, lng] = pair.split(',');
        return {
          lat: parseFloat(lat.trim()),
          lng: parseFloat(lng.trim()),
        };
      });
    }
  } catch (error) {
    console.error('Error parsing coordinates:', coordinatesString, error);
  }
  return [];
};

// Configuration: Change this to "real" to use actual API data
const DATA_MODE: "dummy" | "real" = "real";

const VehicleTrackingMap: React.FC = () => {
  const searchParams = useSearchParams();
  const tractorId = searchParams.get('tractorId');
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyBWo_tQ4rjQkZz1kN5WXfnemHCaF0gQ8BU', // Your actual API key
    libraries,
    version: 'weekly',
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [vehicleIcon, setVehicleIcon] = useState<google.maps.Icon | null>(null);
  const [allDevices, setAllDevices] = useState<TrackedDevice[]>([]);
  const [devices, setDevices] = useState<TrackedDevice[]>([]);
  const [geofences, setGeofences] = useState<GeofenceItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyGroups, setHistoryGroups] = useState<HistoryResponse['items']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleDevices, setVisibleDevices] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'devices' | 'history' | 'geofences' | 'alerts'>('devices');
  const [selectedHistoryTrail, setSelectedHistoryTrail] = useState<HistoryItem[] | null>(null);
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<number | null>(null);
  const [historySearchParams, setHistorySearchParams] = useState({
    deviceId: '',
    fromDate: '',
    fromTime: '',
    toDate: '',
    toTime: ''
  });
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // Geofence management state
  const [showGeofenceForm, setShowGeofenceForm] = useState(false);
  const [editingGeofence, setEditingGeofence] = useState<GeofenceItem | null>(null);
  const [geofenceFormData, setGeofenceFormData] = useState<CreateGeoFenceData>({
    name: '',
    type: 'circle',
    polygon_color: '#00ff00',
    active: 1
  });
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingType, setDrawingType] = useState<'circle' | 'polygon' | null>(null);
  const [drawnCoordinates, setDrawnCoordinates] = useState<Array<{ lat: number; lng: number }>>([]);
  const [drawnCenter, setDrawnCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [drawnRadius, setDrawnRadius] = useState<number | null>(null);
  const [isLoadingGeofence, setIsLoadingGeofence] = useState(false);

  // Alert management state
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [isLoadingAlert, setIsLoadingAlert] = useState(false);
  const [alertFormData, setAlertFormData] = useState<CreateAlertData>({
    name: '',
    devices: [],
    geofences: [],
    notifications: {
      email: {
        active: 0,
        input: 'Israel.olatunde@tractrac.co'
      }
    },
    type: 'geofence_inout'
  });

  // Fallback simple icon
  const fallbackIcon = {
    path: 'M 0, 0 m -8, 0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0',
    scale: 1,
    fillColor: '#FF0000',
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: '#FFFFFF',
  };

  // Dummy data for testing
  const dummyDevices: TrackedDevice[] = [
    {
      id: 1,
      name: "Tractor Alpha",
      online: "online",
      alarm: "",
      time: "2024-08-31 14:30:00",
      timestamp: Date.now() / 1000,
      speed: 25,
      lat: 9.082,
      lng: 8.6753,
      course: "45",
      power: "12.5V",
      altitude: 175,
      address: "Lagos, Nigeria",
      protocol: "osmand",
      driver: "John Doe",
      total_distance: 114.73,
      unit_of_distance: "Km",
      sensors: [
        {
          id: 37,
          type: "engine",
          name: "Ignition",
          show_in_popup: 0,
          value: "On",
          val: 1,
          scale_value: null,
          tag_name: "ignition"
        },
        {
          id: 38,
          type: "engine_hours",
          name: "Engine Hours",
          show_in_popup: 0,
          value: "6.4 h",
          val: 6.4008,
          scale_value: null,
          tag_name: "enginehours"
        },
        {
          id: 39,
          type: "battery",
          name: "Battery Level",
          show_in_popup: 0,
          value: "3.27 Volts",
          val: 3.272,
          scale_value: 1,
          tag_name: "battery"
        }
      ],
      tail: [
        { lat: "9.080", lng: "8.673" },
        { lat: "9.081", lng: "8.674" },
        { lat: "9.082", lng: "8.6753" },
        { lat: "9.083", lng: "8.676" },
        { lat: "9.084", lng: "8.677" },
      ],
      device_data: {
        tail_color: "#33cc33",
        tail_length: "3",
        distance_unit_hour: "km/h",
      },
    },
    {
      id: 2,
      name: "Tractor Beta",
      online: "offline",
      alarm: "low_fuel",
      time: "2024-08-31 13:45:00",
      timestamp: Date.now() / 1000 - 3600,
      speed: 0,
      lat: 9.1,
      lng: 8.7,
      course: "180",
      power: "11.8V",
      altitude: 180,
      address: "Abuja, Nigeria",
      protocol: "osmand",
      driver: "Jane Smith",
      total_distance: 89.45,
      unit_of_distance: "Km",
      sensors: [
        {
          id: 37,
          type: "engine",
          name: "Ignition",
          show_in_popup: 0,
          value: "Off",
          val: 0,
          scale_value: null,
          tag_name: "ignition"
        },
        {
          id: 38,
          type: "engine_hours",
          name: "Engine Hours",
          show_in_popup: 0,
          value: "4.2 h",
          val: 4.2005,
          scale_value: null,
          tag_name: "enginehours"
        },
        {
          id: 39,
          type: "battery",
          name: "Battery Level",
          show_in_popup: 0,
          value: "2.85 Volts",
          val: 2.85,
          scale_value: 1,
          tag_name: "battery"
        }
      ],
      tail: [
        { lat: "9.095", lng: "8.695" },
        { lat: "9.098", lng: "8.698" },
        { lat: "9.1", lng: "8.7" },
        { lat: "9.102", lng: "8.702" },
      ],
      device_data: {
        tail_color: "#ff6600",
        tail_length: "4",
        distance_unit_hour: "km/h",
      },
    },
    {
      id: 3,
      name: "Harvester Gamma",
      online: "online",
      alarm: "",
      time: "2024-08-31 14:35:00",
      timestamp: Date.now() / 1000,
      speed: 15,
      lat: 9.05,
      lng: 8.65,
      course: "90",
      power: "13.2V",
      altitude: 165,
      address: "Kano, Nigeria",
      protocol: "osmand",
      driver: "Mike Johnson",
      total_distance: 156.78,
      unit_of_distance: "Km",
      sensors: [
        {
          id: 37,
          type: "engine",
          name: "Ignition",
          show_in_popup: 0,
          value: "On",
          val: 1,
          scale_value: null,
          tag_name: "ignition"
        },
        {
          id: 38,
          type: "engine_hours",
          name: "Engine Hours",
          show_in_popup: 0,
          value: "8.7 h",
          val: 8.7002,
          scale_value: null,
          tag_name: "enginehours"
        },
        {
          id: 39,
          type: "battery",
          name: "Battery Level",
          show_in_popup: 0,
          value: "3.45 Volts",
          val: 3.45,
          scale_value: 1,
          tag_name: "battery"
        }
      ],
      tail: [
        { lat: "9.045", lng: "8.645" },
        { lat: "9.047", lng: "8.647" },
        { lat: "9.05", lng: "8.65" },
        { lat: "9.052", lng: "8.652" },
        { lat: "9.054", lng: "8.654" },
        { lat: "9.056", lng: "8.656" },
      ],
      device_data: {
        tail_color: "#0066ff",
        tail_length: "5",
        distance_unit_hour: "km/h",
      },
    },
  ];

  const dummyGeofences: GeofenceItem[] = [
    {
      id: 1,
      type: "circle",
      user_id: 1,
      group_id: null,
      active: 1,
      name: "Farm Zone A",
      center: { lat: 9.085, lng: 8.675 },
      radius: 2000,
      coordinates: "",
      polygon_color: "#00ff00",
      created_at: "2024-01-01",
      updated_at: "2024-08-31",
    },
    {
      id: 2,
      type: "polygon",
      user_id: 1,
      group_id: null,
      active: 1,
      name: "Restricted Area",
      center: { lat: 9.095, lng: 8.685 },
      radius: 0,
      coordinates: JSON.stringify([
        { lat: 9.093, lng: 8.683 },
        { lat: 9.097, lng: 8.683 },
        { lat: 9.097, lng: 8.687 },
        { lat: 9.093, lng: 8.687 },
      ]),
      polygon_color: "#ff0000",
      created_at: "2024-01-01",
      updated_at: "2024-08-31",
    },
    {
      id: 3,
      type: "polygon",
      user_id: 1,
      group_id: null,
      active: 1,
      name: "Safe Parking Zone",
      center: { lat: 9.06, lng: 8.66 },
      radius: 0,
      coordinates: JSON.stringify([
        { lat: 9.058, lng: 8.658 },
        { lat: 9.062, lng: 8.658 },
        { lat: 9.062, lng: 8.662 },
        { lat: 9.058, lng: 8.662 },
      ]),
      polygon_color: "#0000ff",
      created_at: "2024-01-01",
      updated_at: "2024-08-31",
    },
  ];

  // Fetch history data with parameters
  const fetchHistory = async (deviceId?: string, fromDate?: string, fromTime?: string, toDate?: string, toTime?: string) => {
    try {
      console.log('Fetching history data with params:', { deviceId, fromDate, fromTime, toDate, toTime });
      const historyResponse = await getHistory(deviceId, fromDate, fromTime, toDate, toTime);
      console.log('History response:', historyResponse);
      
      if (historyResponse?.data?.items) {
        const responseData: HistoryResponse = historyResponse.data;
        setHistoryGroups(responseData.items);
        
        // Flatten all history items from all groups
        const allHistoryItems: HistoryItem[] = [];
        responseData.items.forEach(group => {
          if (group.items && Array.isArray(group.items)) {
            allHistoryItems.push(...group.items);
          }
        });
        setHistory(allHistoryItems);
        console.log('Loaded history groups:', responseData.items.length);
        console.log('Loaded history items:', allHistoryItems.length);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  // Set default date values
  const setDefaultDateRange = (days: number) => {
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - days);
    
    setHistorySearchParams(prev => ({
      ...prev,
      fromDate: fromDate.toISOString().split('T')[0],
      fromTime: '00:00',
      toDate: today.toISOString().split('T')[0],
      toTime: '23:59'
    }));
  };

  // Search history with user-selected parameters
  const searchHistory = async () => {
    if (!historySearchParams.deviceId || !historySearchParams.fromDate || !historySearchParams.toDate) {
      alert('Please select a device and date range');
      return;
    }

    setIsLoadingHistory(true);
    try {
      // Clear previous results
      setHistoryGroups([]);
      setHistory([]);
      setSelectedHistoryTrail(null);
      setSelectedHistoryIndex(null);

      // Fetch history with the selected parameters
      await fetchHistory(
        historySearchParams.deviceId,
        historySearchParams.fromDate,
        historySearchParams.fromTime,
        historySearchParams.toDate,
        historySearchParams.toTime
      );
    } catch (err) {
      console.error('Error searching history:', err);
      alert('Error fetching history data. Please try again.');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Filter devices based on tractorId parameter
  useEffect(() => {
    if (tractorId) {
      const targetId = parseInt(tractorId);
      const filteredDevices = allDevices.filter(device => device.id === targetId);
      setDevices(filteredDevices);
      setVisibleDevices(new Set(filteredDevices.map(d => d.id)));
      
      // Auto-select the filtered tractor in history search
      setHistorySearchParams(prev => ({ ...prev, deviceId: tractorId }));
      
      console.log(`Filtered devices for tractorId ${tractorId}:`, filteredDevices.length);
    } else {
      setDevices(allDevices);
      setVisibleDevices(new Set(allDevices.map(d => d.id)));
      console.log('Showing all devices (no tractorId filter)');
    }
  }, [tractorId, allDevices]);

  // Fetch data from APIs or use dummy data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`Using ${DATA_MODE} data mode`);
        
        if (DATA_MODE === "dummy") {
          // Use dummy data
          setAllDevices(dummyDevices);
          setGeofences(dummyGeofences);
          console.log('Loaded dummy devices:', dummyDevices.length);
          console.log('Loaded dummy geofences:', dummyGeofences.length);
        } else {
          // Use real API data
          console.log('Fetching real data from APIs...');
          
          // Fetch tracked tractors
          const tractorsResponse = await getTrackedTractors();
          console.log('Tractors response:', tractorsResponse);
          
          const fetchedDevices: TrackedDevice[] = [];
          
          // Extract devices from all groups
          if (tractorsResponse?.data && Array.isArray(tractorsResponse.data)) {
            tractorsResponse.data.forEach((group: TrackedGroup) => {
              if (group.items && Array.isArray(group.items)) {
                fetchedDevices.push(...group.items);
              }
            });
          }
          
          setAllDevices(fetchedDevices);
          console.log('Loaded real devices:', fetchedDevices.length);

          // Fetch geofences
          const geofencesResponse = await getGeoFences();
          console.log('Geofences response:', geofencesResponse);
          
          if (geofencesResponse?.data?.items?.geofences) {
            setGeofences(geofencesResponse?.data?.items?.geofences);
            console.log('Loaded real geofences:', geofencesResponse?.data?.items?.geofences.length);
          }

          // Fetch alerts
          await fetchAlerts();
        }

        // Don't automatically fetch history - let user search manually
        // await fetchHistory();

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Failed to load ${DATA_MODE} tracking data. Check console for details.`);
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchData();
    }
  }, [isLoaded]);


  const onLoad = useCallback((map: google.maps.Map) => {
    console.log('Map loaded successfully');
    
    // Create the vehicle icon after Google Maps API is loaded
    try {
      const icon: google.maps.Icon = {
        url: "https://res.cloudinary.com/tractrac-global/image/upload/v1746446667/tractor-icon_nwbaf5.svg",
        scaledSize: new google.maps.Size(54, 54),
        anchor: new google.maps.Point(16, 16),
      };
      setVehicleIcon(icon);
      console.log('Vehicle icon created successfully');
    } catch (error) {
      console.error('Error creating vehicle icon:', error);
    }
    
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
    setVehicleIcon(null);
  }, []);

  // Get polyline options based on device tail color
  const getTrailOptions = (device: TrackedDevice): google.maps.PolylineOptions => ({
    strokeColor: device.device_data?.tail_color || '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: parseInt(device.device_data?.tail_length) || 3,
  });

  // Handle device visibility toggle
  const toggleDeviceVisibility = (deviceId: number) => {
    setVisibleDevices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deviceId)) {
        newSet.delete(deviceId);
      } else {
        newSet.add(deviceId);
      }
      return newSet;
    });
  };

  // Handle device click - zoom to device location
  const zoomToDevice = (device: TrackedDevice) => {
    if (map) {
      map.panTo({ lat: device.lat, lng: device.lng });
      map.setZoom(150); // Zoom in closer to the device
      console.log(`Zooming to device ${device.name} at`, device.lat, device.lng);
    }
  };

  // Toggle all devices visibility
  const toggleAllDevices = () => {
    if (visibleDevices.size === devices.length) {
      setVisibleDevices(new Set()); // Hide all
    } else {
      setVisibleDevices(new Set(devices.map(d => d.id))); // Show all
    }
  };

  // Helper function to get battery level from sensors
  const getBatteryLevel = (device: TrackedDevice): string => {
    const batterySensor = device.sensors?.find(sensor => sensor.tag_name === 'battery');
    return batterySensor ? batterySensor.value : 'N/A';
  };

  // Helper function to calculate area covered by tractor (simplified calculation)
  const getAreaCovered = (device: TrackedDevice): string => {
    if (!device.tail || device.tail.length < 3) {
      return 'N/A';
    }
    
    // Simple approximation: calculate bounding box area
    const lats = device.tail.map(point => parseFloat(point.lat));
    const lngs = device.tail.map(point => parseFloat(point.lng));
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    // Rough calculation: 1 degree ≈ 111 km
    const latDiff = (maxLat - minLat) * 111;
    const lngDiff = (maxLng - minLng) * 111 * Math.cos((minLat + maxLat) / 2 * Math.PI / 180);
    
    const area = latDiff * lngDiff;
    
    if (area < 1) {
      return `${(area * 1000).toFixed(0)} m²`;
    } else {
      return `${area.toFixed(2)} km²`;
    }
  };

  // Geofence management functions
  const openGeofenceForm = (geofence?: GeofenceItem) => {
    if (geofence) {
      setEditingGeofence(geofence);
      setGeofenceFormData({
        name: geofence.name,
        type: geofence.type as 'circle' | 'polygon',
        polygon_color: geofence.polygon_color,
        device_id: geofence.device_id || undefined,
        group_id: geofence.group_id || undefined,
        speed_limit: geofence.speed_limit || undefined,
        active: geofence.active,
        coordinates: geofence.coordinates,
        center: geofence.center,
        radius: geofence.radius
      });
    } else {
      setEditingGeofence(null);
      setGeofenceFormData({
        name: '',
        type: 'circle',
        polygon_color: '#00ff00',
        active: 1
      });
    }
    setShowGeofenceForm(true);
  };

  const closeGeofenceForm = () => {
    setShowGeofenceForm(false);
    setEditingGeofence(null);
    setIsDrawingMode(false);
    setDrawingType(null);
    setDrawnCoordinates([]);
    setDrawnCenter(null);
    setDrawnRadius(null);
  };

  const startDrawing = (type: 'circle' | 'polygon') => {
    setIsDrawingMode(true);
    setDrawingType(type);
    setDrawnCoordinates([]);
    setDrawnCenter(null);
    setDrawnRadius(null);
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!isDrawingMode || !drawingType || !event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    if (drawingType === 'circle') {
      if (!drawnCenter) {
        // First click sets center
        setDrawnCenter({ lat, lng });
      } else {
        // Second click sets radius
        const radius = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(drawnCenter.lat, drawnCenter.lng),
          new google.maps.LatLng(lat, lng)
        );
        setDrawnRadius(radius);
        setIsDrawingMode(false);
        setDrawingType(null);
      }
    } else if (drawingType === 'polygon') {
      setDrawnCoordinates(prev => [...prev, { lat, lng }]);
    }
  };

  const finishPolygonDrawing = () => {
    if (drawnCoordinates.length >= 3) {
      setIsDrawingMode(false);
      setDrawingType(null);
    }
  };

  const saveGeofence = async () => {
    if (!geofenceFormData.name.trim()) {
      alert('Please enter a geofence name');
      return;
    }

    setIsLoadingGeofence(true);
    try {
      const geofenceData: CreateGeoFenceData = {
        ...geofenceFormData,
        coordinates: geofenceFormData.type === 'polygon' && drawnCoordinates.length > 0 
          ? JSON.stringify(drawnCoordinates) 
          : geofenceFormData.coordinates,
        center: geofenceFormData.type === 'circle' && drawnCenter 
          ? drawnCenter 
          : geofenceFormData.center,
        radius: geofenceFormData.type === 'circle' && drawnRadius 
          ? drawnRadius 
          : geofenceFormData.radius
      };

      if (editingGeofence) {
        await updateGeoFence(editingGeofence.id, geofenceData);
        alert('Geofence updated successfully!');
      } else {
        const response = await addGeoFence(geofenceData);
        console.log("addGeoFence", response);

        alert('Geofence created successfully!');
      }

      // Refresh geofences
      const geofencesResponse = await getGeoFences();
      if (geofencesResponse?.data?.items?.geofences) {
        setGeofences(geofencesResponse.data.items.geofences);
      }

      closeGeofenceForm();
    } catch (err) {
      console.error('Error saving geofence:', err);
      alert('Error saving geofence. Please try again.');
    } finally {
      setIsLoadingGeofence(false);
    }
  };

  const handleDeleteGeofence = async (geofenceId: number) => {
    if (!confirm('Are you sure you want to delete this geofence?')) return;

    try {
      await deleteGeoFence(geofenceId);
      alert('Geofence deleted successfully!');
      
      // Refresh geofences
      const geofencesResponse = await getGeoFences();
      if (geofencesResponse?.data?.items?.geofences) {
        setGeofences(geofencesResponse.data.items.geofences);
      }
    } catch (err) {
      console.error('Error deleting geofence:', err);
      alert('Error deleting geofence. Please try again.');
    }
  };

  // Alert management functions
  const fetchAlerts = async () => {
    try {
      setAlertsLoading(true);
      const response = await getAlerts();
      if (response?.data?.items?.alerts) {
        setAlerts(response.data.items.alerts);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError('Error fetching alerts. Please try again.');
    } finally {
      setAlertsLoading(false);
    }
  };

  const openAlertModal = (alert?: AlertItem) => {
    if (alert) {
      setSelectedAlert(alert);
      setAlertFormData({
        name: alert.name,
        devices: alert.devices,
        geofences: alert.geofences,
        notifications: alert.notifications,
        type: alert.type
      });
    } else {
      setSelectedAlert(null);
      setAlertFormData({
        name: '',
        devices: [],
        geofences: [],
        notifications: {
          email: {
            active: 0,
            input: 'Israel.olatunde@tractrac.co'
          }
        },
        type: 'geofence_inout'
      });
    }
    setShowAlertModal(true);
  };

  const closeAlertModal = () => {
    if (isLoadingAlert) return; // Prevent closing while loading
    setShowAlertModal(false);
    setSelectedAlert(null);
  };

  const saveAlert = async () => {
    try {
      setIsLoadingAlert(true);
      
      // Validation checks
      if (!alertFormData.name.trim()) {
        alert('Please enter an alert name');
        setIsLoadingAlert(false);
        return;
      }

      if (alertFormData.devices.length === 0) {
        alert('Please select at least one device');
        setIsLoadingAlert(false);
        return;
      }

      if (alertFormData.geofences.length === 0) {
        alert('Please select at least one geofence');
        setIsLoadingAlert(false);
        return;
      }

      if (selectedAlert) {
        // Edit existing alert
        await editAlert(
          selectedAlert.id,
          alertFormData.name,
          alertFormData.devices,
          alertFormData.geofences
        );
        alert('Alert updated successfully!');
      } else {
        // Create new alert
        await createAlert(
          alertFormData.name,
          alertFormData.devices,
          alertFormData.geofences
        );
        alert('Alert created successfully!');
      }

      // Refresh alerts
      await fetchAlerts();
      closeAlertModal();
    } catch (err) {
      console.error('Error saving alert:', err);
      alert('Error saving alert. Please try again.');
    } finally {
      setIsLoadingAlert(false);
    }
  };

  const handleDeleteAlert = async (alertId: number) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;

    try {
      // Note: The API doesn't seem to have a delete alert endpoint
      // You might need to implement this or use editAlert to deactivate
      console.log('Delete alert:', alertId);
      alert('Alert deletion not implemented in API');
    } catch (err) {
      console.error('Error deleting alert:', err);
      alert('Error deleting alert. Please try again.');
    }
  };

  // Show history trail on map
  const showHistoryTrailOnMap = (mainItem: HistoryResponse['items'][0], index: number) => {
    if (mainItem.items && mainItem.items.length > 0) {
      setSelectedHistoryTrail(mainItem.items);
      setSelectedHistoryIndex(index);
      
      // Pan map to the first point of the trail and zoom in
      if (map && mainItem.items[0]) {
        const firstPoint = mainItem.items[0];
        
        // Use setTimeout to ensure the map is ready
        setTimeout(() => {
          map.panTo({ lat: firstPoint.lat, lng: firstPoint.lng });
          map.setZoom(150);
          console.log(`Map panned to ${firstPoint.lat}, ${firstPoint.lng} and zoomed to 15`);
        }, 100);
      }
      
      console.log(`Showing history trail with ${mainItem.items.length} points on map`);
    }
  };

  // Get polygon options based on geofence color
  const getPolygonOptions = (geofence: GeofenceItem): google.maps.PolygonOptions => ({
    strokeColor: geofence.polygon_color || '#00FF00',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: geofence.polygon_color || '#00FF00',
    fillOpacity: 0.2,
  });

  // Circle options for circular geofences
  const circleOptions: google.maps.CircleOptions = {
    strokeColor: '#0000FF',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#0000FF',
    fillOpacity: 0.2,
  };

  if (loadError) {
    return <div>Error loading maps: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps API...</div>;
  }

  if (loading) {
    return <div>Loading tracking data...</div>;
  }

  if (error) {
    return (
      <div>
        <div style={{ color: 'red', marginBottom: '10px' }}>Error: {error}</div>
        <div>Please check the browser console for more details.</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      {/* Device List Sidebar with Tabs */}
      <div style={{ 
        width: '300px', 
        background: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Tab Headers */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '2px solid #e0e0e0',
          marginBottom: '15px',
          width: '300px',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => setActiveTab('devices')}
            style={{
              flex: 1,
              padding: '10px 15px',
              border: 'none',
              background: activeTab === 'devices' ? '#FA9411' : 'transparent',
              color: activeTab === 'devices' ? 'white' : '#666',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '4px 4px 0 0'
            }}
          >
            Devices ({devices.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              flex: 1,
              padding: '10px 15px',
              border: 'none',
              background: activeTab === 'history' ? '#FA9411' : 'transparent',
              color: activeTab === 'history' ? 'white' : '#666',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '4px 4px 0 0'
            }}
          >
            History ({history.length})
          </button>
          <button
            onClick={() => setActiveTab('geofences')}
            style={{
              flex: 1,
              padding: '10px 15px',
              border: 'none',
              background: activeTab === 'geofences' ? '#FA9411' : 'transparent',
              color: activeTab === 'geofences' ? 'white' : '#666',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '4px 4px 0 0'
            }}
          >
            Geofences ({geofences.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            style={{
              flex: 1,
              padding: '10px 15px',
              border: 'none',
              background: activeTab === 'alerts' ? '#FA9411' : 'transparent',
              color: activeTab === 'alerts' ? 'white' : '#666',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '4px 4px 0 0'
            }}
          >
            Alerts ({alerts.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'devices' && (
          <div>
            {tractorId && (
              <div style={{ 
                background: '#e3f2fd', 
                padding: '10px', 
                borderRadius: '6px', 
                marginBottom: '15px',
                border: '1px solid #2196f3'
              }}>
                <div style={{ fontSize: '12px', color: '#1976d2', fontWeight: 'bold', marginBottom: '5px' }}>
                  🔍 Filtered View
                </div>
                <div style={{ fontSize: '11px', color: '#424242' }}>
                  Showing only Tractor ID: <strong>{tractorId}</strong>
                  {devices.length === 0 && (
                    <div style={{ color: '#f44336', marginTop: '5px' }}>
                      ⚠️ No tractor found with this ID
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div style={{ marginBottom: '15px' }}>
              <button
                onClick={toggleAllDevices}
                style={{ 
                  padding: '5px 10px',
                  fontSize: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                {visibleDevices.size === devices.length ? 'Hide All' : 'Show All'}
              </button>
            </div>
            
            {devices.map((device) => (
              <div
                key={device.id}
                style={{ 
                  marginBottom: '10px',
                  padding: '10px',
                  background: '#fff',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <input
                    type="checkbox"
                    checked={visibleDevices.has(device.id)}
                    onChange={() => toggleDeviceVisibility(device.id)}
                    style={{ marginRight: '8px' }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <strong 
                    style={{ fontSize: '14px', color: '#333', flex: 1 }}
                    onClick={() => zoomToDevice(device)}
                  >
                    {device.name}
                  </strong>
                  <span style={{ 
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    background: device.online === 'online' ? '#FA9411' : '#dc3545',
                    color: 'white'
                  }}>
                    {device.online}
                  </span>
                </div>
                
                <div 
                  style={{ fontSize: '12px', color: '#666', cursor: 'pointer' }}
                  onClick={() => zoomToDevice(device)}
                >
                  <div>Driver: {device.driver}</div>
                  <div>Speed: {device.speed} {device.device_data?.distance_unit_hour || 'km/h'}</div>
                  <div>Total Distance: {device.total_distance || 0} {device.unit_of_distance || 'km'}</div>
                  <div>Area Covered: {getAreaCovered(device)}</div>
                  <div>Battery: {getBatteryLevel(device)}</div>
                  <div>Last Update: {new Date(device.timestamp * 1000).toLocaleTimeString()}</div>
                  {device.alarm && (
                    <div style={{ color: '#dc3545', fontWeight: 'bold' }}>
                      ⚠️ {device.alarm}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {devices.length === 0 && !loading && (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                No devices found
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                  Device Movement History
                </h4>
                {selectedHistoryTrail && (
                  <button
                    onClick={() => {
                      setSelectedHistoryTrail(null);
                      setSelectedHistoryIndex(null);
                    }}
                    style={{
                      padding: '4px 8px',
                      fontSize: '10px',
                      border: '1px solid #dc3545',
                      borderRadius: '3px',
                      background: '#fff',
                      color: '#dc3545',
                      cursor: 'pointer'
                    }}
                  >
                    Clear Trail
                  </button>
                )}
              </div>
              
              {/* History Search Form */}
              <div style={{ 
                background: '#f8f9fa', 
                padding: '12px', 
                borderRadius: '6px', 
                marginBottom: '15px',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                  Search History
                </div>
                
                {/* Device Selector */}
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '2px' }}>
                    Device:
                  </label>
                  <select
                    value={historySearchParams.deviceId}
                    onChange={(e) => setHistorySearchParams(prev => ({ ...prev, deviceId: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '4px 6px',
                      fontSize: '11px',
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                      background: '#fff'
                    }}
                  >
                    <option value="">Select a device</option>
                    {devices.map(device => (
                      <option key={device.id} value={device.id}>
                        {device.name} (ID: {device.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date and Time Range */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '2px' }}>
                      From Date:
                    </label>
                    <input
                      type="date"
                      value={historySearchParams.fromDate}
                      onChange={(e) => setHistorySearchParams(prev => ({ ...prev, fromDate: e.target.value }))}
                      style={{
                        // width: '100%',
                        padding: '4px 6px',
                        fontSize: '11px',
                        border: '1px solid #ccc',
                        borderRadius: '3px'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '2px' }}>
                      From Time:
                    </label>
                    <input
                      type="time"
                      value={historySearchParams.fromTime}
                      onChange={(e) => setHistorySearchParams(prev => ({ ...prev, fromTime: e.target.value }))}
                      style={{
                        // width: '100%',
                        padding: '4px 6px',
                        fontSize: '11px',
                        border: '1px solid #ccc',
                        borderRadius: '3px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '2px' }}>
                      To Date:
                    </label>
                    <input
                      type="date"
                      value={historySearchParams.toDate}
                      onChange={(e) => setHistorySearchParams(prev => ({ ...prev, toDate: e.target.value }))}
                      style={{
                        // width: '100%',
                        padding: '4px 6px',
                        fontSize: '11px',
                        border: '1px solid #ccc',
                        borderRadius: '3px'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '2px' }}>
                      To Time:
                    </label>
                    <input
                      type="time"
                      value={historySearchParams.toTime}
                      onChange={(e) => setHistorySearchParams(prev => ({ ...prev, toTime: e.target.value }))}
                      style={{
                        // width: '100%',
                        padding: '4px 6px',
                        fontSize: '11px',
                        border: '1px solid #ccc',
                        borderRadius: '3px'
                      }}
                    />
                  </div>
                </div>

                {/* Quick Preset Buttons */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>Quick presets:</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => setDefaultDateRange(1)}
                      style={{
                        flex: 1,
                        padding: '3px 6px',
                        fontSize: '9px',
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                        background: '#fff',
                        color: '#666',
                        cursor: 'pointer'
                      }}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setDefaultDateRange(7)}
                      style={{
                        flex: 1,
                        padding: '3px 6px',
                        fontSize: '9px',
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                        background: '#fff',
                        color: '#666',
                        cursor: 'pointer'
                      }}
                    >
                      Last 7 days
                    </button>
                    <button
                      onClick={() => setDefaultDateRange(30)}
                      style={{
                        flex: 1,
                        padding: '3px 6px',
                        fontSize: '9px',
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                        background: '#fff',
                        color: '#666',
                        cursor: 'pointer'
                      }}
                    >
                      Last 30 days
                    </button>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={searchHistory}
                  disabled={isLoadingHistory}
                  style={{
                    width: '100%',
                    padding: '6px 12px',
                    fontSize: '11px',
                    border: 'none',
                    borderRadius: '3px',
                    background: isLoadingHistory ? '#ccc' : '#FA9411',
                    color: 'white',
                    cursor: isLoadingHistory ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {isLoadingHistory ? 'Searching...' : 'Search History'}
                </button>
              </div>
              
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '10px' }}>
                Click on a movement period to show the trail on the map
              </div>
            </div>
            
            {historyGroups.map((mainItem, mainIndex) => {
              const movementCount = mainItem.items ? mainItem.items.length : 0;
              const isSelected = selectedHistoryIndex === mainIndex;
              
              return (
                <div 
                  key={mainIndex} 
                  onClick={() => showHistoryTrailOnMap(mainItem, mainIndex)}
                  style={{ 
                    marginBottom: '10px',
                    padding: '12px',
                    background: isSelected ? 'rgba(250, 149, 17, 0.24)' : '#f8f9fa',
                    borderRadius: '6px',
                    border: isSelected ? '2px solid #FA9411' : '1px solid #e0e0e0',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderLeft: `4px solid ${isSelected ? '#FA9411' : mainItem.status === 3 ? '#FA9411' : mainItem.status === 2 ? '#ffc107' : '#dc3545'}`,
                    boxShadow: isSelected ? '0 2px 8px rgba(33, 150, 243, 0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = '#e9ecef';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = '#f8f9fa';
                    }
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: isSelected ? '#FA9411' : '#333', marginBottom: '4px' }}>
                    Movement Period {mainIndex + 1}
                    {isSelected && <span style={{ marginLeft: '8px', fontSize: '10px', color: '#FA9411' }}>● Active</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    <div><strong>Time:</strong> {mainItem.show}</div>
                    {mainItem.distance > 0 && <div><strong>Distance:</strong> {mainItem.distance} km</div>}
                    {mainItem.time && <div><strong>Duration:</strong> {mainItem.time}</div>}
                    <div><strong>Tracking Points:</strong> {movementCount}</div>
                    <div><strong>Status:</strong> 
                      <span style={{ 
                        color: mainItem.status === 3 ? '#FA9411' : mainItem.status === 2 ? '#ffc107' : '#dc3545',
                        fontWeight: 'bold',
                        marginLeft: '4px'
                      }}>
                        {mainItem.status === 3 ? 'Active' : mainItem.status === 2 ? 'Parked' : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {historyGroups.length === 0 && !loading && !isLoadingHistory && (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                {historySearchParams.deviceId ? 'No movement history found for the selected criteria' : 'Select a device and date range to search history'}
              </div>
            )}
            
            {isLoadingHistory && (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                <div style={{ fontSize: '12px' }}>Searching history...</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'geofences' && (
          <div>
            {!showGeofenceForm ? (
              // Geofence List View
              <div>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                      Geofence Management
                    </h4>
                    <button
                      onClick={() => openGeofenceForm()}
                      style={{
                        padding: '6px 12px',
                        fontSize: '11px',
                        border: 'none',
                        borderRadius: '4px',
                        background: '#FA9411',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      + Add Geofence
                    </button>
                  </div>
                </div>
                
                {geofences.map((geofence) => (
                  <div
                    key={geofence.id}
                    style={{ 
                      marginBottom: '10px',
                      padding: '12px',
                      background: '#fff',
                      borderRadius: '6px',
                      border: '1px solid #e0e0e0',
                      borderLeft: `4px solid ${geofence.polygon_color}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <strong style={{ fontSize: '13px', color: '#333' }}>
                          {geofence.name}
                        </strong>
                        <span style={{ 
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          background: geofence.active ? '#FA9411' : '#dc3545',
                          color: 'white',
                          marginLeft: '8px'
                        }}>
                          {geofence.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => openGeofenceForm(geofence)}
                          style={{
                            padding: '3px 6px',
                            fontSize: '9px',
                            border: '1px solid #007bff',
                            borderRadius: '3px',
                            background: '#fff',
                            color: '#007bff',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteGeofence(geofence.id)}
                          style={{
                            padding: '3px 6px',
                            fontSize: '9px',
                            border: '1px solid #dc3545',
                            borderRadius: '3px',
                            background: '#fff',
                            color: '#dc3545',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      <div><strong>Type:</strong> {geofence.type}</div>
                      {geofence.type === 'circle' && geofence.radius && (
                        <div><strong>Radius:</strong> {geofence.radius.toFixed(0)}m</div>
                      )}
                      {geofence.speed_limit && (
                        <div><strong>Speed Limit:</strong> {geofence.speed_limit} km/h</div>
                      )}
                      {geofence.device_id && (
                        <div><strong>Device ID:</strong> {geofence.device_id}</div>
                      )}
                      <div><strong>Created:</strong> {new Date(geofence.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
                
                {geofences.length === 0 && !loading && (
                  <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                    No geofences found. Click "Add Geofence" to create one.
                  </div>
                )}
              </div>
            ) : (
              // Geofence Form View
              <div>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                      {editingGeofence ? 'Edit Geofence' : 'Create New Geofence'}
                    </h4>
                    <button
                      onClick={closeGeofenceForm}
                      style={{
                        padding: '4px 8px',
                        fontSize: '10px',
                        border: '1px solid #dc3545',
                        borderRadius: '3px',
                        background: '#fff',
                        color: '#dc3545',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', fontWeight: 'bold' }}>
                    Geofence Name:
                  </label>
                  <input
                    type="text"
                    value={geofenceFormData.name}
                    onChange={(e) => setGeofenceFormData(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                      fontSize: '12px'
                    }}
                    placeholder="Enter geofence name"
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', fontWeight: 'bold' }}>
                    Type:
                  </label>
                  <select
                    value={geofenceFormData.type}
                    onChange={(e) => setGeofenceFormData(prev => ({ ...prev, type: e.target.value as 'circle' | 'polygon' }))}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                      fontSize: '12px'
                    }}
                  >
                    <option value="circle">Circle</option>
                    <option value="polygon">Polygon</option>
                  </select>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', fontWeight: 'bold' }}>
                    Color:
                  </label>
                  <input
                    type="color"
                    value={geofenceFormData.polygon_color}
                    onChange={(e) => setGeofenceFormData(prev => ({ ...prev, polygon_color: e.target.value }))}
                    style={{
                      width: '100%',
                      height: '30px',
                      border: '1px solid #ccc',
                      borderRadius: '3px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', fontWeight: 'bold' }}>
                    Speed Limit (km/h):
                  </label>
                  <input
                    type="number"
                    value={geofenceFormData.speed_limit || ''}
                    onChange={(e) => setGeofenceFormData(prev => ({ ...prev, speed_limit: parseInt(e.target.value) || undefined }))}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                      fontSize: '12px'
                    }}
                    placeholder="Optional speed limit"
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', fontWeight: 'bold' }}>
                    Device Association:
                  </label>
                  <select
                    value={geofenceFormData.device_id || ''}
                    onChange={(e) => setGeofenceFormData(prev => ({ ...prev, device_id: parseInt(e.target.value) || undefined }))}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                      fontSize: '12px'
                    }}
                  >
                    <option value="">No specific device</option>
                    {devices.map(device => (
                      <option key={device.id} value={device.id}>
                        {device.name} (ID: {device.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                    <input
                      type="checkbox"
                      checked={geofenceFormData.active === 1}
                      onChange={(e) => setGeofenceFormData(prev => ({ ...prev, active: e.target.checked ? 1 : 0 }))}
                      style={{ marginRight: '6px' }}
                    />
                    Active (monitor this geofence)
                  </label>
                </div>

                {/* Drawing Instructions */}
                {!editingGeofence && (
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '10px', 
                    borderRadius: '4px', 
                    marginBottom: '15px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <h5 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#333' }}>
                      Drawing Instructions:
                    </h5>
                    {geofenceFormData.type === 'circle' ? (
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        <p style={{ margin: '0 0 3px 0' }}>1. Click "Start Drawing Circle" below</p>
                        <p style={{ margin: '0 0 3px 0' }}>2. Click on the map to set the center point</p>
                        <p style={{ margin: '0' }}>3. Click again to set the radius</p>
                      </div>
                    ) : (
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        <p style={{ margin: '0 0 3px 0' }}>1. Click "Start Drawing Polygon" below</p>
                        <p style={{ margin: '0 0 3px 0' }}>2. Click on the map to add points</p>
                        <p style={{ margin: '0' }}>3. Click "Finish Drawing" when done (minimum 3 points)</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Drawing Controls */}
                {!editingGeofence && (
                  <div style={{ marginBottom: '15px' }}>
                    {!isDrawingMode ? (
                      <button
                        onClick={() => startDrawing(geofenceFormData.type)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: 'none',
                          borderRadius: '4px',
                          background: '#007bff',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        Start Drawing {geofenceFormData.type === 'circle' ? 'Circle' : 'Polygon'}
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => {
                            setIsDrawingMode(false);
                            setDrawingType(null);
                            setDrawnCoordinates([]);
                            setDrawnCenter(null);
                            setDrawnRadius(null);
                          }}
                          style={{
                            flex: 1,
                            padding: '6px',
                            border: '1px solid #dc3545',
                            borderRadius: '3px',
                            background: '#fff',
                            color: '#dc3545',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 'bold'
                          }}
                        >
                          Cancel
                        </button>
                        {geofenceFormData.type === 'polygon' && drawnCoordinates.length >= 3 && (
                          <button
                            onClick={finishPolygonDrawing}
                            style={{
                              flex: 1,
                              padding: '6px',
                              border: 'none',
                              borderRadius: '3px',
                              background: '#FA9411',
                              color: 'white',
                              cursor: 'pointer',
                              fontSize: '11px',
                              fontWeight: 'bold'
                            }}
                          >
                            Finish ({drawnCoordinates.length})
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Drawing Status */}
                {isDrawingMode && (
                  <div style={{ 
                    background: '#fff3cd', 
                    padding: '8px', 
                    borderRadius: '3px', 
                    marginBottom: '15px',
                    border: '1px solid #ffeaa7'
                  }}>
                    <div style={{ fontSize: '11px', color: '#856404' }}>
                      {geofenceFormData.type === 'circle' ? (
                        drawnCenter ? 'Click on the map to set the radius' : 'Click on the map to set the center point'
                      ) : (
                        `Drawing polygon... ${drawnCoordinates.length} points added. Click "Finish Drawing" when done.`
                      )}
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <button
                  onClick={saveGeofence}
                  disabled={isLoadingGeofence}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: 'none',
                    borderRadius: '4px',
                    background: isLoadingGeofence ? '#ccc' : '#FA9411',
                    color: 'white',
                    cursor: isLoadingGeofence ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {isLoadingGeofence ? 'Saving...' : (editingGeofence ? 'Update Geofence' : 'Create Geofence')}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                  Alert Management
                </h4>
                <button
                  onClick={() => openAlertModal()}
                  style={{
                    padding: '6px 12px',
                    fontSize: '11px',
                    border: 'none',
                    borderRadius: '4px',
                    background: '#FA9411',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  + Create Alert
                </button>
              </div>
            </div>

            {alertsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Loading alerts...
              </div>
            ) : alerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No alerts found. Create your first alert to get started.
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{ 
                    marginBottom: '10px',
                    padding: '12px',
                    background: '#fff',
                    borderRadius: '6px',
                    border: '1px solid #e0e0e0',
                    borderLeft: `4px solid ${alert.active ? '#FA9411' : '#dc3545'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '13px', color: '#333' }}>
                        {alert.name}
                      </strong>
                      <span style={{ 
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        marginLeft: '8px',
                        background: alert.active ? '#d4edda' : '#f8d7da',
                        color: alert.active ? '#155724' : '#721c24'
                      }}>
                        {alert.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div>
                      <button
                        onClick={() => openAlertModal(alert)}
                        style={{
                          padding: '4px 8px',
                          fontSize: '10px',
                          border: 'none',
                          borderRadius: '3px',
                          background: '#007bff',
                          color: 'white',
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        style={{
                          padding: '4px 8px',
                          fontSize: '10px',
                          border: 'none',
                          borderRadius: '3px',
                          background: '#dc3545',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    <div><strong>Type:</strong> {alert.type}</div>
                    <div><strong>Devices:</strong> {alert.devices.length} device(s)</div>
                    <div><strong>Geofences:</strong> {alert.geofences.length} geofence(s)</div>
                    <div><strong>Created:</strong> {new Date(alert.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Alert Modal */}
      {showAlertModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>
                {selectedAlert ? 'Edit Alert' : 'Create New Alert'}
              </h3>
              <button
                onClick={closeAlertModal}
                disabled={isLoadingAlert}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: isLoadingAlert ? 'not-allowed' : 'pointer',
                  color: isLoadingAlert ? '#ccc' : '#666'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Alert Name *
              </label>
              <input
                type="text"
                value={alertFormData.name}
                onChange={(e) => setAlertFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter alert name"
                disabled={isLoadingAlert}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  opacity: isLoadingAlert ? 0.6 : 1,
                  cursor: isLoadingAlert ? 'not-allowed' : 'text'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Select Devices *
              </label>
              <div style={{ 
                maxHeight: '150px', 
                overflowY: 'auto', 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                padding: '8px',
                opacity: isLoadingAlert ? 0.6 : 1
              }}>
                {devices.map(device => (
                  <div key={device.id} style={{ marginBottom: '5px' }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: isLoadingAlert ? 'not-allowed' : 'pointer' 
                    }}>
                      <input
                        type="checkbox"
                        checked={alertFormData.devices.includes(device.id)}
                        disabled={isLoadingAlert}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAlertFormData(prev => ({ 
                              ...prev, 
                              devices: [...prev.devices, device.id] 
                            }));
                          } else {
                            setAlertFormData(prev => ({ 
                              ...prev, 
                              devices: prev.devices.filter(id => id !== device.id) 
                            }));
                          }
                        }}
                        style={{ marginRight: '8px' }}
                      />
                      <span style={{ fontSize: '14px' }}>{device.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Select Geofences *
              </label>
              <div style={{ 
                maxHeight: '150px', 
                overflowY: 'auto', 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                padding: '8px',
                opacity: isLoadingAlert ? 0.6 : 1
              }}>
                {geofences.map(geofence => (
                  <div key={geofence.id} style={{ marginBottom: '5px' }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: isLoadingAlert ? 'not-allowed' : 'pointer' 
                    }}>
                      <input
                        type="checkbox"
                        checked={alertFormData.geofences.includes(geofence.id)}
                        disabled={isLoadingAlert}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAlertFormData(prev => ({ 
                              ...prev, 
                              geofences: [...prev.geofences, geofence.id] 
                            }));
                          } else {
                            setAlertFormData(prev => ({ 
                              ...prev, 
                              geofences: prev.geofences.filter(id => id !== geofence.id) 
                            }));
                          }
                        }}
                        style={{ marginRight: '8px' }}
                      />
                      <span style={{ fontSize: '14px' }}>{geofence.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Email Notification
              </label>
              <input
                type="email"
                value={alertFormData.notifications?.email?.input || ''}
                onChange={(e) => setAlertFormData(prev => ({ 
                  ...prev, 
                  notifications: {
                    ...prev.notifications,
                    email: {
                      ...prev.notifications?.email,
                      input: e.target.value,
                      active: prev.notifications?.email?.active || 0
                    }
                  }
                }))}
                placeholder="Enter email address"
                disabled={isLoadingAlert}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  opacity: isLoadingAlert ? 0.6 : 1,
                  cursor: isLoadingAlert ? 'not-allowed' : 'text'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={closeAlertModal}
                disabled={isLoadingAlert}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: 'white',
                  cursor: isLoadingAlert ? 'not-allowed' : 'pointer',
                  opacity: isLoadingAlert ? 0.6 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveAlert}
                disabled={isLoadingAlert}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: isLoadingAlert ? '#ccc' : '#FA9411',
                  color: 'white',
                  cursor: isLoadingAlert ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {isLoadingAlert ? 'Saving...' : (selectedAlert ? 'Update Alert' : 'Create Alert')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '10px', fontSize: '14px', background: '#f0f0f0', padding: '5px' }}>
          <strong>Mode:</strong> {DATA_MODE.toUpperCase()} | 
          <strong> Status:</strong> Devices: {devices.length} | Geofences: {geofences.length} | Alerts: {alerts.length} | 
          <strong> Visible:</strong> {visibleDevices.size} devices
          {tractorId && (
            <span style={{ color: '#FA9411', fontWeight: 'bold' }}>
              {' | '}Filtered by Tractor ID: {tractorId}
            </span>
          )}
        </div>
        
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={8}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={mapOptions}
        >
          {/* Render Only Visible Device Markers */}
          {devices
            .filter(device => visibleDevices.has(device.id))
            .map((device) => {
              // Skip devices with invalid coordinates
              if (!device.lat || !device.lng || device.lat === 0 || device.lng === 0) {
                console.warn(`Skipping device ${device.id} - invalid coordinates:`, device.lat, device.lng);
                return null;
              }

              console.log(`Rendering device ${device.id} (${device.name}) at`, device.lat, device.lng, 'Online:', device.online);
              
              return (
                <Marker
                  key={device.id}
                  position={{ lat: device.lat, lng: device.lng }}
                  icon={vehicleIcon || fallbackIcon}
                  title={`${device.name}\nStatus: ${device.online}\nSpeed: ${device.speed} ${device.device_data?.tail_length || 'km/h'}\nDriver: ${device.driver}\nLast Update: ${device.time}`}
                  onLoad={() => console.log(`Device marker ${device.id} loaded successfully`)}
                />
              );
            })}

          {/* Render Device Trails (only for visible devices) */}
          {devices
            .filter(device => visibleDevices.has(device.id))
            .map((device) => {
              if (device.tail && device.tail.length > 1) {
                const trailCoordinates = device.tail
                  .map(point => ({
                    lat: parseFloat(point.lat),
                    lng: parseFloat(point.lng),
                  }))
                  .filter(coord => coord.lat !== 0 && coord.lng !== 0); // Filter out invalid coordinates
                
                if (trailCoordinates.length > 1) {
                  console.log(`Rendering trail for device ${device.id} (${device.name})`, trailCoordinates.length, 'points');
                  
                  return (
                    <Polyline
                      key={`trail-${device.id}`}
                      path={trailCoordinates}
                      options={getTrailOptions(device)}
                      onLoad={() => console.log(`Trail for device ${device.id} loaded successfully`)}
                    />
                  );
                }
              }
              return null;
            })}

          {/* Render Selected History Trail */}
          {selectedHistoryTrail && selectedHistoryTrail.length > 1 && (
            <Polyline
              path={selectedHistoryTrail.map(point => ({
                lat: point.lat,
                lng: point.lng,
              }))}
              options={{
                strokeColor: '#FF6B35',
                strokeOpacity: 1.0,
                strokeWeight: 4,
                geodesic: true,
              }}
              onLoad={() => console.log('History trail loaded successfully')}
            />
          )}

          {/* Render History Trail Markers */}
          {selectedHistoryTrail && selectedHistoryTrail.map((point, index) => (
            <Marker
              key={`history-${point.id}`}
              position={{ lat: point.lat, lng: point.lng }}
              icon={{
                path: 'M 0, 0 m -4, 0 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0',
                scale: 1,
                fillColor: point.valid ? '#FF6B35' : '#999999',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#FFFFFF',
              }}
              title={`History Point ${index + 1}\nTime: ${point.time}\nSpeed: ${point.speed} km/h\nValid: ${point.valid ? 'Yes' : 'No'}`}
              onLoad={() => console.log(`History marker ${index + 1} loaded`)}
            />
          ))}

          {/* Render Drawing Visualization */}
          {isDrawingMode && drawnCenter && (
            <Marker
              position={drawnCenter}
              icon={{
                path: 'M 0, 0 m -6, 0 a 6,6 0 1,0 12,0 a 6,6 0 1,0 -12,0',
                scale: 1,
                fillColor: '#007bff',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#FFFFFF',
              }}
              title="Circle Center"
            />
          )}

          {isDrawingMode && drawnCenter && drawnRadius && (
            <Circle
              center={drawnCenter}
              radius={drawnRadius}
              options={{
                strokeColor: '#007bff',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#007bff',
                fillOpacity: 0.2,
              }}
            />
          )}

          {isDrawingMode && drawnCoordinates.length > 0 && (
            <Polygon
              paths={drawnCoordinates}
              options={{
                strokeColor: '#007bff',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#007bff',
                fillOpacity: 0.2,
              }}
            />
          )}

          {isDrawingMode && drawnCoordinates.map((coord, index) => (
            <Marker
              key={`drawing-${index}`}
              position={coord}
              icon={{
                path: 'M 0, 0 m -4, 0 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0',
                scale: 1,
                fillColor: '#007bff',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#FFFFFF',
              }}
              title={`Point ${index + 1}`}
            />
          ))}

          {/* Render Active Geofences */}
          {geofences.map((geofence) => {
            console.log(`Rendering geofence ${geofence.id} (${geofence.name})`, geofence.type);
            
            if (geofence.type === 'polygon' && geofence.coordinates) {
              const coordinates = parseCoordinates(geofence.coordinates);
              if (coordinates.length > 2) {
                return (
                  <Polygon
                    key={geofence.id}
                    paths={coordinates}
                    options={getPolygonOptions(geofence)}
                    onLoad={() => console.log(`Polygon geofence ${geofence.id} (${geofence.name}) loaded`)}
                  />
                );
              }
            } else if (geofence.type === 'circle' && geofence.radius > 0) {
              return (
                <Circle
                  key={geofence.id}
                  center={geofence.center}
                  radius={geofence.radius}
                  options={circleOptions}
                  onLoad={() => console.log(`Circle geofence ${geofence.id} (${geofence.name}) loaded`)}
                />
              );
            }
            return null;
          })}
        </GoogleMap>
      </div>

    </div>
  );
};

export default VehicleTrackingMap;
