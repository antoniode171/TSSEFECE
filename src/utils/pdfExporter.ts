export interface ExportPdfOptions {
  onProgress?: (progress: number, message: string) => void;
  idPrefix?: string;
}

export async function exportSurveyToPdf(
  siteCode: string,
  options?: ExportPdfOptions
): Promise<void> {
  const { onProgress, idPrefix = 'export-' } = options || {};

  try {
    onProgress?.(5, 'Cargando módulos de exportación...');

    // Dynamic import to prevent heavy bundle execution on initial app boot
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ]);

    onProgress?.(12, 'Iniciando documento PDF...');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageCount = 6;
    let renderedCount = 0;

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      onProgress?.(
        Math.round(((pageNum - 0.5) / pageCount) * 88) + 5,
        `Procesando página ${pageNum} de ${pageCount}...`
      );

      // Prioritize dedicated unscaled export element, then fallback to general pdf-page
      const pageEl =
        document.getElementById(`${idPrefix}page-${pageNum}`) ||
        document.getElementById(`export-page-${pageNum}`) ||
        document.getElementById(`pdf-page-${pageNum}`);

      if (!pageEl) {
        console.warn(`Element for page ${pageNum} not found in DOM, skipping`);
        continue;
      }

      // Wait for any images inside this page to complete loading
      const images = Array.from(pageEl.querySelectorAll('img'));
      await Promise.all(
        images.map((img) => {
          if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            setTimeout(resolve, 600); // safety fallback timeout
          });
        })
      );

      // Render high resolution canvas (scale 2 = 300 DPI clarity)
      const canvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (renderedCount > 0) {
        pdf.addPage('a4', 'portrait');
      }

      // A4 is 210mm x 297mm
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      renderedCount++;
    }

    if (renderedCount === 0) {
      throw new Error('No se encontraron páginas para generar el PDF');
    }

    onProgress?.(95, 'Compilando archivo PDF final...');

    const cleanCode = (siteCode || 'SURVEY').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `REPORTE_SITE_SURVEY_${cleanCode}.pdf`;

    pdf.save(fileName);

    onProgress?.(100, '¡Descarga completada!');
  } catch (error) {
    console.error('Error al generar PDF:', error);
    throw error;
  }
}

export function printSurveyDocument(): void {
  window.print();
}
