import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CalendarDays, Menu, X, LogOut, Heart, ClipboardList, DoorOpen } from 'lucide-react';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label, icon) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive(to)
          ? 'bg-primary-50 text-primary-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-sm shadow-primary-500/25">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">BookRoom</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                {navLink('/rooms', 'Salas', <DoorOpen className="w-4 h-4" />)}
                {navLink('/reservations', 'Mis Reservas', <ClipboardList className="w-4 h-4" />)}
                {navLink('/favorites', 'Favoritos', <Heart className="w-4 h-4" />)}
              </>
            ) : (
              <>
                {navLink('/login', 'Iniciar Sesion', null)}
                {navLink('/register', 'Registrarse', null)}
              </>
            )}
          </nav>

          {/* User / Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
                    {user.nombre?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.nombre}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-slate-100 pt-3 space-y-1">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
                    {user.nombre?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.nombre}</span>
                </div>
                {navLink('/rooms', 'Salas', <DoorOpen className="w-4 h-4" />)}
                {navLink('/reservations', 'Mis Reservas', <ClipboardList className="w-4 h-4" />)}
                {navLink('/favorites', 'Favoritos', <Heart className="w-4 h-4" />)}
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </>
            ) : (
              <>
                {navLink('/login', 'Iniciar Sesion', null)}
                {navLink('/register', 'Registrarse', null)}
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
