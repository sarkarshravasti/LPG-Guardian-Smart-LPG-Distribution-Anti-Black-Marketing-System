import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function MapReady({ onReady }) {
  const map = useMap();

  useEffect(() => {
    if (onReady && map) {
      onReady(map);
    }
  }, [map, onReady]);

  return null;
}

export default function IndiaMap({
  onMapReady,
  showConsumers = true,
  showDistributors = true,
  showComplaints = true,
  showLowStock = true,
  showHeatmap = false,
  mapMode = "standard",
}) {
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
  }, []);

  const tileStyles = {
    standard: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics",
    },
    terrain: {
      url: "https://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg",
      attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>',
    },
    heatmap: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  };

  const selectedStyle = tileStyles[mapMode] || tileStyles.standard;

  const consumerMarkers = [
    { center: [19.076, 72.8777], label: "Mumbai Consumer" },
    { center: [28.6139, 77.209], label: "Delhi Consumer" },
    { center: [22.5726, 88.3639], label: "Kolkata Consumer" },
  ];

  const distributorMarkers = [
    { center: [19.195, 72.9753], label: "Mumbai Distributor" },
    { center: [28.7041, 77.1025], label: "Delhi Distributor" },
  ];

  const complaintMarkers = [
    { center: [25.3176, 82.9739], label: "Kanpur Hotspot" },
    { center: [23.0225, 72.5714], label: "Ahmedabad Hotspot" },
  ];

  const lowStockMarkers = [
    { center: [18.5204, 73.8567], label: "Pune Low Stock" },
    { center: [13.0827, 80.2707], label: "Chennai Low Stock" },
  ];

  const heatPoints = [
    [22.5726, 88.3639],
    [19.076, 72.8777],
    [25.3176, 82.9739],
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
      }}
    >
      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        minZoom={4}
        maxZoom={18}
        scrollWheelZoom={true}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer
          attribution={selectedStyle.attribution}
          url={selectedStyle.url}
        />

        <MapReady onReady={onMapReady} />

        {showConsumers &&
          consumerMarkers.map((marker, index) => (
            <CircleMarker
              key={`consumer-${index}`}
              center={marker.center}
              radius={12}
              pathOptions={{
                color: "#22c55e",
                fillColor: "#22c55e",
                fillOpacity: 0.9,
              }}
            />
          ))}

        {showDistributors &&
          distributorMarkers.map((marker, index) => (
            <CircleMarker
              key={`distributor-${index}`}
              center={marker.center}
              radius={10}
              pathOptions={{
                color: "#38bdf8",
                fillColor: "#38bdf8",
                fillOpacity: 0.95,
              }}
            />
          ))}

        {showComplaints &&
          complaintMarkers.map((marker, index) => (
            <CircleMarker
              key={`complaint-${index}`}
              center={marker.center}
              radius={14}
              pathOptions={{
                color: "#ef4444",
                fillColor: "#ef4444",
                fillOpacity: 0.7,
              }}
            />
          ))}

        {showLowStock &&
          lowStockMarkers.map((marker, index) => (
            <CircleMarker
              key={`lowstock-${index}`}
              center={marker.center}
              radius={13}
              pathOptions={{
                color: "#f59e0b",
                fillColor: "#f59e0b",
                fillOpacity: 0.7,
              }}
            />
          ))}

        {(showHeatmap || mapMode === "heatmap") &&
          heatPoints.map((point, index) => (
            <CircleMarker
              key={`heat-${index}`}
              center={point}
              radius={28}
              pathOptions={{
                color: "rgba(239, 68, 68, 0.35)",
                fillColor: "rgba(239, 68, 68, 0.12)",
                fillOpacity: 0.5,
              }}
            />
          ))}
      </MapContainer>
    </div>
  );
}
