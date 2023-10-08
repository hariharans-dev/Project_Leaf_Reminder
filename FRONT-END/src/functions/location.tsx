import { useState, useEffect } from "react";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string;
}

export function useLocation(): LocationState {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: "",
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        handleLocation,
        handleLocationError
      );
    } else {
      setLocation({
        ...location,
        error: "Geolocation is not available in your browser.",
      });
    }
  }, []);

  const handleLocation = (position: GeolocationPosition) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      error: "", // Reset error to an empty string
    });
  };

  const handleLocationError = (error: GeolocationPositionError) => {
    setLocation({ ...location, error: error.message });
  };

  return location;
}
