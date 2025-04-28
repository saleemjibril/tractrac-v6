import { useState, useEffect } from "react";
import loader from "../googleMapsLoader";

import * as markerI from "./tractor-icon.svg";

const Map = ({ addresses }: { addresses: string[] }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  useEffect(() => {
    loader.importLibrary("maps").then(() => {
      const geocoder = new window.google.maps.Geocoder();

      const mapOptions: google.maps.MapOptions = {
        center: new window.google.maps.LatLng(9.082, 8.6753),
        zoom: 6,
      };
      const documentMap = document?.getElementById("map") as HTMLElement;
      const newMap = new window.google.maps.Map(documentMap, mapOptions);

      addresses.forEach((address) => {
        geocoder.geocode({ address }, (results: any, status: any) => {
          if (status === "OK") {
            // const documentMap = document?.getElementById("map");
            // if (documentMap) {
            // const newMap = new window.google.maps.Map(
            //   documentMap,
            //   mapOptions
            // );
            const marker = new window.google.maps.Marker({
              position: results[0].geometry.location,
              map: newMap,
              icon: {
                // url: google.maps.Circle
                url: "/tractor-icon.svg",
                // fillColor: "#EB00FF",
                // scale: 7,
                // url: markerI.default,
                // url: "./tractor-icon.ico",
              },
            });
            setMap(newMap);
            // }
          }
        });
      });
    });
  }, [addresses]);
  return <div id="map" style={{ height: "360px" }}></div>;
};
export default Map;
