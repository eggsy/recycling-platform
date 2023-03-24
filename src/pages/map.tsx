import { useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import { toast } from "sonner";
import type { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";

// Components
import { Layout } from "@/components/Layout";

const mapLibraries = ["places"] as Libraries;

interface IMarker {
  lat: number;
  lng: number;
  isOpen: boolean;
  title: string;
  address: string;
}

export default function MapPage() {
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState<IMarker[]>([]);
  const [coords, setCoords] = useState({
    latitude: 0,
    longtitude: 0,
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: mapLibraries,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longtitude: position.coords.longitude,
        });

        setLoading(false);
      },
      (err) => {
        toast.error(
          "Couldn't retreive your location. Make sure you have given permission to access your location."
        );
        console.error(err);
        setLoading(false);
      }
    );
  }, []);

  const fetchNearbyCenters = async (map: google.maps.Map) => {
    let service = new google.maps.places.PlacesService(map);

    service.nearbySearch(
      {
        location: {
          lat: coords.latitude,
          lng: coords.longtitude,
        },
        keyword: "Recycling center",
        radius: 10000,
      },
      (results, status) => {
        if (results?.length === 0) {
          toast.error(
            "Couldn't find any recycling centres in 10 kilometers radius."
          );
          return;
        }

        console.log(results);

        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setMarkers(
            results.map((result) => ({
              lat: result.geometry?.location?.lat() as number,
              lng: result.geometry?.location?.lng() as number,
              title: result.name as string,
              address: result.vicinity as string,
              isOpen: false,
            }))
          );
        }
      }
    );
  };

  const toggleWindow = (marker: IMarker) => {
    setMarkers(
      markers.map((m) => {
        if (m.lat === marker.lat) {
          return {
            ...m,
            isOpen: !m.isOpen,
          };
        }

        return m;
      })
    );
  };

  return (
    <Layout title="Nearby Recycling Centers" padding={false}>
      {!loading && !Boolean(coords.latitude) && (
        <div className="p-6 text-black/50">
          ⛔ Make sure you have given us permission to access your location (we
          are not storing your location).
        </div>
      )}

      {isLoaded && !loading && coords.latitude !== 0 && (
        <GoogleMap
          id="map"
          zoom={14}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          options={{
            center: {
              lat: coords.latitude,
              lng: coords.longtitude,
            },
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          mapContainerStyle={{
            width: "100%",
            height: "100%",
            borderRadius: "0 0 0.5rem 0.5rem",
          }}
          onLoad={fetchNearbyCenters}
        >
          <MarkerF
            position={{
              lat: coords.latitude,
              lng: coords.longtitude,
            }}
          />

          {markers.map((marker) => (
            <MarkerF
              key={marker.lat}
              position={marker}
              icon={{
                url: "/marker.png",
                scaledSize: new google.maps.Size(50, 50),
              }}
              onClick={() => toggleWindow(marker)}
            >
              {marker.isOpen && (
                <InfoWindowF
                  position={marker}
                  onCloseClick={() => toggleWindow(marker)}
                >
                  <div className="flex flex-col items-start space-y-2">
                    <h1>{marker.title}</h1>

                    <span className="text-xs text-black/50">
                      {marker.address}
                    </span>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${marker.lat},${marker.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-blue-600/10 px-3 py-1 text-xs text-blue-600"
                    >
                      Get Directions
                    </a>
                  </div>
                </InfoWindowF>
              )}
            </MarkerF>
          ))}
        </GoogleMap>
      )}
    </Layout>
  );
}
