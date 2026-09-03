import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-navy-900/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-aen-gold/[0.05] rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-20 left-20 w-32 h-32 border border-aen-gold/10 rotate-45" />
      <div className="absolute bottom-20 right-20 w-24 h-24 border border-navy-900/5 rotate-12" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl shadow-navy-900/5 border border-gray-100 p-8 md:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-navy-900 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-navy-900/20">
              <span className="text-white font-serif text-2xl font-bold">A</span>
            </div>
            <h1 className="text-2xl font-serif font-semibold text-navy-900 tracking-tight">
              Certificate Generator
            </h1>
            <p className="text-sm text-gray-400 mt-1 tracking-wide uppercase text-[11px] font-medium">
              Authorized Administrator Access
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aen.org"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-navy-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900/20 transition-all"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-lg text-sm text-navy-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900/20 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-300 mt-6">
            African Entrepreneurs Network · Internal System
          </p>
        </div>
      </motion.div>
    </div>
  );
}
