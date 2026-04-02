import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CalendarDays, LayoutDashboard, DoorOpen, ClipboardList, Heart, LogOut, ShieldCheck } from 'lucide-react';

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const isAdmin = user?.role === 'admin';

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/rooms', label: 'Salas', icon: DoorOpen },
    { to: '/reservations', label: 'Reservas', icon: ClipboardList },
    { to: '/favorites', label: 'Favoritos', icon: Heart },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-carbon border-r border-border-subtle flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="w-9 h-9 bg-accent-500 rounded-xl flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">BookRoom</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 mt-4">
        <p className="px-3 mb-3 text-[11px] font-semibold text-zinc-600 uppercase tracking-widest">Menu</p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
              isActive(to)
                ? 'bg-accent-500/10 text-accent-400 border-l-2 border-accent-500'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-surface-elevated'
            }`}
          >
            <Icon className="w-[18px] h-[18px]" />
            {label}
          </Link>
        ))}

        {isAdmin && (
          <>
            <p className="px-3 mt-6 mb-3 text-[11px] font-semibold text-amber-500/70 uppercase tracking-widest">Admin</p>
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                isActive('/admin')
                  ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-surface-elevated'
              }`}
            >
              <ShieldCheck className="w-[18px] h-[18px]" />
              Panel Admin
            </Link>
          </>
        )}
      </nav>

      {/* User */}
      <div className="px-3 pb-6">
        <div className="p-3 rounded-xl bg-surface border border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center text-sm font-bold">
              {user?.nombre?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white truncate">{user?.nombre || 'Usuario'}</p>
                {isAdmin && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded">ADMIN</span>}
              </div>
              <p className="text-xs text-zinc-600 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-zinc-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar sesion
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
