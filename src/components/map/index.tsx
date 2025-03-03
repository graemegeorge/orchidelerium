"use client";

import { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_POSITION: [number, number] = [51.5074, -0.1278]; // Default to London

const FlyToUserLocation = () => {
  const map = useMap();
  const [locationFetched, setLocationFetched] = useState(false);

  const foo = useCallback(() => {
    console.log("t");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        map.flyTo([latitude, longitude], 13, {
          animate: true,
          duration: 1,
        });
        setLocationFetched(true);
      },
      () => {
        console.warn("Unable to retrieve location");
      }
    );
  }, [map]);

  useEffect(() => {
    if (!navigator.geolocation || locationFetched) {
      return;
    }

    foo();
  }, [map, locationFetched, foo]);

  return (
    <button
      type="button"
      className="absolute z-[99999] bg-white text-black bottom-0 p-8"
      onClick={(e) => {
        e.stopPropagation();
        console.log("clicked");
        setLocationFetched(false);
        foo();
      }}
    >
      reset
    </button>
  );
};

const Map = () => {
  return (
    <MapContainer
      center={DEFAULT_POSITION}
      zoom={5}
      style={{ height: "50vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FlyToUserLocation />
    </MapContainer>
  );
};

export { Map };
