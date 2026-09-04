import { FormData } from '../../pages/DashboardPage';
import { generateQrDataUrl } from '../../utils/qrHelper';
import { useEffect, useState } from 'react';

interface Props {
  formData: FormData;
  logoUrl: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const VictorianCorner = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
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
    <path d="M 20 20 C 45 45, 62 28, 50 16 C 38 4, 24 24, 20 20 Z" stroke="#1c2841" strokeWidth="2.2" fill="none" />
    <path d="M 20 20 C 45 45, 28 62, 16 50 C 4 38, 24 24, 20 20 Z" stroke="#1c2841" strokeWidth="2.2" fill="none" />
    <circle cx="32" cy="32" r="4.5" fill="#1c2841" />
    <circle cx="46" cy="18" r="2.8" fill="#1c2841" />
    <circle cx="18" cy="46" r="2.8" fill="#1c2841" />
  </svg>
);

const CenterDiamond = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M 0 10 L 15 10" stroke="#1c2841" strokeWidth="1.5" />
    <path d="M 25 10 L 40 10" stroke="#1c2841" strokeWidth="1.5" />
    <polygon points="20,2 25,10 20,18 15,10" fill="#1c2841" />
  </svg>
);

export default function CertificatePreview({ formData, logoUrl }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    const data = [
      `AEN Certificate`,
      `Recipient: ${formData.recipientName || '—'}`,
      `Event: ${formData.eventName || '—'}`,
      `Issued: ${formatDate(formData.issueDate)}`,
    ].join('\n');
    generateQrDataUrl(data).then(setQrDataUrl);
  }, [formData.recipientName, formData.eventName, formData.issueDate]);

  const rightLabel = 'Ismael KOANDA\nPresident of AEN';
  const serif = "'Cormorant Garamond', 'Times New Roman', serif";
  const navy = '#1c2841';
  const beige = '#eae8e0';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 w-full flex flex-col justify-center">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-navy-900">Live Preview</h3>
      </div>

      {/* Certificate Canvas */}
      <div
        style={{
          containerType: 'inline-size',
          aspectRatio: '1.414 / 1',
          backgroundColor: beige,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        }}
      >
        {/* Outer padding shell */}
        <div style={{ position: 'absolute', inset: '1.5cqw' }}>

          {/* Double border frame */}
          <div style={{
            width: '100%', height: '100%', position: 'relative',
            border: `0.18cqw solid ${navy}`,
          }}>
            <div style={{
              position: 'absolute', inset: '0.55cqw',
              border: `0.12cqw solid ${navy}`,
              pointerEvents: 'none',
            }} />

            {/* Victorian corner ornaments */}
            <VictorianCorner style={{ position: 'absolute', top: 0, left: 0, width: '9cqw', height: '9cqw', transform: 'translate(-3%, -3%)' }} />
            <VictorianCorner style={{ position: 'absolute', top: 0, right: 0, width: '9cqw', height: '9cqw', transform: 'translate(3%, -3%) scaleX(-1)' }} />
            <VictorianCorner style={{ position: 'absolute', bottom: 0, left: 0, width: '9cqw', height: '9cqw', transform: 'translate(-3%, 3%) scaleY(-1)' }} />
            <VictorianCorner style={{ position: 'absolute', bottom: 0, right: 0, width: '9cqw', height: '9cqw', transform: 'translate(3%, 3%) scale(-1,-1)' }} />

            {/* Top & bottom centre diamond ornaments */}
            <div style={{
              position: 'absolute', top: 0, left: '50%',
              transform: 'translate(-50%, -55%)',
              background: beige, padding: '0 1cqw',
            }}>
              <CenterDiamond style={{ width: '7cqw', height: '1.8cqw' }} />
            </div>
            <div style={{
              position: 'absolute', bottom: 0, left: '50%',
              transform: 'translate(-50%, 55%)',
              background: beige, padding: '0 1cqw',
            }}>
              <CenterDiamond style={{ width: '7cqw', height: '1.8cqw' }} />
            </div>

            {/* === CONTENT AREA === */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '3.5cqw 9cqw 2.8cqw',
              color: navy,
            }}>

              {/* TOP: Logo + Event + Certificate Title + Subtitle */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5cqw', width: '100%' }}>
                <img
                  src={logoUrl || '/logo.png'}
                  alt="AEN Logo"
                  style={{ height: '10cqw', width: 'auto', objectFit: 'contain' }}
                />
                <p style={{ fontSize: '1cqw', letterSpacing: '0.18em', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>
                  {formData.eventName || 'PITCH NIGHT #1 2026'}
                </p>
                <h1 style={{
                  fontFamily: serif, fontSize: '4cqw', fontWeight: 700,
                  lineHeight: 1.1, textAlign: 'center', margin: 0,
                }}>
                  {formData.certificateType || 'CERTIFICATE OF GRAND WINNER'}
                </h1>
                <p style={{ fontSize: '0.95cqw', letterSpacing: '0.22em', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>
                  THE FOLLOWING AWARD IS GIVEN TO
                </p>
              </div>

              {/* MIDDLE: Name + Rule */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '0.6cqw' }}>
                <h2 style={{
                  fontFamily: serif, fontSize: '3.8cqw', fontWeight: 700,
                  lineHeight: 1.1, textAlign: 'center', margin: 0, textTransform: 'uppercase',
                }}>
                  {formData.recipientName || 'SANDIE THÉO RUKIRUMURAME'}
                </h2>
                <div style={{ width: '60%', borderTop: `1.5px dotted ${navy}` }} />
              </div>

              {/* DESCRIPTION */}
              <div style={{ width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3cqw' }}>
                <p style={{
                  fontFamily: serif, fontSize: '1.35cqw', lineHeight: 1.5,
                  textAlign: 'center', margin: 0, fontWeight: 500,
                }}>
                  {formData.description}
                </p>
              </div>

              {/* BOTTOM: Date + QR (small) + Signature */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                width: '100%', height: '9cqw',
              }}>
                {/* Date block */}
                <div style={{ width: '28%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p style={{ fontFamily: serif, fontSize: '1.3cqw', fontWeight: 600, marginBottom: '0.3cqw' }}>
                    {formatDate(formData.issueDate)}
                  </p>
                  <div style={{ width: '100%', borderTop: `1.5px solid ${navy}`, marginBottom: '0.5cqw' }} />
                  <p style={{ fontFamily: serif, fontSize: '1.1cqw', fontWeight: 600, margin: 0 }}>Date</p>
                </div>

                {/* Small decorative seal */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '6cqw', height: '6cqw' }}>
                    {/* Starburst outer ring */}
                    <polygon points="50,2 56,18 74,6 68,24 88,20 78,36 96,40 82,50 96,60 78,64 88,80 68,76 74,94 56,82 50,98 44,82 26,94 32,76 12,80 22,64 4,60 18,50 4,40 22,36 12,20 32,24 26,6 44,18" fill="#1c2841" />
                    {/* Inner circle */}
                    <circle cx="50" cy="50" r="28" fill="#1c2841" stroke="#eae8e0" strokeWidth="2" />
                    <circle cx="50" cy="50" r="24" fill="#1c2841" stroke="#eae8e0" strokeWidth="1" />
                  </svg>
                </div>

                {/* President signature block */}
                <div style={{ width: '28%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src="/signature.png"
                    alt="Signature"
                    style={{ height: '4.5cqw', width: 'auto', objectFit: 'contain', marginBottom: '0.1cqw' }}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  <div style={{ width: '100%', borderTop: `1.5px solid ${navy}`, marginBottom: '0.5cqw' }} />
                  <p style={{
                    fontFamily: serif, fontSize: '1.1cqw', fontWeight: 600,
                    margin: 0, textAlign: 'center', lineHeight: 1.25, whiteSpace: 'pre-line',
                  }}>
                    {rightLabel}
                  </p>
                </div>
              </div>

            </div>
            {/* === END CONTENT === */}

          </div>
        </div>
      </div>
    </div>
  );
}
