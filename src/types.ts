export interface ObservationLocation {
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
}

export interface DisplayOptions {
  constellations: boolean;
  labels: boolean;
  planets: boolean;
}

export interface StarRecord {
  id: string;
  name: string;
  ra: number;
  dec: number;
  magnitude: number;
  color: string;
}

export interface SkyPoint {
  id: string;
  name: string;
  altitude: number;
  azimuth: number;
  magnitude: number;
  color: string;
  kind: 'star' | 'sun' | 'moon' | 'planet';
}

export interface ConstellationRecord {
  id: string;
  name: string;
  lines: Array<[string, string]>;
}

export interface SkyModel {
  stars: SkyPoint[];
  bodies: SkyPoint[];
  sunAltitude: number;
  moonIllumination: number;
  moonPhase: number;
  limitingMagnitude: number;
}

export interface LocationSearchResult {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}
