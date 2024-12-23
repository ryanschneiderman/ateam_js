import { ParticleImage, ColorMappingType, ColorAlphaType } from './ParticleImage';

type ImageAttributes = {
  src: string;
  colorMapping?: ColorMappingType;
  color?: string;
  backgroundColor?: string;
  colorAlpha?: ColorAlphaType;
  density?: number;
  maxParticleSize?: number;
};

export class ImageLoader {
  particleImages: ParticleImage[] = [];
  onLoadAllCallback?: () => void;

  constructor(imagesAttributes: ImageAttributes[], onLoadAllCallback?: () => void) {
    this.onLoadAllCallback = onLoadAllCallback;
    this.loadImages(imagesAttributes);
  }

  private loadImages(imagesAttributes: ImageAttributes[]): void {
    let loadedCount = 0;
    const totalImages = imagesAttributes.length;

    imagesAttributes.forEach(attributes => {
      const particleImage = new ParticleImage(
        attributes.src,
        attributes.colorMapping,
        attributes.color,
        attributes.backgroundColor,
        attributes.colorAlpha,
        attributes.density,
        attributes.maxParticleSize
      );

      this.particleImages.push(particleImage);
      loadedCount++;
      if (loadedCount === totalImages) {
        console.log('All images loaded as ParticleImage instances');
        this.onLoadAllCallback?.();
      }
    });
  }
}

export default ImageLoader;