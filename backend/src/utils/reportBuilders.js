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

function calcColWidths(totalWidth, columns) {
  const fixed = columns.map((c) => Math.min(Math.max((c.width || 22) * 6, 50), 200));
  const sum = fixed.reduce((a, b) => a + b, 0);
  if (sum <= totalWidth) return fixed;
  const ratio = totalWidth / sum;
  return fixed.map((w) => Math.max(50, Math.floor(w * ratio)));
}

function truncateText(doc, text, maxW) {
  let display = String(text);
  if (display.length < 2) return display;
  while (doc.widthOfString(display + '...') > maxW && display.length > 0) {
    display = display.slice(0, -1);
  }
  return display !== String(text) ? display + '...' : display;
}

function drawTableCell(doc, x, y, w, h, text, opts = {}) {
  const { bold, align = 'left', fill } = opts;
  const savedY = doc.y;
  if (fill) {
    doc.rect(x, y, w, h).fill(fill);
  }
  doc.rect(x, y, w, h).stroke('#CBD5E1');
  doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(8).fillColor(opts.color || '#0F172A');
  const pad = 4;
  const maxW = w - pad * 2;
  const display = truncateText(doc, text, maxW);
  const tx = x + pad;
  const ty = y + (h - 10) / 2;
  doc.text(display, tx, ty, { width: maxW, align });
  doc.y = savedY;
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
    const pageW = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const rowH = 20;
    const headerH = 24;
    const colWs = calcColWidths(pageW, columns);
    const startX = doc.page.margins.left;

    const drawHeader = () => {
      let cx = startX;
      columns.forEach((col, i) => {
        drawTableCell(doc, cx, doc.y, colWs[i], headerH, col.header, {
          bold: true,
          align: 'center',
          fill: '#0F4C5C',
          color: '#FFFFFF',
        });
        cx += colWs[i];
      });
      doc.y += headerH;
    };

    const ensureSpace = (needed = rowH * 2) => {
      if (doc.y + needed >= doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        doc.y = doc.page.margins.top;
        drawHeader();
      }
    };

    // Title
    doc.font('Helvetica-Bold').fontSize(16).fillColor('#0F172A').text(report.title);
    let hasSub = false;
    if (report.subtitle) {
      hasSub = true;
      doc.moveDown(0.15);
      doc.font('Helvetica').fontSize(9).fillColor('#475569').text(report.subtitle);
    }
    // Meta line: generation date + filters inline
    if (!hasSub) doc.moveDown(0.15);
    else doc.moveDown(0.25);
    const metaParts = [`Generado: ${new Date().toLocaleString('es-BO')}`];
    filters.forEach(([k, v]) => metaParts.push(`${k}: ${v}`));
    doc.font('Helvetica').fontSize(8).fillColor('#64748B').text(metaParts.join('  |  '));

    doc.moveDown(0.5);
    drawHeader();

    const rows = report.rows || [];
    rows.forEach((row, ri) => {
      ensureSpace();
      let cx = startX;
      const fill = ri % 2 === 0 ? undefined : '#F8FAFC';
      columns.forEach((col, i) => {
        drawTableCell(doc, cx, doc.y, colWs[i], rowH, row[col.key] ?? '', {
          fill,
          color: '#111827',
        });
        cx += colWs[i];
      });
      doc.y += rowH;
    });

    if (rows.length === 0) {
      ensureSpace(rowH * 3);
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
