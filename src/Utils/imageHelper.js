/**
 * Helper utility to compress and convert images to WebP format using canvas on the client side.
 * Resizes images exceeding 1920x1080 bounds while maintaining aspect ratio and quality.
 * 
 * @param {File} file - The original file object selected by the user.
 * @param {number} quality - Target compression quality from 0.0 to 1.0 (default 0.8).
 * @returns {Promise<File>} A promise that resolves to the compressed WebP File object.
 */
export const compressAndConvertToWebP = (file, quality = 0.8) => {
  return new Promise((resolve) => {
    // If the file is not an image, resolve immediately with the original file
    if (!file || !file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Define max constraints
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, "") + ".webp",
                { type: "image/webp", lastModified: Date.now() }
              );
              resolve(webpFile);
            } else {
              resolve(file); // Fallback if blob creation fails
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve(file); // Fallback on load error
    };
    reader.onerror = () => resolve(file); // Fallback on read error
  });
};
