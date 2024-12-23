export interface Shape {
    shape: string | null;
    colorMapping: string;
    color: string;
    backgroundColor: string;
    colorAlpha: string;
    density: number;
    densityOriginal: number;
    maxParticleSize: number;
    maxParticleSizeOriginal: number;
}

export type MousePosition = {
    x: number;
    y: number;
};
