import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import QRCode from 'qrcode';
import { formatDate } from './certificate';

interface SignatoryData {
  name: string;
  title: string;
  signatureUrl: string;
}

interface CertificateData {
  certificateId: string;
  recipientName: string;
  certificateType: string;
  award: string;
  eventName: string;
  description: string;
  eventDate: Date | string;
  issueDate: Date | string;
  logoUrl: string;
  signatories: SignatoryData[];
}

function buildCertificateHtml(data: CertificateData, qrDataUrl: string): string {
  const signatoriesCount = data.signatories.length;

  const signatoriesHtml = data.signatories.map((s) => `
    <div class="signature-block">
      <img src="${s.signatureUrl}" class="signature-img" onerror="this.style.display='none'" />
      <div class="signature-line"></div>
      <div class="signature-name">${s.name}</div>
      <div class="signature-title">${s.title}</div>
    </div>
  `).join('');

  const displayType = data.certificateType.toUpperCase().replace('CERTIFICATE OF ', 'OF ');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&family=Great+Vibes&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  @page {
    size: A4 landscape;
    margin: 0;
  }

  body {
    width: 1122px;
    height: 793px;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
    background: #FFFEF8;
  }

  .certificate {
    width: 1122px;
    height: 793px;
    position: relative;
    background: #FFFEF8;
    overflow: hidden;
  }

  /* Outer border layers */
  .border-outer {
    position: absolute;
    top: 12px; left: 12px; right: 12px; bottom: 12px;
    border: 2px solid #1a2340;
  }

  .border-gold {
    position: absolute;
    top: 18px; left: 18px; right: 18px; bottom: 18px;
    border: 1px solid #C9963B;
  }

  .border-inner {
    position: absolute;
    top: 24px; left: 24px; right: 24px; bottom: 24px;
    border: 1px solid #1a2340;
    opacity: 0.3;
  }

  .border-accent {
    position: absolute;
    top: 28px; left: 28px; right: 28px; bottom: 28px;
    border: 0.5px solid #C9963B;
    opacity: 0.5;
  }

  /* Corner decorations */
  .corner { position: absolute; width: 40px; height: 40px; }
  .corner::before, .corner::after {
    content: ''; position: absolute; background: #C9963B;
  }
  .corner-tl { top: 14px; left: 14px; }
  .corner-tl::before { top: 0; left: 0; width: 20px; height: 1.5px; }
  .corner-tl::after { top: 0; left: 0; width: 1.5px; height: 20px; }
  .corner-tr { top: 14px; right: 14px; }
  .corner-tr::before { top: 0; right: 0; width: 20px; height: 1.5px; }
  .corner-tr::after { top: 0; right: 0; width: 1.5px; height: 20px; }
  .corner-bl { bottom: 14px; left: 14px; }
  .corner-bl::before { bottom: 0; left: 0; width: 20px; height: 1.5px; }
  .corner-bl::after { bottom: 0; left: 0; width: 1.5px; height: 20px; }
  .corner-br { bottom: 14px; right: 14px; }
  .corner-br::before { bottom: 0; right: 0; width: 20px; height: 1.5px; }
  .corner-br::after { bottom: 0; right: 0; width: 1.5px; height: 20px; }

  /* Subtle background pattern */
  .bg-pattern {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image:
      radial-gradient(circle at 20% 20%, rgba(26, 35, 64, 0.015) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(201, 150, 59, 0.015) 0%, transparent 50%),
      repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(26, 35, 64, 0.008) 40px, rgba(26, 35, 64, 0.008) 41px),
      repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(26, 35, 64, 0.008) 40px, rgba(26, 35, 64, 0.008) 41px);
    pointer-events: none;
  }

  /* Content container */
  .content {
    position: absolute;
    top: 40px; left: 40px; right: 40px; bottom: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-align: center;
  }

  /* Logo area */
  .logo-section {
    margin-top: 10px;
  }

  .logo-img {
    height: 60px;
    max-width: 180px;
    object-fit: contain;
  }

  /* Organization name */
  .org-name {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: #1a2340;
    margin-top: 6px;
  }

  /* Title */
  .title-section {
    margin-top: 2px;
  }

  .main-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 52px;
    font-weight: 300;
    color: #1a2340;
    letter-spacing: 8px;
    text-transform: uppercase;
    line-height: 1;
  }

  .sub-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 500;
    color: #C9963B;
    letter-spacing: 6px;
    text-transform: uppercase;
    margin-top: 4px;
  }

  /* Decorative line */
  .deco-line {
    width: 120px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #C9963B, transparent);
    margin: 8px auto;
  }

  /* Presented to */
  .presented-to {
    font-family: 'Inter', sans-serif;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #8a7e6a;
    margin-top: 8px;
  }

  /* Recipient name */
  .recipient-name {
    font-family: 'Great Vibes', cursive;
    font-size: 48px;
    color: #1a2340;
    margin-top: 4px;
    line-height: 1.2;
    max-width: 700px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .recipient-name.small { font-size: 38px; }
  .recipient-name.xsmall { font-size: 30px; }

  /* Decorative line under name */
  .name-line {
    width: 280px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #C9963B, #e6a832, #C9963B, transparent);
    margin: 6px auto;
  }

  /* Description */
  .description {
    font-family: 'Inter', sans-serif;
    font-size: 10.5px;
    font-weight: 300;
    color: #4a4a4a;
    line-height: 1.6;
    max-width: 580px;
    margin: 6px auto 0;
    text-align: center;
  }

  /* Award info */
  .award-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    margin-top: 4px;
  }

  .award-info-line {
    font-family: 'Inter', sans-serif;
    font-size: 9px;
    color: #1a2340;
    letter-spacing: 1px;
  }

  .award-info-line strong {
    font-weight: 600;
    color: #C9963B;
    text-transform: uppercase;
    font-size: 10px;
  }

  /* Bottom section */
  .bottom-section {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 8px;
    padding: 0 20px;
  }

  /* Signatures */
  .signatures {
    display: flex;
    gap: 120px;
    justify-content: center;
    flex: 1;
  }

  .signatures.single .signature-block {
    margin: 0 auto;
  }

  .signature-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 160px;
  }

  .signature-img {
    height: 36px;
    max-width: 140px;
    object-fit: contain;
    margin-bottom: 2px;
  }

  .signature-line {
    width: 140px;
    height: 1px;
    background: #1a2340;
    opacity: 0.4;
  }

  .signature-name {
    font-family: 'Inter', sans-serif;
    font-size: 9px;
    font-weight: 600;
    color: #1a2340;
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .signature-title {
    font-family: 'Inter', sans-serif;
    font-size: 7.5px;
    color: #8a7e6a;
    margin-top: 1px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* QR Code */
  .qr-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .qr-img {
    width: 64px;
    height: 64px;
  }

  .qr-label {
    font-family: 'Inter', sans-serif;
    font-size: 6px;
    color: #8a7e6a;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  /* Footer */
  .footer {
    text-align: center;
    margin-top: 2px;
  }

  .footer-id {
    font-family: 'Inter', sans-serif;
    font-size: 7px;
    font-weight: 500;
    color: #8a7e6a;
    letter-spacing: 2px;
  }

  .footer-org {
    font-family: 'Inter', sans-serif;
    font-size: 7px;
    font-weight: 400;
    color: #1a2340;
    letter-spacing: 3px;
    margin-top: 2px;
  }

  /* Seal */
  .seal {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1.5px solid #C9963B;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }

  .seal-inner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 0.5px solid #1a2340;
    opacity: 0.3;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .seal-text {
    font-family: 'Inter', sans-serif;
    font-size: 5px;
    font-weight: 700;
    color: #1a2340;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
</style>
</head>
<body>
<div class="certificate">
  <div class="border-outer"></div>
  <div class="border-gold"></div>
  <div class="border-inner"></div>
  <div class="border-accent"></div>
  <div class="corner corner-tl"></div>
  <div class="corner corner-tr"></div>
  <div class="corner corner-bl"></div>
  <div class="corner corner-br"></div>
  <div class="bg-pattern"></div>

  <div class="content">
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div class="logo-section">
        ${data.logoUrl ? `<img src="${data.logoUrl}" class="logo-img" />` : ''}
      </div>
      <div class="org-name">African Entrepreneurs Network</div>

      <div class="title-section">
        <div class="main-title">Certificate</div>
        <div class="sub-title">${displayType}</div>
        <div class="deco-line"></div>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;align-items:center;margin-top:-8px;">
      <div class="presented-to">Proudly Presented To</div>
      <div class="recipient-name${data.recipientName.length > 30 ? ' xsmall' : data.recipientName.length > 22 ? ' small' : ''}">${data.recipientName}</div>
      <div class="name-line"></div>
      <div class="description">${data.description}</div>
      <div class="award-info">
        <div class="award-info-line"><strong>Award:</strong> ${data.award}</div>
        <div class="award-info-line"><strong>Event:</strong> ${data.eventName}</div>
        <div class="award-info-line"><strong>Date:</strong> ${formatDate(data.eventDate)}</div>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;align-items:center;width:100%;">
      <div class="bottom-section">
        <div class="qr-section">
          <img src="${qrDataUrl}" class="qr-img" />
        </div>

        <div class="signatures${signatoriesCount === 1 ? ' single' : ''}">
          ${signatoriesHtml}
        </div>

        <div style="width:64px;display:flex;flex-direction:column;align-items:center;">
          <div class="seal">
            <div class="seal-inner">
              <div class="seal-text">AEN</div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="footer-id">Credential ID: ${data.certificateId}</div>
        <div class="footer-org">African Entrepreneurs Network</div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;
}

export async function generatePdf(data: CertificateData): Promise<Buffer> {
  const qrData = [
    `AEN Certificate`,
    `ID: ${data.certificateId}`,
    `Recipient: ${data.recipientName}`,
    `Award: ${data.award}`,
    `Event: ${data.eventName}`,
    `Issued: ${formatDate(data.issueDate)}`,
  ].join('\n');

  const qrDataUrl = await QRCode.toDataURL(qrData, {
    type: 'image/png',
    width: 200,
    margin: 1,
    color: { dark: '#1a2340', light: '#ffffff' },
  });

  const html = buildCertificateHtml(data, qrDataUrl);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForFunction('document.fonts.ready', { timeout: 10000 }).catch(() => {});

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

export async function generateCertificateHtmlPreview(data: CertificateData): Promise<string> {
  const qrData = [
    `AEN Certificate`,
    `ID: ${data.certificateId}`,
    `Recipient: ${data.recipientName}`,
    `Award: ${data.award}`,
    `Event: ${data.eventName}`,
    `Issued: ${formatDate(data.issueDate)}`,
  ].join('\n');

  const qrDataUrl = await QRCode.toDataURL(qrData, {
    type: 'image/png',
    width: 200,
    margin: 1,
    color: { dark: '#1a2340', light: '#ffffff' },
  });

  return buildCertificateHtml(data, qrDataUrl);
}
