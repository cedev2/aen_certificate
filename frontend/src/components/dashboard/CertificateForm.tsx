import { FormData, Signatory } from '../../pages/DashboardPage';
import { Loader2 } from 'lucide-react';

const certTypes = [
  'Certificate of Achievement',
  'Certificate of Excellence',
  'Winner Certificate',
  'First Place Award',
  'Second Place Award',
  'Third Place Award',
  'Certificate of Recognition',
  'Certificate of Appreciation',
  'Certificate of Participation',
  'Custom',
];

interface Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  signatories: Signatory[];
  onGenerate: () => void;
  generating: boolean;
}

export default function CertificateForm({ formData, setFormData, signatories, onGenerate, generating }: Props) {
  const update = (field: keyof FormData, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleSignatory = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      signatoryIds: prev.signatoryIds.includes(id)
        ? prev.signatoryIds.filter((s) => s !== id)
        : [...prev.signatoryIds, id],
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-navy-900 mb-5">Certificate Information</h3>

      <div className="space-y-4">
        {/* Recipient Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.recipientName}
            onChange={(e) => update('recipientName', e.target.value)}
            placeholder="e.g. NIBISHAKA Cedrick"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900/20 transition-all"
          />
        </div>

        {/* Certificate Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certificate Type <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.certificateType}
            onChange={(e) => update('certificateType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900/20 transition-all bg-white"
          >
            {certTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Award / Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Award / Category <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.award}
            onChange={(e) => update('award', e.target.value)}
            placeholder="e.g. 1st Place – Innovation Award"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900/20 transition-all"
          />
        </div>

        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event / Program <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.eventName}
            onChange={(e) => update('eventName', e.target.value)}
            placeholder="e.g. AEN Community Hackathon 2026"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900/20 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="In recognition of outstanding achievement..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900/20 transition-all resize-none"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
            <input
              type="date"
              value={formData.eventDate}
              onChange={(e) => update('eventDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Award Date</label>
            <input
              type="date"
              value={formData.issueDate}
              onChange={(e) => update('issueDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900/20 transition-all"
            />
          </div>
        </div>

        {/* Signatories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Signatories <span className="text-red-400">*</span>
          </label>
          {signatories.length === 0 ? (
            <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
              No signatories found. Add signatories in the Signatory Manager.
            </p>
          ) : (
            <div className="space-y-1.5">
              {signatories.map((s) => (
                <label
                  key={s._id}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                    formData.signatoryIds.includes(s._id)
                      ? 'border-navy-900/20 bg-navy-50/50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.signatoryIds.includes(s._id)}
                    onChange={() => toggleSignatory(s._id)}
                    className="w-4 h-4 rounded border-gray-300 text-navy-900 focus:ring-navy-900/20"
                  />
                  <div>
                    <p className="text-sm font-medium text-navy-900">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.title}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Generate button */}
        <button
          onClick={onGenerate}
          disabled={generating || !formData.recipientName || !formData.award || !formData.eventName || formData.signatoryIds.length === 0}
          className="w-full py-3 bg-navy-900 text-white text-sm font-semibold rounded-xl hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-2"
        >
          {generating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating Certificate...
            </>
          ) : (
            'Generate Certificate'
          )}
        </button>
      </div>
    </div>
  );
}
