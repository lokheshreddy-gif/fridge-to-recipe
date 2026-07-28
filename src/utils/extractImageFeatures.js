/**
 * Client-Side HTML5 Canvas Visual Feature Extractor
 * Analyzes RGB color channels, dominant hue, and brightness from any image Data URL.
 */
export function extractImageFeatures(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 64; // downscale for fast analysis
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return resolve({ dominantHue: 'yellow', primaryColor: 'amber' });
        }

        ctx.drawImage(img, 0, 0, 64, 64);
        const imageData = ctx.getImageData(0, 0, 64, 64);
        const data = imageData.data;

        let rSum = 0;
        let gSum = 0;
        let bSum = 0;

        for (let i = 0; i < data.length; i += 4) {
          rSum += data[i];
          gSum += data[i + 1];
          bSum += data[i + 2];
        }

        const count = data.length / 4;
        const avgR = rSum / count;
        const avgG = gSum / count;
        const avgB = bSum / count;

        // Classify dominant color profile
        let dominantHue = 'yellow';
        let primaryColor = 'amber';

        if (avgG > avgR * 1.15 && avgG > avgB * 1.15) {
          dominantHue = 'green';
          primaryColor = 'emerald';
        } else if (avgR > avgG * 1.25 && avgR > avgB * 1.2) {
          dominantHue = 'red';
          primaryColor = 'rose';
        } else if (avgR > 180 && avgG > 180 && avgB > 180) {
          dominantHue = 'white';
          primaryColor = 'slate';
        } else if (avgR > 130 && avgG > 100 && avgB < 90) {
          dominantHue = 'yellow';
          primaryColor = 'amber';
        } else if (avgR > 90 && avgG < 80 && avgB < 80) {
          dominantHue = 'brown';
          primaryColor = 'amber';
        }

        resolve({ dominantHue, primaryColor, avgR, avgG, avgB });
      } catch (err) {
        console.error('[Feature Extract Error]', err);
        resolve({ dominantHue: 'yellow', primaryColor: 'amber' });
      }
    };

    img.onerror = () => {
      resolve({ dominantHue: 'yellow', primaryColor: 'amber' });
    };

    img.src = dataUrl;
  });
}
