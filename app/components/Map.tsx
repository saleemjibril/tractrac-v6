import { useState, useEffect } from "react";
import loader from "../googleMapsLoader";

import * as markerI from ".https://res.cloudinary.com/tractrac-global/image/upload/v1746446667/tractor-icon_nwbaf5.svg";

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
                url: "https://res.cloudinary.com/thewebplug/image/upload/v1751460708/WhatsApp_Image_2025-06-25_at_17.19.08_hl0em3.jpg",
                // fillColor: "#EB00FF",
                // scale: 7,
                // url: markerI.default,
                // url: "https://res.cloudinary.com/tractrac-global/image/upload/v1746446552/tractor-icon_i6psd0.ico",
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
