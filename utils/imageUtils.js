import sharp from 'sharp';

export async function optimizeImage(imageInput, returnDetails = false) {
  try {
    // First get image metadata and stats
    const originalImage = sharp(Buffer.isBuffer(imageInput) ? imageInput : imageInput);
    const metadata = await originalImage.metadata();
    const stats = await originalImage.stats();
    const originalBuffer = await originalImage.toBuffer();
    
    // Calculate target dimensions while maintaining aspect ratio
    const MAX_WIDTH = 192;
    const MAX_HEIGHT = 192;
    let width = metadata.width;
    let height = metadata.height;
    
    if (width > MAX_WIDTH) {
      height = Math.round(height * (MAX_WIDTH / width));
      width = MAX_WIDTH;
    }
    if (height > MAX_HEIGHT) {
      width = Math.round(width * (MAX_HEIGHT / height));
      height = MAX_HEIGHT;
    }

    // Optimize the image
    const optimizedBuffer = await sharp(imagePath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: 85,
        progressive: true,
        chromaSubsampling: '4:2:0' // Better compression
      })
      .toBuffer();

    // Check final size
    const optimizedSize = optimizedBuffer.length;
    const MAX_SIZE = 20 * 1024 * 1024; // 20MB limit for OpenAI

    if (optimizedSize > MAX_SIZE) {
      // If still too large, reduce quality further
      return await sharp(imagePath)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({
          quality: 60,
          progressive: true,
          chromaSubsampling: '4:2:0'
        })
        .toBuffer();

      // Get final metadata
      const finalMetadata = await sharp(optimizedBuffer).metadata();
      
      // Convert to base64
      const base64Data = optimizedBuffer.toString('base64');
      
      if (returnDetails) {
        return {
          base64Data,
          originalSize: metadata.size,
          originalWidth: metadata.width,
          originalHeight: metadata.height,
          optimizedSize: optimizedBuffer.length,
          optimizedWidth: finalMetadata.width,
          optimizedHeight: finalMetadata.height,
          compressionRatio: (metadata.size / optimizedBuffer.length).toFixed(2),
          format: finalMetadata.format
        };
      }
      
      return base64Data;
    }

    // Get final metadata
    const finalMetadata = await sharp(optimizedBuffer).metadata();
    
    // Convert to base64
    const base64Data = optimizedBuffer.toString('base64');
    
    if (returnDetails) {
      return {
        base64Data,
        originalSize: originalBuffer.length,
        originalWidth: metadata.width,
        originalHeight: metadata.height,
        optimizedSize: optimizedBuffer.length,
        optimizedWidth: finalMetadata.width,
        optimizedHeight: finalMetadata.height,
        compressionRatio: (originalBuffer.length / optimizedBuffer.length).toFixed(2),
        format: finalMetadata.format
      };
    }
    
    return base64Data;
  } catch (error) {
    console.error('Image optimization failed:', error);
    throw error;
  }
}
