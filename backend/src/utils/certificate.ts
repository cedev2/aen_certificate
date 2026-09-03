import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

export function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const random = uuidv4().slice(0, 4).toUpperCase();
  return `AEN-${year}-${random}`;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateShort(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function generateQrData(cert: {
  certificateId: string;
  recipientName: string;
  award: string;
  eventName: string;
  issueDate: Date | string;
}): string {
  return [
    `AEN Certificate`,
    `ID: ${cert.certificateId}`,
    `Recipient: ${cert.recipientName}`,
    `Award: ${cert.award}`,
    `Event: ${cert.eventName}`,
    `Issued: ${formatDate(cert.issueDate)}`,
  ].join('\n');
}

export async function generateQrCodeBuffer(data: string): Promise<Buffer> {
  return QRCode.toBuffer(data, {
    type: 'png',
    width: 200,
    margin: 1,
    color: {
      dark: '#1a2340',
      light: '#ffffff',
    },
  });
}
