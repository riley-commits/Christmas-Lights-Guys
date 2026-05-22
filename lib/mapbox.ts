import type { LngLat } from "@/lib/types";

export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

export const hasMapboxToken = MAPBOX_TOKEN.length > 0;

export const WINNIPEG_CENTER: LngLat = [-97.1384, 49.8951];

export interface OptimizedRoute {
  ordered: number[]; // original index order, e.g. [0,2,1] means visit stop 0, then 2, then 1
  geometry?: GeoJSON.LineString;
  distanceMeters: number;
  durationSeconds: number;
}

export async function fetchOptimizedRoute(
  start: LngLat,
  stops: LngLat[]
): Promise<OptimizedRoute | null> {
  if (!hasMapboxToken) return null;
  if (stops.length === 0) return null;

  // Mapbox Optimization v1 takes up to 12 coords total
  const coords = [start, ...stops].slice(0, 12);
  const path = coords.map((c) => `${c[0]},${c[1]}`).join(";");
  const url =
    `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${path}` +
    `?source=first&roundtrip=false&geometries=geojson&overview=full&steps=false&access_token=${MAPBOX_TOKEN}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.trips || data.trips.length === 0) return null;
    const trip = data.trips[0];
    const waypoints: Array<{ waypoint_index: number; trips_index: number }> = data.waypoints ?? [];

    // Build the ordered list of original-stop indexes (excluding the start)
    const order: number[] = [];
    for (let i = 1; i < waypoints.length; i++) {
      const wp = waypoints[i];
      order[wp.waypoint_index - 1] = i - 1; // -1 because stops[] doesn't include start
    }

    return {
      ordered: order.filter((n) => n !== undefined),
      geometry: trip.geometry as GeoJSON.LineString,
      distanceMeters: trip.distance ?? 0,
      durationSeconds: trip.duration ?? 0,
    };
  } catch {
    return null;
  }
}

// Fallback "ordering" when no token / API fails: greedy nearest-neighbour from the start point
export function greedyOrderStops(start: LngLat, stops: LngLat[]): number[] {
  const remaining = stops.map((_, i) => i);
  const order: number[] = [];
  let current = start;
  while (remaining.length > 0) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const stop = stops[remaining[i]];
      const d = haversine(current, stop);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    const pick = remaining.splice(bestIdx, 1)[0];
    order.push(pick);
    current = stops[pick];
  }
  return order;
}

export function haversine(a: LngLat, b: LngLat): number {
  const R = 6371e3;
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const lat1 = toRad(a[1]);
  const lat2 = toRad(b[1]);
  const x =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}
