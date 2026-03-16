// "use client";
// import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, Circle, useMap } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { createCustomIcon } from "../leafletLoader";
// import {
//   getGeoFences,
//   getTrackedTractors,
//   getHistory,
//   addGeoFence,
//   updateGeoFence,
//   deleteGeoFence,
//   CreateGeoFenceData,
//   createAlert,
//   getAlerts,
//   getAlertById,
//   editAlert,
//   reverseGeocode as reverseGeocodeAPI,
// } from "../apis/tracker";
// import { sumMainItemsFilteredBySensor39 } from "@/app/utils/sumMainItems";
// import { getHireRequestsById, getMyTractors } from "../apis/tractor";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { SumResult } from "@/app/utils/sumMainItems";
// import { getErrorMessage } from "../utils/errorUtils";
// import { userLogout } from "@/redux/features/auth/authActions";

// // Types based on your API response
// interface TrackedDevice {
//   id: number;
//   name: string;
//   online: string;
//   alarm: string;
//   time: string;
//   timestamp: number;
//   speed: number;
//   lat: number;
//   lng: number;
//   course: number;
//   icon_type?: string;
//   icon_color?: string;
//   icon_colors?: {
//     moving?: string;
//     stopped?: string;
//     offline?: string;
//     engine?: string;
//     blocked?: string;
//   };
//   power: string;
//   altitude: number;
//   address: string;
//   protocol: string;
//   driver: string;
//   total_distance: number;
//   unit_of_distance: string;
//   moved_timestamp?: number;
//   state?: string;
//   lga?: string;
//   sensors: Array<{
//     id: number;
//     type: string;
//     name: string;
//     show_in_popup: number;
//     value: string;
//     val: number;
//     scale_value: number | null;
//     tag_name: string;
//   }>;
//   tail: Array<{ 
//     lat: string;
//     lng: string;
//   }>;
//   device_data: {
//     tail_color: string;
//     tail_length: string;
//     distance_unit_hour: string;
//     [key: string]: any;
//   };
// }

// interface TrackedGroup {
//   title: string;
//   items: TrackedDevice[];
// }

// interface GeofenceItem {
//   id: number;
//   type: string;
//   user_id: number;
//   group_id: number | null;
//   active: number;
//   name: string;
//   center: {
//     lat: number;
//     lng: number;
//   };
//   radius: number;
//   coordinates: string;
//   polygon_color: string;
//   created_at: string;
//   updated_at: string;
//   device_id?: number;
//   speed_limit?: number;
//   diem_rate_id?: number | null;
//   additional?: any;
// }

// interface HistoryItem {
//   id: number;
//   device_id: number;
//   item_id: string;
//   time: string;
//   raw_time: string;
//   altitude: number;
//   course: number;
//   speed: number;
//   latitude: number;
//   longitude: number;
//   lat: number;
//   lng: number;
//   distance: number;
//   other: string;
//   color: string;
//   valid: number;
//   device_time: string;
//   server_time: string;
//   other_arr: string[];
//   sensors_data: Array<{
//     id: string;
//     value: number;
//   }>;
// }

// interface HistoryResponse {
//   items: Array<{
//     status: number;
//     time: string | null;
//     show: string;
//     raw_time: string;
//     distance: number;
//     driver: string | null;
//     items: HistoryItem[];
//   }>;
// }

// interface AlertNotification {
//   email: {
//     active: number;
//     input: string;
//   };
// }

// interface AlertItem {
//   id: number;
//   user_id: number;
//   active: number;
//   name: string;
//   type: string;
//   for_all_user_devices: number;
//   schedules: any;
//   notifications: AlertNotification;
//   created_at: string;
//   updated_at: string;
//   zone: number;
//   schedule: number;
//   command: any;
//   devices: number[];
//   drivers: any[];
//   geofences: number[];
//   events_custom: any[];
// }

// interface AlertsResponse {
//   status: number;
//   items: {
//     alerts: AlertItem[];
//   };
// }

// interface CreateAlertData {
//   name: string;
//   devices: number[];
//   geofences: number[];
//   notifications?: AlertNotification;
//   type?: string;
// }

// const libraries: ("places" | "geometry" | "drawing")[] = ["places", "geometry"];

// const center = {
//   lat: 9.082,
//   lng: 8.6753,
// };

// // Map type tile layer URLs
// const getTileLayerUrl = (mapType: MapType): string => {
//   switch (mapType) {
//     case 'satellite':
//       return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
//     case 'hybrid':
//       return "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
//     case 'terrain':
//       return "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
//     case 'roadmap':
//     default:
//       return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
//   }
// };

// const getTileLayerAttribution = (mapType: MapType): string => {
//   switch (mapType) {
//     case 'satellite':
//       return 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
//     case 'hybrid':
//       return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
//     case 'terrain':
//       return 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
//     case 'roadmap':
//     default:
//       return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
//   }
// };

// // Helper function to parse coordinates string
// const parseCoordinates = (
//   coordinatesString: string
// ): Array<{ lat: number; lng: number }> => {
//   try {
//     // Handle different coordinate formats
//     if (
//       coordinatesString.startsWith("[") ||
//       coordinatesString.startsWith("{")
//     ) {
//       const parsed = JSON.parse(coordinatesString);
//       if (Array.isArray(parsed)) {
//         return parsed.map((coord) => ({
//           lat:
//             typeof coord.lat === "number" ? coord.lat : parseFloat(coord.lat),
//           lng:
//             typeof coord.lng === "number" ? coord.lng : parseFloat(coord.lng),
//         }));
//       }
//     }
    
//     // Handle comma-separated coordinates like "lat1,lng1;lat2,lng2"
//     if (coordinatesString.includes(";")) {
//       return coordinatesString.split(";").map((pair) => {
//         const [lat, lng] = pair.split(",");
//         return {
//           lat: parseFloat(lat.trim()),
//           lng: parseFloat(lng.trim()),
//         };
//       });
//     }
//   } catch (error) {
//     console.error("Error parsing coordinates:", coordinatesString, error);
//   }
//   return [];
// };

// // Configuration: set via env; falls back to "real"
// const DATA_MODE: "dummy" | "real" =
//   process.env.NEXT_PUBLIC_TRACKING_DATA_MODE === "dummy" ? "dummy" : "real";

// type MapType = "satellite" | "hybrid" | "roadmap" | "terrain";

// const VehicleTrackingMap: React.FC = () => {
//   const { profileInfo, userToken } = useAppSelector((state) => state.auth);
//   const dispatch = useAppDispatch();
//   const router = useRouter();

//   const { adminToken } = useAppSelector((state) => state.auth);
//   const urlParams = useSearchParams();
// const [isLoaded, setIsLoaded] = useState(true);
// const loadError = null;

//   const [map, setMap] = useState<L.Map | null>(null);
//   const [vehicleIcon, setVehicleIcon] = useState<L.Icon | null>(null);
//   const [devices, setDevices] = useState<TrackedDevice[]>([]);
//   const [geofences, setGeofences] = useState<GeofenceItem[]>([]);
//   const [history, setHistory] = useState<HistoryItem[]>([]);
//   const [historyGroups, setHistoryGroups] = useState<HistoryResponse["items"]>(
//     []
//   );
//   const [historyFilteredSummary, setHistoryFilteredSummary] =
//     useState<SumResult | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [visibleDevices, setVisibleDevices] = useState<Set<number>>(new Set());
//   const [activeTab, setActiveTab] = useState<
//     "devices" | "history" | "geofences" | "alerts"
//   >("devices");
//   const [selectedHistoryTrail, setSelectedHistoryTrail] = useState<
//     HistoryItem[] | null
//   >(null);
//   const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<
//     number | null
//   >(null);
//   const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
//   const [mapType, setMapType] = useState<MapType>("hybrid");
//   const [deviceSearch, setDeviceSearch] = useState("");
//   const [historySearchParams, setHistorySearchParams] = useState({
//     deviceId: "",
//     fromDate: "",
//     fromTime: "",
//     toDate: "",
//     toTime: "",
//   });
//   const [isLoadingHistory, setIsLoadingHistory] = useState(false);
//   const [tractors, setTractors] = useState<any[]>([]);
//   // Map control toggles
//   const [showGeofences, setShowGeofences] = useState(true);
//   const [showTails, setShowTails] = useState(false);
//   const [showGrouping, setShowGrouping] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
  
//   // Polling setup
//   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const POLLING_INTERVAL = 10000; // 10 seconds
  
//   // Popup setup for marker tooltips/details (replaces InfoWindow)
//   const [openPopupDeviceId, setOpenPopupDeviceId] = useState<number | null>(null);
//   const geocodingCacheRef = useRef<Map<string, { state: string; lga: string }>>(new Map());
  
//   // Marker animation refs (Leaflet markers)
//   const markerInstancesRef = useRef<Map<number, L.Marker>>(new Map());
//   const previousPositionsRef = useRef<Map<number, { lat: number; lng: number }>>(new Map());
//   const animationFramesRef = useRef<Map<number, number>>(new Map());
//   const animatingMarkersRef = useRef<Set<number>>(new Set());
//   const devicePathsRef = useRef<Map<number, Array<{ lat: number; lng: number }>>>(new Map());
//   const [animatedPositions, setAnimatedPositions] = useState<Map<number, { lat: number; lng: number }>>(new Map());
  
//   // Map type tile layer URL (memoized)
//   const tileLayerUrl = useMemo(() => getTileLayerUrl(mapType), [mapType]);
//   const tileLayerAttribution = useMemo(() => getTileLayerAttribution(mapType), [mapType]);
  
//   // Dynamic map container style based on fullscreen state
//   const mapContainerStyle = useMemo(() => ({
//     width: "100%",
//     height: isFullscreen ? "100vh" : "90vh",
//   }), [isFullscreen]);
  
//   // Auto-fetch history when URL contains tracker_id, start_date, end_date
//   useEffect(() => {
//     const trackerId = urlParams.get("tracker_id");
//     const startDate = urlParams.get("start_date");
//     const endDate = urlParams.get("end_date");
//     if (!trackerId || !startDate || !endDate) return;

//     // Optionally switch to history tab
//     setActiveTab("history");

//     // Set search params state for UI visibility
//     setHistorySearchParams((prev) => ({
//       ...prev,
//       deviceId: trackerId,
//       fromDate: startDate,
//       fromTime: "00:00",
//       toDate: endDate,
//       toTime: "23:59",
//     }));

//     // Trigger fetch
//     setIsLoadingHistory(true);
//     fetchHistory(trackerId, startDate, "00:00", endDate, "23:59")
//       .catch((err) => console.error("Auto history fetch failed:", err))
//       .finally(() => setIsLoadingHistory(false));
//     // We intentionally run when params change
//   }, [urlParams]);
  
//   // Geofence management state
//   const [showGeofenceForm, setShowGeofenceForm] = useState(false);
//   const [editingGeofence, setEditingGeofence] = useState<GeofenceItem | null>(
//     null
//   );
//   const [geofenceFormData, setGeofenceFormData] = useState<CreateGeoFenceData>({
//     name: "",
//     type: "circle",
//     polygon_color: "#00ff00",
//     active: 1,
//   });
//   const [isDrawingMode, setIsDrawingMode] = useState(false);
//   const [drawingType, setDrawingType] = useState<"circle" | "polygon" | null>(
//     null
//   );
//   const [drawnCoordinates, setDrawnCoordinates] = useState<
//     Array<{ lat: number; lng: number }>
//   >([]);
//   const [drawnCenter, setDrawnCenter] = useState<{
//     lat: number;
//     lng: number;
//   } | null>(null);
//   const [drawnRadius, setDrawnRadius] = useState<number | null>(null);
//   const [isLoadingGeofence, setIsLoadingGeofence] = useState(false);

//   // Alert management state
//   const [alerts, setAlerts] = useState<AlertItem[]>([]);
//   const [alertsLoading, setAlertsLoading] = useState(false);
//   const [showAlertModal, setShowAlertModal] = useState(false);
//   const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
//   const [isLoadingAlert, setIsLoadingAlert] = useState(false);
//   const [hireRequestInfo, setHireRequestInfo] = useState<any>(null);
//   const [alertFormData, setAlertFormData] = useState<CreateAlertData>({
//     name: "",
//     devices: [],
//     geofences: [],
//     notifications: {
//       email: {
//         active: 0,
//         input: "Israel.olatunde@tractrac.co",
//     },
//     },
//     type: "geofence_inout",
//   });

//   // Fallback icon - always use Group.png
//   const getFallbackIcon = (): L.Icon => {
//     return createCustomIcon({
//       iconUrl: "/icons/Group.png",
//       iconSize: [32, 32],
//       iconAnchor: [16, 16],
//     });
//   };

//   // State to store rotated icons cache
//   const [rotatedIconsCache, setRotatedIconsCache] = useState<Map<string, L.Icon>>(new Map());
//   const iconImageRef = useRef<HTMLImageElement | null>(null);

//   // Load the base icon image once
//   useEffect(() => {
//     if (iconImageRef.current) return;
    
//     const img = new Image();
//     img.crossOrigin = 'anonymous';
//     img.onload = () => {
//       iconImageRef.current = img;
//     };
//     img.src = "/icons/Group.png";
//   }, []);

//   // Function to create rotated vehicle icon based on course/bearing
//   const getVehicleIconWithRotation = useCallback((course: number): L.Icon => {
//     // Round course to nearest 5 degrees for caching (reduce cache size)
//     const roundedCourse = Math.round(course / 5) * 5;
//     const cacheKey = `icon_${roundedCourse}`;
    
//     // Check cache first
//     if (rotatedIconsCache.has(cacheKey)) {
//       return rotatedIconsCache.get(cacheKey)!;
//     }

//     // If image not loaded yet, return fallback
//     if (!iconImageRef.current || !iconImageRef.current.complete) {
//       return getFallbackIcon();
//     }

//     // Create rotated icon using canvas
//     const canvas = document.createElement('canvas');
//     const size = 32;
//     canvas.width = size;
//     canvas.height = size;
//     const ctx = canvas.getContext('2d');
    
//     if (!ctx || !iconImageRef.current) {
//       return getFallbackIcon();
//     }

//     // Clear and rotate
//     ctx.clearRect(0, 0, size, size);
//     ctx.save();
//     ctx.translate(size / 2, size / 2);
//     ctx.rotate((roundedCourse * Math.PI) / 180); // Convert degrees to radians
//     ctx.drawImage(iconImageRef.current, -size / 2, -size / 2, size, size);
//     ctx.restore();
    
//     const rotatedIcon = L.icon({
//       iconUrl: canvas.toDataURL(),
//       iconSize: [32, 32],
//       iconAnchor: [16, 16],
//     });

//     // Cache the rotated icon
//     setRotatedIconsCache(prev => {
//       const newCache = new Map(prev);
//       newCache.set(cacheKey, rotatedIcon);
//       return newCache;
//     });

//     return rotatedIcon;
//   }, [rotatedIconsCache]);

//   // Dummy data for testing
//   const dummyDevices: TrackedDevice[] = [
//     {
//       id: 1,
//       name: "Tractor Alpha",
//       online: "online",
//       alarm: "",
//       time: "2024-08-31 14:30:00",
//       timestamp: Date.now() / 1000,
//       speed: 25,
//       lat: 9.082,
//       lng: 8.6753,
//       course: 45,
//       power: "12.5V",
//       altitude: 175,
//       address: "Lagos, Nigeria",
//       protocol: "osmand",
//       driver: "John Doe",
//       total_distance: 114.73,
//       unit_of_distance: "Km",
//       sensors: [
//         {
//           id: 37,
//           type: "engine",
//           name: "Ignition",
//           show_in_popup: 0,
//           value: "On",
//           val: 1,
//           scale_value: null,
//           tag_name: "ignition",
//         },
//         {
//           id: 38,
//           type: "engine_hours",
//           name: "Engine Hours",
//           show_in_popup: 0,
//           value: "6.4 h",
//           val: 6.4008,
//           scale_value: null,
//           tag_name: "enginehours",
//         },
//         {
//           id: 39,
//           type: "battery",
//           name: "Battery Level",
//           show_in_popup: 0,
//           value: "3.27 Volts",
//           val: 3.272,
//           scale_value: 1,
//           tag_name: "battery",
//         },
//       ],
//       tail: [
//         { lat: "9.080", lng: "8.673" },
//         { lat: "9.081", lng: "8.674" },
//         { lat: "9.082", lng: "8.6753" },
//         { lat: "9.083", lng: "8.676" },
//         { lat: "9.084", lng: "8.677" },
//       ],
//       device_data: {
//         tail_color: "#33cc33",
//         tail_length: "3",
//         distance_unit_hour: "km/h",
//       },
//     },
//     {
//       id: 2,
//       name: "Tractor Beta",
//       online: "offline",
//       alarm: "low_fuel",
//       time: "2024-08-31 13:45:00",
//       timestamp: Date.now() / 1000 - 3600,
//       speed: 0,
//       lat: 9.1,
//       lng: 8.7,
//       course: 180,
//       power: "11.8V",
//       altitude: 180,
//       address: "Abuja, Nigeria",
//       protocol: "osmand",
//       driver: "Jane Smith",
//       total_distance: 89.45,
//       unit_of_distance: "Km",
//       sensors: [
//         {
//           id: 37,
//           type: "engine",
//           name: "Ignition",
//           show_in_popup: 0,
//           value: "Off",
//           val: 0,
//           scale_value: null,
//           tag_name: "ignition",
//         },
//         {
//           id: 38,
//           type: "engine_hours",
//           name: "Engine Hours",
//           show_in_popup: 0,
//           value: "4.2 h",
//           val: 4.2005,
//           scale_value: null,
//           tag_name: "enginehours",
//         },
//         {
//           id: 39,
//           type: "battery",
//           name: "Battery Level",
//           show_in_popup: 0,
//           value: "2.85 Volts",
//           val: 2.85,
//           scale_value: 1,
//           tag_name: "battery",
//         },
//       ],
//       tail: [
//         { lat: "9.095", lng: "8.695" },
//         { lat: "9.098", lng: "8.698" },
//         { lat: "9.1", lng: "8.7" },
//         { lat: "9.102", lng: "8.702" },
//       ],
//       device_data: {
//         tail_color: "#ff6600",
//         tail_length: "4",
//         distance_unit_hour: "km/h",
//       },
//     },
//     {
//       id: 3,
//       name: "Harvester Gamma",
//       online: "online",
//       alarm: "",
//       time: "2024-08-31 14:35:00",
//       timestamp: Date.now() / 1000,
//       speed: 15,
//       lat: 9.05,
//       lng: 8.65,
//       course: 90,
//       power: "13.2V",
//       altitude: 165,
//       address: "Kano, Nigeria",
//       protocol: "osmand",
//       driver: "Mike Johnson",
//       total_distance: 156.78,
//       unit_of_distance: "Km",
//       sensors: [
//         {
//           id: 37,
//           type: "engine",
//           name: "Ignition",
//           show_in_popup: 0,
//           value: "On",
//           val: 1,
//           scale_value: null,
//           tag_name: "ignition",
//         },
//         {
//           id: 38,
//           type: "engine_hours",
//           name: "Engine Hours",
//           show_in_popup: 0,
//           value: "8.7 h",
//           val: 8.7002,
//           scale_value: null,
//           tag_name: "enginehours",
//         },
//         {
//           id: 39,
//           type: "battery",
//           name: "Battery Level",
//           show_in_popup: 0,
//           value: "3.45 Volts",
//           val: 3.45,
//           scale_value: 1,
//           tag_name: "battery",
//         },
//       ],
//       tail: [
//         { lat: "9.045", lng: "8.645" },
//         { lat: "9.047", lng: "8.647" },
//         { lat: "9.05", lng: "8.65" },
//         { lat: "9.052", lng: "8.652" },
//         { lat: "9.054", lng: "8.654" },
//         { lat: "9.056", lng: "8.656" },
//       ],
//       device_data: {
//         tail_color: "#0066ff",
//         tail_length: "5",
//         distance_unit_hour: "km/h",
//       },
//     },
//   ];

//   const dummyGeofences: GeofenceItem[] = [
//     {
//       id: 1,
//       type: "circle",
//       user_id: 1,
//       group_id: null,
//       active: 1,
//       name: "Farm Zone A",
//       center: { lat: 9.085, lng: 8.675 },
//       radius: 2000,
//       coordinates: "",
//       polygon_color: "#00ff00",
//       created_at: "2024-01-01",
//       updated_at: "2024-08-31",
//     },
//     {
//       id: 2,
//       type: "polygon",
//       user_id: 1,
//       group_id: null,
//       active: 1,
//       name: "Restricted Area",
//       center: { lat: 9.095, lng: 8.685 },
//       radius: 0,
//       coordinates: JSON.stringify([
//         { lat: 9.093, lng: 8.683 },
//         { lat: 9.097, lng: 8.683 },
//         { lat: 9.097, lng: 8.687 },
//         { lat: 9.093, lng: 8.687 },
//       ]),
//       polygon_color: "#ff0000",
//       created_at: "2024-01-01",
//       updated_at: "2024-08-31",
//     },
//     {
//       id: 3,
//       type: "polygon",
//       user_id: 1,
//       group_id: null,
//       active: 1,
//       name: "Safe Parking Zone",
//       center: { lat: 9.06, lng: 8.66 },
//       radius: 0,
//       coordinates: JSON.stringify([
//         { lat: 9.058, lng: 8.658 },
//         { lat: 9.062, lng: 8.658 },
//         { lat: 9.062, lng: 8.662 },
//         { lat: 9.058, lng: 8.662 },
//       ]),
//       polygon_color: "#0000ff",
//       created_at: "2024-01-01",
//       updated_at: "2024-08-31",
//     },
//   ];

//   // Fetch history data with parameters
//   const fetchHistory = async (
//     deviceId?: string,
//     fromDate?: string,
//     fromTime?: string,
//     toDate?: string,
//     toTime?: string
//   ) => {
//     try {
//       console.log("Fetching history data with params:", {
//         deviceId,
//         fromDate,
//         fromTime,
//         toDate,
//         toTime,
//       });
//       const historyResponse = await getHistory(
//         deviceId,
//         fromDate,
//         fromTime,
//         toDate,
//         toTime
//       );
//       console.log("History response:", historyResponse);
//       // If hire_request_id is present, compute filtered summary immediately
//       const hireRequestId = urlParams.get("hire_request_id");
//       if (hireRequestId) {
//         try {
//           const itemsForSummary = historyResponse?.data?.items || [];
//           const summary = sumMainItemsFilteredBySensor39(
//             itemsForSummary as any
//           );
//           console.log("Filtered summary (sensor_39>0):", summary);
//           const response = await getHireRequestsById(
//             hireRequestId,
//             adminToken as string
//           );
//           console.log("Hire requests response:", response);
//           setHireRequestInfo(response?.data);
//           setHistoryFilteredSummary(summary);
//         } catch (e) {
//           console.error("Error computing filtered summary:", e);
//         }
//       }
      
//       if (historyResponse?.data?.items) {
//         const responseData: HistoryResponse = historyResponse.data;
//         setHistoryGroups(responseData.items);
        
//         // Flatten all history items from all groups
//         const allHistoryItems: HistoryItem[] = [];
//         responseData.items.forEach((group) => {
//           if (group.items && Array.isArray(group.items)) {
//             allHistoryItems.push(...group.items);
//           }
//         });
//         setHistory(allHistoryItems);
//         console.log("Loaded history groups:", responseData.items.length);
//         console.log("Loaded history items:", allHistoryItems.length);
//       }
//     } catch (err) {
//       console.error("Error fetching history:", err);
//     }
//   };

//   // Set default date values
//   const setDefaultDateRange = (days: number) => {
//     const today = new Date();
//     const fromDate = new Date(today);
//     fromDate.setDate(today.getDate() - days);
    
//     setHistorySearchParams((prev) => ({
//       ...prev,
//       fromDate: fromDate.toISOString().split("T")[0],
//       fromTime: "00:00",
//       toDate: today.toISOString().split("T")[0],
//       toTime: "23:59",
//     }));
//   };

//   // Search history with user-selected parameters
//   const searchHistory = async () => {
//     if (
//       !historySearchParams.deviceId ||
//       !historySearchParams.fromDate ||
//       !historySearchParams.toDate
//     ) {
//       alert("Please select a device and date range");
//       return;
//     }

//     setIsLoadingHistory(true);
//     try {
//       // Clear previous results
//       setHistoryGroups([]);
//       setHistory([]);
//       setSelectedHistoryTrail(null);
//       setSelectedHistoryIndex(null);

//       // Fetch history with the selected parameters
//       await fetchHistory(
//         historySearchParams.deviceId,
//         historySearchParams.fromDate,
//         historySearchParams.fromTime,
//         historySearchParams.toDate,
//         historySearchParams.toTime
//       );
//     } catch (err) {
//       console.error("Error searching history:", err);
//       alert("Error fetching history data. Please try again.");
//     } finally {
//       setIsLoadingHistory(false);
//     }
//   };

//   // Fetch data from APIs or use dummy data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         console.log(`Using ${DATA_MODE} data mode`);
        
//         if (DATA_MODE === "dummy") {
//           // Use dummy data
//           setDevices(dummyDevices);
//           setGeofences(dummyGeofences);
//           // Set all devices as visible by default
//           setVisibleDevices(new Set(dummyDevices.map((d) => d.id)));
//           console.log("Loaded dummy devices:", dummyDevices.length);
//           console.log("Loaded dummy geofences:", dummyGeofences.length);
//         } else {
//           // Use real API data
//           console.log("Fetching real data from APIs...");
          
//           // Fetch tracked tractors
//           const tractorsResponse = await getTrackedTractors();
//           console.log("Tractors response:", tractorsResponse);
          
//           const allDevices: TrackedDevice[] = [];
          
//           // Extract devices from all groups
//           if (tractorsResponse?.data && Array.isArray(tractorsResponse.data)) {
//             tractorsResponse.data.forEach((group: TrackedGroup) => {
//               if (group.items && Array.isArray(group.items)) {
//                 allDevices.push(...group.items);
//               }
//             });
//           }
          
//           const response = await getMyTractors(userToken as string);
//           let tractorTrackerIds = response?.data?.map((tractor: any) => tractor.tracker_id);
//           console.log("getMyTractors", response?.data);
//           console.log("userToken", userToken);
//           console.log("tractorTrackerIds", tractorTrackerIds);


//           console.log("allDevices", allDevices);
//           const filteredAllDevices = allDevices.filter((device) => tractorTrackerIds.includes(device.id?.toString()));
//           console.log("filteredAllDevices", filteredAllDevices);

//           setDevices(filteredAllDevices);
//           // Set all devices as visible by default
//           setVisibleDevices(new Set(filteredAllDevices.map((d) => d.id)));
//           console.log("Loaded real devices:", filteredAllDevices.length);

//           // Fetch geofences
//           const geofencesResponse = await getGeoFences();
//           console.log("Geofences response:", geofencesResponse);
          
//           if (geofencesResponse?.data?.items?.geofences) {
//             setGeofences(geofencesResponse?.data?.items?.geofences);
//             console.log(
//               "Loaded real geofences:",
//               geofencesResponse?.data?.items?.geofences.length
//             );
//           }

//           // Fetch alerts
//           await fetchAlerts();
//         }

//         // Don't automatically fetch history - let user search manually
//         // await fetchHistory();

//         setLoading(false);
//       } catch (err) {
//         const error = err as any;
//         if(error.response?.status === 401){
//           dispatch(userLogout());
//           router.replace("/login");
//         }
//         console.error("Error fetching data:", err);
//         setError(
//           `Failed to load ${DATA_MODE} tracking data. Check console for details.`
//         );
//         setLoading(false);
//       }
//     };

//     if (isLoaded) {
//       fetchData();
//     }
//   }, [isLoaded]);


//   useEffect(() => {
//     console.log("tractors id array", tractors);
//   }, [tractors]);


//   // Function to reverse geocode and get state and LGA using Traccar API
//   const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<{ state: string; lga: string }> => {
//     const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`; // Round to 4 decimals for caching (~11m precision)
    
//     // Check cache first
//     const cached = geocodingCacheRef.current.get(cacheKey);
//     if (cached) {
//       return cached;
//     }

//     try {
//       const response = await reverseGeocodeAPI(lat, lng);
      
//       if (response?.data?.location) {
//         const location = response.data.location;
//         const result = {
//           state: location.state || location.county || 'Unknown',
//           lga: location.city || 'Unknown'
//         };
        
//         // Cache the result
//         geocodingCacheRef.current.set(cacheKey, result);
//         return result;
//       }
//     } catch (error) {
//       // console.warn('Reverse geocoding error:', error);
//     }
    
//     return { state: 'Unknown', lga: 'Unknown' };
//   }, []);

//   // Map control functions
//   const toggleFullscreen = useCallback(() => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen().then(() => {
//         setIsFullscreen(true);
//       }).catch((err) => {
//         console.error('Error attempting to enable fullscreen:', err);
//       });
//     } else {
//       document.exitFullscreen().then(() => {
//         setIsFullscreen(false);
//       }).catch((err) => {
//         console.error('Error attempting to exit fullscreen:', err);
//       });
//     }
//   }, []);

//   const fitBoundsToDevices = useCallback(() => {
//     if (!map || devices.length === 0) return;

//     const bounds = L.latLngBounds([]);
//     let hasValidBounds = false;

//     devices.forEach((device) => {
//       if (device.lat && device.lng && device.lat !== 0 && device.lng !== 0) {
//         bounds.extend([device.lat, device.lng]);
//         hasValidBounds = true;
//       }
//     });

//     if (hasValidBounds) {
//       map.fitBounds(bounds, {
//         padding: [50, 50],
//       });
//     }
//   }, [map, devices]);

//   const toggleGeofences = useCallback(() => {
//     setShowGeofences((prev) => !prev);
//   }, []);

//   const toggleTails = useCallback(() => {
//     setShowTails((prev) => !prev);
//   }, []);

//   const toggleGrouping = useCallback(() => {
//     setShowGrouping((prev) => !prev);
//   }, []);

//   // Clustering function - groups nearby devices
//   const clusterDevices = useCallback((devices: TrackedDevice[], map: L.Map | null): Array<{ center: { lat: number; lng: number }, devices: TrackedDevice[], count: number }> => {
//     if (!map || !showGrouping) {
//       return devices.map(d => ({ center: { lat: d.lat, lng: d.lng }, devices: [d], count: 1 }));
//     }

//     const clusters: Array<{ center: { lat: number; lng: number }, devices: TrackedDevice[], count: number }> = [];
//     const processed = new Set<number>();
//     const bounds = map.getBounds();
    
//     if (!bounds) return devices.map(d => ({ center: { lat: d.lat, lng: d.lng }, devices: [d], count: 1 }));

//     // Calculate cluster distance based on zoom level (smaller at higher zoom)
//     const zoom = map.getZoom() || 8;
//     const clusterDistance = Math.max(0.01, 0.1 / Math.pow(2, zoom - 8)); // Adjust based on zoom

//     devices.forEach((device) => {
//       if (processed.has(device.id)) return;
//       if (!device.lat || !device.lng || device.lat === 0 || device.lng === 0) return;

//       const cluster: { center: { lat: number; lng: number }, devices: TrackedDevice[], count: number } = {
//         center: { lat: device.lat, lng: device.lng },
//         devices: [device],
//         count: 1
//       };
//       processed.add(device.id);

//       // Find nearby devices to cluster
//       devices.forEach((otherDevice) => {
//         if (processed.has(otherDevice.id)) return;
//         if (!otherDevice.lat || !otherDevice.lng || otherDevice.lat === 0 || otherDevice.lng === 0) return;

//         const distance = Math.sqrt(
//           Math.pow((device.lat - otherDevice.lat), 2) +
//           Math.pow((device.lng - otherDevice.lng), 2)
//         );

//         if (distance < clusterDistance) {
//           cluster.devices.push(otherDevice);
//           cluster.count++;
//           processed.add(otherDevice.id);
//         }
//       });

//       // Calculate cluster center
//       if (cluster.count > 1) {
//         const avgLat = cluster.devices.reduce((sum, d) => sum + d.lat, 0) / cluster.count;
//         const avgLng = cluster.devices.reduce((sum, d) => sum + d.lng, 0) / cluster.count;
//         cluster.center = { lat: avgLat, lng: avgLng };
//       }

//       clusters.push(cluster);
//     });

//     return clusters;
//   }, [showGrouping]);

//   // Listen for fullscreen changes
//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(!!document.fullscreenElement);
//     };

//     document.addEventListener('fullscreenchange', handleFullscreenChange);
//     return () => {
//       document.removeEventListener('fullscreenchange', handleFullscreenChange);
//     };
//   }, []);

//   // Function to smoothly animate marker from old position to new position
//   const animateMarker = useCallback((marker: L.Marker, deviceId: number, from: { lat: number; lng: number }, to: { lat: number; lng: number }, duration: number = 2000) => {
//     // Mark this marker as animating
//     animatingMarkersRef.current.add(deviceId);
    
//     const startTime = Date.now();
//     const startLat = from.lat;
//     const startLng = from.lng;
//     const deltaLat = to.lat - startLat;
//     const deltaLng = to.lng - startLng;

//     const animate = () => {
//       const elapsed = Date.now() - startTime;
//       const progress = Math.min(elapsed / duration, 1);
      
//       // Use easing function for smooth animation (ease-in-out)
//       const easeInOut = progress < 0.5
//         ? 2 * progress * progress
//         : 1 - Math.pow(-2 * progress + 2, 2) / 2;

//       const currentLat = startLat + deltaLat * easeInOut;
//       const currentLng = startLng + deltaLng * easeInOut;

//       // Update marker position directly (this overrides React prop updates)
//       marker.setLatLng([currentLat, currentLng]);
      
//       // Update animated positions state for popup positioning
//       setAnimatedPositions(prev => {
//         const newMap = new Map(prev);
//         newMap.set(deviceId, { lat: currentLat, lng: currentLng });
//         return newMap;
//       });
      
//       // Auto-pan if device is moving out of view during animation
//       if (map) {
//         const bounds = map.getBounds();
//         const currentPos: [number, number] = [currentLat, currentLng];
//         if (bounds && !bounds.contains(currentPos)) {
//           map.panTo(currentPos);
//         }
//       }

//       if (progress < 1) {
//         const frameId = requestAnimationFrame(animate);
//         animationFramesRef.current.set(deviceId, frameId);
//       } else {
//         // Animation complete, ensure final position is exact
//         marker.setLatLng([to.lat, to.lng]);
//         // Clear animated position so Marker uses device position from state
//         setAnimatedPositions(prev => {
//           const newMap = new Map(prev);
//           newMap.delete(deviceId);
//           return newMap;
//         });
//         animatingMarkersRef.current.delete(deviceId);
//         animationFramesRef.current.delete(deviceId);
//       }
//     };

//     animate();
//   }, [map]);

//   // Generate Popup content for device details
//   const generateInfoContent = useCallback((device: TrackedDevice, isLoading: boolean = false) => {
//     const getBatteryLevel = (device: TrackedDevice): string => {
//       const batterySensor = device.sensors?.find(
//         (sensor) => sensor.tag_name === "battery"
//       );
//       return batterySensor ? batterySensor.value : 'N/A';
//     };

//     const getEngineHours = (device: TrackedDevice): string => {
//       const engineHoursSensor = device.sensors?.find(
//         (sensor) => sensor.tag_name === "enginehours"
//       );
//       return engineHoursSensor ? engineHoursSensor.value : 'N/A';
//     };

//     const ignition = device.sensors?.find((s) => s.tag_name === "ignition");
//     const ignitionText = ignition
//       ? (ignition.val ?? 0) > 0 || (ignition.value || "").toLowerCase() === "on"
//         ? "On"
//         : "Off"
//       : "N/A";

//     const statusColor = device.online === 'online' ? '#000000' : device.online === 'ack' ? '#FA9411' : '#dc3545';
//     const statusText = device.online === "online" ? "Moving" : device.online === "ack" ? "Online" : "Offline";

//     if (isLoading) {
//       return (
//         <div style={{ padding: "12px", minWidth: "250px", fontFamily: "Arial, sans-serif" }}>
//           <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: "bold", color: "#333" }}>{device.name}</h3>
//           <div style={{ marginBottom: "8px" }}>
//             <strong style={{ color: "#666" }}>Status:</strong>{" "}
//             <span style={{ color: statusColor, fontWeight: "bold" }}>{statusText}</span>
//           </div>
//           <div style={{ marginBottom: "8px" }}><strong style={{ color: "#666" }}>Tracker ID:</strong> {device.id}</div>
//           {device.driver && <div style={{ marginBottom: "8px" }}><strong style={{ color: "#666" }}>Driver:</strong> {device.driver}</div>}
//           {device.address && <div style={{ marginBottom: "8px" }}><strong style={{ color: "#666" }}>Address:</strong> {device.address}</div>}
//           <div style={{ marginBottom: "8px", color: "#666" }}><em>Loading location details...</em></div>
//         </div>
//       );
//     }

//     return (
//       <div style={{ padding: "12px", minWidth: "250px", fontFamily: "Arial, sans-serif" }}>
//         <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: "bold", color: "#333" }}>{device.name}</h3>
//         <div style={{ marginBottom: "8px" }}>
//           <strong style={{ color: "#666" }}>Status:</strong>{" "}
//           <span style={{ color: statusColor, fontWeight: "bold" }}>{statusText}</span>
//         </div>
//         <div style={{ marginBottom: "8px" }}><strong style={{ color: "#666" }}>Tracker ID:</strong> {device.id}</div>
//         {device.driver && <div style={{ marginBottom: "8px" }}><strong style={{ color: "#666" }}>Driver:</strong> {device.driver}</div>}
//         {device.address && <div style={{ marginBottom: "8px" }}><strong style={{ color: "#666" }}>Address:</strong> {device.address}</div>}
//         {device.state && <div style={{ marginBottom: "8px" }}><strong style={{ color: "#666" }}>State:</strong> {device.state}</div>}
//         {device.lga && <div style={{ marginBottom: "8px" }}><strong style={{ color: "#666" }}>Local Government:</strong> {device.lga}</div>}
//         <div style={{ marginBottom: "8px" }}><strong style={{ color: "#666" }}>Speed:</strong> {device.speed} {device.device_data?.distance_unit_hour || "km/h"}</div>
//         <div style={{ marginBottom: "8px" }}><strong style={{ color: "#666" }}>Total Distance:</strong> {device.total_distance || 0} {device.unit_of_distance || "km"}</div>
//         <div style={{ marginBottom: "8px" }}><strong style={{ color: "#666" }}>Ignition:</strong> {ignitionText}</div>
//         <div style={{ marginBottom: "8px" }}><strong style={{ color: "#666" }}>Engine Hours:</strong> {getEngineHours(device)}</div>
//         <div style={{ marginBottom: "8px" }}><strong style={{ color: "#666" }}>Battery Level:</strong> {getBatteryLevel(device)}</div>
//         <div style={{ marginBottom: "8px" }}><strong style={{ color: "#666" }}>Last Update:</strong> {device.time || new Date(device.timestamp * 1000).toLocaleString()}</div>
//         {device.alarm && (
//           <div style={{ marginTop: "8px", padding: "6px", background: "#fee", borderLeft: "3px solid #dc3545", color: "#dc3545", fontWeight: "bold" }}>
//             ⚠️ Alarm: {device.alarm}
//           </div>
//         )}
//       </div>
//     );
//   }, []);

//   // Function to update device positions (for polling)
//   const updateDevicePositions = useCallback(async () => {
//     // Only poll in real mode, skip polling in dummy mode
//     if (DATA_MODE === "dummy") return;

//     try {
//       console.log("Polling for device updates...");
//       const tractorsResponse = await getTrackedTractors();
      
//       const allDevices: TrackedDevice[] = [];
      
//       // Extract devices from all groups
//       if (tractorsResponse?.data && Array.isArray(tractorsResponse.data)) {
//         tractorsResponse.data.forEach((group: TrackedGroup) => {
//           if (group.items && Array.isArray(group.items)) {
//             allDevices.push(...group.items);
//           }
//         });
//       }
      
//       const response = await getMyTractors(userToken as string);
//       let tractorTrackerIds = response?.data?.map((tractor: any) => tractor.tracker_id);

//       const filteredAllDevices = allDevices.filter((device) => tractorTrackerIds.includes(device.id?.toString()));

//       // Preserve geocoded state/LGA data from previous devices state and animate markers
//       setDevices((prevDevices) => {
//         const prevDevicesMap = new Map(prevDevices.map(d => [d.id, d]));
//         const updatedDevices = filteredAllDevices.map(device => {
//           const prevDevice = prevDevicesMap.get(device.id);
//           // Preserve state and lga if they were previously geocoded
//           if (prevDevice?.state && prevDevice?.lga) {
//             return {
//               ...device,
//               state: prevDevice.state,
//               lga: prevDevice.lga
//             };
//           }
//           return device;
//         });
        
//         // Animate markers that have moved
//         updatedDevices.forEach(device => {
//           if (!device.lat || !device.lng || device.lat === 0 || device.lng === 0) return;
          
//           const marker = markerInstancesRef.current.get(device.id);
//           const prevPosition = previousPositionsRef.current.get(device.id);
//           const newPosition = { lat: device.lat, lng: device.lng };
//           const prevDevice = prevDevicesMap.get(device.id);
          
//           if (marker) {
//             // Check if position has changed (with small threshold to avoid unnecessary animations)
//             const hasMoved = !prevPosition || 
//               Math.abs(prevPosition.lat - newPosition.lat) > 0.0001 || 
//               Math.abs(prevPosition.lng - newPosition.lng) > 0.0001;
            
//             if (hasMoved) {
//               // Cancel any ongoing animation for this marker
//               const frameId = animationFramesRef.current.get(device.id);
//               if (frameId) {
//                 cancelAnimationFrame(frameId);
//                 animationFramesRef.current.delete(device.id);
//               }
              
//               // Get current marker position as starting point
//               const currentPos = marker.getPosition();
//               const from = prevPosition || (currentPos ? { lat: currentPos.lat(), lng: currentPos.lng() } : newPosition);
              
//               // Track device path for tail rendering
//               if (!devicePathsRef.current.has(device.id)) {
//                 devicePathsRef.current.set(device.id, []);
//               }
//               const path = devicePathsRef.current.get(device.id)!;
//               path.push(newPosition);
//               // Keep only last 50 points to limit memory usage
//               if (path.length > 50) {
//                 path.shift();
//               }
              
//               // Animate to new position (duration based on distance for more natural movement)
//               const distance = Math.sqrt(
//                 Math.pow((newPosition.lat - from.lat) * 111000, 2) + 
//                 Math.pow((newPosition.lng - from.lng) * 111000 * Math.cos(from.lat * Math.PI / 180), 2)
//               );
//               // Adjust duration: 2000ms minimum, up to 6000ms for longer distances (slower animation)
//               const duration = Math.min(Math.max(distance / 5, 2000), 6000);
              
//               animateMarker(marker, device.id, from, newPosition, duration);
//               previousPositionsRef.current.set(device.id, newPosition);
//             }
//           } else {
//             // First time seeing this device, just store position and initialize path
//             previousPositionsRef.current.set(device.id, newPosition);
//             if (!devicePathsRef.current.has(device.id)) {
//               devicePathsRef.current.set(device.id, [newPosition]);
//             }
//           }
//         });
        
//         // Auto-pan map to keep selected device in view if popup is open
//         if (openPopupDeviceId !== null && map) {
//           const deviceId = openPopupDeviceId;
//           const device = updatedDevices.find((d) => d.id === deviceId);
//           if (device) {
//             // Auto-pan map to keep selected device in view
//             const devicePosition: [number, number] = [device.lat, device.lng];
//             const bounds = map.getBounds();
            
//             // Check if device is outside current viewport
//             if (bounds && !bounds.contains(devicePosition)) {
//               // Smoothly pan to device position
//               map.panTo(devicePosition);
//             }
//           }
//         }
        
//         return updatedDevices;
//       });
//       console.log("Updated devices:", filteredAllDevices.length);
      
//       // Update visible devices if needed (keep existing visibility state)
//       setVisibleDevices((prev) => {
//         const newSet = new Set(prev);
//         // Add any new devices to visible set
//         filteredAllDevices.forEach((device) => {
//           if (!newSet.has(device.id)) {
//             newSet.add(device.id);
//           }
//         });
//         // Remove devices that no longer exist
//         const existingIds = new Set(filteredAllDevices.map((d) => d.id));
//         const toRemove: number[] = [];
//         newSet.forEach((id) => {
//           if (!existingIds.has(id)) {
//             toRemove.push(id);
//           }
//         });
//         toRemove.forEach((id) => {
//           newSet.delete(id);
//           // Clean up animation and marker data for removed devices
//           const frameId = animationFramesRef.current.get(id);
//           if (frameId) {
//             cancelAnimationFrame(frameId);
//             animationFramesRef.current.delete(id);
//           }
//           animatingMarkersRef.current.delete(id);
//           markerInstancesRef.current.delete(id);
//           previousPositionsRef.current.delete(id);
//           devicePathsRef.current.delete(id);
//           setAnimatedPositions(prev => {
//             const newMap = new Map(prev);
//             newMap.delete(id);
//             return newMap;
//           });
//         });
//         return newSet;
//       });
//     } catch (err) {
//       console.error("Error updating device positions:", err);
//     }
//   }, [map, generateInfoContent, animateMarker]);

//   // Initialize vehicle icon
//   useEffect(() => {
//     const icon = createCustomIcon({
//       iconUrl: "/icons/Group.png",
//       iconSize: [32, 32],
//       iconAnchor: [16, 16],
//     });
//     setVehicleIcon(icon);
//   }, []);

//   // Map ready handler component
//   function MapReadyHandler() {
//     const mapInstance = useMap();
    
//     useEffect(() => {
//       setMap(mapInstance);
//       setIsLoaded(true);
//       console.log("Map loaded successfully");
//     }, [mapInstance]);
    
//     return null;
//   }
//     // Clear polling interval on unmount
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//       pollingIntervalRef.current = null;
//     }
//     // Cancel all ongoing animations
//     animationFramesRef.current.forEach((frameId) => {
//       cancelAnimationFrame(frameId);
//     });
//     animationFramesRef.current.clear();
//     animatingMarkersRef.current.clear();
//     markerInstancesRef.current.clear();
//     previousPositionsRef.current.clear();
//     setAnimatedPositions(new Map());
//   }, []);

//   // Polling effect - starts after map is initialized and data is loaded
//   useEffect(() => {
//     if (!map || !isLoaded || loading) return;
    
//     // Only start polling in real mode
//     if (DATA_MODE === "dummy") return;

//     console.log(`Starting device position polling (every ${POLLING_INTERVAL / 1000}s)`);

//     // Set up polling interval
//     pollingIntervalRef.current = setInterval(() => {
//       updateDevicePositions();
//     }, POLLING_INTERVAL);

//     // Cleanup function
//     return () => {
//       if (pollingIntervalRef.current) {
//         console.log("Stopping device position polling");
//         clearInterval(pollingIntervalRef.current);
//         pollingIntervalRef.current = null;
//       }
//     };
//   }, [map, isLoaded, loading, updateDevicePositions]);

//   // Get polyline options based on device tail color
//   const getTrailOptions = (
//     device: TrackedDevice
//   ): L.PolylineOptions => ({
//     color: device.device_data?.tail_color || "#FF0000",
//     weight: parseInt(device.device_data?.tail_length) || 3,
//     opacity: 1.0,
//   });

//   // Handle device visibility toggle
//   const toggleDeviceVisibility = (deviceId: number) => {
//     setVisibleDevices((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(deviceId)) {
//         newSet.delete(deviceId);
//       } else {
//         newSet.add(deviceId);
//       }
//       return newSet;
//     });
//   };

//   // Handle device click - zoom to device location
//   const zoomToDevice = (device: TrackedDevice) => {
//     if (map) {
//       map.panTo({ lat: device.lat, lng: device.lng });
//       map.setZoom(150); // Zoom in closer to the device
//       console.log(
//         `Zooming to device ${device.name} at`,
//         device.lat,
//         device.lng
//       );
//     }
//     setSelectedDeviceId(device.id);
//   };

//   // Toggle all devices visibility
//   const toggleAllDevices = () => {
//     if (visibleDevices.size === devices.length) {
//       setVisibleDevices(new Set()); // Hide all
//     } else {
//       setVisibleDevices(new Set(devices.map((d) => d.id))); // Show all
//     }
//   };

//   // Helper function to get battery level from sensors
//   const getBatteryLevel = (device: TrackedDevice): string => {
//     const batterySensor = device.sensors?.find(
//       (sensor) => sensor.tag_name === "battery"
//     );
//     return batterySensor ? batterySensor.value : "N/A";
//   };

//   // Helper function to calculate area covered by tractor (simplified calculation)
//   const getAreaCovered = (device: TrackedDevice): string => {
//     if (!device.tail || device.tail.length < 3) {
//       return "N/A";
//     }
    
//     // Simple approximation: calculate bounding box area
//     const lats = device.tail.map((point) => parseFloat(point.lat));
//     const lngs = device.tail.map((point) => parseFloat(point.lng));
    
//     const minLat = Math.min(...lats);
//     const maxLat = Math.max(...lats);
//     const minLng = Math.min(...lngs);
//     const maxLng = Math.max(...lngs);
    
//     // Rough calculation: 1 degree ≈ 111 km
//     const latDiff = (maxLat - minLat) * 111;
//     const lngDiff =
//       (maxLng - minLng) *
//       111 *
//       Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
    
//     const area = latDiff * lngDiff;
    
//     if (area < 1) {
//       return `${(area * 1000).toFixed(0)} m²`;
//     } else {
//       return `${area.toFixed(2)} km²`;
//     }
//   };

//   // Geofence management functions
//   const openGeofenceForm = (geofence?: GeofenceItem) => {
//     if (geofence) {
//       setEditingGeofence(geofence);
//       setGeofenceFormData({
//         name: geofence.name,
//         type: geofence.type as "circle" | "polygon",
//         polygon_color: geofence.polygon_color,
//         device_id: geofence.device_id || undefined,
//         group_id: geofence.group_id || undefined,
//         speed_limit: geofence.speed_limit || undefined,
//         active: geofence.active,
//         coordinates: geofence.coordinates,
//         center: geofence.center,
//         radius: geofence.radius,
//       });
//     } else {
//       setEditingGeofence(null);
//       setGeofenceFormData({
//         name: "",
//         type: "circle",
//         polygon_color: "#00ff00",
//         active: 1,
//       });
//     }
//     setShowGeofenceForm(true);
//   };

//   const closeGeofenceForm = () => {
//     setShowGeofenceForm(false);
//     setEditingGeofence(null);
//     setIsDrawingMode(false);
//     setDrawingType(null);
//     setDrawnCoordinates([]);
//     setDrawnCenter(null);
//     setDrawnRadius(null);
//   };

//   const startDrawing = (type: "circle" | "polygon") => {
//     setIsDrawingMode(true);
//     setDrawingType(type);
//     setDrawnCoordinates([]);
//     setDrawnCenter(null);
//     setDrawnRadius(null);
//   };

//   // Map click handler component
//   function MapClickHandler() {
//     const mapInstance = useMap();
    
//     useEffect(() => {
//       if (!isDrawingMode || !drawingType) return;
      
//       const handleClick = (e: L.LeafletMouseEvent) => {
//         const lat = e.latlng.lat;
//         const lng = e.latlng.lng;

//         if (drawingType === "circle") {
//           if (!drawnCenter) {
//             // First click sets center
//             setDrawnCenter({ lat, lng });
//           } else {
//             // Second click sets radius (calculate distance in meters)
//             const radius = mapInstance.distance(
//               [drawnCenter.lat, drawnCenter.lng],
//               [lat, lng]
//             );
//             setDrawnRadius(radius);
//             setIsDrawingMode(false);
//             setDrawingType(null);
//           }
//         } else if (drawingType === "polygon") {
//           setDrawnCoordinates((prev) => [...prev, { lat, lng }]);
//         }
//       };
      
//       mapInstance.on('click', handleClick);
//       return () => {
//         mapInstance.off('click', handleClick);
//       };
//     }, [mapInstance, isDrawingMode, drawingType, drawnCenter]);
    
//     return null;
//   }

//   const finishPolygonDrawing = () => {
//     if (drawnCoordinates.length >= 3) {
//       setIsDrawingMode(false);
//       setDrawingType(null);
//     }
//   };

//   const saveGeofence = async () => {
//     if (!geofenceFormData.name.trim()) {
//       alert("Please enter a geofence name");
//       return;
//     }

//     setIsLoadingGeofence(true);
//     try {
//       const geofenceData: CreateGeoFenceData = {
//         ...geofenceFormData,
//         coordinates:
//           geofenceFormData.type === "polygon" && drawnCoordinates.length > 0
//           ? JSON.stringify(drawnCoordinates) 
//           : geofenceFormData.coordinates,
//         center:
//           geofenceFormData.type === "circle" && drawnCenter
//           ? drawnCenter 
//           : geofenceFormData.center,
//         radius:
//           geofenceFormData.type === "circle" && drawnRadius
//           ? drawnRadius 
//             : geofenceFormData.radius,
//       };

//       if (editingGeofence) {
//         await updateGeoFence(editingGeofence.id, geofenceData);
//         alert("Geofence updated successfully!");
//       } else {
//         const response = await addGeoFence(geofenceData);
//         console.log("addGeoFence", response);

//         alert("Geofence created successfully!");
//       }

//       // Refresh geofences
//       const geofencesResponse = await getGeoFences();
//       if (geofencesResponse?.data?.items?.geofences) {
//         setGeofences(geofencesResponse.data.items.geofences);
//       }

//       closeGeofenceForm();
//     } catch (err) {
//       console.error("Error saving geofence:", err);
//       alert("Error saving geofence. Please try again.");
//     } finally {
//       setIsLoadingGeofence(false);
//     }
//   };

//   const handleDeleteGeofence = async (geofenceId: number) => {
//     if (!confirm("Are you sure you want to delete this geofence?")) return;

//     try {
//       await deleteGeoFence(geofenceId);
//       alert("Geofence deleted successfully!");
      
//       // Refresh geofences
//       const geofencesResponse = await getGeoFences();
//       if (geofencesResponse?.data?.items?.geofences) {
//         setGeofences(geofencesResponse.data.items.geofences);
//       }
//     } catch (err) {
//       console.error("Error deleting geofence:", err);
//       alert("Error deleting geofence. Please try again.");
//     }
//   };

//   // Alert management functions
//   const fetchAlerts = async () => {
//     try {
//       setAlertsLoading(true);
//       const response = await getAlerts();
//       if (response?.data?.items?.alerts) {
//         setAlerts(response.data.items.alerts);
//       }
//     } catch (err) {
//       console.error("Error fetching alerts:", err);
//       setError("Error fetching alerts. Please try again.");
//     } finally {
//       setAlertsLoading(false);
//     }
//   };

//   const openAlertModal = (alert?: AlertItem) => {
//     if (alert) {
//       setSelectedAlert(alert);
//       setAlertFormData({
//         name: alert.name,
//         devices: alert.devices,
//         geofences: alert.geofences,
//         notifications: alert.notifications,
//         type: alert.type,
//       });
//     } else {
//       setSelectedAlert(null);
//       setAlertFormData({
//         name: "",
//         devices: [],
//         geofences: [],
//         notifications: {
//           email: {
//             active: 0,
//             input: "Israel.olatunde@tractrac.co",
//         },
//         },
//         type: "geofence_inout",
//       });
//     }
//     setShowAlertModal(true);
//   };

//   const closeAlertModal = () => {
//     if (isLoadingAlert) return; // Prevent closing while loading
//     setShowAlertModal(false);
//     setSelectedAlert(null);
//   };

//   const saveAlert = async () => {
//     try {
//       setIsLoadingAlert(true);
      
//       // Validation checks
//       if (!alertFormData.name.trim()) {
//         alert("Please enter an alert name");
//         setIsLoadingAlert(false);
//         return;
//       }

//       if (alertFormData.devices.length === 0) {
//         alert("Please select at least one device");
//         setIsLoadingAlert(false);
//         return;
//       }

//       if (alertFormData.geofences.length === 0) {
//         alert("Please select at least one geofence");
//         setIsLoadingAlert(false);
//         return;
//       }

//       if (selectedAlert) {
//         // Edit existing alert
//         await editAlert(
//           selectedAlert.id,
//           alertFormData.name,
//           alertFormData.devices,
//           alertFormData.geofences
//         );
//         alert("Alert updated successfully!");
//       } else {
//         // Create new alert
//         await createAlert(
//           alertFormData.name,
//           alertFormData.devices,
//           alertFormData.geofences
//         );
//         alert("Alert created successfully!");
//       }

//       // Refresh alerts
//       await fetchAlerts();
//       closeAlertModal();
//     } catch (err) {
//       console.error("Error saving alert:", err);
//       alert("Error saving alert. Please try again.");
//     } finally {
//       setIsLoadingAlert(false);
//     }
//   };

//   const handleDeleteAlert = async (alertId: number) => {
//     if (!confirm("Are you sure you want to delete this alert?")) return;

//     try {
//       // Note: The API doesn't seem to have a delete alert endpoint
//       // You might need to implement this or use editAlert to deactivate
//       console.log("Delete alert:", alertId);
//       alert("Alert deletion not implemented in API");
//     } catch (err) {
//       console.error("Error deleting alert:", err);
//       alert("Error deleting alert. Please try again.");
//     }
//   };

//   // Show history trail on map
//   const showHistoryTrailOnMap = (
//     mainItem: HistoryResponse["items"][0],
//     index: number
//   ) => {
//     if (mainItem.items && mainItem.items.length > 0) {
//       setSelectedHistoryTrail(mainItem.items);
//       setSelectedHistoryIndex(index);
      
//       // Pan map to the first point of the trail and zoom in
//       if (map && mainItem.items[0]) {
//         const firstPoint = mainItem.items[0];
        
//         // Use setTimeout to ensure the map is ready
//         setTimeout(() => {
//           map.panTo({ lat: firstPoint.lat, lng: firstPoint.lng });
//           map.setZoom(150);
//           // console.log(
//           //   `Map panned to ${firstPoint.lat}, ${firstPoint.lng} and zoomed to 15`
//           // );
//         }, 100);
//       }
      
//       // console.log(
//       //   `Showing history trail with ${mainItem.items.length} points on map`
//       // );
//     }
//   };

//   // Get polygon options based on geofence color
//   const getPolygonOptions = (
//     geofence: GeofenceItem
//   ): L.PathOptions => ({
//     color: geofence.polygon_color || "#00FF00",
//     weight: 2,
//     opacity: 0.8,
//     fillColor: geofence.polygon_color || "#00FF00",
//     fillOpacity: 0.2,
//   });

//   // Circle options for circular geofences
//   const circleOptions: L.PathOptions = {
//     color: "#0000FF",
//     weight: 2,
//     opacity: 0.8,
//     fillColor: "#0000FF",
//     fillOpacity: 0.2,
//   };

//   if (loadError) {
//     return <div>Error loading maps: {loadError.message}</div>;
//   }

//   if (!isLoaded) {
//     return <div>Loading Maps API...</div>;
//   }

//   if (loading) {
//     return <div>Loading tracking data...</div>;
//   }

//   if (error) {
//     return (
//       <div>
//         <div style={{ color: "red", marginBottom: "10px" }}>Error: {error}</div>
//         <div>Please check the browser console for more details.</div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ display: "flex", gap: isFullscreen ? "0" : "10px", height: isFullscreen ? "100vh" : "auto" }}>
//       {/* Device List Sidebar with Tabs */}
//       {!isFullscreen && (
//       <div
//         style={{
//           width: "300px",
//           background: "#f8f9fa",
//           padding: "15px",
//           borderRadius: "8px",
//           maxHeight: "90vh",
//           overflowY: "auto",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//         }}
//       >
//         {/* Tab Headers */}
//         <div
//           style={{
//             display: "flex",
//             borderBottom: "2px solid #e0e0e0",
//             marginBottom: "15px",
//             width: "300px",
//             overflowX: "auto",
//           }}
//         >
//           <button
//             onClick={() => setActiveTab("devices")}
//             style={{
//               flex: 1,
//               padding: "10px 15px",
//               border: "none",
//               background: activeTab === "devices" ? "#FA9411" : "transparent",
//               color: activeTab === "devices" ? "white" : "#666",
//               cursor: "pointer",
//               fontSize: "14px",
//               fontWeight: "bold",
//               borderRadius: "4px 4px 0 0",
//             }}
//           >
//             Devices ({devices.length})
//           </button>
//           <button
//             onClick={() => setActiveTab("history")}
//             style={{
//               flex: 1,
//               padding: "10px 15px",
//               border: "none",
//               background: activeTab === "history" ? "#FA9411" : "transparent",
//               color: activeTab === "history" ? "white" : "#666",
//               cursor: "pointer",
//               fontSize: "14px",
//               fontWeight: "bold",
//               borderRadius: "4px 4px 0 0",
//             }}
//           >
//             History ({history.length})
//           </button>
//           <button
//             onClick={() => setActiveTab("geofences")}
//             style={{
//               flex: 1,
//               padding: "10px 15px",
//               border: "none",
//               background: activeTab === "geofences" ? "#FA9411" : "transparent",
//               color: activeTab === "geofences" ? "white" : "#666",
//               cursor: "pointer",
//               fontSize: "14px",
//               fontWeight: "bold",
//               borderRadius: "4px 4px 0 0",
//             }}
//           >
//             Geofences ({geofences.length})
//           </button>
//           <button
//             onClick={() => setActiveTab("alerts")}
//             style={{
//               flex: 1,
//               padding: "10px 15px",
//               border: "none",
//               background: activeTab === "alerts" ? "#FA9411" : "transparent",
//               color: activeTab === "alerts" ? "white" : "#666",
//               cursor: "pointer",
//               fontSize: "14px",
//               fontWeight: "bold",
//               borderRadius: "4px 4px 0 0",
//             }}
//           >
//             Alerts ({alerts.length})
//           </button>
//         </div>

//         {/* Tab Content */}
//         {activeTab === "devices" && (
//           <div>
//             <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
//               <button
//                 onClick={toggleAllDevices}
//                 style={{ 
//                   padding: "5px 10px",
//                   fontSize: "12px",
//                   border: "1px solid #ccc",
//                   borderRadius: "4px",
//                   background: "#fff",
//                   cursor: "pointer",
//                 }}
//               >
//                 {visibleDevices.size === devices.length
//                   ? "Hide All"
//                   : "Show All"}
//               </button>
//               <input
//                 type="text"
//                 value={deviceSearch}
//                 onChange={(e) => setDeviceSearch(e.target.value)}
//                 placeholder="Search devices (name, ID, driver)"
//                 style={{
//                   width: "200px",
//                   marginTop: "8px",
//                   padding: "6px 8px",
//                   fontSize: "12px",
//                   border: "1px solid #ccc",
//                   borderRadius: "4px",
//                   background: "#fff",
//                 }}
//               />
//             </div>
            
//             {[...devices]
//               .filter((d) => {
//                 const q = deviceSearch.trim().toLowerCase();
//                 if (!q) return true;
//                 const name = d.name?.toLowerCase() || "";
//                 const driver = d.driver?.toLowerCase() || "";
//                 const idStr = String(d.id);
//                 return (
//                   name.includes(q) || driver.includes(q) || idStr.includes(q)
//                 );
//               })
//               .sort((a, b) => {
//               // Sort order: online -> ack -> offline
//               const getSortOrder = (status: string) => {
//                 if (status === "online") return 0;
//                 if (status === "ack") return 1;
//                 return 2; // offline or any other status
//               };
              
//               const statusDiff = getSortOrder(a.online) - getSortOrder(b.online);
              
//               // If both are in the same status group
//               if (statusDiff === 0) {
//                 // Within "ack" (online) group, sort by moved_timestamp (most recent first)
//                 if (a.online === "ack" && b.online === "ack") {
//                   const aMoved = a.moved_timestamp || 0;
//                   const bMoved = b.moved_timestamp || 0;
//                   // Sort descending (most recent first) - device that moved last appears first
//                   return bMoved - aMoved;
//                 }
//                 // For other groups (moving, offline), maintain current order
//                 return 0;
//               }
              
//               return statusDiff;
//             })
//               .map((device) => (
//               <div
//                 key={device.id}
//                 style={{ 
//                   marginBottom: "10px",
//                   padding: "10px",
//                   background: "#fff",
//                   borderRadius: "6px",
//                   border: "1px solid #e0e0e0",
//                   cursor: "pointer",
//                 }}
//                 onClick={() => zoomToDevice(device)}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={visibleDevices.has(device.id)}
//                     onChange={() => toggleDeviceVisibility(device.id)}
//                     style={{ marginRight: "8px" }}
//                     onClick={(e) => e.stopPropagation()}
//                   />
//                   <div 
//                     style={{ fontSize: "12px", color: "#333", flex: 1 }}
//                   >
//                     {device.name}
//                 </div>
//                   <span
//                     style={{
//                       fontSize: "10px",
//                       padding: "2px 6px",
//                       borderRadius: "3px",
//                       background:
//                         device.online === "online" ? "#00FF00" : device.online === "ack" ? "#FA9411" : "#dc3545",
//                       color: "white",
//                     }}
//                   >
//                     {device.online === "online" ? "Moving" : device.online === "ack" ? "Online" : "Offline"}
//                   </span>
//                 </div>
//               </div>
//             ))}
            
//             {devices.length === 0 && !loading && (
//               <div
//                 style={{ textAlign: "center", color: "#666", padding: "20px" }}
//               >
//                 No devices found
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === "history" && (
//           <div>
//             <div style={{ marginBottom: "15px" }}>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <h4 style={{ margin: "0", fontSize: "14px", color: "#666" }}>
//                   Device Movement History
//                 </h4>
//                 {selectedHistoryTrail && (
//                   <button
//                     onClick={() => {
//                       setSelectedHistoryTrail(null);
//                       setSelectedHistoryIndex(null);
//                     }}
//                     style={{
//                       padding: "4px 8px",
//                       fontSize: "10px",
//                       border: "1px solid #dc3545",
//                       borderRadius: "3px",
//                       background: "#fff",
//                       color: "#dc3545",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Clear Trail
//                   </button>
//                 )}
//               </div>
              
//               {/* Hire Request Filtered Summary (when present) */}
//               {urlParams.get("hire_request_id") && historyFilteredSummary && (
//                 <div
//                   style={{
//                     background: "#fff5e6",
//                     padding: "12px",
//                     borderRadius: "6px",
//                     marginBottom: "10px",
//                     border: "1px solid #ffe0b3",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom: "8px",
//                     }}
//                   >
//                     <div
//                       style={{
//                         fontSize: "12px",
//                         fontWeight: "bold",
//                         color: "#663c00",
//                       }}
//                     >
//                       Hire Request Summary
//                     </div>
//                     <div style={{ fontSize: "10px", color: "#a66f00" }}>
//                       ID: {urlParams.get("hire_request_id")}
//                     </div>
//                   </div>
//                   <div
//                     style={{
//                       display: "grid",
//                       gridTemplateColumns: "repeat(1, 1fr)",
//                       gap: "8px",
//                       fontSize: "11px",
//                       color: "#663c00",
//                     }}
//                   >
//                     <div>
//                       <strong>Total Time:</strong> {historyFilteredSummary.time}
//                     </div>
//                     {/* <div><strong>Engine Hours:</strong> {historyFilteredSummary.engine_hours}</div> */}
//                     {/* <div><strong>Engine Idle:</strong> {historyFilteredSummary.engine_idle.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div> */}
//                     <div>
//                       <strong>Distance covered:</strong>{" "}
//                       {historyFilteredSummary.distance.toLocaleString(
//                         undefined,
//                         { maximumFractionDigits: 3 }
//                       )}{" "}
//                       km
//                     </div>
//                     {/* <div><strong>Points Count:</strong> {historyFilteredSummary.count}</div> */}
//                     <div>
//                       <strong>Expected farm size:</strong>{" "}
//                       {hireRequestInfo?.farm_size} square meters
//                     </div>
//                     <div>
//                       <strong>Actual farm size:</strong>{" "}
//                       {historyFilteredSummary.area_m2.toLocaleString(
//                         undefined,
//                         { maximumFractionDigits: 0 }
//                       )}{" "}
//                       square meters
//                     </div>
//                     <div>
//                       <strong>Expected implements:</strong>{" "}
//                       {hireRequestInfo?.implement_types?.join(", ")}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* History Search Form */}
//               <div
//                 style={{
//                   background: "#f8f9fa",
//                   padding: "12px",
//                   borderRadius: "6px",
//                   marginBottom: "15px",
//                   border: "1px solid #e0e0e0",
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     marginBottom: "8px",
//                     color: "#333",
//                   }}
//                 >
//                   Search History
//                 </div>
                
//                 {/* Device Selector */}
//                 <div style={{ marginBottom: "8px" }}>
//                   <label
//                     style={{
//                       fontSize: "11px",
//                       color: "#666",
//                       display: "block",
//                       marginBottom: "2px",
//                     }}
//                   >
//                     Device:
//                   </label>
//                   <select
//                     value={historySearchParams.deviceId}
//                     onChange={(e) =>
//                       setHistorySearchParams((prev) => ({
//                         ...prev,
//                         deviceId: e.target.value,
//                       }))
//                     }
//                     style={{
//                       width: "100%",
//                       padding: "4px 6px",
//                       fontSize: "11px",
//                       border: "1px solid #ccc",
//                       borderRadius: "3px",
//                       background: "#fff",
//                     }}
//                   >
//                     <option value="">Select a device</option>
//                     {devices.map((device) => (
//                       <option key={device.id} value={device.id}>
//                         {device.name} (ID: {device.id})
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Date and Time Range */}
//                 <div
//                   style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
//                 >
//                   <div style={{ flex: 1 }}>
//                     <label
//                       style={{
//                         fontSize: "11px",
//                         color: "#666",
//                         display: "block",
//                         marginBottom: "2px",
//                       }}
//                     >
//                       From Date:
//                     </label>
//                     <input
//                       type="date"
//                       value={historySearchParams.fromDate}
//                       onChange={(e) =>
//                         setHistorySearchParams((prev) => ({
//                           ...prev,
//                           fromDate: e.target.value,
//                         }))
//                       }
//                       style={{
//                         // width: '100%',
//                         padding: "4px 6px",
//                         fontSize: "11px",
//                         border: "1px solid #ccc",
//                         borderRadius: "3px",
//                       }}
//                     />
//                   </div>
//                   <div style={{ flex: 1 }}>
//                     <label
//                       style={{
//                         fontSize: "11px",
//                         color: "#666",
//                         display: "block",
//                         marginBottom: "2px",
//                       }}
//                     >
//                       From Time:
//                     </label>
//                     <input
//                       type="time"
//                       value={historySearchParams.fromTime}
//                       onChange={(e) =>
//                         setHistorySearchParams((prev) => ({
//                           ...prev,
//                           fromTime: e.target.value,
//                         }))
//                       }
//                       style={{
//                         // width: '100%',
//                         padding: "4px 6px",
//                         fontSize: "11px",
//                         border: "1px solid #ccc",
//                         borderRadius: "3px",
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div
//                   style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
//                 >
//                   <div style={{ flex: 1 }}>
//                     <label
//                       style={{
//                         fontSize: "11px",
//                         color: "#666",
//                         display: "block",
//                         marginBottom: "2px",
//                       }}
//                     >
//                       To Date:
//                     </label>
//                     <input
//                       type="date"
//                       value={historySearchParams.toDate}
//                       onChange={(e) =>
//                         setHistorySearchParams((prev) => ({
//                           ...prev,
//                           toDate: e.target.value,
//                         }))
//                       }
//                       style={{
//                         // width: '100%',
//                         padding: "4px 6px",
//                         fontSize: "11px",
//                         border: "1px solid #ccc",
//                         borderRadius: "3px",
//                       }}
//                     />
//                   </div>
//                   <div style={{ flex: 1 }}>
//                     <label
//                       style={{
//                         fontSize: "11px",
//                         color: "#666",
//                         display: "block",
//                         marginBottom: "2px",
//                       }}
//                     >
//                       To Time:
//                     </label>
//                     <input
//                       type="time"
//                       value={historySearchParams.toTime}
//                       onChange={(e) =>
//                         setHistorySearchParams((prev) => ({
//                           ...prev,
//                           toTime: e.target.value,
//                         }))
//                       }
//                       style={{
//                         // width: '100%',
//                         padding: "4px 6px",
//                         fontSize: "11px",
//                         border: "1px solid #ccc",
//                         borderRadius: "3px",
//                       }}
//                     />
//                   </div>
//                 </div>

//                 {/* Quick Preset Buttons */}
//                 <div style={{ marginBottom: "8px" }}>
//                   <div
//                     style={{
//                       fontSize: "10px",
//                       color: "#666",
//                       marginBottom: "4px",
//                     }}
//                   >
//                     Quick presets:
//                   </div>
//                   <div style={{ display: "flex", gap: "4px" }}>
//                     <button
//                       onClick={() => setDefaultDateRange(1)}
//                       style={{
//                         flex: 1,
//                         padding: "3px 6px",
//                         fontSize: "9px",
//                         border: "1px solid #ccc",
//                         borderRadius: "3px",
//                         background: "#fff",
//                         color: "#666",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Today
//                     </button>
//                     <button
//                       onClick={() => setDefaultDateRange(7)}
//                       style={{
//                         flex: 1,
//                         padding: "3px 6px",
//                         fontSize: "9px",
//                         border: "1px solid #ccc",
//                         borderRadius: "3px",
//                         background: "#fff",
//                         color: "#666",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Last 7 days
//                     </button>
//                     <button
//                       onClick={() => setDefaultDateRange(30)}
//                       style={{
//                         flex: 1,
//                         padding: "3px 6px",
//                         fontSize: "9px",
//                         border: "1px solid #ccc",
//                         borderRadius: "3px",
//                         background: "#fff",
//                         color: "#666",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Last 30 days
//                     </button>
//                   </div>
//                 </div>

//                 {/* Search Button */}
//                 <button
//                   onClick={searchHistory}
//                   disabled={isLoadingHistory}
//                   style={{
//                     width: "100%",
//                     padding: "6px 12px",
//                     fontSize: "11px",
//                     border: "none",
//                     borderRadius: "3px",
//                     background: isLoadingHistory ? "#ccc" : "#FA9411",
//                     color: "white",
//                     cursor: isLoadingHistory ? "not-allowed" : "pointer",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {isLoadingHistory ? "Searching..." : "Search History"}
//                 </button>
//               </div>
              
//               <div
//                 style={{
//                   fontSize: "12px",
//                   color: "#999",
//                   marginBottom: "10px",
//                 }}
//               >
//                 Click on a movement period to show the trail on the map
//               </div>
//             </div>
            
//             {historyGroups.map((mainItem, mainIndex) => {
//               const movementCount = mainItem.items ? mainItem.items.length : 0;
//               const isSelected = selectedHistoryIndex === mainIndex;
              
//               return (
//                 <div 
//                   key={mainIndex} 
//                   onClick={() => showHistoryTrailOnMap(mainItem, mainIndex)}
//                   style={{ 
//                     marginBottom: "10px",
//                     padding: "12px",
//                     background: isSelected
//                       ? "rgba(250, 149, 17, 0.24)"
//                       : "#f8f9fa",
//                     borderRadius: "6px",
//                     border: isSelected
//                       ? "2px solid #FA9411"
//                       : "1px solid #e0e0e0",
//                     cursor: "pointer",
//                     transition: "all 0.2s",
//                     borderLeft: `4px solid ${
//                       isSelected
//                         ? "#FA9411"
//                         : mainItem.status === 3
//                         ? "#FA9411"
//                         : mainItem.status === 2
//                         ? "#ffc107"
//                         : "#dc3545"
//                     }`,
//                     boxShadow: isSelected
//                       ? "0 2px 8px rgba(33, 150, 243, 0.3)"
//                       : "none",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!isSelected) {
//                       e.currentTarget.style.background = "#e9ecef";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!isSelected) {
//                       e.currentTarget.style.background = "#f8f9fa";
//                     }
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: "13px",
//                       fontWeight: "bold",
//                       color: isSelected ? "#FA9411" : "#333",
//                       marginBottom: "4px",
//                     }}
//                   >
//                     Movement Period {mainIndex + 1}
//                     {isSelected && (
//                       <span
//                         style={{
//                           marginLeft: "8px",
//                           fontSize: "10px",
//                           color: "#FA9411",
//                         }}
//                       >
//                         ● Active
//                       </span>
//                     )}
//                   </div>
//                   <div style={{ fontSize: "11px", color: "#666" }}>
//                     <div>
//                       <strong>Time:</strong> {mainItem.show}
//                     </div>
//                     {mainItem.distance > 0 && (
//                       <div>
//                         <strong>Distance:</strong> {mainItem.distance} km
//                       </div>
//                     )}
//                     {mainItem.time && (
//                       <div>
//                         <strong>Duration:</strong> {mainItem.time}
//                       </div>
//                     )}
//                     <div>
//                       <strong>Tracking Points:</strong> {movementCount}
//                     </div>
//                     <div>
//                       <strong>Status:</strong>
//                       <span
//                         style={{
//                           color:
//                             mainItem.status === 3
//                               ? "#FA9411"
//                               : mainItem.status === 2
//                               ? "#ffc107"
//                               : "#dc3545",
//                           fontWeight: "bold",
//                           marginLeft: "4px",
//                         }}
//                       >
//                         {mainItem.status === 3
//                           ? "Active"
//                           : mainItem.status === 2
//                           ? "Parked"
//                           : "Unknown"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
            
//             {historyGroups.length === 0 && !loading && !isLoadingHistory && (
//               <div
//                 style={{ textAlign: "center", color: "#666", padding: "20px" }}
//               >
//                 {historySearchParams.deviceId
//                   ? "No movement history found for the selected criteria"
//                   : "Select a device and date range to search history"}
//               </div>
//             )}
            
//             {isLoadingHistory && (
//               <div
//                 style={{ textAlign: "center", color: "#666", padding: "20px" }}
//               >
//                 <div style={{ fontSize: "12px" }}>Searching history...</div>
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === "geofences" && (
//           <div>
//             {!showGeofenceForm ? (
//               // Geofence List View
//               <div>
//                 <div style={{ marginBottom: "15px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <h4
//                       style={{ margin: "0", fontSize: "14px", color: "#666" }}
//                     >
//                       Geofence Management
//                     </h4>
//                     <button
//                       onClick={() => openGeofenceForm()}
//                       style={{
//                         padding: "6px 12px",
//                         fontSize: "11px",
//                         border: "none",
//                         borderRadius: "4px",
//                         background: "#FA9411",
//                         color: "white",
//                         cursor: "pointer",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       + Add Geofence
//                     </button>
//                   </div>
//                 </div>
                
//                 {geofences.map((geofence) => (
//                   <div
//                     key={geofence.id}
//                     style={{ 
//                       marginBottom: "10px",
//                       padding: "12px",
//                       background: "#fff",
//                       borderRadius: "6px",
//                       border: "1px solid #e0e0e0",
//                       borderLeft: `4px solid ${geofence.polygon_color}`,
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         marginBottom: "8px",
//                       }}
//                     >
//                       <div>
//                         <strong style={{ fontSize: "13px", color: "#333" }}>
//                           {geofence.name}
//                         </strong>
//                         <span
//                           style={{
//                             fontSize: "10px",
//                             padding: "2px 6px",
//                             borderRadius: "3px",
//                             background: geofence.active ? "#FA9411" : "#dc3545",
//                             color: "white",
//                             marginLeft: "8px",
//                           }}
//                         >
//                           {geofence.active ? "Active" : "Inactive"}
//                         </span>
//                       </div>
//                       <div style={{ display: "flex", gap: "4px" }}>
//                         <button
//                           onClick={() => openGeofenceForm(geofence)}
//                           style={{
//                             padding: "3px 6px",
//                             fontSize: "9px",
//                             border: "1px solid #007bff",
//                             borderRadius: "3px",
//                             background: "#fff",
//                             color: "#007bff",
//                             cursor: "pointer",
//                           }}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteGeofence(geofence.id)}
//                           style={{
//                             padding: "3px 6px",
//                             fontSize: "9px",
//                             border: "1px solid #dc3545",
//                             borderRadius: "3px",
//                             background: "#fff",
//                             color: "#dc3545",
//                             cursor: "pointer",
//                           }}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
                    
//                     <div style={{ fontSize: "11px", color: "#666" }}>
//                       <div>
//                         <strong>Type:</strong> {geofence.type}
//                       </div>
//                       {geofence.type === "circle" && geofence.radius && (
//                         <div>
//                           <strong>Radius:</strong> {geofence.radius.toFixed(0)}m
//                         </div>
//                       )}
//                       {geofence.speed_limit && (
//                         <div>
//                           <strong>Speed Limit:</strong> {geofence.speed_limit}{" "}
//                           km/h
//                         </div>
//                       )}
//                       {geofence.device_id && (
//                         <div>
//                           <strong>Device ID:</strong> {geofence.device_id}
//                         </div>
//                       )}
//                       <div>
//                         <strong>Created:</strong>{" "}
//                         {new Date(geofence.created_at).toLocaleDateString()}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
                
//                 {geofences.length === 0 && !loading && (
//                   <div
//                     style={{
//                       textAlign: "center",
//                       color: "#666",
//                       padding: "20px",
//                     }}
//                   >
//                     No geofences found. Click "Add Geofence" to create one.
//                   </div>
//                 )}
//               </div>
//             ) : (
//               // Geofence Form View
//               <div>
//                 <div style={{ marginBottom: "15px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <h4
//                       style={{ margin: "0", fontSize: "14px", color: "#666" }}
//                     >
//                       {editingGeofence
//                         ? "Edit Geofence"
//                         : "Create New Geofence"}
//                     </h4>
//                     <button
//                       onClick={closeGeofenceForm}
//                       style={{
//                         padding: "4px 8px",
//                         fontSize: "10px",
//                         border: "1px solid #dc3545",
//                         borderRadius: "3px",
//                         background: "#fff",
//                         color: "#dc3545",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>

//                 <div style={{ marginBottom: "12px" }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: "3px",
//                       fontSize: "12px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     Geofence Name:
//                   </label>
//                   <input
//                     type="text"
//                     value={geofenceFormData.name}
//                     onChange={(e) =>
//                       setGeofenceFormData((prev) => ({
//                         ...prev,
//                         name: e.target.value,
//                       }))
//                     }
//                     style={{
//                       width: "100%",
//                       padding: "6px",
//                       border: "1px solid #ccc",
//                       borderRadius: "3px",
//                       fontSize: "12px",
//                     }}
//                     placeholder="Enter geofence name"
//                   />
//                 </div>

//                 <div style={{ marginBottom: "12px" }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: "3px",
//                       fontSize: "12px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     Type:
//                   </label>
//                   <select
//                     value={geofenceFormData.type}
//                     onChange={(e) =>
//                       setGeofenceFormData((prev) => ({
//                         ...prev,
//                         type: e.target.value as "circle" | "polygon",
//                       }))
//                     }
//                     style={{
//                       width: "100%",
//                       padding: "6px",
//                       border: "1px solid #ccc",
//                       borderRadius: "3px",
//                       fontSize: "12px",
//                     }}
//                   >
//                     <option value="circle">Circle</option>
//                     <option value="polygon">Polygon</option>
//                   </select>
//                 </div>

//                 <div style={{ marginBottom: "12px" }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: "3px",
//                       fontSize: "12px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     Color:
//                   </label>
//                   <input
//                     type="color"
//                     value={geofenceFormData.polygon_color}
//                     onChange={(e) =>
//                       setGeofenceFormData((prev) => ({
//                         ...prev,
//                         polygon_color: e.target.value,
//                       }))
//                     }
//                     style={{
//                       width: "100%",
//                       height: "30px",
//                       border: "1px solid #ccc",
//                       borderRadius: "3px",
//                     }}
//                   />
//                 </div>

//                 <div style={{ marginBottom: "12px" }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: "3px",
//                       fontSize: "12px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     Speed Limit (km/h):
//                   </label>
//                   <input
//                     type="number"
//                     value={geofenceFormData.speed_limit || ""}
//                     onChange={(e) =>
//                       setGeofenceFormData((prev) => ({
//                         ...prev,
//                         speed_limit: parseInt(e.target.value) || undefined,
//                       }))
//                     }
//                     style={{
//                       width: "100%",
//                       padding: "6px",
//                       border: "1px solid #ccc",
//                       borderRadius: "3px",
//                       fontSize: "12px",
//                     }}
//                     placeholder="Optional speed limit"
//                   />
//                 </div>

//                 <div style={{ marginBottom: "12px" }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: "3px",
//                       fontSize: "12px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     Device Association:
//                   </label>
//                   <select
//                     value={geofenceFormData.device_id || ""}
//                     onChange={(e) =>
//                       setGeofenceFormData((prev) => ({
//                         ...prev,
//                         device_id: parseInt(e.target.value) || undefined,
//                       }))
//                     }
//                     style={{
//                       width: "100%",
//                       padding: "6px",
//                       border: "1px solid #ccc",
//                       borderRadius: "3px",
//                       fontSize: "12px",
//                     }}
//                   >
//                     <option value="">No specific device</option>
//                     {devices.map((device) => (
//                       <option key={device.id} value={device.id}>
//                         {device.name} (ID: {device.id})
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div style={{ marginBottom: "15px" }}>
//                   <label
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       fontSize: "12px",
//                     }}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={geofenceFormData.active === 1}
//                       onChange={(e) =>
//                         setGeofenceFormData((prev) => ({
//                           ...prev,
//                           active: e.target.checked ? 1 : 0,
//                         }))
//                       }
//                       style={{ marginRight: "6px" }}
//                     />
//                     Active (monitor this geofence)
//                   </label>
//                 </div>

//                 {/* Drawing Instructions */}
//                 {!editingGeofence && (
//                   <div
//                     style={{
//                       background: "#f8f9fa",
//                       padding: "10px",
//                       borderRadius: "4px",
//                       marginBottom: "15px",
//                       border: "1px solid #e0e0e0",
//                     }}
//                   >
//                     <h5
//                       style={{
//                         margin: "0 0 8px 0",
//                         fontSize: "12px",
//                         color: "#333",
//                       }}
//                     >
//                       Drawing Instructions:
//                     </h5>
//                     {geofenceFormData.type === "circle" ? (
//                       <div style={{ fontSize: "11px", color: "#666" }}>
//                         <p style={{ margin: "0 0 3px 0" }}>
//                           1. Click "Start Drawing Circle" below
//                         </p>
//                         <p style={{ margin: "0 0 3px 0" }}>
//                           2. Click on the map to set the center point
//                         </p>
//                         <p style={{ margin: "0" }}>
//                           3. Click again to set the radius
//                         </p>
//                       </div>
//                     ) : (
//                       <div style={{ fontSize: "11px", color: "#666" }}>
//                         <p style={{ margin: "0 0 3px 0" }}>
//                           1. Click "Start Drawing Polygon" below
//                         </p>
//                         <p style={{ margin: "0 0 3px 0" }}>
//                           2. Click on the map to add points
//                         </p>
//                         <p style={{ margin: "0" }}>
//                           3. Click "Finish Drawing" when done (minimum 3 points)
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Drawing Controls */}
//                 {!editingGeofence && (
//                   <div style={{ marginBottom: "15px" }}>
//                     {!isDrawingMode ? (
//                       <button
//                         onClick={() => startDrawing(geofenceFormData.type)}
//                         style={{
//                           width: "100%",
//                           padding: "8px",
//                           border: "none",
//                           borderRadius: "4px",
//                           background: "#007bff",
//                           color: "white",
//                           cursor: "pointer",
//                           fontSize: "12px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         Start Drawing{" "}
//                         {geofenceFormData.type === "circle"
//                           ? "Circle"
//                           : "Polygon"}
//                       </button>
//                     ) : (
//                       <div style={{ display: "flex", gap: "6px" }}>
//                         <button
//                           onClick={() => {
//                             setIsDrawingMode(false);
//                             setDrawingType(null);
//                             setDrawnCoordinates([]);
//                             setDrawnCenter(null);
//                             setDrawnRadius(null);
//                           }}
//                           style={{
//                             flex: 1,
//                             padding: "6px",
//                             border: "1px solid #dc3545",
//                             borderRadius: "3px",
//                             background: "#fff",
//                             color: "#dc3545",
//                             cursor: "pointer",
//                             fontSize: "11px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Cancel
//                         </button>
//                         {geofenceFormData.type === "polygon" &&
//                           drawnCoordinates.length >= 3 && (
//                           <button
//                             onClick={finishPolygonDrawing}
//                             style={{
//                               flex: 1,
//                                 padding: "6px",
//                                 border: "none",
//                                 borderRadius: "3px",
//                                 background: "#FA9411",
//                                 color: "white",
//                                 cursor: "pointer",
//                                 fontSize: "11px",
//                                 fontWeight: "bold",
//                             }}
//                           >
//                             Finish ({drawnCoordinates.length})
//                           </button>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Drawing Status */}
//                 {isDrawingMode && (
//                   <div
//                     style={{
//                       background: "#fff3cd",
//                       padding: "8px",
//                       borderRadius: "3px",
//                       marginBottom: "15px",
//                       border: "1px solid #ffeaa7",
//                     }}
//                   >
//                     <div style={{ fontSize: "11px", color: "#856404" }}>
//                       {geofenceFormData.type === "circle"
//                         ? drawnCenter
//                           ? "Click on the map to set the radius"
//                           : "Click on the map to set the center point"
//                         : `Drawing polygon... ${drawnCoordinates.length} points added. Click "Finish Drawing" when done.`}
//                     </div>
//                   </div>
//                 )}

//                 {/* Save Button */}
//                 <button
//                   onClick={saveGeofence}
//                   disabled={isLoadingGeofence}
//                   style={{
//                     width: "100%",
//                     padding: "8px",
//                     border: "none",
//                     borderRadius: "4px",
//                     background: isLoadingGeofence ? "#ccc" : "#FA9411",
//                     color: "white",
//                     cursor: isLoadingGeofence ? "not-allowed" : "pointer",
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {isLoadingGeofence
//                     ? "Saving..."
//                     : editingGeofence
//                     ? "Update Geofence"
//                     : "Create Geofence"}
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === "alerts" && (
//           <div>
//             <div style={{ marginBottom: "15px" }}>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <h4 style={{ margin: "0", fontSize: "14px", color: "#666" }}>
//                   Alert Management
//                 </h4>
//                 <button
//                   onClick={() => openAlertModal()}
//                   style={{
//                     padding: "6px 12px",
//                     fontSize: "11px",
//                     border: "none",
//                     borderRadius: "4px",
//                     background: "#FA9411",
//                     color: "white",
//                     cursor: "pointer",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   + Create Alert
//                 </button>
//               </div>
//             </div>

//             {alertsLoading ? (
//               <div
//                 style={{ textAlign: "center", padding: "20px", color: "#666" }}
//               >
//                 Loading alerts...
//               </div>
//             ) : alerts.length === 0 ? (
//               <div
//                 style={{ textAlign: "center", padding: "20px", color: "#666" }}
//               >
//                 No alerts found. Create your first alert to get started.
//               </div>
//             ) : (
//               alerts.map((alert) => (
//                 <div
//                   key={alert.id}
//                   style={{ 
//                     marginBottom: "10px",
//                     padding: "12px",
//                     background: "#fff",
//                     borderRadius: "6px",
//                     border: "1px solid #e0e0e0",
//                     borderLeft: `4px solid ${
//                       alert.active ? "#FA9411" : "#dc3545"
//                     }`,
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom: "8px",
//                     }}
//                   >
//                     <div>
//                       <strong style={{ fontSize: "13px", color: "#333" }}>
//                         {alert.name}
//                       </strong>
//                       <span
//                         style={{
//                           fontSize: "10px",
//                           padding: "2px 6px",
//                           borderRadius: "3px",
//                           marginLeft: "8px",
//                           background: alert.active ? "#d4edda" : "#f8d7da",
//                           color: alert.active ? "#155724" : "#721c24",
//                         }}
//                       >
//                         {alert.active ? "Active" : "Inactive"}
//                       </span>
//                     </div>
//                     <div>
//                       <button
//                         onClick={() => openAlertModal(alert)}
//                         style={{
//                           padding: "4px 8px",
//                           fontSize: "10px",
//                           border: "none",
//                           borderRadius: "3px",
//                           background: "#007bff",
//                           color: "white",
//                           cursor: "pointer",
//                           marginRight: "5px",
//                         }}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteAlert(alert.id)}
//                         style={{
//                           padding: "4px 8px",
//                           fontSize: "10px",
//                           border: "none",
//                           borderRadius: "3px",
//                           background: "#dc3545",
//                           color: "white",
//                           cursor: "pointer",
//                         }}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                   <div style={{ fontSize: "11px", color: "#666" }}>
//                     <div>
//                       <strong>Type:</strong> {alert.type}
//                     </div>
//                     <div>
//                       <strong>Devices:</strong> {alert.devices.length} device(s)
//                     </div>
//                     <div>
//                       <strong>Geofences:</strong> {alert.geofences.length}{" "}
//                       geofence(s)
//                     </div>
//                     <div>
//                       <strong>Created:</strong>{" "}
//                       {new Date(alert.created_at).toLocaleDateString()}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>
//       )}

//       {/* Alert Modal */}
//       {showAlertModal && (
//         <div
//           style={{
//             position: "fixed",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//             background: "rgba(0, 0, 0, 0.5)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             style={{
//               background: "white",
//               padding: "20px",
//               borderRadius: "8px",
//               maxWidth: "500px",
//               width: "90%",
//               maxHeight: "80vh",
//               overflowY: "auto",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "20px",
//               }}
//             >
//               <h3 style={{ margin: 0 }}>
//                 {selectedAlert ? "Edit Alert" : "Create New Alert"}
//               </h3>
//               <button
//                 onClick={closeAlertModal}
//                 disabled={isLoadingAlert}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   fontSize: "20px",
//                   cursor: isLoadingAlert ? "not-allowed" : "pointer",
//                   color: isLoadingAlert ? "#ccc" : "#666",
//                 }}
//               >
//                 ×
//               </button>
//             </div>

//             <div style={{ marginBottom: "15px" }}>
//               <label
//                 style={{
//                   display: "block",
//                   marginBottom: "5px",
//                   fontSize: "14px",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Alert Name *
//               </label>
//               <input
//                 type="text"
//                 value={alertFormData.name}
//                 onChange={(e) =>
//                   setAlertFormData((prev) => ({
//                     ...prev,
//                     name: e.target.value,
//                   }))
//                 }
//                 placeholder="Enter alert name"
//                 disabled={isLoadingAlert}
//                 style={{
//                   width: "100%",
//                   padding: "8px",
//                   border: "1px solid #ddd",
//                   borderRadius: "4px",
//                   fontSize: "14px",
//                   opacity: isLoadingAlert ? 0.6 : 1,
//                   cursor: isLoadingAlert ? "not-allowed" : "text",
//                 }}
//               />
//             </div>

//             <div style={{ marginBottom: "15px" }}>
//               <label
//                 style={{
//                   display: "block",
//                   marginBottom: "5px",
//                   fontSize: "14px",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Select Devices *
//               </label>
//               <div
//                 style={{
//                   maxHeight: "150px",
//                   overflowY: "auto",
//                   border: "1px solid #ddd",
//                   borderRadius: "4px",
//                   padding: "8px",
//                   opacity: isLoadingAlert ? 0.6 : 1,
//                 }}
//               >
//                 {devices.map((device) => (
//                   <div key={device.id} style={{ marginBottom: "5px" }}>
//                     <label
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         cursor: isLoadingAlert ? "not-allowed" : "pointer",
//                       }}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={alertFormData.devices.includes(device.id)}
//                         disabled={isLoadingAlert}
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             setAlertFormData((prev) => ({
//                               ...prev, 
//                               devices: [...prev.devices, device.id],
//                             }));
//                           } else {
//                             setAlertFormData((prev) => ({
//                               ...prev, 
//                               devices: prev.devices.filter(
//                                 (id) => id !== device.id
//                               ),
//                             }));
//                           }
//                         }}
//                         style={{ marginRight: "8px" }}
//                       />
//                       <span style={{ fontSize: "14px" }}>{device.name}</span>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div style={{ marginBottom: "15px" }}>
//               <label
//                 style={{
//                   display: "block",
//                   marginBottom: "5px",
//                   fontSize: "14px",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Select Geofences *
//               </label>
//               <div
//                 style={{
//                   maxHeight: "150px",
//                   overflowY: "auto",
//                   border: "1px solid #ddd",
//                   borderRadius: "4px",
//                   padding: "8px",
//                   opacity: isLoadingAlert ? 0.6 : 1,
//                 }}
//               >
//                 {geofences.map((geofence) => (
//                   <div key={geofence.id} style={{ marginBottom: "5px" }}>
//                     <label
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         cursor: isLoadingAlert ? "not-allowed" : "pointer",
//                       }}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={alertFormData.geofences.includes(geofence.id)}
//                         disabled={isLoadingAlert}
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             setAlertFormData((prev) => ({
//                               ...prev, 
//                               geofences: [...prev.geofences, geofence.id],
//                             }));
//                           } else {
//                             setAlertFormData((prev) => ({
//                               ...prev, 
//                               geofences: prev.geofences.filter(
//                                 (id) => id !== geofence.id
//                               ),
//                             }));
//                           }
//                         }}
//                         style={{ marginRight: "8px" }}
//                       />
//                       <span style={{ fontSize: "14px" }}>{geofence.name}</span>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div style={{ marginBottom: "20px" }}>
//               <label
//                 style={{
//                   display: "block",
//                   marginBottom: "5px",
//                   fontSize: "14px",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Email Notification
//               </label>
//               <input
//                 type="email"
//                 value={alertFormData.notifications?.email?.input || ""}
//                 onChange={(e) =>
//                   setAlertFormData((prev) => ({
//                   ...prev, 
//                   notifications: {
//                     ...prev.notifications,
//                     email: {
//                       ...prev.notifications?.email,
//                       input: e.target.value,
//                         active: prev.notifications?.email?.active || 0,
//                       },
//                     },
//                   }))
//                     }
//                 placeholder="Enter email address"
//                 disabled={isLoadingAlert}
//                 style={{
//                   width: "100%",
//                   padding: "8px",
//                   border: "1px solid #ddd",
//                   borderRadius: "4px",
//                   fontSize: "14px",
//                   opacity: isLoadingAlert ? 0.6 : 1,
//                   cursor: isLoadingAlert ? "not-allowed" : "text",
//                 }}
//               />
//             </div>

//             <div
//               style={{
//                 display: "flex",
//                 gap: "10px",
//                 justifyContent: "flex-end",
//               }}
//             >
//               <button
//                 onClick={closeAlertModal}
//                 disabled={isLoadingAlert}
//                 style={{
//                   padding: "8px 16px",
//                   border: "1px solid #ddd",
//                   borderRadius: "4px",
//                   background: "white",
//                   cursor: isLoadingAlert ? "not-allowed" : "pointer",
//                   opacity: isLoadingAlert ? 0.6 : 1,
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={saveAlert}
//                 disabled={isLoadingAlert}
//                 style={{
//                   padding: "8px 16px",
//                   border: "none",
//                   borderRadius: "4px",
//                   background: isLoadingAlert ? "#ccc" : "#FA9411",
//                   color: "white",
//                   cursor: isLoadingAlert ? "not-allowed" : "pointer",
//                   fontWeight: "bold",
//                 }}
//               >
//                 {isLoadingAlert
//                   ? "Saving..."
//                   : selectedAlert
//                   ? "Update Alert"
//                   : "Create Alert"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Map Container */}
//       <div style={{ flex: 1, height: isFullscreen ? "100vh" : "auto" }}>
//         {!isFullscreen && (
//         <div
//           style={{
//             marginBottom: "10px",
//             fontSize: "14px",
//             background: "#f0f0f0",
//             padding: "5px",
//           }}
//         >
//           <strong>Mode:</strong> {DATA_MODE.toUpperCase()} | 
//           <strong> Status:</strong> Devices: {devices.length} | Geofences:{" "}
//           {geofences.length} | Alerts: {alerts.length} |
//           <strong> Visible:</strong> {visibleDevices.size} devices
//         </div>
//         )}

//         <div style={{ position: "relative" }}>
//           {/* Map Type Selector */}
//           <div
//             style={{
//               position: "absolute",
//               top: "10px",
//               right: "10px",
//               zIndex: 5,
//               background: "white",
//               borderRadius: "8px",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
//               display: "flex",
//               overflow: "hidden",
//             }}
//           >
//             {(["satellite", "hybrid", "roadmap", "terrain"] as MapType[]).map(
//               (type) => (
//                 <button
//                   key={type}
//                   onClick={() => {
//                     setMapType(type);
//                     if (map) {
//                       map.setMapTypeId(type as any);
//                     }
//                   }}
//                   style={{
//                     padding: "8px 12px",
//                     border: "none",
//                     background: mapType === type ? "#FA9411" : "white",
//                     color: mapType === type ? "white" : "#333",
//                     cursor: "pointer",
//                     fontSize: "12px",
//                     fontWeight: mapType === type ? "bold" : "normal",
//                     transition: "all 0.2s ease",
//                     textTransform: "capitalize",
//                     borderRight:
//                       type !== "terrain" ? "1px solid #e0e0e0" : "none",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (mapType !== type) {
//                       (e.currentTarget as HTMLButtonElement).style.background =
//                         "#f5f5f5";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (mapType !== type) {
//                       (e.currentTarget as HTMLButtonElement).style.background =
//                         "white";
//                     }
//                   }}
//                 >
//                   {type === "roadmap" ? "Normal" : type}
//                 </button>
//               )
//             )}
//         </div>
//           <div
//           className="map_rightbar"
//             style={{
//               position: "absolute",
//               top: "100px",
//               right: "10px",
//               zIndex: 5,
//               background: "white",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
//               borderRadius: "8px",
//               display: "flex",
//               flexDirection: "column",
//               padding: "4px",
//               gap: "4px",
//             }}
//           >
//             {/* Fullscreen Toggle */}
//             <button
//               onClick={toggleFullscreen}
//               title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
//               style={{
//                 width: "36px",
//                 height: "36px",
//                 border: "none",
//                 background: isFullscreen ? "#e3f2fd" : "white",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "18px",
//                 transition: "background 0.2s",
//               }}
//               onMouseEnter={(e) => {
//                 (e.currentTarget as HTMLButtonElement).style.background = "#f5f5f5";
//               }}
//               onMouseLeave={(e) => {
//                 (e.currentTarget as HTMLButtonElement).style.background = isFullscreen ? "#e3f2fd" : "white";
//               }}
//             >
//               {isFullscreen ? "⤓" : "⤢"}
//             </button>

//             {/* Fit Bounds */}
//             <button
//               onClick={fitBoundsToDevices}
//               title="Fit all devices on map"
//               style={{
//                 width: "36px",
//                 height: "36px",
//                 border: "none",
//                 background: "white",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "16px",
//                 transition: "background 0.2s",
//               }}
//               onMouseEnter={(e) => {
//                 (e.currentTarget as HTMLButtonElement).style.background = "#f5f5f5";
//               }}
//               onMouseLeave={(e) => {
//                 (e.currentTarget as HTMLButtonElement).style.background = "white";
//               }}
//             >
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
//               </svg>
//             </button>

//             {/* Geofences Toggle */}
//             <button
//               onClick={toggleGeofences}
//               title={showGeofences ? "Hide Geofences" : "Show Geofences"}
//               style={{
//                 width: "36px",
//                 height: "36px",
//                 border: "none",
//                 background: showGeofences ? "#e3f2fd" : "white",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "18px",
//                 transition: "background 0.2s",
//               }}
//               onMouseEnter={(e) => {
//                 (e.currentTarget as HTMLButtonElement).style.background = "#f5f5f5";
//               }}
//               onMouseLeave={(e) => {
//                 (e.currentTarget as HTMLButtonElement).style.background = showGeofences ? "#e3f2fd" : "white";
//               }}
//             >
//                             <img src="/icons/location.png" alt="Route/Trail" width="20" height="20" style={{ objectFit: "contain" }} />

//             </button>

//             {/* Tails Toggle */}
//             <button
//               onClick={toggleTails}
//               title={showTails ? "Hide Tails" : "Show Tails"}
//               style={{
//                 width: "36px",
//                 height: "36px",
//                 border: "none",
//                 background: showTails ? "#e3f2fd" : "white",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "16px",
//                 transition: "background 0.2s",
//               }}
//               onMouseEnter={(e) => {
//                 (e.currentTarget as HTMLButtonElement).style.background = "#f5f5f5";
//               }}
//               onMouseLeave={(e) => {
//                 (e.currentTarget as HTMLButtonElement).style.background = showTails ? "#e3f2fd" : "white";
//               }}
//             >
//               <img src="/icons/route.png" alt="Route/Trail" width="20" height="20" style={{ objectFit: "contain" }} />
//             </button>

//             {/* Grouping/Clustering Toggle */}
//             <button
//               onClick={toggleGrouping}
//               title={showGrouping ? "Disable Grouping" : "Enable Grouping"}
//               style={{
//                 width: "36px",
//                 height: "36px",
//                 border: "none",
//                 background: showGrouping ? "#e3f2fd" : "white",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "18px",
//                 transition: "background 0.2s",
//               }}
//               onMouseEnter={(e) => {
//                 (e.currentTarget as HTMLButtonElement).style.background = "#f5f5f5";
//               }}
//               onMouseLeave={(e) => {
//                 (e.currentTarget as HTMLButtonElement).style.background = showGrouping ? "#e3f2fd" : "white";
//               }}
//             >
//               <svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M21,18.28V11.72A2,2,0,1,0,18.28,9H15V5.72A2,2,0,1,0,12.28,3H5.72A2,2,0,1,0,3,5.72v6.56A2,2,0,1,0,5.72,15H9v3.28A2,2,0,1,0,11.72,21h6.56A2,2,0,1,0,21,18.28ZM8,10a2,2,0,0,0,1,1.72V13H5.72A1.91,1.91,0,0,0,5,12.28V5.72A1.91,1.91,0,0,0,5.72,5h6.56a1.91,1.91,0,0,0,.72.72V9H11.72A2,2,0,0,0,8,10Zm5,1v1.28a1.91,1.91,0,0,0-.72.72H11V11.72a1.91,1.91,0,0,0,.72-.72Zm6,7.28a1.91,1.91,0,0,0-.72.72H11.72a1.91,1.91,0,0,0-.72-.72V15h1.28A2,2,0,1,0,15,12.28V11h3.28a1.91,1.91,0,0,0,.72.72Z"></path></g></svg>
//             </button>
//         </div>
        
//         <MapContainer
//           center={[center.lat, center.lng]}
//           zoom={8}
//           style={mapContainerStyle}
//           scrollWheelZoom={true}
//         >
//           <MapReadyHandler />
//           <TileLayer
//             key={mapType}
//             attribution={tileLayerAttribution}
//             url={tileLayerUrl}
//           />
//           <MapClickHandler />
//           {/* Render Device Trails (only for visible devices) */}
//           {showTails && devices
//             .filter((device) => visibleDevices.has(device.id))
//             .map((device) => {
//               if (device.tail && device.tail.length > 1) {
//                 const trailCoordinates = device.tail
//                   .map((point) => ({
//                     lat: parseFloat(point.lat),
//                     lng: parseFloat(point.lng),
//                   }))
//                   .filter((coord) => coord.lat !== 0 && coord.lng !== 0); // Filter out invalid coordinates
                
//                 if (trailCoordinates.length > 1) {
//                   // console.log(
//                   //   `Rendering trail for device ${device.id} (${device.name})`,
//                   //   trailCoordinates.length,
//                   //   "points"
//                   // );
                  
//                   const trailOptions = getTrailOptions(device);
//                   return (
//                     <Polyline
//                       key={`trail-${device.id}`}
//                       positions={trailCoordinates.map(c => [c.lat, c.lng] as [number, number])}
//                       pathOptions={trailOptions}
//                     />
//                   );
//                 }
//               }
//               return null;
//             })}

//           {/* Render Only Visible Device Markers (with clustering support) */}
//           {(() => {
//             const visibleDevicesList = devices.filter((device) => visibleDevices.has(device.id));
//             const clusters = clusterDevices(visibleDevicesList, map);
            
//             return clusters.map((cluster) => {
//               if (cluster.count === 1) {
//                 // Single device - render normally
//                 const device = cluster.devices[0];
//               // Skip devices with invalid coordinates
//                 if (
//                   !device.lat ||
//                   !device.lng ||
//                   device.lat === 0 ||
//                   device.lng === 0
//                 ) {
//                   // console.warn(
//                   //   `Skipping device ${device.id} - invalid coordinates:`,
//                   //   device.lat,
//                   //   device.lng
//                   // );
//                 return null;
//               }

//                 // console.log(
//                 //   `Rendering device ${device.id} (${device.name}) at`,
//                 //   device.lat,
//                 //   device.lng,
//                 //   "Online:",
//                 //   device.online
//                 // );
              
//               // Use animated position if available (marker is animating), otherwise use device position
//               const animatedPos = animatedPositions.get(device.id);
//               const markerPosition = animatedPos || { lat: device.lat, lng: device.lng };
              
//               // Get rotated icon based on course (if available)
//               const deviceIcon = device.course !== undefined && device.course !== null
//                 ? getVehicleIconWithRotation(device.course)
//                 : (vehicleIcon || getFallbackIcon());
              
//               // Check if device is moving and show white dot at target position (latest lat/lng it's animating towards)
//               const isMoving = device.online === "online";
//               // Target position is the device's current lat/lng (where it's animating to)
//               // Show white dot when device is moving, but only if target position is different from current marker position
//               const targetPos = isMoving && device.lat && device.lng 
//                 ? { lat: device.lat, lng: device.lng }
//                 : null;
//               // Only show white dot if target position is different from current marker position (to avoid overlap)
//               const targetPosition = targetPos && (
//                 Math.abs(targetPos.lat - markerPosition.lat) > 0.0001 || 
//                 Math.abs(targetPos.lng - markerPosition.lng) > 0.0001
//               ) ? targetPos : null;
              
//               const needsGeocoding = !device.state || !device.lga;
//               return (
//                 <>
//                   <Marker
//                     key={device.id}
//                     position={[markerPosition.lat, markerPosition.lng]}
//                     icon={deviceIcon}
//                     eventHandlers={{
//                       click: async () => {
//                         setOpenPopupDeviceId(device.id);
                        
//                         // If device needs geocoding, fetch it now
//                         if (needsGeocoding && device.lat && device.lng) {
//                           try {
//                             const location = await reverseGeocode(device.lat, device.lng);
                            
//                             // Update device in devices state
//                             setDevices((prevDevices) => {
//                               return prevDevices.map((d) => {
//                                 if (d.id === device.id) {
//                                   return {
//                                     ...d,
//                                     state: location.state,
//                                     lga: location.lga
//                                   };
//                                 }
//                                 return d;
//                               });
//                             });
//                           } catch (error) {
//                             console.warn(`Failed to geocode device ${device.id}:`, error);
//                           }
//                         }
//                       },
//                       add: (e) => {
//                         // Store marker instance for animation
//                         const marker = e.target as L.Marker;
//                         markerInstancesRef.current.set(device.id, marker);
//                         // Store initial position
//                         if (!previousPositionsRef.current.has(device.id)) {
//                           previousPositionsRef.current.set(device.id, { lat: device.lat, lng: device.lng });
//                         }
//                       },
//                     }}
//                   >
//                     <Popup>
//                       {generateInfoContent(device, needsGeocoding)}
//                     </Popup>
//                   </Marker>
//                 {/* White dot marker showing target position for moving tractors */}
//                 {targetPosition && (
//                   <Marker
//                     key={`target-${device.id}`}
//                     position={[targetPosition.lat, targetPosition.lng]}
//                     icon={L.divIcon({
//                       className: 'target-marker',
//                       html: '<div style="width: 12px; height: 12px; background-color: #FFFFFF; border: 1px solid #000000; border-radius: 50%;"></div>',
//                       iconSize: [12, 12],
//                       iconAnchor: [6, 6],
//                     })}
//                   >
//                     <Popup>
//                       Target position for {device.name}
//                     </Popup>
//                   </Marker>
//                 )}
//               </>
//               );
//               } else {
//                 // Cluster - render cluster marker
//                 const clusterSize = 10 + Math.min(cluster.count * 2, 20);
//                 return (
//                   <Marker
//                     key={`cluster-${cluster.center.lat}-${cluster.center.lng}`}
//                     position={[cluster.center.lat, cluster.center.lng]}
//                     icon={L.divIcon({
//                       className: 'cluster-marker',
//                       html: `<div style="
//                         width: ${clusterSize}px;
//                         height: ${clusterSize}px;
//                         background-color: #4285F4;
//                         border: 2px solid #FFFFFF;
//                         border-radius: 50%;
//                         display: flex;
//                         align-items: center;
//                         justify-content: center;
//                         color: #FFFFFF;
//                         font-weight: bold;
//                         font-size: 12px;
//                       ">${cluster.count}</div>`,
//                       iconSize: [clusterSize, clusterSize],
//                       iconAnchor: [clusterSize / 2, clusterSize / 2],
//                     })}
//                     eventHandlers={{
//                       click: () => {
//                         if (map) {
//                           // Zoom in on cluster
//                           map.setView([cluster.center.lat, cluster.center.lng], (map.getZoom() || 8) + 2);
//                         }
//                       },
//                     }}
//                   >
//                     <Popup>
//                       {cluster.count} devices
//                     </Popup>
//                   </Marker>
//                 );
//               }
//             });
//           })()}

//           {/* Render Selected History Trail */}
//           {selectedHistoryTrail && selectedHistoryTrail.length > 1 && (
//             <Polyline
//               positions={selectedHistoryTrail.map((point) => [point.lat, point.lng] as [number, number])}
//               pathOptions={{
//                 color: "#FF6B35",
//                 weight: 4,
//                 opacity: 1.0,
//               }}
//             />
//           )}

//           {/* Render History Trail Markers */}
//           {selectedHistoryTrail &&
//             selectedHistoryTrail.map((point, index) => (
//               <Marker
//                 key={`history-${point.id}`}
//                 position={[point.lat, point.lng]}
//                 icon={L.divIcon({
//                   className: 'history-marker',
//                   html: `<div style="
//                     width: 8px;
//                     height: 8px;
//                     background-color: ${point.valid ? "#FF6B35" : "#999999"};
//                     border: 2px solid #FFFFFF;
//                     border-radius: 50%;
//                   "></div>`,
//                   iconSize: [8, 8],
//                   iconAnchor: [4, 4],
//                 })}
//               >
//                 <Popup>
//                   History Point {index + 1}<br/>
//                   Time: {point.time}<br/>
//                   Speed: {point.speed} km/h<br/>
//                   Valid: {point.valid ? "Yes" : "No"}
//                 </Popup>
//               </Marker>
//             ))}

//           {/* Render Drawing Visualization */}
//           {isDrawingMode && drawnCenter && (
//             <Marker
//               position={[drawnCenter.lat, drawnCenter.lng]}
//               icon={L.divIcon({
//                 className: 'drawing-center',
//                 html: '<div style="width: 12px; height: 12px; background-color: #007bff; border: 2px solid #FFFFFF; border-radius: 50%;"></div>',
//                 iconSize: [12, 12],
//                 iconAnchor: [6, 6],
//               })}
//             >
//               <Popup>Circle Center</Popup>
//             </Marker>
//           )}

//           {isDrawingMode && drawnCenter && drawnRadius && (
//             <Circle
//               center={[drawnCenter.lat, drawnCenter.lng]}
//               radius={drawnRadius}
//               pathOptions={{
//                 color: "#007bff",
//                 fillColor: "#007bff",
//                 fillOpacity: 0.2,
//                 weight: 2,
//                 opacity: 0.8,
//               }}
//             />
//           )}

//           {isDrawingMode && drawnCoordinates.length > 0 && (
//             <Polygon
//               positions={drawnCoordinates.map(c => [c.lat, c.lng] as [number, number])}
//               pathOptions={{
//                 color: "#007bff",
//                 fillColor: "#007bff",
//                 fillOpacity: 0.2,
//                 weight: 2,
//                 opacity: 0.8,
//               }}
//             />
//           )}

//           {isDrawingMode &&
//             drawnCoordinates.map((coord, index) => (
//               <Marker
//                 key={`drawing-${index}`}
//                 position={[coord.lat, coord.lng]}
//                 icon={L.divIcon({
//                   className: 'drawing-point',
//                   html: '<div style="width: 8px; height: 8px; background-color: #007bff; border: 2px solid #FFFFFF; border-radius: 50%;"></div>',
//                   iconSize: [8, 8],
//                   iconAnchor: [4, 4],
//                 })}
//               >
//                 <Popup>Point {index + 1}</Popup>
//               </Marker>
//             ))}

//           {/* Render Active Geofences */}
//           {showGeofences && geofences.map((geofence) => {
//             if (geofence.type === "polygon" && geofence.coordinates) {
//               const coordinates = parseCoordinates(geofence.coordinates);
//               if (coordinates.length > 2) {
//                 return (
//                   <Polygon
//                     key={geofence.id}
//                     positions={coordinates.map(c => [c.lat, c.lng] as [number, number])}
//                     pathOptions={getPolygonOptions(geofence)}
//                   />
//                 );
//               }
//             } else if (geofence.type === "circle" && geofence.radius > 0) {
//               return (
//                 <Circle
//                   key={geofence.id}
//                   center={[geofence.center.lat, geofence.center.lng]}
//                   radius={geofence.radius}
//                   pathOptions={circleOptions}
//                 />
//               );
//             }
//             return null;
//           })}
//         </MapContainer>
//       </div>

//         {/* Bottom Info Panel - temporarily disabled (was breaking build parsing) */}
//         {selectedDeviceId && null}
//       </div>
//     </div>
//   );
// };

// export default VehicleTrackingMap;
