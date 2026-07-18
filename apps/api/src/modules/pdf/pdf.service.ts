import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import SVGtoPDF = require('svg-to-pdfkit');

@Injectable()
export class PdfService {
  generateInvoice(order: any): Readable {
    // Use A4 size explicitly; autoFirstPage gives us one page only
    const doc = new PDFDocument({ margin: 30, size: 'A4', autoFirstPage: true });

    // Prevent PDFKit from adding a second page automatically
    doc.on('pageAdded', () => { /* intentionally empty – we target single page */ });

    // Fallback paths for logo resolution
    const possiblePaths = [
      path.join(process.cwd(), 'apps/admin/public/logo.svg'),
      path.join(process.cwd(), '../admin/public/logo.svg'),
      path.join(__dirname, '../../../../../apps/admin/public/logo.svg'),
      path.join(__dirname, '../../../../../../apps/admin/public/logo.svg')
    ];
    let logoPath = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) { logoPath = p; break; }
    }

    if (logoPath) {
      const svg = fs.readFileSync(logoPath, 'utf8');
      doc.save();
      doc.translate(38, 30);
      const scale = 75 / 973;
      doc.scale(scale, scale);
      SVGtoPDF(doc, svg, 0, 0, { preserveAspectRatio: 'xMinYMin meet' });
      doc.restore();
    }

    // Header vertical line
    doc.moveTo(120, 28).lineTo(120, 88).lineWidth(2).stroke('#74950A');

    // Company header
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#74950A').text("ALI & KHAN'S GREEN WHEELS", 130, 34);
    doc.font('Helvetica-Oblique').fontSize(9).fillColor('#5E1414').text("Electric Vehicle Dealers", 130, 50);
    doc.font('Helvetica').fontSize(7.5).fillColor('gray').text("Pakistan | ghulam.ali9366@gmail.com | +92 323 9143977 | +92 311 9143977", 130, 62);

    // Banner
    doc.rect(30, 96, 535, 24).fill('#5E1414');
    doc.font('Helvetica-Bold').fontSize(12).fillColor('white').text('INVOICE / SALE AGREEMENT', 30, 103, { align: 'center', width: 535 });

    // Order Number / Date grid
    doc.rect(30, 126, 267, 30).fillAndStroke('#EAEFC4', '#74950A');
    doc.rect(297, 126, 268, 30).fillAndStroke('#EAEFC4', '#74950A');
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#74950A').text('Order Number', 30, 131, { align: 'center', width: 267 });
    doc.font('Helvetica').fontSize(8).fillColor('black').text(order.orderNumber, 30, 141, { align: 'center', width: 267 });
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#74950A').text('Date', 297, 131, { align: 'center', width: 268 });
    const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.font('Helvetica').fontSize(8).fillColor('black').text(dateFormatted, 297, 141, { align: 'center', width: 268 });

    const R = 20; // row height
    const L = 140; // label col width
    const V = 30 + L; // value col x
    const VW = 535 - L; // value col width

    const drawRow = (y: number, label: string, value: string) => {
      doc.rect(30, y, L, R).stroke('#d3d3d3');
      doc.rect(V, y, VW, R).stroke('#d3d3d3');
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#5E1414').text(label, 35, y + 6);
      doc.font('Helvetica').fontSize(8).fillColor('#333').text(value, V + 5, y + 6);
    };

    const drawSectionHeader = (y: number, label: string) => {
      doc.rect(30, y, 535, 16).fill('#EAEFC4');
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#74950A').text(label, 35, y + 4);
    };

    let y = 163;

    // Customer Details
    drawSectionHeader(y, 'CUSTOMER DETAILS'); y += 20;
    drawRow(y, 'Name', order.customerName || 'N/A'); y += R;
    drawRow(y, 'Phone', order.customerPhone || 'N/A'); y += R;
    if (order.customerCNIC) { drawRow(y, 'CNIC', order.customerCNIC); y += R; }
    if (order.customerAddress) { drawRow(y, 'Address', order.customerAddress); y += R; }

    y += 8;

    // Item Details
    drawSectionHeader(y, 'ITEM DETAILS'); y += 20;
    if (order.bike) {
      drawRow(y, 'Bike', `${order.bike.model?.brand || ''} ${order.bike.model?.modelName || ''}`.trim()); y += R;
      drawRow(y, 'Chassis Number', order.bike.chassisNumber || 'N/A'); y += R;
      drawRow(y, 'Engine Number', order.bike.engineNumber || 'N/A'); y += R;
    } else if (order.part) {
      drawRow(y, 'Part Name', order.part.name || 'N/A'); y += R;
      drawRow(y, 'Quantity', String(order.quantity || 1)); y += R;
    }

    y += 8;

    // Payment Details
    drawSectionHeader(y, 'PAYMENT DETAILS'); y += 20;
    const methodMap: Record<string, string> = { ONLINE_TRANSFER: 'Online Transfer', CASH: 'Cash' };
    drawRow(y, 'Payment Method', methodMap[order.paymentMethod] || order.paymentMethod); y += R;

    // Total amount row
    doc.rect(30, y, L, 28).fillAndStroke('#74950A', '#74950A');
    doc.rect(V, y, VW, 28).fillAndStroke('#EAEFC4', '#d3d3d3');
    doc.font('Helvetica-Bold').fontSize(10).fillColor('white').text('TOTAL AMOUNT', 30, y + 9, { width: L, align: 'center' });
    const amount = order.bike?.actualSalePrice || order.amount || 0;
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#74950A').text(`Rs. ${Number(amount).toLocaleString()}`, V + 5, y + 9);
    y += 36;

    // Signatures
    drawSectionHeader(y, 'SIGNATURES'); y += 20;

    const sigW = 240;
    const sigH = 55;
    const leftX = 30;
    const rightX = 325;

    doc.rect(leftX, y, sigW, sigH).stroke('#d3d3d3');
    doc.rect(rightX, y, sigW, sigH).stroke('#d3d3d3');

    doc.font('Helvetica-Bold').fontSize(8).fillColor('#5E1414')
      .text('Customer Signature', leftX, y + sigH + 4, { width: sigW, align: 'center' });
    doc.font('Helvetica').fontSize(7.5).fillColor('gray')
      .text(order.customerName || '', leftX, y + sigH + 14, { width: sigW, align: 'center' });

    doc.font('Helvetica-Bold').fontSize(8).fillColor('#5E1414')
      .text('Authorized Signatory', rightX, y + sigH + 4, { width: sigW, align: 'center' });
    doc.font('Helvetica').fontSize(7.5).fillColor('gray')
      .text("Ali & Khan's Green Wheels", rightX, y + sigH + 14, { width: sigW, align: 'center' });

    y += sigH + 32;

    // Footer
    doc.moveTo(30, y).lineTo(565, y).lineWidth(0.5).stroke('#5E1414');
    doc.rect(30, y, 535, 30).fill('#F8F8F8');
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#74950A')
      .text("Thank you for your purchase! — Ali & Khan's Green Wheels", 30, y + 7, { align: 'center', width: 535 });
    doc.font('Helvetica-Oblique').fontSize(7).fillColor('gray')
      .text("This invoice serves as a legal sale agreement. Please retain for your records.", 30, y + 18, { align: 'center', width: 535 });

    doc.end();
    return doc as unknown as Readable;
  }

  generateReceipt(transaction: any): Readable {
    const doc = new PDFDocument({ margin: 30, size: 'A4', autoFirstPage: true });

    doc.on('pageAdded', () => { /* intentionally empty – we target single page */ });

    // Fallback paths for logo resolution
    const possiblePaths = [
      path.join(process.cwd(), 'apps/admin/public/logo.svg'),
      path.join(process.cwd(), '../admin/public/logo.svg'),
      path.join(__dirname, '../../../../../apps/admin/public/logo.svg'),
      path.join(__dirname, '../../../../../../apps/admin/public/logo.svg')
    ];
    let logoPath = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) { logoPath = p; break; }
    }

    if (logoPath) {
      const svg = fs.readFileSync(logoPath, 'utf8');
      doc.save();
      doc.translate(38, 30);
      const scale = 75 / 973;
      doc.scale(scale, scale);
      SVGtoPDF(doc, svg, 0, 0, { preserveAspectRatio: 'xMinYMin meet' });
      doc.restore();
    }

    // Header vertical line
    doc.moveTo(120, 28).lineTo(120, 88).lineWidth(2).stroke('#74950A');

    // Company header
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#74950A').text("ALI & KHAN'S GREEN WHEELS", 130, 34);
    doc.font('Helvetica-Oblique').fontSize(9).fillColor('#5E1414').text("Electric Vehicle Dealers", 130, 50);
    doc.font('Helvetica').fontSize(7.5).fillColor('gray').text("Pakistan | ghulam.ali9366@gmail.com | +92 311 9143977 | +92 323 9143977", 130, 62);

    // Banner
    doc.rect(30, 96, 535, 24).fill('#5E1414');
    doc.font('Helvetica-Bold').fontSize(12).fillColor('white').text('PAYMENT RECEIPT', 30, 103, { align: 'center', width: 535 });

    // Receipt ID / Date grid
    doc.rect(30, 126, 267, 30).fillAndStroke('#EAEFC4', '#74950A');
    doc.rect(297, 126, 268, 30).fillAndStroke('#EAEFC4', '#74950A');
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#74950A').text('Receipt ID', 30, 131, { align: 'center', width: 267 });
    doc.font('Helvetica').fontSize(8).fillColor('black').text(transaction.id, 30, 141, { align: 'center', width: 267 });
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#74950A').text('Date', 297, 131, { align: 'center', width: 268 });
    const dateFormatted = new Date(transaction.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.font('Helvetica').fontSize(8).fillColor('black').text(dateFormatted, 297, 141, { align: 'center', width: 268 });

    const R = 20;
    const L = 140;
    const V = 30 + L;
    const VW = 535 - L;

    const drawRow = (y: number, label: string, value: string) => {
      doc.rect(30, y, L, R).stroke('#d3d3d3');
      doc.rect(V, y, VW, R).stroke('#d3d3d3');
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#5E1414').text(label, 35, y + 6);
      doc.font('Helvetica').fontSize(8).fillColor('#333').text(value, V + 5, y + 6);
    };

    const drawSectionHeader = (y: number, label: string) => {
      doc.rect(30, y, 535, 16).fill('#EAEFC4');
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#74950A').text(label, 35, y + 4);
    };

    let y = 163;

    // Payment Details
    drawSectionHeader(y, 'PAYMENT DETAILS'); y += 20;
    const methodMap: Record<string, string> = { ONLINE_TRANSFER: 'Online Transfer', CASH: 'Cash' };
    drawRow(y, 'Payment Method', methodMap[transaction.method] || transaction.method); y += R;

    // Amount paid row
    doc.rect(30, y, L, 28).fillAndStroke('#74950A', '#74950A');
    doc.rect(V, y, VW, 28).fillAndStroke('#EAEFC4', '#d3d3d3');
    doc.font('Helvetica-Bold').fontSize(10).fillColor('white').text('AMOUNT PAID', 30, y + 9, { width: L, align: 'center' });
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#74950A').text(`Rs. ${Number(transaction.amount).toLocaleString()}`, V + 5, y + 9);
    y += 36;

    // Order Details
    const order = transaction.order || transaction.partOrder;
    if (order) {
      y += 8;
      drawSectionHeader(y, 'ORDER DETAILS'); y += 20;
      drawRow(y, 'Order Number', order.orderNumber || 'N/A'); y += R;
      drawRow(y, 'Customer Name', order.customerName || 'N/A'); y += R;
      drawRow(y, 'Customer Phone', order.customerPhone || 'N/A'); y += R;
    }

    y += 8;

    // Signatures
    drawSectionHeader(y, 'SIGNATURES'); y += 20;

    const sigW = 240;
    const sigH = 55;
    const leftX = 30;
    const rightX = 325;

    doc.rect(leftX, y, sigW, sigH).stroke('#d3d3d3');
    doc.rect(rightX, y, sigW, sigH).stroke('#d3d3d3');

    const customerName = order?.customerName || '';
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#5E1414')
      .text('Customer Signature', leftX, y + sigH + 4, { width: sigW, align: 'center' });
    doc.font('Helvetica').fontSize(7.5).fillColor('gray')
      .text(customerName, leftX, y + sigH + 14, { width: sigW, align: 'center' });

    doc.font('Helvetica-Bold').fontSize(8).fillColor('#5E1414')
      .text('Authorized Signatory', rightX, y + sigH + 4, { width: sigW, align: 'center' });
    doc.font('Helvetica').fontSize(7.5).fillColor('gray')
      .text("Ali & Khan's Green Wheels", rightX, y + sigH + 14, { width: sigW, align: 'center' });

    y += sigH + 32;

    // Footer
    doc.moveTo(30, y).lineTo(565, y).lineWidth(0.5).stroke('#5E1414');
    doc.rect(30, y, 535, 30).fill('#F8F8F8');
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#74950A')
      .text("Thank you for your business! — Ali & Khan's Green Wheels", 30, y + 7, { align: 'center', width: 535 });
    doc.font('Helvetica-Oblique').fontSize(7).fillColor('gray')
      .text("This receipt confirms your payment. Please retain for your records.", 30, y + 18, { align: 'center', width: 535 });

    doc.end();
    return doc as unknown as Readable;
  }
}
