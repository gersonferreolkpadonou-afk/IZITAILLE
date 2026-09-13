/**
 * Utilitaire de compression d'images côté client pour IZITAILLE.
 * Réduit drastiquement l'usage de la data mobile en Afrique de l'Ouest
 * (transforme une photo de 3-8 Mo en un fichier léger de 100-250 Ko).
 */

export interface CompressionResult {
  file: File;
  dataUrl: string;
  tailleOriginaleKo: number;
  tailleCompresseeKo: number;
  gainPourcentage: number;
}

export async function compresserPhoto(
  file: File,
  maxDimension = 1280,
  qualite = 0.72
): Promise<CompressionResult> {
  const tailleOriginaleKo = Math.round(file.size / 1024);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calcul des dimensions proportionnelles
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Impossible d initialiser le contexte canvas 2D'));
          return;
        }

        // Dessin et compression JPEG
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', qualite);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Erreur lors de la création du blob compressé'));
              return;
            }

            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            const tailleCompresseeKo = Math.round(blob.size / 1024);
            const gainPourcentage = Math.round(
              ((tailleOriginaleKo - tailleCompresseeKo) / tailleOriginaleKo) * 100
            );

            resolve({
              file: compressedFile,
              dataUrl,
              tailleOriginaleKo,
              tailleCompresseeKo,
              gainPourcentage: Math.max(0, gainPourcentage),
            });
          },
          'image/jpeg',
          qualite
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}
