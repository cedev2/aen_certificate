import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { certificateAPI } from '../services/api';

export default function CertificatePreviewPage() {
  const { id } = useParams();
  const [html, setHtml] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // This page is mainly used for printing/PDF
    // The actual rendering happens server-side
    setError('Use the dashboard to generate and download certificates.');
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading certificate...</p>
    </div>
  );
}
