"use client";

import * as React from "react";
import { MapBase, type MapPin } from "./MapBase";
import { fetchOptimizedRoute, greedyOrderStops } from "@/lib/mapbox";
import type { LngLat } from "@/lib/types";

interface Stop {
  id: string;
  coords: LngLat;
  label: string;
  sublabel?: string;
}

interface DayRouteProps {
  start: LngLat;
  stops: Stop[];
  height?: string;
  onChange?: (ordered: Stop[]) => void;
  onPinClick?: (stopId: string) => void;
}

export function DayRoute({ start, stops, height, onChange, onPinClick }: DayRouteProps) {
  const [order, setOrder] = React.useState<number[] | null>(null);
  const [geometry, setGeometry] = React.useState<GeoJSON.LineString | undefined>(undefined);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  React.useEffect(() => {
    let cancelled = false;
    if (stops.length === 0) {
      setOrder([]);
      setGeometry(undefined);
      onChangeRef.current?.([]);
      return;
    }

    // Optimistic greedy first so the UI is never empty
    const greedy = greedyOrderStops(start, stops.map((s) => s.coords));
    setOrder(greedy);
    onChangeRef.current?.(greedy.map((i) => stops[i]));

    fetchOptimizedRoute(start, stops.map((s) => s.coords))
      .then((res) => {
        if (cancelled || !res) return;
        setOrder(res.ordered);
        setGeometry(res.geometry);
        onChangeRef.current?.(res.ordered.map((i) => stops[i]));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [start, stops]);

  const pins: MapPin[] = stops.map((s, i) => ({
    id: s.id,
    coords: s.coords,
    label: s.label,
    sublabel: s.sublabel,
    index: i + 1,
  }));

  return (
    <MapBase
      pins={pins}
      start={start}
      routeGeometry={geometry}
      routeOrder={order ?? undefined}
      height={height}
      onPinClick={onPinClick}
    />
  );
}
