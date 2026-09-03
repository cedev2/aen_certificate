import { useAuth } from '../../hooks/useAuth';
import { LogOut } from 'lucide-react';

export default function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-navy-900 border-b border-navy-800">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif text-lg font-bold">A</span>
            </div>
            <div>
              <h1 className="text-white text-sm font-semibold tracking-tight">
                Certificate Generator
              </h1>
              <p className="text-white/40 text-[10px] tracking-widest uppercase">
                African Entrepreneurs Network
              </p>
            </div>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-white/90 text-sm font-medium">{user?.name}</p>
              <p className="text-white/40 text-xs">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-all"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
