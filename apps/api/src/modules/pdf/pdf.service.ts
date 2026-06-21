import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Readable } from 'stream';

@Injectable()
export class PdfService {
  generateInvoice(order: any): Readable {
    const doc = new PDFDocument({ margin: 50 });
    
    doc.fontSize(20).text('INVOICE / SALE AGREEMENT', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Order Number: ${order.orderNumber}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Status: ${order.status}`);
    doc.moveDown();

    doc.fontSize(14).text('Customer Details', { underline: true });
    doc.fontSize(12).text(`Name: ${order.customerName}`);
    doc.text(`Phone: ${order.customerPhone}`);
    if (order.customerCNIC) doc.text(`CNIC: ${order.customerCNIC}`);
    doc.text(`Address: ${order.customerAddress}`);
    doc.moveDown();

    if (order.bike) {
      doc.fontSize(14).text('Item Details', { underline: true });
      doc.fontSize(12).text(`Bike: ${order.bike.model?.brand} ${order.bike.model?.modelName}`);
      doc.text(`Chassis Number: ${order.bike.chassisNumber}`);
      doc.text(`Engine Number: ${order.bike.engineNumber}`);
    } else if (order.part) {
      doc.fontSize(14).text('Item Details', { underline: true });
      doc.fontSize(12).text(`Part: ${order.part.name}`);
      doc.text(`Quantity: ${order.quantity}`);
    }
    doc.moveDown();

    doc.fontSize(14).text('Payment Details', { underline: true });
    const amount = order.bike?.actualSalePrice || order.amount || 0;
    doc.fontSize(12).text(`Total Amount: Rs. ${Number(amount).toLocaleString()}`);
    doc.text(`Payment Method: ${order.paymentMethod}`);
    
    doc.moveDown(4);
    doc.fontSize(10).text('Thank you for your business!', { align: 'center' });

    doc.end();

    return doc as unknown as Readable; // pdfkit creates a readable stream
  }

  generateReceipt(transaction: any): Readable {
    const doc = new PDFDocument({ margin: 50 });
    
    doc.fontSize(20).text('PAYMENT RECEIPT', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Receipt ID: ${transaction.id}`);
    doc.text(`Date: ${new Date(transaction.createdAt).toLocaleDateString()}`);
    doc.text(`Status: ${transaction.status}`);
    doc.moveDown();

    doc.fontSize(14).text('Payment Details', { underline: true });
    doc.fontSize(12).text(`Amount Paid: Rs. ${Number(transaction.amount).toLocaleString()}`);
    doc.text(`Payment Method: ${transaction.method}`);
    if (transaction.gatewayReference) {
      doc.text(`Gateway Reference: ${transaction.gatewayReference}`);
    }
    doc.moveDown();

    if (transaction.order) {
      doc.fontSize(14).text('Order Details', { underline: true });
      doc.fontSize(12).text(`Order Number: ${transaction.order.orderNumber}`);
      doc.text(`Customer Name: ${transaction.order.customerName}`);
      doc.text(`Customer Phone: ${transaction.order.customerPhone}`);
    }

    doc.moveDown(4);
    doc.fontSize(10).text('Thank you for your business!', { align: 'center' });

    doc.end();

    return doc as unknown as Readable;
  }
}
