import * as Location from "expo-location";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import MapView, { LatLng, Marker, Region } from "react-native-maps";

interface FavoritePlace {
  id: string;
  name: string;
  ubication: string;
  latitude: number;
  longitude: number;
}

type Coords = {
  latitude: number;
  longitude: number;
};

const GOOGLE_MAPS_APIKEY = "AIzaSyB8519h_kvlK7sYDugPDKb9msvOGc5hoU4";

const FALLBACK_REGION: Region = {
  latitude: -9.2,
  longitude: -75.0,
  latitudeDelta: 12,
  longitudeDelta: 12,
};

const COLORS = [
  "#E53935",
  "#1E88E5",
  "#43A047",
  "#FB8C00",
  "#8E24AA",
  "#00897B",
  "#FDD835",
];

export default function App() {
  const [placesMarker, setPlacesMarker] = useState<FavoritePlace[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Coords | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const mapRef = useRef<MapView | null>(null);
  const didFitRef = useRef(false);

  const showMessage = (msg: string) => {
    Platform.OS === "web" ? alert(msg) : Alert.alert(msg);
  };

  const geocodePlace = async (place: string): Promise<Coords | null> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          place,
        )}&key=${GOOGLE_MAPS_APIKEY}`,
      );

      const data = await response.json();

      if (data.status === "OK" && data.results?.length) {
        const location = data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      }

      console.log("Geocode error:", data.status);
      return null;
    } catch (error) {
      console.log("Geocode fetch error:", error);
      return null;
    }
  };

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let alive = true;

    const startLocationTracking = async () => {
      try {
        if (Platform.OS === "web") return;

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          showMessage("Necesitas permiso de ubicación para ver tu posición.");
          return;
        }

        const lastLocation = await Location.getLastKnownPositionAsync({});
        if (alive && lastLocation) {
          setCurrentLocation({
            latitude: lastLocation.coords.latitude,
            longitude: lastLocation.coords.longitude,
          });
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 3000000,
            distanceInterval: 10,
          },
          (location) => {
            if (!alive) return;

            const next = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };

            setCurrentLocation(next);
          },
        );
      } catch (error) {
        showMessage(String(error));
      }
    };

    startLocationTracking();

    return () => {
      alive = false;
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    const db = getDatabase();
    const favRef = ref(db, `/favorites/${userId}`);

    const unsubscribe = onValue(favRef, async (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setPlacesMarker([]);
        return;
      }

      const favorites = Object.entries(data) as [string, any][];

      const enriched = await Promise.all(
        favorites.map(async ([id, place]) => {
          const query = `${place.name}, ${place.ubication}`;
          const coords = await geocodePlace(query);

          if (!coords) return null;

          return {
            id,
            name: place.name ?? "",
            ubication: place.ubication ?? "",
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
        }),
      );

      setPlacesMarker(enriched.filter(Boolean) as FavoritePlace[]);
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (!mapReady) return;
    if (placesMarker.length === 0) return;
    if (didFitRef.current) return;

    const coordinates = [
      ...placesMarker.map((place) => ({
        latitude: place.latitude,
        longitude: place.longitude,
      })),
      ...(currentLocation ? [currentLocation] : []), // optional
    ];

    if (coordinates.length === 0) return;

    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: {
        top: 120,
        right: 80,
        bottom: 180,
        left: 80,
      },
      animated: true,
    });

    didFitRef.current = true;
  }, [mapReady, placesMarker, currentLocation]);

  if (Platform.OS === "web") {
    return (
      <View>
        <Text>Mapa no disponible en web</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={FALLBACK_REGION}
        onMapReady={() => setMapReady(true)}
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation as LatLng}
            title="Mi ubicación"
            description="Ubicación actual"
            pinColor="#0000FF"
          />
        )}

        {placesMarker.map((place, index) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
            description={place.ubication}
            pinColor={COLORS[index % COLORS.length]}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
