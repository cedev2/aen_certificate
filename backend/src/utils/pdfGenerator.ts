import puppeteer from 'puppeteer';
import { formatDate } from './certificate';
import fs from 'fs';
import path from 'path';

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

function victorianCornerSvg(): string {
  return `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
    <path d="M8 8 H45 V12 H12 V45 H8 Z" fill="#1c2841" />
    <path d="M2 2 H30 V5 H5 V30 H2 Z" fill="#1c2841" />
    <path d="M 30 5 C 42 -2, 55 2, 68 8 C 58 12, 45 10, 30 5 Z" fill="#1c2841" />
    <path d="M 60 7 C 75 0, 90 4, 102 10 C 90 14, 75 12, 60 7 Z" fill="#1c2841" />
    <path d="M 95 9 C 105 5, 112 7, 118 10 C 112 13, 104 12, 95 9 Z" fill="#1c2841" />
    <path d="M 5 30 C -2 42, 2 55, 8 68 C 12 58, 10 45, 5 30 Z" fill="#1c2841" />
    <path d="M 7 60 C 0 75, 4 90, 10 102 C 14 90, 12 75, 7 60 Z" fill="#1c2841" />
    <path d="M 9 95 C 5 105, 7 112, 10 118 C 13 112, 12 104, 9 95 Z" fill="#1c2841" />
    <path d="M 15 15 C 32 32, 45 22, 38 14 C 32 8, 18 18, 15 15 Z" fill="#1c2841" />
    <path d="M 15 15 C 32 32, 22 45, 14 38 C 8 32, 18 18, 15 15 Z" fill="#1c2841" />
    <path d="M 20 20 C 45 45, 62 28, 50 16 C 38 4, 24 24, 20 20 Z" stroke="#1c2841" stroke-width="2.2" fill="none" />
    <path d="M 20 20 C 45 45, 28 62, 16 50 C 4 38, 24 24, 20 20 Z" stroke="#1c2841" stroke-width="2.2" fill="none" />
    <circle cx="32" cy="32" r="4.5" fill="#1c2841" />
    <circle cx="46" cy="18" r="2.8" fill="#1c2841" />
    <circle cx="18" cy="46" r="2.8" fill="#1c2841" />
  </svg>`;
}

function centerDiamondSvg(): string {
  return `<svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:70px;height:18px;">
    <path d="M 0 10 L 15 10" stroke="#1c2841" stroke-width="1.5" />
    <path d="M 25 10 L 40 10" stroke="#1c2841" stroke-width="1.5" />
    <polygon points="20,2 25,10 20,18 15,10" fill="#1c2841" />
  </svg>`;
}

function sealSvg(): string {
  return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:60px;height:60px;">
    <polygon points="50,2 56,18 74,6 68,24 88,20 78,36 96,40 82,50 96,60 78,64 88,80 68,76 74,94 56,82 50,98 44,82 26,94 32,76 12,80 22,64 4,60 18,50 4,40 22,36 12,20 32,24 26,6 44,18" fill="#1c2841" />
    <circle cx="50" cy="50" r="28" fill="#1c2841" stroke="#eae8e0" stroke-width="2" />
    <circle cx="50" cy="50" r="24" fill="#1c2841" stroke="#eae8e0" stroke-width="1" />
  </svg>`;
}

function getLogoBase64(): string {
  try {
    const logoPath = path.join(process.cwd(), '../frontend/public/logo.png');
    if (fs.existsSync(logoPath)) {
      const bitmap = fs.readFileSync(logoPath);
      return `data:image/png;base64,${bitmap.toString('base64')}`;
    }
  } catch {}
  return '';
}

function getSignatureBase64(): string {
  try {
    const sigPath = path.join(process.cwd(), '../frontend/public/signature.png');
    if (fs.existsSync(sigPath)) {
      const bitmap = fs.readFileSync(sigPath);
      return `data:image/png;base64,${bitmap.toString('base64')}`;
    }
  } catch {}
  return '';
}

function buildCertificateHtml(data: CertificateData): string {
  const formattedDate = formatDate(data.issueDate);
  const logoBase64 = data.logoUrl || getLogoBase64();
  const sigBase64 = getSignatureBase64();
  
  const rightLabel = 'Ismael KOANDA<br/>President of AEN';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap');

  * { margin:0; padding:0; box-sizing:border-box; }
  @page { size: A4 landscape; margin: 0; }

  body {
    width: 1122px;
    height: 793px;
    margin: 0;
    padding: 0;
    background-color: #eae8e0;
    font-family: 'Cormorant Garamond', 'Times New Roman', serif;
    color: #1c2841;
    overflow: hidden;
    -webkit-print-color-adjust: exact;
  }

  .cert-container {
    width: 1122px;
    height: 793px;
    position: relative;
    padding: 17px; /* ~1.5% of 1122 */
  }

  .outer-border {
    width: 100%;
    height: 100%;
    position: relative;
    border: 2px solid #1c2841;
  }

  .inner-border {
    position: absolute;
    top: 6px;
    left: 6px;
    right: 6px;
    bottom: 6px;
    border: 1.5px solid #1c2841;
    pointer-events: none;
  }

  .corner { position: absolute; width: 100px; height: 100px; }
  .c-tl { top: 0; left: 0; transform: translate(-3%, -3%); }
  .c-tr { top: 0; right: 0; transform: translate(3%, -3%) scaleX(-1); }
  .c-bl { bottom: 0; left: 0; transform: translate(-3%, 3%) scaleY(-1); }
  .c-br { bottom: 0; right: 0; transform: translate(3%, 3%) scale(-1, -1); }

  .diamond-top { position: absolute; top: 0; left: 50%; transform: translate(-50%, -55%); background: #eae8e0; padding: 0 10px; }
  .diamond-bot { position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 55%); background: #eae8e0; padding: 0 10px; }

  .content {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 40px 100px 32px;
  }

  /* --- Header --- */
  .header-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
  .logo-img {
    height: 110px;
    width: auto;
    object-fit: contain;
  }
  .event-name {
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.18em;
    font-weight: 600;
  }
  .cert-title {
    font-size: 45px;
    line-height: 1.1;
    text-align: center;
    font-weight: 700;
  }
  .subtitle {
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.22em;
    font-weight: 600;
  }

  /* --- Name --- */
  .name-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 7px;
  }
  .recipient-name {
    font-size: 43px;
    font-weight: 700;
    text-transform: uppercase;
    text-align: center;
    line-height: 1.1;
  }
  .dotted-rule {
    width: 60%;
    border-top: 1.5px dotted #1c2841;
  }

  /* --- Description --- */
  .description-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    gap: 3px;
  }
  .description-text {
    font-size: 15px;
    line-height: 1.5;
    text-align: center;
    font-weight: 500;
  }

  /* --- Footer --- */
  .footer-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 100px;
  }
  .sig-col {
    width: 28%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .date-val {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 3px;
  }
  .sig-rule {
    width: 100%;
    border-top: 1.5px solid #1c2841;
    margin-bottom: 6px;
  }
  .sig-title {
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    line-height: 1.25;
  }
  .seal-center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sig-img-wrap {
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    margin-bottom: 1px;
  }
</style>
</head>
<body>
<div class="cert-container">
  <div class="outer-border">
    <div class="inner-border"></div>

    <div class="corner c-tl">${victorianCornerSvg()}</div>
    <div class="corner c-tr">${victorianCornerSvg()}</div>
    <div class="corner c-bl">${victorianCornerSvg()}</div>
    <div class="corner c-br">${victorianCornerSvg()}</div>

    <div class="diamond-top">${centerDiamondSvg()}</div>
    <div class="diamond-bot">${centerDiamondSvg()}</div>

    <div class="content">

      <!-- Header -->
      <div class="header-block">
        ${logoBase64 ? `<img src="${logoBase64}" class="logo-img" alt="AEN Logo">` : ''}
        <div class="event-name">${data.eventName || 'PITCH NIGHT #1 2026'}</div>
        <div class="cert-title">${data.certificateType || 'CERTIFICATE OF GRAND WINNER'}</div>
        <div class="subtitle">THE FOLLOWING AWARD IS GIVEN TO</div>
      </div>

      <!-- Name -->
      <div class="name-block">
        <div class="recipient-name">${data.recipientName || 'SANDIE THÉO RUKIRUMURAME'}</div>
        <div class="dotted-rule"></div>
      </div>

      <!-- Description -->
      <div class="description-block">
        <div class="description-text">${data.description}</div>
      </div>

      <!-- Footer: Date + Seal + Signature -->
      <div class="footer-row">
        
        <div class="sig-col">
          <div class="date-val">${formattedDate}</div>
          <div class="sig-rule"></div>
          <div class="sig-title">Date</div>
        </div>

        <div class="seal-center">
          ${sealSvg()}
        </div>

        <div class="sig-col">
          <div class="sig-img-wrap">
            ${sigBase64 ? `<img src="${sigBase64}" style="height: 50px; width: auto; object-fit: contain;" alt="Signature">` : ''}
          </div>
          <div class="sig-rule"></div>
          <div class="sig-title">${rightLabel}</div>
        </div>

      </div>

    </div>
  </div>
</div>
</body>
</html>`;
}

export async function generatePdf(data: CertificateData): Promise<Buffer> {
  const html = buildCertificateHtml(data);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

export async function generateImage(data: CertificateData): Promise<Buffer> {
  const html = buildCertificateHtml(data);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1122, height: 793, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const screenshotBuffer = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 1122, height: 793 },
    });

    return Buffer.from(screenshotBuffer);
  } finally {
    await browser.close();
  }
}

export async function generateCertificateHtmlPreview(data: CertificateData): Promise<string> {
  return buildCertificateHtml(data);
}