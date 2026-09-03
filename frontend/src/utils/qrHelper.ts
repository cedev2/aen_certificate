// Client-side QR code generation using a simple canvas approach
// We use a basic QR code implementation for the preview

export async function generateQrDataUrl(data: string): Promise<string> {
  // Use a simple approach: generate QR code as data URL via a free API or embedded library
  // For simplicity, we use the QR Server API for preview, and the backend generates the real one
  const encoded = encodeURIComponent(data);
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}&color=1a2340&bgcolor=FFFFFF&margin=8`;
  return url;
}
