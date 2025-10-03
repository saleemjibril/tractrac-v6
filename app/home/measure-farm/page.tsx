"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import * as turf from "@turf/turf";

mapboxgl.accessToken = "pk.eyJ1IjoiZW9rZGV2IiwiYSI6ImNtOW5yZTltbTAxeGIycXM0eGY0b29kMzcifQ.nbiCtwZeOhetCDPFodoQ1Q"; // 🔐 Replace with yours

type Coordinate = [number, number];

export default function MapTracker() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [tracking, setTracking] = useState(false);
  const [positions, setPositions] = useState<Coordinate[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (!mapContainer.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [8.6753, 9.082], // Nigeria center
      zoom: 6,
    });

    mapRef.current.on("load", () => {
      mapRef.current?.addSource("path", {
        type: "geojson",
        data: lineGeoJSON([]),
      });

      mapRef.current?.addLayer({
        id: "path-line",
        type: "line",
        source: "path",
        paint: {
          "line-color": "#ff6600",
          "line-width": 4,
        },
      });
    });

    return () => {
      // Ensure geolocation watch is cleared on unmount
      if (watchId !== null) {
        try { navigator.geolocation.clearWatch(watchId); } catch {}
      }
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    const geoJson = lineGeoJSON(positions);
    const source = mapRef.current?.getSource("path") as mapboxgl.GeoJSONSource;
    if (source) source.setData(geoJson);
  }, [positions]);

  const lineGeoJSON = (coords: Coordinate[]) => ({
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: coords,
    },
    properties: {},
  });

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast({ status: "error", description: "Geolocation not supported" });
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const coord: Coordinate = [longitude, latitude];

        setPositions((prev) => [...prev, coord]);
        mapRef.current?.flyTo({ center: coord, zoom: 16 });

        drawAccuracyCircle(coord, accuracy);
      },
      (err) => {
        toast({ status: "error", description: err.message });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );

    setWatchId(id);
    setTracking(true);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }
    setTracking(false);

    if (positions.length >= 3) {
      const polygonCoords = [...positions, positions[0]];
      const polygon = turf.polygon([polygonCoords]);
      const area = turf.area(polygon); // in m²
      const hectares = area / 10_000;

      toast({
        status: "info",
        title: "Measurement Complete",
        description: `Area: ${area.toFixed(2)} m² (${hectares.toFixed(2)} ha)`,
        duration: 9000,
        isClosable: true,
      });

      // Draw polygon layer
      const polygonSource = mapRef.current?.getSource("polygon") as mapboxgl.GeoJSONSource;
      if (polygonSource) {
        polygonSource.setData(polygon);
      } else {
        mapRef.current?.addSource("polygon", {
          type: "geojson",
          data: polygon,
        });

        mapRef.current?.addLayer({
          id: "polygon-layer",
          type: "fill",
          source: "polygon",
          paint: {
            "fill-color": "#ffcc00",
            "fill-opacity": 0.3,
          },
        });
      }
    }
  };

  const reset = () => {
    stopTracking();
    setPositions([]);

    // Clear polygon and path
    const pathSource = mapRef.current?.getSource("path") as mapboxgl.GeoJSONSource;
    pathSource?.setData(lineGeoJSON([]));

    const polySource = mapRef.current?.getSource("polygon") as mapboxgl.GeoJSONSource;
    polySource?.setData(turf.polygon([[[]]]));
  };

  const drawAccuracyCircle = (center: Coordinate, radius: number) => {
    const circle = turf.circle(center, radius, {
      steps: 64,
      units: "meters",
    });

    const source = mapRef.current?.getSource("accuracy") as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(circle);
    } else {
      mapRef.current?.addSource("accuracy", {
        type: "geojson",
        data: circle,
      });

      mapRef.current?.addLayer({
        id: "accuracy-layer",
        type: "fill",
        source: "accuracy",
        paint: {
          "fill-color": "#66ccff",
          "fill-opacity": 0.2,
        },
      });
    }
  };

  return (
    <Flex direction="column" align="center" p={4}>
      <Box
        ref={mapContainer}
        width="100%"
        height="500px"
        borderRadius="lg"
        mb={4}
      />
      <VStack spacing={3}>
        <Button colorScheme="teal" onClick={startTracking} isDisabled={tracking}>
          Start Tracking
        </Button>
        <Button colorScheme="orange" onClick={stopTracking} isDisabled={!tracking}>
          Stop & Calculate Area
        </Button>
        <Button colorScheme="red" onClick={reset}>
          Reset
        </Button>
        <Text fontSize="sm" color="gray.500">
          Points recorded: {positions.length}
        </Text>
      </VStack>
    </Flex>
  );
}
