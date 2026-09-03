import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { certificateAPI, signatoryAPI, brandAPI } from '../services/api';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatisticsCards from '../components/dashboard/StatisticsCards';
import CertificateForm from '../components/dashboard/CertificateForm';
import CertificatePreview from '../components/dashboard/CertificatePreview';
import CertificateHistory from '../components/dashboard/CertificateHistory';
import SignatoryManager from '../components/dashboard/SignatoryManager';
import BrandManager from '../components/dashboard/BrandManager';
import SuccessModal from '../components/dashboard/SuccessModal';
import BulkGenerator from '../components/dashboard/BulkGenerator';
import { motion } from 'framer-motion';

export interface Signatory {
  _id: string;
  name: string;
  title: string;
  signatureUrl: string;
  active: boolean;
}

export interface Certificate {
  _id: string;
  certificateId: string;
  recipientName: string;
  certificateType: string;
  award: string;
  eventName: string;
  description: string;
  eventDate: string;
  issueDate: string;
  signatoryIds: Signatory[];
  status: string;
  pdfUrl: string;
  createdAt: string;
}

export interface FormData {
  recipientName: string;
  certificateType: string;
  award: string;
  eventName: string;
  description: string;
  eventDate: string;
  issueDate: string;
  signatoryIds: string[];
}

const defaultFormData: FormData = {
  recipientName: '',
  certificateType: 'Certificate of Achievement',
  award: '',
  eventName: '',
  description: '',
  eventDate: new Date().toISOString().split('T')[0],
  issueDate: new Date().toISOString().split('T')[0],
  signatoryIds: [],
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [signatories, setSignatories] = useState<Signatory[]>([]);
  const [logoUrl, setLogoUrl] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState({ total: 0, generatedToday: 0, drafts: 0, currentEvent: 0 });
  const [showSignatoryModal, setShowSignatoryModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [successModal, setSuccessModal] = useState<{ certId: string; recipient: string; award: string } | null>(null);
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState('');

  const loadSignatories = useCallback(async () => {
    try {
      const res = await signatoryAPI.list();
      setSignatories(res.data);
    } catch {}
  }, []);

  const loadLogo = useCallback(async () => {
    try {
      const res = await brandAPI.getLogo();
      if (res.data?.url) setLogoUrl(res.data.url);
    } catch {}
  }, []);

  const loadCertificates = useCallback(async () => {
    try {
      const res = await certificateAPI.list({ search, limit: 50 });
      setCertificates(res.data.certificates);
    } catch {}
  }, [search]);

  const loadStats = useCallback(async () => {
    try {
      const res = await certificateAPI.stats();
      setStats(res.data);
    } catch {}
  }, []);

  useEffect(() => {
    loadSignatories();
    loadLogo();
    loadCertificates();
    loadStats();
  }, [loadSignatories, loadLogo, loadCertificates, loadStats]);

  useEffect(() => {
    const t = setTimeout(() => loadCertificates(), 300);
    return () => clearTimeout(t);
  }, [search, loadCertificates]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await certificateAPI.create(formData);
      setSuccessModal({
        certId: res.data.certificateId,
        recipient: res.data.recipientName,
        award: res.data.award,
      });
      loadCertificates();
      loadStats();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to generate certificate.');
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!window.confirm('Are you sure you want to revoke this certificate?')) return;
    try {
      await certificateAPI.revoke(id);
      loadCertificates();
      loadStats();
    } catch {}
  };

  const handleGenerateAnother = () => {
    setFormData({
      ...defaultFormData,
      eventName: formData.eventName,
      signatoryIds: formData.signatoryIds,
      certificateType: formData.certificateType,
    });
    setSuccessModal(null);
  };

  const handleDownloadPdf = async (certId: string) => {
    try {
      const res = await certificateAPI.get(certId);
      // Generate PDF client-side using a new window
      const previewUrl = `/api/certificates/${certId}/preview`;
      window.open(previewUrl, '_blank');
    } catch {}
  };

  const selectedSignatories = signatories.filter(s => formData.signatoryIds.includes(s._id));

  return (
    <div className="min-h-screen bg-gray-50/50">
      <DashboardHeader />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Welcome header */}
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-semibold text-navy-900">
              Certificate Generator
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create official AEN certificates in seconds.
            </p>
          </div>

          {/* Stats */}
          <StatisticsCards stats={stats} />

          {/* Quick actions */}
          <div className="flex gap-3 mb-6 mt-2">
            <button
              onClick={() => setShowSignatoryModal(true)}
              className="px-4 py-2 text-sm font-medium text-navy-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            >
              Manage Signatories
            </button>
            <button
              onClick={() => setShowBrandModal(true)}
              className="px-4 py-2 text-sm font-medium text-navy-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            >
              Brand Assets
            </button>
            <button
              onClick={() => setShowBulkModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-aen-orange rounded-lg hover:bg-aen-orange/90 transition-all"
            >
              Bulk Generate
            </button>
          </div>

          {/* Certificate Generator: Form + Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <CertificateForm
              formData={formData}
              setFormData={setFormData}
              signatories={signatories}
              onGenerate={handleGenerate}
              generating={generating}
            />
            <CertificatePreview
              formData={formData}
              signatories={selectedSignatories}
              logoUrl={logoUrl}
            />
          </div>

          {/* Certificate History */}
          <CertificateHistory
            certificates={certificates}
            search={search}
            setSearch={setSearch}
            onRevoke={handleRevoke}
            onRefresh={loadCertificates}
          />
        </motion.div>
      </main>

      {/* Modals */}
      {showSignatoryModal && (
        <SignatoryManager
          signatories={signatories}
          onClose={() => { setShowSignatoryModal(false); loadSignatories(); }}
        />
      )}
      {showBrandModal && (
        <BrandManager
          logoUrl={logoUrl}
          onClose={() => { setShowBrandModal(false); loadLogo(); }}
        />
      )}
      {showBulkModal && (
        <BulkGenerator
          signatories={signatories}
          logoUrl={logoUrl}
          onClose={() => setShowBulkModal(false)}
          onComplete={() => { loadCertificates(); loadStats(); }}
        />
      )}
      {successModal && (
        <SuccessModal
          certId={successModal.certId}
          recipient={successModal.recipient}
          award={successModal.award}
          onClose={() => setSuccessModal(null)}
          onGenerateAnother={handleGenerateAnother}
        />
      )}
    </div>
  );
}
