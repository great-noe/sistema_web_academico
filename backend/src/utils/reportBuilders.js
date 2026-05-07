const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

function sanitizeFileName(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function normalizeFilters(filters = {}) {
  return Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== '');
}

async function buildExcelReport(report) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Codex';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(report.sheetName || 'Reporte');
  const columns = report.columns || [];
  const filterEntries = normalizeFilters(report.filters);
  let rowPointer = 1;

  sheet.mergeCells(rowPointer, 1, rowPointer, Math.max(columns.length, 1));
  sheet.getCell(rowPointer, 1).value = report.title;
  sheet.getCell(rowPointer, 1).font = { bold: true, size: 16 };
  rowPointer += 1;

  if (report.subtitle) {
    sheet.mergeCells(rowPointer, 1, rowPointer, Math.max(columns.length, 1));
    sheet.getCell(rowPointer, 1).value = report.subtitle;
    sheet.getCell(rowPointer, 1).font = { italic: true, color: { argb: 'FF5C6470' } };
    rowPointer += 1;
  }

  sheet.getCell(rowPointer, 1).value = `Generado: ${new Date().toLocaleString('es-BO')}`;
  rowPointer += 1;

  if (filterEntries.length) {
    filterEntries.forEach(([key, value]) => {
      sheet.getCell(rowPointer, 1).value = `${key}: ${value}`;
      rowPointer += 1;
    });
  }

  rowPointer += 1;

  sheet.columns = columns.map((column) => ({
    header: column.header,
    key: column.key,
    width: column.width || 20,
  }));

  const headerRow = sheet.getRow(rowPointer);
  columns.forEach((column, index) => {
    headerRow.getCell(index + 1).value = column.header;
  });
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F4C5C' },
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  rowPointer += 1;

  (report.rows || []).forEach((row) => {
    const targetRow = sheet.getRow(rowPointer);
    columns.forEach((column, index) => {
      targetRow.getCell(index + 1).value = row[column.key] ?? '';
    });
    rowPointer += 1;
  });

  sheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD9DDE3' } },
        left: { style: 'thin', color: { argb: 'FFD9DDE3' } },
        bottom: { style: 'thin', color: { argb: 'FFD9DDE3' } },
        right: { style: 'thin', color: { argb: 'FFD9DDE3' } },
      };
      if (rowNumber > 1) {
        cell.alignment = { vertical: 'middle', wrapText: true };
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
}

function buildTableLine(columns, row) {
  return columns
    .map((column) => {
      const value = String(row[column.key] ?? '');
      const width = Math.max(10, Math.min(column.width || 22, 28));
      if (value.length <= width) {
        return value.padEnd(width, ' ');
      }
      return `${value.slice(0, width - 3)}...`;
    })
    .join(' | ');
}

function buildPdfReport(report) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 36,
      bufferPages: true,
    });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const columns = report.columns || [];
    const filters = normalizeFilters(report.filters);
    const lineHeight = 14;

    const ensureSpace = (needed = lineHeight * 2) => {
      if (doc.y + needed >= doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
      }
    };

    doc.font('Helvetica-Bold').fontSize(18).fillColor('#0F172A').text(report.title);
    if (report.subtitle) {
      doc.moveDown(0.2);
      doc.font('Helvetica').fontSize(10).fillColor('#475569').text(report.subtitle);
    }

    doc.moveDown(0.6);
    doc.font('Helvetica').fontSize(9).fillColor('#334155').text(`Generado: ${new Date().toLocaleString('es-BO')}`);
    filters.forEach(([key, value]) => {
      doc.text(`${key}: ${value}`);
    });

    doc.moveDown(0.8);
    doc.font('Courier-Bold').fontSize(8).fillColor('#0F172A');
    const header = buildTableLine(columns, Object.fromEntries(columns.map((column) => [column.key, column.header])));
    doc.text(header);
    doc.moveTo(doc.x, doc.y + 2).lineTo(doc.page.width - doc.page.margins.right, doc.y + 2).stroke('#CBD5E1');
    doc.moveDown(0.3);

    doc.font('Courier').fontSize(8).fillColor('#111827');
    (report.rows || []).forEach((row) => {
      ensureSpace();
      doc.text(buildTableLine(columns, row), {
        lineBreak: true,
      });
    });

    if (!report.rows || report.rows.length === 0) {
      ensureSpace();
      doc.font('Helvetica-Oblique').fontSize(10).fillColor('#64748B').text(
        report.emptyMessage || 'No se encontraron registros para los filtros indicados.',
      );
    }

    doc.end();
  });
}

module.exports = {
  buildExcelReport,
  buildPdfReport,
  sanitizeFileName,
};
