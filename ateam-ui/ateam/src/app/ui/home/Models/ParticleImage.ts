export type ColorMappingType = "original" | string; // Define more specific types as needed
export type ColorAlphaType = "original" | string; // Define more specific types as needed

export class ParticleImage {
    constructor(
        public src: string,
        public backgroundColor: string = "transparent",
        public colorMapping: ColorMappingType = "original",
        public color: string = "#fefefe",
        public colorAlpha: ColorAlphaType = "original",
        public density: number = 13,
        public densityOriginal: number = 13,
        public maxParticleSize: number = 3,
        public maxParticleSizeOriginal: number = 3
    ) {}
}
