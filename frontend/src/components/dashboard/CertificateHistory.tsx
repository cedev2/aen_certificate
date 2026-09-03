import { Certificate } from '../../pages/DashboardPage';
import { Search, Download, Eye, Ban, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  certificates: Certificate[];
  search: string;
  setSearch: (v: string) => void;
  onRevoke: (id: string) => void;
  onRefresh: () => void;
}

function formatDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const statusColors: Record<string, string> = {
  generated: 'bg-green-50 text-green-700 border-green-200',
  issued: 'bg-blue-50 text-blue-700 border-blue-200',
  draft: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  revoked: 'bg-red-50 text-red-700 border-red-200',
};

export default function CertificateHistory({ certificates, search, setSearch, onRevoke, onRefresh }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-navy-900">Recent Certificates</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, award..."
              className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm text-navy-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10 w-56"
            />
          </div>
          <button
            onClick={onRefresh}
            className="p-1.5 text-gray-400 hover:text-navy-900 hover:bg-gray-50 rounded-lg transition-all"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">No certificates found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2.5 px-3">Certificate ID</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2.5 px-3">Recipient</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2.5 px-3">Award</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2.5 px-3">Event</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2.5 px-3">Date</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2.5 px-3">Status</th>
                <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider py-2.5 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert, i) => (
                <motion.tr
                  key={cert._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${cert.status === 'revoked' ? 'opacity-50' : ''}`}
                >
                  <td className="py-2.5 px-3">
                    <span className="text-xs font-mono font-medium text-navy-900 bg-gray-50 px-1.5 py-0.5 rounded">
                      {cert.certificateId}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-sm text-navy-900 font-medium">{cert.recipientName}</td>
                  <td className="py-2.5 px-3 text-sm text-gray-600">{cert.award}</td>
                  <td className="py-2.5 px-3 text-sm text-gray-500">{cert.eventName}</td>
                  <td className="py-2.5 px-3 text-xs text-gray-400">{formatDateShort(cert.issueDate)}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColors[cert.status] || 'bg-gray-50 text-gray-500'}`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center justify-end gap-1">
                      {cert.status !== 'revoked' && (
                        <>
                          <button className="p-1.5 text-gray-400 hover:text-navy-900 hover:bg-gray-100 rounded-md transition-all" title="Download">
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => onRevoke(cert._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                            title="Revoke"
                          >
                            <Ban size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
