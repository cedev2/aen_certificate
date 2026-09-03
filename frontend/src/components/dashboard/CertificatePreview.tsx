import { FormData, Signatory } from '../../pages/DashboardPage';
import { generateQrDataUrl } from '../../utils/qrHelper';
import { useEffect, useState } from 'react';

interface Props {
  formData: FormData;
  signatories: Signatory[];
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

function generatePreviewId(): string {
  const year = new Date().getFullYear();
  return `AEN-${year}-XXXX`;
}

export default function CertificatePreview({ formData, signatories, logoUrl }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    const data = [
      `AEN Certificate`,
      `ID: ${generatePreviewId()}`,
      `Recipient: ${formData.recipientName || '—'}`,
      `Award: ${formData.award || '—'}`,
      `Event: ${formData.eventName || '—'}`,
      `Issued: ${formatDate(formData.issueDate)}`,
    ].join('\n');
    generateQrDataUrl(data).then(setQrDataUrl);
  }, [formData.recipientName, formData.award, formData.eventName, formData.issueDate]);

  const displayType = formData.certificateType.toUpperCase().replace('CERTIFICATE OF ', 'OF ');
  const nameLen = formData.recipientName.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <h3 className="text-lg font-semibold text-navy-900 mb-3">Live Preview</h3>

      <div
        className="relative overflow-hidden rounded-xl border border-gray-200"
        style={{ aspectRatio: '297 / 210' }}
      >
        {/* A4 Landscape container */}
        <div
          className="relative w-full h-full"
          style={{
            background: '#FFFEF8',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {/* Border layers */}
          <div className="absolute inset-[3px] border-2 border-navy-900 pointer-events-none" />
          <div className="absolute inset-[5px] border border-aen-gold/60 pointer-events-none" />
          <div className="absolute inset-[7px] border border-navy-900/20 pointer-events-none" />
          <div className="absolute inset-[8px] border border-aen-gold/30 pointer-events-none" />

          {/* Corner decorations */}
          {['top-[3px] left-[3px]', 'top-[3px] right-[3px]', 'bottom-[3px] left-[3px]', 'bottom-[3px] right-[3px]'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-3 h-3`}>
              <div className="absolute top-0 left-0 w-full h-[1px] bg-aen-gold" />
              <div className={`absolute top-0 left-0 h-full w-[1px] bg-aen-gold ${i % 2 === 1 ? 'right-0 left-auto' : ''}`} />
            </div>
          ))}

          {/* Background pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, transparent, transparent 30px, #1a2340 30px, #1a2340 30.5px),
                repeating-linear-gradient(-45deg, transparent, transparent 30px, #1a2340 30px, #1a2340 30.5px)
              `,
            }}
          />

          {/* Content */}
          <div className="absolute inset-[14px] flex flex-col items-center justify-between text-center px-4 py-2">
            {/* Top: Logo + org name */}
            <div className="flex flex-col items-center mt-0.5">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="AEN Logo"
                  className="h-7 sm:h-10 md:h-12 max-w-[120px] sm:max-w-[140px] object-contain mb-0.5"
                />
              )}
              <span
                className="text-[5px] sm:text-[6px] md:text-[7px] font-semibold tracking-[3px] text-navy-900 uppercase"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                African Entrepreneurs Network
              </span>
            </div>

            {/* Title */}
            <div className="flex flex-col items-center mt-[-2px]">
              <h2
                className="text-[22px] sm:text-[28px] md:text-[34px] font-light text-navy-900 uppercase tracking-[5px]"
                style={{ fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}
              >
                Certificate
              </h2>
              <p
                className="text-[8px] sm:text-[10px] md:text-[12px] font-medium text-aen-gold uppercase tracking-[4px] mt-0.5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {displayType}
              </p>
              <div className="w-16 sm:w-20 h-[1px] bg-gradient-to-r from-transparent via-aen-gold to-transparent my-1.5" />
            </div>

            {/* Presented to + Name */}
            <div className="flex flex-col items-center">
              <span
                className="text-[4px] sm:text-[5px] md:text-[6px] font-medium tracking-[3px] text-gray-400 uppercase mb-0.5"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Proudly Presented To
              </span>
              <span
                className={`text-navy-900 leading-tight ${
                  nameLen > 30
                    ? 'text-[18px] sm:text-[22px] md:text-[26px]'
                    : nameLen > 20
                    ? 'text-[22px] sm:text-[28px] md:text-[34px]'
                    : 'text-[26px] sm:text-[34px] md:text-[40px]'
                }`}
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                {formData.recipientName || 'Recipient Name'}
              </span>
              <div className="w-36 sm:w-44 h-[1px] bg-gradient-to-r from-transparent via-aen-gold to-transparent mt-1" />
            </div>

            {/* Description */}
            <div className="flex flex-col items-center mt-[-2px]">
              {formData.description && (
                <p
                  className="text-[4.5px] sm:text-[5.5px] md:text-[7px] text-gray-500 leading-relaxed max-w-[320px] sm:max-w-[380px] md:max-w-[420px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {formData.description}
                </p>
              )}

              {/* Award info */}
              <div className="flex flex-col items-center gap-px mt-1.5">
                {formData.award && (
                  <p className="text-[4px] sm:text-[5px] md:text-[6px] text-navy-900" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <strong className="font-semibold text-aen-gold uppercase text-[5px] sm:text-[6px] md:text-[7px]">Award:</strong>{' '}
                    {formData.award}
                  </p>
                )}
                {formData.eventName && (
                  <p className="text-[4px] sm:text-[5px] md:text-[6px] text-navy-900" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <strong className="font-semibold text-aen-gold uppercase text-[5px] sm:text-[6px] md:text-[7px]">Event:</strong>{' '}
                    {formData.eventName}
                  </p>
                )}
                {formData.eventDate && (
                  <p className="text-[4px] sm:text-[5px] md:text-[6px] text-navy-900" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <strong className="font-semibold text-aen-gold uppercase text-[5px] sm:text-[6px] md:text-[7px]">Date:</strong>{' '}
                    {formatDate(formData.eventDate)}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom: QR + Signatures + Seal */}
            <div className="w-full flex items-end justify-between px-2 mb-0.5">
              {/* QR Code */}
              <div className="flex flex-col items-center">
                {qrDataUrl && (
                  <img src={qrDataUrl} alt="QR" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
                )}
                <span className="text-[3px] sm:text-[4px] text-gray-400 uppercase tracking-wider mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Verify
                </span>
              </div>

              {/* Signatures */}
              <div className={`flex ${signatories.length === 1 ? 'justify-center' : 'gap-6 sm:gap-10 md:gap-16'}`}>
                {signatories.length > 0 ? (
                  signatories.map((s) => (
                    <div key={s._id} className="flex flex-col items-center min-w-[60px]">
                      {s.signatureUrl ? (
                        <img
                          src={s.signatureUrl}
                          alt={s.name}
                          className="h-6 sm:h-8 md:h-9 max-w-[70px] object-contain mb-0.5"
                        />
                      ) : (
                        <div className="h-6 sm:h-8 md:h-9 mb-0.5" />
                      )}
                      <div className="w-16 sm:w-20 h-[0.5px] bg-navy-900/30" />
                      <span className="text-[4px] sm:text-[5px] md:text-[5.5px] font-semibold text-navy-900 uppercase tracking-wider mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {s.name}
                      </span>
                      <span className="text-[3px] sm:text-[4px] md:text-[4.5px] text-gray-400 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {s.title}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-8 sm:gap-12">
                    <div className="flex flex-col items-center min-w-[60px]">
                      <div className="h-6 sm:h-8 md:h-9 mb-0.5" />
                      <div className="w-16 sm:w-20 h-[0.5px] bg-navy-900/20" />
                      <span className="text-[4px] sm:text-[5px] text-gray-300 mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Signatory
                      </span>
                    </div>
                    <div className="flex flex-col items-center min-w-[60px]">
                      <div className="h-6 sm:h-8 md:h-9 mb-0.5" />
                      <div className="w-16 sm:w-20 h-[0.5px] bg-navy-900/20" />
                      <span className="text-[4px] sm:text-[5px] text-gray-300 mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Signatory
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Seal */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full border border-aen-gold flex items-center justify-center">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border border-navy-900/20 flex items-center justify-center">
                    <span className="text-[4px] sm:text-[5px] font-bold text-navy-900 tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                      AEN
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col items-center mt-[-2px]">
              <span className="text-[3.5px] sm:text-[4px] md:text-[4.5px] font-medium text-gray-400 tracking-[2px] uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                Credential ID: {generatePreviewId()}
              </span>
              <span className="text-[3.5px] sm:text-[4px] md:text-[4.5px] font-normal text-navy-900 tracking-[3px] uppercase mt-px" style={{ fontFamily: "'Inter', sans-serif" }}>
                African Entrepreneurs Network
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
