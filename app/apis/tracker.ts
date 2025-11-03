import axios from "axios";

const baseUrl =
  "https://stoplight.io/mocks/gpswox/tracking-software/271970092/get_devices?lang=en&user_api_hash=%242y%2410%245RACGMNxUdz3h1ug9yAttu95U2acugM0YG1K5wx01ZrNMvpL6BWMS";

// Interface for creating new geofences
interface CreateGeoFenceData {
  name: string;
  type: "circle" | "polygon";
  coordinates?: string; // JSON string for polygon coordinates
  center?: { lat: number; lng: number }; // For circle type
  radius?: number; // For circle type
  polygon_color: string;
  device_id?: number;
  group_id?: number;
  speed_limit?: number;
  active?: number; // 1 for active, 0 for inactive
}

export const getTrackedTractors = async () => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_TRACKING_BASE_URL}/get_devices?lang=${process.env.NEXT_PUBLIC_TRACKING_LANG}&user_api_hash=$2y$10$0.AGeFFO5v59EyjbccSr2eObg9AxZn5U4N/V8z9qWtQBcuFDJw3um`
    // config
  );

  return res;
};

export const createAlert = async (
  name: string,
  devices: Array<number>,
  geofences: Array<number>
) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_TRACKING_BASE_URL}/add_alert?lang=${process.env.NEXT_PUBLIC_TRACKING_LANG}&user_api_hash=$2y$10$0.AGeFFO5v59EyjbccSr2eObg9AxZn5U4N/V8z9qWtQBcuFDJw3um`,
    {
      name,
      devices,
      notifications: {
        email: {
          active: 0,
          input: "Israel.olatunde@tractrac.co",
        },
      },
      type: "geofence_inout",
      geofences
    }
    // config
  );

  return res;
};

export const getAlerts = async () => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_TRACKING_BASE_URL}/get_alerts?lang=${process.env.NEXT_PUBLIC_TRACKING_LANG}&user_api_hash=$2y$10$0.AGeFFO5v59EyjbccSr2eObg9AxZn5U4N/V8z9qWtQBcuFDJw3um`,
    // config
  );

  return res;

  // sample response
//   {
//     "status": 1,
//     "items": {
//         "alerts": [
//             {
//                 "id": 37,
//                 "user_id": 1792,
//                 "active": 1,
//                 "name": "Device 3936 alert for Alert Geofence",
//                 "type": "geofence_inout",
//                 "for_all_user_devices": 0,
//                 "schedules": null,
//                 "notifications": {
//                     "email": {
//                         "active": 0,
//                         "input": "Israel.olatunde@tractrac.co"
//                     }
//                 },
//                 "created_at": "2025-09-09 12:37:29",
//                 "updated_at": "2025-09-09 12:37:29",
//                 "zone": 0,
//                 "schedule": 0,
//                 "command": null,
//                 "devices": [
//                     3936
//                 ],
//                 "drivers": [],
//                 "geofences": [
//                     52
//                 ],
//                 "events_custom": []
//             },
//             {
//                 "id": 38,
//                 "user_id": 1792,
//                 "active": 1,
//                 "name": "Device 3936 alert for Geofence for tractors",
//                 "type": "geofence_inout",
//                 "for_all_user_devices": 0,
//                 "schedules": null,
//                 "notifications": {
//                     "email": {
//                         "active": 0,
//                         "input": "saleemjibril5@gmail.com"
//                     }
//                 },
//                 "created_at": "2025-09-09 12:39:31",
//                 "updated_at": "2025-09-09 12:39:31",
//                 "zone": 0,
//                 "schedule": 0,
//                 "command": null,
//                 "devices": [
//                     3936
//                 ],
//                 "drivers": [],
//                 "geofences": [
//                     54
//                 ],
//                 "events_custom": []
//             }
//         ]
//     }
// }
};

export const getAlertById = async (alertId: number) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_TRACKING_BASE_URL}/edit_alert_data?lang=${process.env.NEXT_PUBLIC_TRACKING_LANG}&user_api_hash=$2y$10$0.AGeFFO5v59EyjbccSr2eObg9AxZn5U4N/V8z9qWtQBcuFDJw3um`,
    // config
  );

  return res;

  // sample response
//   {
//     "item": {
//         "id": 37,
//         "user_id": 1792,
//         "active": 1,
//         "name": "Device 3936 alert for Alert Geofence",
//         "type": "geofence_inout",
//         "for_all_user_devices": 0,
//         "schedules": null,
//         "notifications": {
//             "email": {
//                 "active": 0,
//                 "input": "Israel.olatunde@tractrac.co"
//             }
//         },
//         "created_at": "2025-09-09 12:37:29",
//         "updated_at": "2025-09-09 12:37:29",
//         "zone": 0,
//         "schedule": 0,
//         "command": null,
//         "user": {
//             "id": 1792,
//             "active": 1,
//             "group_id": 2,
//             "manager_id": null,
//             "billing_plan_id": null,
//             "map_id": 3,
//             "devices_limit": null,
//             "email": "Israel.olatunde@tractrac.co",
//             "phone_number": "",
//             "subscription_expiration": "0000-00-00 00:00:00",
//             "loged_at": "2025-09-09 12:40:37",
//             "api_hash_expire": null,
//             "available_maps": [
//                 "9",
//                 "7",
//                 "8",
//                 "3",
//                 "1",
//                 "4",
//                 "5",
//                 "2"
//             ],
//             "sms_gateway_app_date": "0000-00-00 00:00:00",
//             "sms_gateway_params": {
//                 "request_method": "get",
//                 "authentication": "0",
//                 "username": "fastanet7@gmail.com",
//                 "password": "hadujpiESI03x@33",
//                 "encoding": "0",
//                 "auth_id": "",
//                 "auth_token": "",
//                 "senders_phone": "",
//                 "custom_headers": ""
//             },
//             "ungrouped_open": {
//                 "geofence_group": 1,
//                 "device_group": 1,
//                 "poi_group": 1,
//                 "route_group": 1
//             },
//             "week_start_day": 1,
//             "top_toolbar_open": 1,
//             "map_controls": {
//                 "history_control_route": 1,
//                 "history_control_stops": 1,
//                 "m_objects_cluster": 1,
//                 "m_objects": 1,
//                 "m_routes": 1,
//                 "m_geofences": 1,
//                 "m_traffic": 1,
//                 "m_poi": 1,
//                 "m_show_names": 1,
//                 "m_show_tails": 1
//             },
//             "created_at": "2025-05-28 11:05:37",
//             "updated_at": "2025-09-09 12:40:37",
//             "unit_of_altitude": "mt",
//             "lang": "uk",
//             "unit_of_distance": "km",
//             "unit_of_capacity": "lt",
//             "date_format": null,
//             "time_format": null,
//             "duration_format": "standart",
//             "timezone_id": 61,
//             "sms_gateway": 0,
//             "sms_gateway_url": "",
//             "settings": {
//                 "listview": {
//                     "columns": [
//                         {
//                             "field": "name",
//                             "class": "device"
//                         },
//                         {
//                             "field": "status",
//                             "class": "device"
//                         },
//                         {
//                             "field": "time",
//                             "class": "device"
//                         },
//                         {
//                             "field": "position",
//                             "class": "device"
//                         }
//                     ],
//                     "groupby": "protocol"
//                 },
//                 "widgets": {
//                     "status": "1",
//                     "list": [
//                         "device",
//                         "sensors",
//                         "services",
//                         "camera",
//                         "location",
//                         "image",
//                         "gprs_command",
//                         "recent_events"
//                     ]
//                 },
//                 "dashboard": {
//                     "enabled": "1",
//                     "blocks": {
//                         "device_activity": {
//                             "enabled": "1"
//                         },
//                         "latest_events": {
//                             "enabled": "1"
//                         },
//                         "device_status_counts": {
//                             "enabled": "1"
//                         },
//                         "latest_tasks": {
//                             "enabled": "1"
//                         },
//                         "device_distance": {
//                             "enabled": "1"
//                         },
//                         "device_overview": {
//                             "enabled": "1"
//                         }
//                     }
//                 }
//             },
//             "login_periods": null,
//             "email_verified_at": "2025-05-28 11:05:37",
//             "phone_verified_at": "2025-08-05 14:02:15",
//             "client_id": 1793,
//             "company_id": null,
//             "only_one_session": 0,
//             "role_id": 2
//         },
//         "drivers": [],
//         "geofences": [
//             {
//                 "id": 52,
//                 "user_id": 1792,
//                 "group_id": 0,
//                 "active": 1,
//                 "name": "Alert Geofence",
//                 "coordinates": "[{\"lat\":8.882624118588891,\"lng\":7.790557717582711},{\"lat\":8.882669169276017,\"lng\":7.790614043972024},{\"lat\":8.88252076699165,\"lng\":7.790772294303903},{\"lat\":8.882435965659317,\"lng\":7.790713285705575},{\"lat\":8.882552567486204,\"lng\":7.790560399791726},{\"lat\":8.88258436797801,\"lng\":7.790530895492562}]",
//                 "polygon_color": "#00ff00",
//                 "created_at": "2025-09-09 12:37:28",
//                 "updated_at": "2025-09-09 12:37:28",
//                 "type": "polygon",
//                 "radius": 0,
//                 "center": {
//                     "lat": 0,
//                     "lng": 0
//                 },
//                 "device_id": 3936,
//                 "speed_limit": 0,
//                 "diem_rate_id": null,
//                 "additional": null,
//                 "pivot": {
//                     "alert_id": 37,
//                     "geofence_id": 52
//                 }
//             }
//         ],
//         "events_custom": [],
//         "pois": [],
//         "devices": [
//             {
//                 "id": 3936,
//                 "user_id": null,
//                 "current_driver_id": null,
//                 "current_driver_rfid": null,
//                 "timezone_id": null,
//                 "traccar_device_id": 3926,
//                 "icon_id": 0,
//                 "model_id": null,
//                 "icon_colors": {
//                     "moving": "green",
//                     "stopped": "yellow",
//                     "offline": "red",
//                     "engine": "yellow",
//                     "blocked": "black"
//                 },
//                 "active": 1,
//                 "kind": 0,
//                 "deleted": 0,
//                 "name": "Tractrac 1",
//                 "imei": "353691849033377",
//                 "fuel_measurement_id": 1,
//                 "fuel_quantity": "0.00",
//                 "fuel_price": "0.00",
//                 "fuel_per_km": "0.0000",
//                 "fuel_per_h": "0.0000",
//                 "sim_number": "09061954274",
//                 "msisdn": "",
//                 "device_model": "FMB130",
//                 "plate_number": "",
//                 "vin": "",
//                 "registration_number": "",
//                 "object_owner": "",
//                 "additional_notes": "",
//                 "authentication": "",
//                 "comment": "",
//                 "expiration_date": "2026-05-27 06:35:00",
//                 "sim_expiration_date": "0000-00-00",
//                 "sim_activation_date": "0000-00-00",
//                 "installation_date": "0000-00-00",
//                 "tail_color": "#33cc33",
//                 "tail_length": 5,
//                 "engine_hours": "gps",
//                 "detect_engine": "gps",
//                 "detect_speed": "gps",
//                 "detect_distance": null,
//                 "min_moving_speed": 6,
//                 "min_fuel_fillings": 10,
//                 "min_fuel_thefts": 10,
//                 "snap_to_road": 0,
//                 "gprs_templates_only": 0,
//                 "valid_by_avg_speed": 1,
//                 "max_speed": null,
//                 "parameters": "[\"priority\",\"sat\",\"event\",\"ignition\",\"motion\",\"rssi\",\"io200\",\"io69\",\"pdop\",\"hdop\",\"power\",\"battery\",\"io68\",\"io270\",\"io273\",\"operator\",\"io16\",\"combinedfuel\",\"blecombinedfuel\",\"sequence\",\"distance\",\"totaldistance\",\"valid\",\"enginehours\",\"accuracy\"]",
//                 "currents": null,
//                 "created_at": "2025-05-27 22:16:39",
//                 "updated_at": "2025-09-02 14:43:32",
//                 "forward": null,
//                 "device_type_id": null,
//                 "app_tracker_login": 0,
//                 "fuel_detect_sec_after_stop": 0,
//                 "lbs": 0,
//                 "fuel_type": "",
//                 "fuel_emissions": 0,
//                 "custom_data": null,
//                 "pivot": {
//                     "alert_id": 37,
//                     "device_id": 3936,
//                     "started_at": null,
//                     "fired_at": null,
//                     "silenced_at": null,
//                     "active_from": null,
//                     "active_to": null
//                 }
//             }
//         ]
//     },
//     "devices": [
//         {
//             "id": 3936,
//             "value": "Tractrac 1",
//             "title": "Tractrac 1"
//         }
//     ],
//     "geofences": [
//         {
//             "id": 51,
//             "value": "Alert geofence",
//             "title": "Alert geofence"
//         },
//         {
//             "id": 52,
//             "value": "Alert Geofence",
//             "title": "Alert Geofence"
//         },
//         {
//             "id": 53,
//             "value": "another geofence",
//             "title": "another geofence"
//         },
//         {
//             "id": 26,
//             "value": "Fence 2",
//             "title": "Fence 2"
//         },
//         {
//             "id": 27,
//             "value": "Fence 3",
//             "title": "Fence 3"
//         },
//         {
//             "id": 49,
//             "value": "Fence 4",
//             "title": "Fence 4"
//         },
//         {
//             "id": 25,
//             "value": "Fence1",
//             "title": "Fence1"
//         },
//         {
//             "id": 54,
//             "value": "Geofence for tractors",
//             "title": "Geofence for tractors"
//         },
//         {
//             "id": 50,
//             "value": "Zaria geofence",
//             "title": "Zaria geofence"
//         }
//     ],
//     "types": [
//         {
//             "type": "overspeed",
//             "title": "Overspeed",
//             "attributes": [
//                 {
//                     "name": "overspeed",
//                     "html_name": "overspeed",
//                     "title": "Overspeed (kph)",
//                     "type": "integer",
//                     "default": 0,
//                     "description": "",
//                     "validation": "",
//                     "required": false
//                 }
//             ]
//         },
//         {
//             "type": "stop_duration",
//             "title": "Stop duration",
//             "attributes": [
//                 {
//                     "name": "stop_duration",
//                     "html_name": "stop_duration",
//                     "title": "Stop duration longer than (minutes)",
//                     "type": "integer",
//                     "default": 0,
//                     "description": "",
//                     "validation": "",
//                     "required": false
//                 }
//             ]
//         },
//         {
//             "type": "offline_duration",
//             "title": "Offline duration",
//             "attributes": [
//                 {
//                     "name": "offline_duration",
//                     "html_name": "offline_duration",
//                     "title": "Offline duration longer than (minutes)",
//                     "type": "integer",
//                     "default": 0,
//                     "description": "",
//                     "validation": "",
//                     "required": false
//                 }
//             ]
//         },
//         {
//             "type": "move_duration",
//             "title": "Move duration",
//             "attributes": [
//                 {
//                     "name": "move_duration",
//                     "html_name": "move_duration",
//                     "title": "Move duration longer than (minutes)",
//                     "type": "integer",
//                     "default": 0,
//                     "description": "",
//                     "validation": "",
//                     "required": false
//                 },
//                 {
//                     "name": "min_parking_duration",
//                     "html_name": "min_parking_duration",
//                     "title": "Minimal parking duration (minutes)",
//                     "type": "integer",
//                     "default": 0,
//                     "description": "",
//                     "validation": "",
//                     "required": false
//                 }
//             ]
//         },
//         {
//             "type": "ignition_duration",
//             "title": "Ignition duration",
//             "attributes": [
//                 {
//                     "name": "ignition_duration",
//                     "html_name": "ignition_duration",
//                     "title": "Ignition duration longer than (minutes)",
//                     "type": "integer",
//                     "default": 0,
//                     "description": "",
//                     "validation": "",
//                     "required": false
//                 }
//             ]
//         },
//         {
//             "type": "idle_duration",
//             "title": "Idle duration",
//             "attributes": [
//                 {
//                     "name": "idle_duration",
//                     "html_name": "idle_duration",
//                     "title": "Idle duration longer than (minutes)",
//                     "type": "integer",
//                     "default": 0,
//                     "description": "",
//                     "validation": "",
//                     "required": false
//                 }
//             ]
//         },
//         {
//             "type": "ignition",
//             "title": "Ignition ON/OFF",
//             "attributes": [
//                 {
//                     "name": "state",
//                     "html_name": "state",
//                     "title": "State",
//                     "type": "select",
//                     "default": null,
//                     "description": "",
//                     "validation": "",
//                     "required": false,
//                     "options": [
//                         {
//                             "id": 0,
//                             "title": "All"
//                         },
//                         {
//                             "id": 1,
//                             "title": "On"
//                         },
//                         {
//                             "id": 2,
//                             "title": "Off"
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "type": "move_start",
//             "title": "Start of movement",
//             "attributes": [
//                 {
//                     "name": "stop_duration",
//                     "html_name": "stop_duration",
//                     "title": "Stop duration longer than (minutes)",
//                     "type": "integer",
//                     "default": 0,
//                     "description": "",
//                     "validation": "",
//                     "required": false
//                 }
//             ]
//         },
//         {
//             "type": "driver",
//             "title": "Driver change",
//             "attributes": [
//                 {
//                     "name": "drivers",
//                     "html_name": "drivers[]",
//                     "title": "Drivers",
//                     "type": "multiselect",
//                     "default": [],
//                     "description": "",
//                     "validation": "",
//                     "required": false,
//                     "options": []
//                 }
//             ]
//         },
//         {
//             "type": "driver_unauthorized",
//             "title": "Driver change authorization",
//             "attributes": [
//                 {
//                     "name": "authorized",
//                     "html_name": "authorized",
//                     "title": "Authorized",
//                     "type": "select",
//                     "default": 0,
//                     "description": "",
//                     "validation": "",
//                     "required": false,
//                     "options": [
//                         {
//                             "id": 0,
//                             "title": "No"
//                         },
//                         {
//                             "id": 1,
//                             "title": "Yes"
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "type": "geofence_in",
//             "title": "Geofence In",
//             "attributes": [
//                 {
//                     "name": "geofences",
//                     "html_name": "geofences[]",
//                     "title": "Geofences",
//                     "type": "multiselect",
//                     "default": [
//                         52
//                     ],
//                     "description": "",
//                     "validation": "",
//                     "required": false,
//                     "options": [
//                         {
//                             "id": 51,
//                             "title": "Alert geofence"
//                         },
//                         {
//                             "id": 52,
//                             "title": "Alert Geofence"
//                         },
//                         {
//                             "id": 53,
//                             "title": "another geofence"
//                         },
//                         {
//                             "id": 26,
//                             "title": "Fence 2"
//                         },
//                         {
//                             "id": 27,
//                             "title": "Fence 3"
//                         },
//                         {
//                             "id": 49,
//                             "title": "Fence 4"
//                         },
//                         {
//                             "id": 25,
//                             "title": "Fence1"
//                         },
//                         {
//                             "id": 54,
//                             "title": "Geofence for tractors"
//                         },
//                         {
//                             "id": 50,
//                             "title": "Zaria geofence"
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "type": "geofence_out",
//             "title": "Geofence Out",
//             "attributes": [
//                 {
//                     "name": "geofences",
//                     "html_name": "geofences[]",
//                     "title": "Geofences",
//                     "type": "multiselect",
//                     "default": [
//                         52
//                     ],
//                     "description": "",
//                     "validation": "",
//                     "required": false,
//                     "options": [
//                         {
//                             "id": 51,
//                             "title": "Alert geofence"
//                         },
//                         {
//                             "id": 52,
//                             "title": "Alert Geofence"
//                         },
//                         {
//                             "id": 53,
//                             "title": "another geofence"
//                         },
//                         {
//                             "id": 26,
//                             "title": "Fence 2"
//                         },
//                         {
//                             "id": 27,
//                             "title": "Fence 3"
//                         },
//                         {
//                             "id": 49,
//                             "title": "Fence 4"
//                         },
//                         {
//                             "id": 25,
//                             "title": "Fence1"
//                         },
//                         {
//                             "id": 54,
//                             "title": "Geofence for tractors"
//                         },
//                         {
//                             "id": 50,
//                             "title": "Zaria geofence"
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "type": "geofence_inout",
//             "title": "Geofence In/Out",
//             "attributes": [
//                 {
//                     "name": "geofences",
//                     "html_name": "geofences[]",
//                     "title": "Geofences",
//                     "type": "multiselect",
//                     "default": [
//                         52
//                     ],
//                     "description": "",
//                     "validation": "",
//                     "required": false,
//                     "options": [
//                         {
//                             "id": 51,
//                             "title": "Alert geofence"
//                         },
//                         {
//                             "id": 52,
//                             "title": "Alert Geofence"
//                         },
//                         {
//                             "id": 53,
//                             "title": "another geofence"
//                         },
//                         {
//                             "id": 26,
//                             "title": "Fence 2"
//                         },
//                         {
//                             "id": 27,
//                             "title": "Fence 3"
//                         },
//                         {
//                             "id": 49,
//                             "title": "Fence 4"
//                         },
//                         {
//                             "id": 25,
//                             "title": "Fence1"
//                         },
//                         {
//                             "id": 54,
//                             "title": "Geofence for tractors"
//                         },
//                         {
//                             "id": 50,
//                             "title": "Zaria geofence"
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "type": "custom",
//             "title": "Custom events",
//             "attributes": [
//                 {
//                     "name": "events_custom",
//                     "html_name": "events_custom[]",
//                     "title": "Event",
//                     "type": "multiselect",
//                     "default": [],
//                     "description": "Custom events can be defined at Setup->Events tab.",
//                     "validation": "",
//                     "required": false,
//                     "options": [
//                         {
//                             "id": 0,
//                             "title": []
//                         },
//                         {
//                             "id": 1,
//                             "title": []
//                         }
//                     ]
//                 },
//                 {
//                     "name": "continuous_duration",
//                     "html_name": "continuous_duration",
//                     "title": "Continuous duration(s)",
//                     "type": "integer",
//                     "default": 0,
//                     "description": "",
//                     "validation": "",
//                     "required": false
//                 }
//             ]
//         },
//         {
//             "type": "sos",
//             "title": "SOS"
//         },
//         {
//             "type": "fuel_change",
//             "title": "Fuel (Fill/Theft)",
//             "attributes": [
//                 {
//                     "name": "state",
//                     "html_name": "state",
//                     "title": "State",
//                     "type": "select",
//                     "default": null,
//                     "description": "",
//                     "validation": "",
//                     "required": false,
//                     "options": [
//                         {
//                             "id": 0,
//                             "title": "Fill/Theft"
//                         },
//                         {
//                             "id": 1,
//                             "title": "Fill"
//                         },
//                         {
//                             "id": 2,
//                             "title": "Theft"
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "type": "distance",
//             "title": "Distance",
//             "attributes": [
//                 {
//                     "name": "distance",
//                     "html_name": "distance",
//                     "title": "Distance limit(Km)",
//                     "type": "integer",
//                     "default": 0,
//                     "description": "",
//                     "validation": "",
//                     "required": false
//                 },
//                 {
//                     "name": "period",
//                     "html_name": "period",
//                     "title": "Period(Days)",
//                     "type": "integer",
//                     "default": 0,
//                     "description": "",
//                     "validation": "",
//                     "required": false
//                 }
//             ]
//         },
//         {
//             "type": "poi_stop_duration",
//             "title": "POI - Stop duration",
//             "attributes": [
//                 {
//                     "name": "stop_duration",
//                     "html_name": "stop_duration",
//                     "title": "Stop duration longer than (minutes)",
//                     "type": "integer",
//                     "default": 0,
//                     "description": "",
//                     "validation": "",
//                     "required": false
//                 },
//                 {
//                     "name": "distance_tolerance",
//                     "html_name": "distance_tolerance",
//                     "title": "Distance tolerance (m)",
//                     "type": "integer",
//                     "default": 0,
//                     "description": "",
//                     "validation": "",
//                     "required": false
//                 },
//                 {
//                     "name": "pois",
//                     "html_name": "pois[]",
//                     "title": "POIs",
//                     "type": "multiselect",
//                     "default": [],
//                     "description": "",
//                     "validation": "",
//                     "required": false,
//                     "options": []
//                 }
//             ]
//         },
//         {
//             "type": "poi_idle_duration",
//             "title": "POI - Idle duration",
//             "attributes": [
//                 {
//                     "name": "idle_duration",
//                     "html_name": "idle_duration",
//                     "title": "Idle duration longer than (minutes)",
//                     "type": "integer",
//                     "default": 0,
//                     "description": "",
//                     "validation": "",
//                     "required": false
//                 },
//                 {
//                     "name": "distance_tolerance",
//                     "html_name": "distance_tolerance",
//                     "title": "Distance tolerance (m)",
//                     "type": "integer",
//                     "default": 0,
//                     "description": "",
//                     "validation": "",
//                     "required": false
//                 },
//                 {
//                     "name": "pois",
//                     "html_name": "pois[]",
//                     "title": "POIs",
//                     "type": "multiselect",
//                     "default": [],
//                     "description": "",
//                     "validation": "",
//                     "required": false,
//                     "options": []
//                 }
//             ]
//         },
//         {
//             "type": "task_status",
//             "title": "Task status",
//             "attributes": [
//                 {
//                     "name": "statuses",
//                     "html_name": "statuses[]",
//                     "title": "Statuses",
//                     "type": "multiselect",
//                     "default": [],
//                     "description": "",
//                     "validation": "",
//                     "required": false,
//                     "options": [
//                         {
//                             "id": 1,
//                             "title": "Task new"
//                         },
//                         {
//                             "id": 2,
//                             "title": "Task in progress"
//                         },
//                         {
//                             "id": 9,
//                             "title": "Task completed"
//                         },
//                         {
//                             "id": 3,
//                             "title": "Task failed"
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "type": "device_expiration",
//             "title": "Device expiration",
//             "attributes": [
//                 {
//                     "name": "case",
//                     "html_name": "case",
//                     "title": "Case",
//                     "type": "select",
//                     "default": "",
//                     "description": "",
//                     "validation": "",
//                     "required": false,
//                     "options": [
//                         {
//                             "id": "expired_device",
//                             "title": "Expired"
//                         },
//                         {
//                             "id": "expiring_device",
//                             "title": "Expiring"
//                         },
//                         {
//                             "id": "expired_sim",
//                             "title": "SIM expired"
//                         },
//                         {
//                             "id": "expiring_sim",
//                             "title": "SIM expiring"
//                         }
//                     ]
//                 },
//                 {
//                     "name": "days",
//                     "html_name": "days",
//                     "title": "Days",
//                     "type": "integer",
//                     "default": 0,
//                     "description": "",
//                     "validation": "",
//                     "required": false
//                 }
//             ]
//         }
//     ],
//     "schedules": [
//         {
//             "id": "monday",
//             "title": "Monday",
//             "items": [
//                 {
//                     "id": "00:00",
//                     "title": "00:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "00:15",
//                     "title": "00:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "00:30",
//                     "title": "00:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "00:45",
//                     "title": "00:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:00",
//                     "title": "01:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "01:15",
//                     "title": "01:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:30",
//                     "title": "01:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:45",
//                     "title": "01:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:00",
//                     "title": "02:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "02:15",
//                     "title": "02:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:30",
//                     "title": "02:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:45",
//                     "title": "02:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:00",
//                     "title": "03:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "03:15",
//                     "title": "03:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:30",
//                     "title": "03:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:45",
//                     "title": "03:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:00",
//                     "title": "04:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "04:15",
//                     "title": "04:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:30",
//                     "title": "04:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:45",
//                     "title": "04:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:00",
//                     "title": "05:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "05:15",
//                     "title": "05:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:30",
//                     "title": "05:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:45",
//                     "title": "05:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:00",
//                     "title": "06:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "06:15",
//                     "title": "06:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:30",
//                     "title": "06:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:45",
//                     "title": "06:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:00",
//                     "title": "07:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "07:15",
//                     "title": "07:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:30",
//                     "title": "07:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:45",
//                     "title": "07:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:00",
//                     "title": "08:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "08:15",
//                     "title": "08:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:30",
//                     "title": "08:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:45",
//                     "title": "08:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:00",
//                     "title": "09:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "09:15",
//                     "title": "09:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:30",
//                     "title": "09:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:45",
//                     "title": "09:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:00",
//                     "title": "10:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "10:15",
//                     "title": "10:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:30",
//                     "title": "10:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:45",
//                     "title": "10:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:00",
//                     "title": "11:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "11:15",
//                     "title": "11:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:30",
//                     "title": "11:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:45",
//                     "title": "11:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:00",
//                     "title": "12:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "12:15",
//                     "title": "12:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:30",
//                     "title": "12:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:45",
//                     "title": "12:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:00",
//                     "title": "13:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "13:15",
//                     "title": "13:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:30",
//                     "title": "13:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:45",
//                     "title": "13:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:00",
//                     "title": "14:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "14:15",
//                     "title": "14:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:30",
//                     "title": "14:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:45",
//                     "title": "14:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:00",
//                     "title": "15:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "15:15",
//                     "title": "15:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:30",
//                     "title": "15:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:45",
//                     "title": "15:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:00",
//                     "title": "16:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "16:15",
//                     "title": "16:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:30",
//                     "title": "16:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:45",
//                     "title": "16:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:00",
//                     "title": "17:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "17:15",
//                     "title": "17:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:30",
//                     "title": "17:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:45",
//                     "title": "17:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:00",
//                     "title": "18:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "18:15",
//                     "title": "18:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:30",
//                     "title": "18:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:45",
//                     "title": "18:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:00",
//                     "title": "19:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "19:15",
//                     "title": "19:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:30",
//                     "title": "19:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:45",
//                     "title": "19:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:00",
//                     "title": "20:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "20:15",
//                     "title": "20:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:30",
//                     "title": "20:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:45",
//                     "title": "20:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:00",
//                     "title": "21:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "21:15",
//                     "title": "21:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:30",
//                     "title": "21:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:45",
//                     "title": "21:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:00",
//                     "title": "22:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "22:15",
//                     "title": "22:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:30",
//                     "title": "22:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:45",
//                     "title": "22:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:00",
//                     "title": "23:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "23:15",
//                     "title": "23:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:30",
//                     "title": "23:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:45",
//                     "title": "23:45",
//                     "active": false,
//                     "class": ""
//                 }
//             ]
//         },
//         {
//             "id": "tuesday",
//             "title": "Tuesday",
//             "items": [
//                 {
//                     "id": "00:00",
//                     "title": "00:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "00:15",
//                     "title": "00:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "00:30",
//                     "title": "00:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "00:45",
//                     "title": "00:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:00",
//                     "title": "01:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "01:15",
//                     "title": "01:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:30",
//                     "title": "01:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:45",
//                     "title": "01:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:00",
//                     "title": "02:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "02:15",
//                     "title": "02:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:30",
//                     "title": "02:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:45",
//                     "title": "02:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:00",
//                     "title": "03:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "03:15",
//                     "title": "03:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:30",
//                     "title": "03:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:45",
//                     "title": "03:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:00",
//                     "title": "04:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "04:15",
//                     "title": "04:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:30",
//                     "title": "04:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:45",
//                     "title": "04:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:00",
//                     "title": "05:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "05:15",
//                     "title": "05:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:30",
//                     "title": "05:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:45",
//                     "title": "05:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:00",
//                     "title": "06:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "06:15",
//                     "title": "06:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:30",
//                     "title": "06:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:45",
//                     "title": "06:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:00",
//                     "title": "07:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "07:15",
//                     "title": "07:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:30",
//                     "title": "07:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:45",
//                     "title": "07:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:00",
//                     "title": "08:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "08:15",
//                     "title": "08:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:30",
//                     "title": "08:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:45",
//                     "title": "08:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:00",
//                     "title": "09:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "09:15",
//                     "title": "09:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:30",
//                     "title": "09:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:45",
//                     "title": "09:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:00",
//                     "title": "10:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "10:15",
//                     "title": "10:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:30",
//                     "title": "10:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:45",
//                     "title": "10:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:00",
//                     "title": "11:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "11:15",
//                     "title": "11:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:30",
//                     "title": "11:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:45",
//                     "title": "11:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:00",
//                     "title": "12:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "12:15",
//                     "title": "12:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:30",
//                     "title": "12:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:45",
//                     "title": "12:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:00",
//                     "title": "13:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "13:15",
//                     "title": "13:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:30",
//                     "title": "13:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:45",
//                     "title": "13:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:00",
//                     "title": "14:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "14:15",
//                     "title": "14:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:30",
//                     "title": "14:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:45",
//                     "title": "14:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:00",
//                     "title": "15:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "15:15",
//                     "title": "15:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:30",
//                     "title": "15:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:45",
//                     "title": "15:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:00",
//                     "title": "16:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "16:15",
//                     "title": "16:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:30",
//                     "title": "16:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:45",
//                     "title": "16:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:00",
//                     "title": "17:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "17:15",
//                     "title": "17:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:30",
//                     "title": "17:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:45",
//                     "title": "17:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:00",
//                     "title": "18:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "18:15",
//                     "title": "18:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:30",
//                     "title": "18:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:45",
//                     "title": "18:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:00",
//                     "title": "19:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "19:15",
//                     "title": "19:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:30",
//                     "title": "19:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:45",
//                     "title": "19:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:00",
//                     "title": "20:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "20:15",
//                     "title": "20:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:30",
//                     "title": "20:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:45",
//                     "title": "20:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:00",
//                     "title": "21:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "21:15",
//                     "title": "21:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:30",
//                     "title": "21:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:45",
//                     "title": "21:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:00",
//                     "title": "22:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "22:15",
//                     "title": "22:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:30",
//                     "title": "22:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:45",
//                     "title": "22:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:00",
//                     "title": "23:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "23:15",
//                     "title": "23:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:30",
//                     "title": "23:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:45",
//                     "title": "23:45",
//                     "active": false,
//                     "class": ""
//                 }
//             ]
//         },
//         {
//             "id": "wednesday",
//             "title": "Wednesday",
//             "items": [
//                 {
//                     "id": "00:00",
//                     "title": "00:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "00:15",
//                     "title": "00:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "00:30",
//                     "title": "00:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "00:45",
//                     "title": "00:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:00",
//                     "title": "01:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "01:15",
//                     "title": "01:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:30",
//                     "title": "01:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:45",
//                     "title": "01:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:00",
//                     "title": "02:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "02:15",
//                     "title": "02:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:30",
//                     "title": "02:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:45",
//                     "title": "02:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:00",
//                     "title": "03:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "03:15",
//                     "title": "03:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:30",
//                     "title": "03:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:45",
//                     "title": "03:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:00",
//                     "title": "04:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "04:15",
//                     "title": "04:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:30",
//                     "title": "04:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:45",
//                     "title": "04:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:00",
//                     "title": "05:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "05:15",
//                     "title": "05:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:30",
//                     "title": "05:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:45",
//                     "title": "05:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:00",
//                     "title": "06:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "06:15",
//                     "title": "06:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:30",
//                     "title": "06:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:45",
//                     "title": "06:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:00",
//                     "title": "07:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "07:15",
//                     "title": "07:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:30",
//                     "title": "07:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:45",
//                     "title": "07:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:00",
//                     "title": "08:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "08:15",
//                     "title": "08:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:30",
//                     "title": "08:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:45",
//                     "title": "08:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:00",
//                     "title": "09:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "09:15",
//                     "title": "09:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:30",
//                     "title": "09:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:45",
//                     "title": "09:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:00",
//                     "title": "10:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "10:15",
//                     "title": "10:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:30",
//                     "title": "10:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:45",
//                     "title": "10:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:00",
//                     "title": "11:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "11:15",
//                     "title": "11:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:30",
//                     "title": "11:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:45",
//                     "title": "11:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:00",
//                     "title": "12:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "12:15",
//                     "title": "12:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:30",
//                     "title": "12:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:45",
//                     "title": "12:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:00",
//                     "title": "13:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "13:15",
//                     "title": "13:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:30",
//                     "title": "13:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:45",
//                     "title": "13:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:00",
//                     "title": "14:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "14:15",
//                     "title": "14:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:30",
//                     "title": "14:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:45",
//                     "title": "14:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:00",
//                     "title": "15:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "15:15",
//                     "title": "15:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:30",
//                     "title": "15:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:45",
//                     "title": "15:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:00",
//                     "title": "16:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "16:15",
//                     "title": "16:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:30",
//                     "title": "16:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:45",
//                     "title": "16:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:00",
//                     "title": "17:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "17:15",
//                     "title": "17:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:30",
//                     "title": "17:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:45",
//                     "title": "17:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:00",
//                     "title": "18:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "18:15",
//                     "title": "18:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:30",
//                     "title": "18:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:45",
//                     "title": "18:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:00",
//                     "title": "19:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "19:15",
//                     "title": "19:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:30",
//                     "title": "19:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:45",
//                     "title": "19:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:00",
//                     "title": "20:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "20:15",
//                     "title": "20:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:30",
//                     "title": "20:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:45",
//                     "title": "20:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:00",
//                     "title": "21:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "21:15",
//                     "title": "21:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:30",
//                     "title": "21:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:45",
//                     "title": "21:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:00",
//                     "title": "22:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "22:15",
//                     "title": "22:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:30",
//                     "title": "22:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:45",
//                     "title": "22:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:00",
//                     "title": "23:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "23:15",
//                     "title": "23:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:30",
//                     "title": "23:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:45",
//                     "title": "23:45",
//                     "active": false,
//                     "class": ""
//                 }
//             ]
//         },
//         {
//             "id": "thursday",
//             "title": "Thursday",
//             "items": [
//                 {
//                     "id": "00:00",
//                     "title": "00:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "00:15",
//                     "title": "00:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "00:30",
//                     "title": "00:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "00:45",
//                     "title": "00:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:00",
//                     "title": "01:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "01:15",
//                     "title": "01:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:30",
//                     "title": "01:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:45",
//                     "title": "01:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:00",
//                     "title": "02:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "02:15",
//                     "title": "02:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:30",
//                     "title": "02:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:45",
//                     "title": "02:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:00",
//                     "title": "03:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "03:15",
//                     "title": "03:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:30",
//                     "title": "03:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:45",
//                     "title": "03:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:00",
//                     "title": "04:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "04:15",
//                     "title": "04:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:30",
//                     "title": "04:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:45",
//                     "title": "04:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:00",
//                     "title": "05:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "05:15",
//                     "title": "05:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:30",
//                     "title": "05:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:45",
//                     "title": "05:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:00",
//                     "title": "06:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "06:15",
//                     "title": "06:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:30",
//                     "title": "06:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:45",
//                     "title": "06:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:00",
//                     "title": "07:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "07:15",
//                     "title": "07:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:30",
//                     "title": "07:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:45",
//                     "title": "07:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:00",
//                     "title": "08:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "08:15",
//                     "title": "08:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:30",
//                     "title": "08:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:45",
//                     "title": "08:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:00",
//                     "title": "09:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "09:15",
//                     "title": "09:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:30",
//                     "title": "09:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:45",
//                     "title": "09:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:00",
//                     "title": "10:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "10:15",
//                     "title": "10:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:30",
//                     "title": "10:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:45",
//                     "title": "10:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:00",
//                     "title": "11:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "11:15",
//                     "title": "11:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:30",
//                     "title": "11:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:45",
//                     "title": "11:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:00",
//                     "title": "12:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "12:15",
//                     "title": "12:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:30",
//                     "title": "12:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:45",
//                     "title": "12:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:00",
//                     "title": "13:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "13:15",
//                     "title": "13:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:30",
//                     "title": "13:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:45",
//                     "title": "13:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:00",
//                     "title": "14:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "14:15",
//                     "title": "14:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:30",
//                     "title": "14:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:45",
//                     "title": "14:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:00",
//                     "title": "15:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "15:15",
//                     "title": "15:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:30",
//                     "title": "15:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:45",
//                     "title": "15:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:00",
//                     "title": "16:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "16:15",
//                     "title": "16:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:30",
//                     "title": "16:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:45",
//                     "title": "16:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:00",
//                     "title": "17:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "17:15",
//                     "title": "17:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:30",
//                     "title": "17:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:45",
//                     "title": "17:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:00",
//                     "title": "18:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "18:15",
//                     "title": "18:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:30",
//                     "title": "18:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:45",
//                     "title": "18:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:00",
//                     "title": "19:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "19:15",
//                     "title": "19:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:30",
//                     "title": "19:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:45",
//                     "title": "19:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:00",
//                     "title": "20:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "20:15",
//                     "title": "20:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:30",
//                     "title": "20:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:45",
//                     "title": "20:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:00",
//                     "title": "21:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "21:15",
//                     "title": "21:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:30",
//                     "title": "21:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:45",
//                     "title": "21:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:00",
//                     "title": "22:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "22:15",
//                     "title": "22:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:30",
//                     "title": "22:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:45",
//                     "title": "22:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:00",
//                     "title": "23:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "23:15",
//                     "title": "23:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:30",
//                     "title": "23:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:45",
//                     "title": "23:45",
//                     "active": false,
//                     "class": ""
//                 }
//             ]
//         },
//         {
//             "id": "friday",
//             "title": "Friday",
//             "items": [
//                 {
//                     "id": "00:00",
//                     "title": "00:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "00:15",
//                     "title": "00:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "00:30",
//                     "title": "00:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "00:45",
//                     "title": "00:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:00",
//                     "title": "01:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "01:15",
//                     "title": "01:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:30",
//                     "title": "01:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:45",
//                     "title": "01:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:00",
//                     "title": "02:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "02:15",
//                     "title": "02:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:30",
//                     "title": "02:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:45",
//                     "title": "02:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:00",
//                     "title": "03:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "03:15",
//                     "title": "03:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:30",
//                     "title": "03:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:45",
//                     "title": "03:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:00",
//                     "title": "04:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "04:15",
//                     "title": "04:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:30",
//                     "title": "04:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:45",
//                     "title": "04:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:00",
//                     "title": "05:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "05:15",
//                     "title": "05:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:30",
//                     "title": "05:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:45",
//                     "title": "05:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:00",
//                     "title": "06:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "06:15",
//                     "title": "06:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:30",
//                     "title": "06:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:45",
//                     "title": "06:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:00",
//                     "title": "07:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "07:15",
//                     "title": "07:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:30",
//                     "title": "07:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:45",
//                     "title": "07:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:00",
//                     "title": "08:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "08:15",
//                     "title": "08:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:30",
//                     "title": "08:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:45",
//                     "title": "08:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:00",
//                     "title": "09:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "09:15",
//                     "title": "09:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:30",
//                     "title": "09:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:45",
//                     "title": "09:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:00",
//                     "title": "10:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "10:15",
//                     "title": "10:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:30",
//                     "title": "10:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:45",
//                     "title": "10:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:00",
//                     "title": "11:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "11:15",
//                     "title": "11:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:30",
//                     "title": "11:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:45",
//                     "title": "11:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:00",
//                     "title": "12:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "12:15",
//                     "title": "12:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:30",
//                     "title": "12:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:45",
//                     "title": "12:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:00",
//                     "title": "13:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "13:15",
//                     "title": "13:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:30",
//                     "title": "13:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:45",
//                     "title": "13:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:00",
//                     "title": "14:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "14:15",
//                     "title": "14:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:30",
//                     "title": "14:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:45",
//                     "title": "14:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:00",
//                     "title": "15:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "15:15",
//                     "title": "15:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:30",
//                     "title": "15:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:45",
//                     "title": "15:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:00",
//                     "title": "16:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "16:15",
//                     "title": "16:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:30",
//                     "title": "16:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:45",
//                     "title": "16:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:00",
//                     "title": "17:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "17:15",
//                     "title": "17:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:30",
//                     "title": "17:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:45",
//                     "title": "17:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:00",
//                     "title": "18:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "18:15",
//                     "title": "18:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:30",
//                     "title": "18:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:45",
//                     "title": "18:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:00",
//                     "title": "19:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "19:15",
//                     "title": "19:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:30",
//                     "title": "19:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:45",
//                     "title": "19:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:00",
//                     "title": "20:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "20:15",
//                     "title": "20:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:30",
//                     "title": "20:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:45",
//                     "title": "20:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:00",
//                     "title": "21:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "21:15",
//                     "title": "21:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:30",
//                     "title": "21:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:45",
//                     "title": "21:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:00",
//                     "title": "22:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "22:15",
//                     "title": "22:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:30",
//                     "title": "22:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:45",
//                     "title": "22:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:00",
//                     "title": "23:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "23:15",
//                     "title": "23:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:30",
//                     "title": "23:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:45",
//                     "title": "23:45",
//                     "active": false,
//                     "class": ""
//                 }
//             ]
//         },
//         {
//             "id": "saturday",
//             "title": "Saturday",
//             "items": [
//                 {
//                     "id": "00:00",
//                     "title": "00:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "00:15",
//                     "title": "00:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "00:30",
//                     "title": "00:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "00:45",
//                     "title": "00:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:00",
//                     "title": "01:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "01:15",
//                     "title": "01:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:30",
//                     "title": "01:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:45",
//                     "title": "01:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:00",
//                     "title": "02:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "02:15",
//                     "title": "02:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:30",
//                     "title": "02:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:45",
//                     "title": "02:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:00",
//                     "title": "03:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "03:15",
//                     "title": "03:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:30",
//                     "title": "03:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:45",
//                     "title": "03:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:00",
//                     "title": "04:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "04:15",
//                     "title": "04:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:30",
//                     "title": "04:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:45",
//                     "title": "04:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:00",
//                     "title": "05:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "05:15",
//                     "title": "05:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:30",
//                     "title": "05:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:45",
//                     "title": "05:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:00",
//                     "title": "06:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "06:15",
//                     "title": "06:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:30",
//                     "title": "06:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:45",
//                     "title": "06:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:00",
//                     "title": "07:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "07:15",
//                     "title": "07:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:30",
//                     "title": "07:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:45",
//                     "title": "07:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:00",
//                     "title": "08:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "08:15",
//                     "title": "08:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:30",
//                     "title": "08:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:45",
//                     "title": "08:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:00",
//                     "title": "09:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "09:15",
//                     "title": "09:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:30",
//                     "title": "09:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:45",
//                     "title": "09:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:00",
//                     "title": "10:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "10:15",
//                     "title": "10:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:30",
//                     "title": "10:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:45",
//                     "title": "10:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:00",
//                     "title": "11:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "11:15",
//                     "title": "11:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:30",
//                     "title": "11:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:45",
//                     "title": "11:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:00",
//                     "title": "12:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "12:15",
//                     "title": "12:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:30",
//                     "title": "12:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:45",
//                     "title": "12:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:00",
//                     "title": "13:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "13:15",
//                     "title": "13:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:30",
//                     "title": "13:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:45",
//                     "title": "13:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:00",
//                     "title": "14:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "14:15",
//                     "title": "14:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:30",
//                     "title": "14:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:45",
//                     "title": "14:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:00",
//                     "title": "15:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "15:15",
//                     "title": "15:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:30",
//                     "title": "15:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:45",
//                     "title": "15:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:00",
//                     "title": "16:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "16:15",
//                     "title": "16:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:30",
//                     "title": "16:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:45",
//                     "title": "16:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:00",
//                     "title": "17:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "17:15",
//                     "title": "17:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:30",
//                     "title": "17:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:45",
//                     "title": "17:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:00",
//                     "title": "18:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "18:15",
//                     "title": "18:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:30",
//                     "title": "18:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:45",
//                     "title": "18:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:00",
//                     "title": "19:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "19:15",
//                     "title": "19:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:30",
//                     "title": "19:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:45",
//                     "title": "19:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:00",
//                     "title": "20:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "20:15",
//                     "title": "20:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:30",
//                     "title": "20:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:45",
//                     "title": "20:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:00",
//                     "title": "21:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "21:15",
//                     "title": "21:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:30",
//                     "title": "21:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:45",
//                     "title": "21:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:00",
//                     "title": "22:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "22:15",
//                     "title": "22:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:30",
//                     "title": "22:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:45",
//                     "title": "22:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:00",
//                     "title": "23:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "23:15",
//                     "title": "23:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:30",
//                     "title": "23:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:45",
//                     "title": "23:45",
//                     "active": false,
//                     "class": ""
//                 }
//             ]
//         },
//         {
//             "id": "sunday",
//             "title": "Sunday",
//             "items": [
//                 {
//                     "id": "00:00",
//                     "title": "00:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "00:15",
//                     "title": "00:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "00:30",
//                     "title": "00:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "00:45",
//                     "title": "00:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:00",
//                     "title": "01:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "01:15",
//                     "title": "01:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:30",
//                     "title": "01:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "01:45",
//                     "title": "01:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:00",
//                     "title": "02:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "02:15",
//                     "title": "02:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:30",
//                     "title": "02:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "02:45",
//                     "title": "02:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:00",
//                     "title": "03:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "03:15",
//                     "title": "03:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:30",
//                     "title": "03:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "03:45",
//                     "title": "03:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:00",
//                     "title": "04:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "04:15",
//                     "title": "04:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:30",
//                     "title": "04:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "04:45",
//                     "title": "04:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:00",
//                     "title": "05:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "05:15",
//                     "title": "05:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:30",
//                     "title": "05:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "05:45",
//                     "title": "05:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:00",
//                     "title": "06:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "06:15",
//                     "title": "06:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:30",
//                     "title": "06:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "06:45",
//                     "title": "06:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:00",
//                     "title": "07:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "07:15",
//                     "title": "07:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:30",
//                     "title": "07:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "07:45",
//                     "title": "07:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:00",
//                     "title": "08:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "08:15",
//                     "title": "08:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:30",
//                     "title": "08:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "08:45",
//                     "title": "08:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:00",
//                     "title": "09:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "09:15",
//                     "title": "09:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:30",
//                     "title": "09:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "09:45",
//                     "title": "09:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:00",
//                     "title": "10:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "10:15",
//                     "title": "10:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:30",
//                     "title": "10:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "10:45",
//                     "title": "10:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:00",
//                     "title": "11:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "11:15",
//                     "title": "11:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:30",
//                     "title": "11:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "11:45",
//                     "title": "11:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:00",
//                     "title": "12:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "12:15",
//                     "title": "12:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:30",
//                     "title": "12:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "12:45",
//                     "title": "12:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:00",
//                     "title": "13:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "13:15",
//                     "title": "13:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:30",
//                     "title": "13:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "13:45",
//                     "title": "13:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:00",
//                     "title": "14:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "14:15",
//                     "title": "14:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:30",
//                     "title": "14:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "14:45",
//                     "title": "14:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:00",
//                     "title": "15:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "15:15",
//                     "title": "15:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:30",
//                     "title": "15:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "15:45",
//                     "title": "15:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:00",
//                     "title": "16:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "16:15",
//                     "title": "16:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:30",
//                     "title": "16:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "16:45",
//                     "title": "16:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:00",
//                     "title": "17:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "17:15",
//                     "title": "17:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:30",
//                     "title": "17:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "17:45",
//                     "title": "17:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:00",
//                     "title": "18:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "18:15",
//                     "title": "18:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:30",
//                     "title": "18:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "18:45",
//                     "title": "18:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:00",
//                     "title": "19:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "19:15",
//                     "title": "19:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:30",
//                     "title": "19:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "19:45",
//                     "title": "19:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:00",
//                     "title": "20:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "20:15",
//                     "title": "20:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:30",
//                     "title": "20:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "20:45",
//                     "title": "20:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:00",
//                     "title": "21:00",
//                     "active": false,
//                     "class": " hour quarter"
//                 },
//                 {
//                     "id": "21:15",
//                     "title": "21:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:30",
//                     "title": "21:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "21:45",
//                     "title": "21:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:00",
//                     "title": "22:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "22:15",
//                     "title": "22:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:30",
//                     "title": "22:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "22:45",
//                     "title": "22:45",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:00",
//                     "title": "23:00",
//                     "active": false,
//                     "class": " hour"
//                 },
//                 {
//                     "id": "23:15",
//                     "title": "23:15",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:30",
//                     "title": "23:30",
//                     "active": false,
//                     "class": ""
//                 },
//                 {
//                     "id": "23:45",
//                     "title": "23:45",
//                     "active": false,
//                     "class": ""
//                 }
//             ]
//         }
//     ],
//     "notifications": [
//         {
//             "input": "",
//             "active": false,
//             "name": "color",
//             "title": "Color",
//             "input_type": "color"
//         },
//         {
//             "input": "0",
//             "active": false,
//             "name": "silent",
//             "title": "Ignore notifications if repeated in minutes",
//             "input_type": "integer"
//         },
//         {
//             "input": "",
//             "active": false,
//             "name": "sound",
//             "title": "Sound notification",
//             "input_type": "select",
//             "options": [
//                 {
//                     "id": "assets/audio/hint.mp3",
//                     "title": "hint"
//                 },
//                 {
//                     "id": "assets/audio/beepbeep.mp3",
//                     "title": "beepbeep"
//                 }
//             ]
//         },
//         {
//             "input": 10,
//             "active": false,
//             "name": "popup",
//             "title": "Popup notification",
//             "input_type": "select",
//             "options": [
//                 {
//                     "id": 0,
//                     "title": "Sticky"
//                 },
//                 {
//                     "id": 5,
//                     "title": "5 s"
//                 },
//                 {
//                     "id": 10,
//                     "title": "10 s"
//                 }
//             ]
//         },
//         {
//             "active": false,
//             "name": "push",
//             "title": "App Push notification"
//         },
//         {
//             "input": "Israel.olatunde@tractrac.co",
//             "active": false,
//             "name": "email",
//             "title": "Email notification",
//             "description": "For multiple emails separate them via semicolon ex.: user@example.com;user1@example.com",
//             "input_type": "string"
//         },
//         {
//             "input": "",
//             "active": false,
//             "name": "webhook",
//             "title": "Webhook notification",
//             "description": "The URL you would like event data posted to.",
//             "input_type": "string"
//         }
//     ],
//     "alert_zones": [
//         {
//             "id": 1,
//             "value": "Zone in",
//             "title": "Zone in"
//         },
//         {
//             "id": 2,
//             "value": "Zone out",
//             "title": "Zone out"
//         }
//     ],
//     "commands": [],
//     "status": 1
// }
};

export const editAlert = async (
  alertId: number,
  name: string,
  devices: Array<number>,
  geofences: Array<number>
) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_TRACKING_BASE_URL}/edit_alert?lang=${process.env.NEXT_PUBLIC_TRACKING_LANG}&user_api_hash=$2y$10$0.AGeFFO5v59EyjbccSr2eObg9AxZn5U4N/V8z9qWtQBcuFDJw3um`,
    {
      alertId,
      name,
      devices,
      notifications: {
        email: {
          active: 0,
          input: "Israel.olatunde@tractrac.co",
        },
      },
      type: "geofence_inout",
      geofences
    }
    // config
  );

  return res;
};

export const getGeoFences = async () => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_TRACKING_BASE_URL}/get_geofences?lang=${process.env.NEXT_PUBLIC_TRACKING_LANG}&user_api_hash=$2y$10$0.AGeFFO5v59EyjbccSr2eObg9AxZn5U4N/V8z9qWtQBcuFDJw3um`
    // config
  );

  return res;
};

export const getHistory = async (
  deviceId?: string,
  fromDate?: string,
  fromTime?: string,
  toDate?: string,
  toTime?: string
) => {
  // Build query parameters
  const params = new URLSearchParams({
    lang: process.env.NEXT_PUBLIC_TRACKING_LANG || "en",
    user_api_hash:
      "$2y$10$0.AGeFFO5v59EyjbccSr2eObg9AxZn5U4N/V8z9qWtQBcuFDJw3um",
  });

  // Add optional parameters if provided
  if (deviceId) {
    params.append("device_id", deviceId);
  }
  if (fromDate) {
    params.append("from_date", fromDate);
  }
  if (fromTime) {
    params.append("from_time", fromTime);
  }
  if (toDate) {
    params.append("to_date", toDate);
  }
  if (toTime) {
    params.append("to_time", toTime);
  }

  const res = await axios.get(
    `${
      process.env.NEXT_PUBLIC_TRACKING_BASE_URL
    }/get_history?${params.toString()}`
    // config
  );

  return res;
};

export const addGeoFence = async (geofenceData: CreateGeoFenceData) => {
  // Build query parameters (only lang and user_api_hash)
  const params = new URLSearchParams({
    lang: process.env.NEXT_PUBLIC_TRACKING_LANG || "en",
    user_api_hash:
      "$2y$10$0.AGeFFO5v59EyjbccSr2eObg9AxZn5U4N/V8z9qWtQBcuFDJw3um",
  });

  // Parse coordinates for polygon type
  let polygon: Array<{ lat: number; lng: number }> | undefined;
  if (geofenceData.type === "polygon" && geofenceData.coordinates) {
    try {
      polygon = JSON.parse(geofenceData.coordinates);
    } catch (error) {
      console.error("Error parsing polygon coordinates:", error);
      polygon = undefined;
    }
  }

  // Build request body according to API specification
  const requestBody = {
    name: geofenceData.name,
    active: geofenceData.active === 1,
    device_id: geofenceData.device_id || 0,
    group_id: geofenceData.group_id || 0,
    type: geofenceData.type,
    polygon: polygon,
    radius: geofenceData.radius || 0,
    center: geofenceData.center || { lat: 0, lng: 0 },
    polygon_color: geofenceData.polygon_color,
    speed_limit: geofenceData.speed_limit || 0,
  };

  const res = await axios.post(
    `${
      process.env.NEXT_PUBLIC_TRACKING_BASE_URL
    }/add_geofence?${params.toString()}`,
    requestBody,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return res;
};

export const updateGeoFence = async (
  geofenceId: number,
  geofenceData: Partial<CreateGeoFenceData>
) => {
  // Build query parameters (only lang, user_api_hash, and geofence_id)
  const params = new URLSearchParams({
    lang: process.env.NEXT_PUBLIC_TRACKING_LANG || "en",
    user_api_hash:
      "$2y$10$0.AGeFFO5v59EyjbccSr2eObg9AxZn5U4N/V8z9qWtQBcuFDJw3um",
    geofence_id: geofenceId.toString(),
  });

  // Parse coordinates for polygon type
  let polygon: Array<{ lat: number; lng: number }> | undefined;
  if (geofenceData.type === "polygon" && geofenceData.coordinates) {
    try {
      polygon = JSON.parse(geofenceData.coordinates);
    } catch (error) {
      console.error("Error parsing polygon coordinates:", error);
      polygon = undefined;
    }
  }

  // Build request body with only provided fields
  const requestBody: any = {};

  if (geofenceData.name !== undefined) requestBody.name = geofenceData.name;
  if (geofenceData.active !== undefined)
    requestBody.active = geofenceData.active === 1;
  if (geofenceData.device_id !== undefined)
    requestBody.device_id = geofenceData.device_id;
  if (geofenceData.group_id !== undefined)
    requestBody.group_id = geofenceData.group_id;
  if (geofenceData.type !== undefined) requestBody.type = geofenceData.type;
  if (polygon !== undefined) requestBody.polygon = polygon;
  if (geofenceData.radius !== undefined)
    requestBody.radius = geofenceData.radius;
  if (geofenceData.center !== undefined)
    requestBody.center = geofenceData.center;
  if (geofenceData.polygon_color !== undefined)
    requestBody.polygon_color = geofenceData.polygon_color;
  if (geofenceData.speed_limit !== undefined)
    requestBody.speed_limit = geofenceData.speed_limit;

  const res = await axios.put(
    `${
      process.env.NEXT_PUBLIC_TRACKING_BASE_URL
    }/update_geofence?${params.toString()}`,
    requestBody,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return res;
};

export const deleteGeoFence = async (geofenceId: number) => {
  const params = new URLSearchParams({
    lang: process.env.NEXT_PUBLIC_TRACKING_LANG || "en",
    user_api_hash:
      "$2y$10$0.AGeFFO5v59EyjbccSr2eObg9AxZn5U4N/V8z9qWtQBcuFDJw3um",
    geofence_id: geofenceId.toString(),
  });

  const res = await axios.delete(
    `${
      process.env.NEXT_PUBLIC_TRACKING_BASE_URL
    }/delete_geofence?${params.toString()}`
  );

  return res;
};

// Reverse geocoding endpoint to get address details from coordinates
export const reverseGeocode = async (lat: number, lng: number) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_TRACKING_BASE_URL}/address/reverse?lang=${process.env.NEXT_PUBLIC_TRACKING_LANG}&user_api_hash=$2y$10$0.AGeFFO5v59EyjbccSr2eObg9AxZn5U4N/V8z9qWtQBcuFDJw3um&lat=${lat}&lng=${lng}`
  );

  return res;
};

// Export the interface for use in other files
export type { CreateGeoFenceData };
