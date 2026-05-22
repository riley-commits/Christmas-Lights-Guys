"use client";

import * as React from "react";
import mapboxgl from "mapbox-gl";
import { MAPBOX_TOKEN, hasMapboxToken, WINNIPEG_CENTER } from "@/lib/mapbox";
import type { LngLat } from "@/lib/types";
import { MapPinned } from "lucide-react";

if (hasMapboxToken) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

export interface MapPin {
  id: string;
  coords: LngLat;
  label: string;
  sublabel?: string;
  index?: number;
  color?: string;
}

interface MapBaseProps {
  pins: MapPin[];
  start?: LngLat;
  routeGeometry?: GeoJSON.LineString;
  routeOrder?: number[];
  height?: string;
  onPinClick?: (pinId: string) => void;
  fitToPins?: boolean;
}

export function MapBase({
  pins,
  start,
  routeGeometry,
  routeOrder,
  height = "320px",
  onPinClick,
  fitToPins = true,
}: MapBaseProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<mapboxgl.Map | null>(null);
  const markersRef = React.useRef<mapboxgl.Marker[]>([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!hasMapboxToken || !containerRef.current) return;
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: pins[0]?.coords ?? start ?? WINNIPEG_CENTER,
      zoom: 11,
      attributionControl: false,
      cooperativeGestures: true,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));

    map.on("load", () => setLoaded(true));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pins + route
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;

    // Clear markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add start marker
    if (start) {
      const el = document.createElement("div");
      el.innerHTML = `
        <div style="width:30px;height:30px;border-radius:50%;background:#1A1A1A;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.2);">
          <span>S</span>
        </div>`;
      const m = new mapboxgl.Marker({ element: el }).setLngLat(start).addTo(map);
      markersRef.current.push(m);
    }

    // Add pins
    const orderMap = new Map<number, number>();
    (routeOrder ?? []).forEach((origIdx, position) => orderMap.set(origIdx, position + 1));

    pins.forEach((pin, i) => {
      const orderNum = orderMap.get(i) ?? pin.index;
      const color = pin.color ?? "#C8102E";
      const el = document.createElement("div");
      el.style.cursor = onPinClick ? "pointer" : "default";
      el.innerHTML = `
        <div style="width:34px;height:34px;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);">
          <span>${orderNum ?? i + 1}</span>
        </div>`;
      if (onPinClick) {
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onPinClick(pin.id);
        });
      }
      const popup = new mapboxgl.Popup({ offset: 22, closeButton: false }).setHTML(
        `<div style="font-family:system-ui;font-size:13px;padding:2px 4px;"><b>${pin.label}</b>${
          pin.sublabel ? `<div style="color:#5C5C5C;font-size:12px;margin-top:2px;">${pin.sublabel}</div>` : ""
        }</div>`
      );
      const m = new mapboxgl.Marker({ element: el }).setLngLat(pin.coords).setPopup(popup).addTo(map);
      markersRef.current.push(m);
    });

    // Route line
    const sourceId = "route-line";
    if (map.getLayer(sourceId)) map.removeLayer(sourceId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    if (routeGeometry) {
      map.addSource(sourceId, { type: "geojson", data: { type: "Feature", properties: {}, geometry: routeGeometry } });
      map.addLayer({
        id: sourceId,
        type: "line",
        source: sourceId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#1F6B3A", "line-width": 4, "line-opacity": 0.85 },
      });
    } else if (start && pins.length > 0 && routeOrder) {
      // Fallback straight-line route in routeOrder
      const coords = [start, ...routeOrder.map((i) => pins[i].coords)];
      map.addSource(sourceId, {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } },
      });
      map.addLayer({
        id: sourceId,
        type: "line",
        source: sourceId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#1F6B3A",
          "line-width": 3,
          "line-opacity": 0.6,
          "line-dasharray": [2, 2],
        },
      });
    }

    // Fit
    if (fitToPins && pins.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      if (start) bounds.extend(start);
      pins.forEach((p) => bounds.extend(p.coords));
      map.fitBounds(bounds, { padding: 60, maxZoom: 13, duration: 600 });
    }
  }, [pins, start, routeGeometry, routeOrder, loaded, fitToPins, onPinClick]);

  if (!hasMapboxToken) {
    return (
      <div
        className="rounded-lg border border-line-strong bg-bg-subtle/60 flex flex-col items-center justify-center text-center p-6"
        style={{ height }}
      >
        <MapPinned size={28} className="text-ink-muted mb-2" />
        <p className="font-semibold text-ink">Map preview</p>
        <p className="text-sm text-ink-muted mt-1 max-w-xs">
          Add <code className="text-xs bg-white px-1.5 py-0.5 rounded border">NEXT_PUBLIC_MAPBOX_TOKEN</code> in Vercel to enable live maps and route optimization.
        </p>
        <p className="text-xs text-ink-subtle mt-3">{pins.length} stop{pins.length === 1 ? "" : "s"} loaded</p>
      </div>
    );
  }

  return <div ref={containerRef} className="rounded-lg overflow-hidden border border-line" style={{ height }} />;
}
