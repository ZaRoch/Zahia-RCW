import PDFDocument from 'pdfkit';
import { Readable } from 'stream';


export function generateTransactionPDF(transaction) {
  const doc = new PDFDocument({ margin: 40 });
  const stream = new Readable();
  stream._read = () => {};
  doc.pipe(stream);

  doc.fontSize(20).text('Reçu de Transaction', { align: 'center', underline: true });
  doc.moveDown(2);

  doc.fontSize(14).text('Informations Client', { underline: true });
  doc.fontSize(12).text(`Nom: ${transaction.clientName}`);
  doc.moveDown();

  doc.fontSize(14).text('Détails de la Transaction', { underline: true });
  doc.fontSize(12).text(`Numéro: ${transaction.transactionNumber}`);
  doc.fontSize(12).text(`Service: ${transaction.service}`);
  doc.fontSize(12).text(`Date: ${new Date(transaction.date).toLocaleString()}`);
  doc.fontSize(12).text(`Statut: ${transaction.status}`);
  doc.moveDown();

  doc.fontSize(14).text('Montants', { underline: true });
  doc.fontSize(12).text(`Montant initial: ${transaction.amount} ${transaction.currency}`);
  if (transaction.convertedAmount && transaction.convertedCurrency) {
    doc.fontSize(12).text(`Montant converti: ${transaction.convertedAmount} ${transaction.convertedCurrency}`);
    doc.fontSize(12).text(`Taux de conversion: ${transaction.rate}`);
  }
  doc.moveDown();

  doc.fontSize(10).text('Merci d\'avoir utilisé notre service.', { align: 'center' });
  doc.end();
  return doc;
}
