// 修正前: import { Vector3D, Vector2D, Constellation } from "../types/astronomy";
// 修正後:
import type { Vector3D, Vector2D, Constellation } from "../types/astronomy";

export class AdvancedPlanetariumProjector {
  private pitch: number = 0;
  private yaw: number = 0;
  private fov: number = 500;

  constructor(private screenWidth: number, private screenHeight: number) {}

  public updateOrientation(pitch: number, yaw: number): void {
    this.pitch = pitch;
    this.yaw = ((yaw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  }

  public project(vector: Vector3D): Vector2D | null {
    const cosY = Math.cos(this.yaw);
    const sinY = Math.sin(this.yaw);
    const x1 = vector.x * cosY - vector.z * sinY;
    const z1 = vector.x * sinY + vector.z * cosY;
    
    const cosP = Math.cos(this.pitch);
    const sinP = Math.sin(this.pitch);
    const y2 = vector.y * cosP - z1 * sinP;
    const z2 = vector.y * sinP + z1 * cosP;

    if (z2 <= 0.1) return null;

    return {
      x: this.screenWidth / 2 + (x1 / z2) * this.fov,
      y: this.screenHeight / 2 - (y2 / z2) * this.fov
    };
  }

  public getTargetConstellation(constellations: Constellation[]): Constellation {
    const currentAngleDeg = (this.yaw * 180) / Math.PI;
    return constellations.reduce((closest, current) => {
      const diffA = Math.abs(closest.baseLongitude - currentAngleDeg);
      const diffB = Math.abs(current.baseLongitude - currentAngleDeg);
      return Math.min(diffB, 360 - diffB) < Math.min(diffA, 360 - diffA) ? current : closest;
    });
  }
}