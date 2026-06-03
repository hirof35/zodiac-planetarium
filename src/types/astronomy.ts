export interface Vector3D { 
  x: number; 
  y: number; 
  z: number; 
}

export interface Vector2D { 
  x: number; 
  y: number; 
}

export interface Star {
  id: string;
  name: string;
  magnitude: number;
  position: Vector3D;
}

export interface Constellation {
  id: string;
  name: string;
  jpName: string;
  zodiacOrder: number;
  baseLongitude: number;
  stars: Star[];
  lines: [string, string][];
}