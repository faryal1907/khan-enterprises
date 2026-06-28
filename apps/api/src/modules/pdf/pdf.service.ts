import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import SVGtoPDF = require('svg-to-pdfkit');

@Injectable()
export class PdfService {
  generateInvoice(order: any): Readable {
    const doc = new PDFDocument({ margin: 50 });
    
    // Fallback paths for logo resolution
    const possiblePaths = [
      path.join(process.cwd(), 'apps/admin/public/logo.svg'),
      path.join(process.cwd(), '../admin/public/logo.svg'),
      path.join(__dirname, '../../../../../apps/admin/public/logo.svg'),
      path.join(__dirname, '../../../../../../apps/admin/public/logo.svg')
    ];
    let logoPath = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        logoPath = p;
        break;
      }
    }

    if (logoPath) {
      const svg = fs.readFileSync(logoPath, 'utf8');
      doc.save();
      doc.translate(65, 50);
      const scale = 110 / 973; 
      doc.scale(scale, scale);
      SVGtoPDF(doc, svg, 0, 0, { preserveAspectRatio: 'xMinYMin meet' });
      doc.restore();
    }

    // Header Vertical Line
    doc.moveTo(180, 50).lineTo(180, 120).lineWidth(2).stroke('#74950A');

    // Company Header Info
    doc.font('Helvetica-Bold').fontSize(18).fillColor('#74950A').text("ALI & KHAN'S GREEN WHEELS", 195, 60);
    doc.font('Helvetica-Oblique').fontSize(11).fillColor('#5E1414').text("Authorized Motorcycle Dealership", 195, 80);
    doc.font('Helvetica').fontSize(10).fillColor('gray').text("Pakistan | ghulam.ali9366@gmail.com | +92 333443 7840", 195, 96);

    // Banner
    doc.rect(50, 150, 512, 35).fill('#5E1414');
    doc.font('Helvetica-Bold').fontSize(16).fillColor('white').text('INVOICE / SALE AGREEMENT', 50, 160, { align: 'center', width: 512 });

    // Grid (Order Number, Date)
    // Col 1
    doc.rect(50, 210, 256, 40).fillAndStroke('#EAEFC4', '#74950A');
    // Col 2
    doc.rect(306, 210, 256, 40).fillAndStroke('#EAEFC4', '#74950A');

    // Col 1 text
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#74950A').text('Order Number', 50, 218, { align: 'center', width: 256 });
    doc.font('Helvetica').fontSize(9).fillColor('black').text(order.orderNumber, 50, 232, { align: 'center', width: 256 });

    // Col 2 text
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#74950A').text('Date', 306, 218, { align: 'center', width: 256 });
    const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.font('Helvetica').fontSize(9).fillColor('black').text(dateFormatted, 306, 232, { align: 'center', width: 256 });

    // Customer Details
    doc.rect(50, 280, 512, 20).fill('#EAEFC4');
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#74950A').text('CUSTOMER DETAILS', 60, 285);

    let orderY = 315;
    // Row 1
    doc.rect(50, orderY, 150, 25).stroke('#d3d3d3');
    doc.rect(200, orderY, 362, 25).stroke('#d3d3d3');
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#5E1414').text('Name', 60, orderY + 8);
    doc.font('Helvetica').fontSize(10).fillColor('#333').text(order.customerName || 'N/A', 210, orderY + 8);
    
    // Row 2
    orderY += 25;
    doc.rect(50, orderY, 150, 25).stroke('#d3d3d3');
    doc.rect(200, orderY, 362, 25).stroke('#d3d3d3');
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#5E1414').text('Phone', 60, orderY + 8);
    doc.font('Helvetica').fontSize(10).fillColor('#333').text(order.customerPhone || 'N/A', 210, orderY + 8);

    if (order.customerCNIC) {
      orderY += 25;
      doc.rect(50, orderY, 150, 25).stroke('#d3d3d3');
      doc.rect(200, orderY, 362, 25).stroke('#d3d3d3');
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#5E1414').text('CNIC', 60, orderY + 8);
      doc.font('Helvetica').fontSize(10).fillColor('#333').text(order.customerCNIC, 210, orderY + 8);
    }
    
    if (order.customerAddress) {
      orderY += 25;
      doc.rect(50, orderY, 150, 25).stroke('#d3d3d3');
      doc.rect(200, orderY, 362, 25).stroke('#d3d3d3');
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#5E1414').text('Address', 60, orderY + 8);
      doc.font('Helvetica').fontSize(10).fillColor('#333').text(order.customerAddress, 210, orderY + 8);
    }

    orderY += 45;

    // Item Details
    doc.rect(50, orderY, 512, 20).fill('#EAEFC4');
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#74950A').text('ITEM DETAILS', 60, orderY + 5);
    orderY += 35;

    if (order.bike) {
      doc.rect(50, orderY, 150, 25).stroke('#d3d3d3');
      doc.rect(200, orderY, 362, 25).stroke('#d3d3d3');
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#5E1414').text('Bike', 60, orderY + 8);
      doc.font('Helvetica').fontSize(10).fillColor('#333').text(`${order.bike.model?.brand} ${order.bike.model?.modelName}`, 210, orderY + 8);

      orderY += 25;
      doc.rect(50, orderY, 150, 25).stroke('#d3d3d3');
      doc.rect(200, orderY, 362, 25).stroke('#d3d3d3');
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#5E1414').text('Chassis Number', 60, orderY + 8);
      doc.font('Helvetica').fontSize(10).fillColor('#333').text(order.bike.chassisNumber || 'N/A', 210, orderY + 8);

      orderY += 25;
      doc.rect(50, orderY, 150, 25).stroke('#d3d3d3');
      doc.rect(200, orderY, 362, 25).stroke('#d3d3d3');
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#5E1414').text('Engine Number', 60, orderY + 8);
      doc.font('Helvetica').fontSize(10).fillColor('#333').text(order.bike.engineNumber || 'N/A', 210, orderY + 8);

    } else if (order.part) {
      doc.rect(50, orderY, 150, 25).stroke('#d3d3d3');
      doc.rect(200, orderY, 362, 25).stroke('#d3d3d3');
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#5E1414').text('Part Name', 60, orderY + 8);
      doc.font('Helvetica').fontSize(10).fillColor('#333').text(order.part.name || 'N/A', 210, orderY + 8);

      orderY += 25;
      doc.rect(50, orderY, 150, 25).stroke('#d3d3d3');
      doc.rect(200, orderY, 362, 25).stroke('#d3d3d3');
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#5E1414').text('Quantity', 60, orderY + 8);
      doc.font('Helvetica').fontSize(10).fillColor('#333').text(String(order.quantity || 1), 210, orderY + 8);
    }

    orderY += 45;

    // Payment Details
    doc.rect(50, orderY, 512, 20).fill('#EAEFC4');
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#74950A').text('PAYMENT DETAILS', 60, orderY + 5);
    orderY += 35;

    doc.rect(50, orderY, 150, 25).stroke('#d3d3d3');
    doc.rect(200, orderY, 362, 25).stroke('#d3d3d3');
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#5E1414').text('Payment Method', 60, orderY + 8);
    const methodMap: Record<string, string> = { ONLINE_TRANSFER: 'Online Transfer', CASH: 'Cash' };
    doc.font('Helvetica').fontSize(10).fillColor('#333').text(methodMap[order.paymentMethod] || order.paymentMethod, 210, orderY + 8);

    orderY += 25;
    doc.rect(50, orderY, 150, 35).fillAndStroke('#74950A', '#74950A');
    doc.rect(200, orderY, 362, 35).fillAndStroke('#EAEFC4', '#d3d3d3');
    doc.font('Helvetica-Bold').fontSize(12).fillColor('white').text('TOTAL AMOUNT', 60, orderY + 12);
    const amount = order.bike?.actualSalePrice || order.amount || 0;
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#74950A').text(`Rs. ${Number(amount).toLocaleString()}`, 210, orderY + 11);

    doc.end();

    return doc as unknown as Readable;
  }

  generateReceipt(transaction: any): Readable {
    const doc = new PDFDocument({ margin: 50 });
    
    // Fallback paths for logo resolution
    const possiblePaths = [
      path.join(process.cwd(), 'apps/admin/public/logo.svg'),
      path.join(process.cwd(), '../admin/public/logo.svg'),
      path.join(__dirname, '../../../../../apps/admin/public/logo.svg'),
      path.join(__dirname, '../../../../../../apps/admin/public/logo.svg')
    ];
    let logoPath = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        logoPath = p;
        break;
      }
    }

    if (logoPath) {
      const svg = fs.readFileSync(logoPath, 'utf8');
      doc.save();
      doc.translate(65, 50);
      const scale = 110 / 973; // Original width is 973, target width is 110
      doc.scale(scale, scale);
      SVGtoPDF(doc, svg, 0, 0, { preserveAspectRatio: 'xMinYMin meet' });
      doc.restore();
    }

    // Header Vertical Line
    doc.moveTo(180, 50).lineTo(180, 120).lineWidth(2).stroke('#74950A');

    // Company Header Info
    doc.font('Helvetica-Bold').fontSize(18).fillColor('#74950A').text("ALI & KHAN'S GREEN WHEELS", 195, 60);
    doc.font('Helvetica-Oblique').fontSize(11).fillColor('#5E1414').text("Authorized Motorcycle Dealership", 195, 80);
    doc.font('Helvetica').fontSize(10).fillColor('gray').text("Pakistan | ghulam.ali9366@gmail.com | +92 333443 7840", 195, 96);

    // Banner
    doc.rect(50, 150, 512, 35).fill('#5E1414');
    doc.font('Helvetica-Bold').fontSize(16).fillColor('white').text('PAYMENT RECEIPT', 50, 160, { align: 'center', width: 512 });

    // Grid (Receipt ID, Date)
    // Col 1
    doc.rect(50, 210, 256, 40).fillAndStroke('#EAEFC4', '#74950A');
    // Col 2
    doc.rect(306, 210, 256, 40).fillAndStroke('#EAEFC4', '#74950A');

    // Col 1 text
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#74950A').text('Receipt ID', 50, 218, { align: 'center', width: 256 });
    doc.font('Helvetica').fontSize(9).fillColor('black').text(transaction.id, 50, 232, { align: 'center', width: 256 });

    // Col 2 text
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#74950A').text('Date', 306, 218, { align: 'center', width: 256 });
    const dateFormatted = new Date(transaction.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.font('Helvetica').fontSize(9).fillColor('black').text(dateFormatted, 306, 232, { align: 'center', width: 256 });

    // Payment Details
    doc.rect(50, 280, 512, 20).fill('#EAEFC4');
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#74950A').text('PAYMENT DETAILS', 60, 285);

    let tableY = 315;
    // Row 1
    doc.rect(50, tableY, 150, 25).stroke('#d3d3d3');
    doc.rect(200, tableY, 362, 25).stroke('#d3d3d3');
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#5E1414').text('Payment Method', 60, tableY + 8);
    const methodMap: Record<string, string> = { ONLINE_TRANSFER: 'Online Transfer', CASH: 'Cash' };
    doc.font('Helvetica').fontSize(10).fillColor('#333').text(methodMap[transaction.method] || transaction.method, 210, tableY + 8);

    // Row 2
    tableY += 25;
    doc.rect(50, tableY, 150, 35).fillAndStroke('#74950A', '#74950A');
    doc.rect(200, tableY, 362, 35).fillAndStroke('#EAEFC4', '#d3d3d3');
    doc.font('Helvetica-Bold').fontSize(12).fillColor('white').text('AMOUNT PAID', 60, tableY + 12);
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#74950A').text(`Rs. ${Number(transaction.amount).toLocaleString()}`, 210, tableY + 11);

    let orderY = tableY + 65;
    
    const order = transaction.order || transaction.partOrder;
    if (order) {
      doc.rect(50, orderY, 512, 20).fill('#EAEFC4');
      doc.font('Helvetica-Bold').fontSize(12).fillColor('#74950A').text('ORDER DETAILS', 60, orderY + 5);

      orderY += 35;
      // Row 1
      doc.rect(50, orderY, 150, 25).stroke('#d3d3d3');
      doc.rect(200, orderY, 362, 25).stroke('#d3d3d3');
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#5E1414').text('Order Number', 60, orderY + 8);
      doc.font('Helvetica').fontSize(10).fillColor('#333').text(order.orderNumber || 'N/A', 210, orderY + 8);
      
      // Row 2
      orderY += 25;
      doc.rect(50, orderY, 150, 25).stroke('#d3d3d3');
      doc.rect(200, orderY, 362, 25).stroke('#d3d3d3');
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#5E1414').text('Customer Name', 60, orderY + 8);
      doc.font('Helvetica').fontSize(10).fillColor('#333').text(order.customerName || 'N/A', 210, orderY + 8);

      // Row 3
      orderY += 25;
      doc.rect(50, orderY, 150, 25).stroke('#d3d3d3');
      doc.rect(200, orderY, 362, 25).stroke('#d3d3d3');
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#5E1414').text('Customer Phone', 60, orderY + 8);
      doc.font('Helvetica').fontSize(10).fillColor('#333').text(order.customerPhone || 'N/A', 210, orderY + 8);
      
      orderY += 25;
    }

    let footerY = orderY + 50;
    if (footerY + 60 > doc.page.height - 50) {
      doc.addPage();
      footerY = 50;
    }

    doc.moveTo(50, footerY).lineTo(562, footerY).lineWidth(1).stroke('#5E1414');
    doc.rect(50, footerY, 512, 40).fill('#F8F8F8');
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#74950A').text("Thank you for your business! — Ali & Khan's Green Wheels", 50, footerY + 10, { align: 'center', width: 512 });
    doc.font('Helvetica-Oblique').fontSize(9).fillColor('gray').text("This receipt confirms your payment. Please retain for your records.", 50, footerY + 25, { align: 'center', width: 512 });

    doc.end();

    return doc as unknown as Readable;
  }
}
