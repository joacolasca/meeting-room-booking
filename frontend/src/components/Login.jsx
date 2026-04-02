import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CalendarDays, Mail, Lock, AlertCircle, CheckCircle, Zap, Shield } from 'lucide-react';

const highlights = [
  { icon: <Zap className="w-4 h-4" />, text: 'Disponibilidad en tiempo real' },
  { icon: <Shield className="w-4 h-4" />, text: 'Reservas sin conflictos' },
  { icon: <CheckCircle className="w-4 h-4" />, text: 'Espacios premium' },
];

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Error al iniciar sesion');
        return;
      }

      login(data.user, data.token);
      navigate('/');
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-carbon relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent-500/8 rounded-full blur-[120px]" />

        <div className="relative">
          <Link to="/" className="flex items-center gap-3 no-underline mb-20">
            <div className="w-9 h-9 bg-accent-500 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">BookRoom</span>
          </Link>

          <h1 className="text-5xl font-bold text-white tracking-tight leading-tight">
            Tu espacio de
            <br />
            <span className="text-accent-400">trabajo ideal</span>
          </h1>
          <p className="mt-4 text-zinc-500 text-lg max-w-md">
            Gestiona y reserva salas de reuniones de manera inteligente.
          </p>

          <div className="mt-10 space-y-3">
            {highlights.map((h) => (
              <div key={h.text} className="flex items-center gap-3 text-zinc-400">
                <div className="text-accent-500">{h.icon}</div>
                <span className="text-sm">{h.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-zinc-700">&copy; {new Date().getFullYear()} BookRoom</p>
      </div>

      {/* Right — Form */}
      <div className="flex-1 bg-surface flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-accent-500 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">BookRoom</span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">Bienvenido</h2>
          <p className="text-zinc-500 mt-1 mb-8">Ingresa a tu cuenta para continuar</p>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-elevated border border-border-subtle text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Contrasena</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contrasena"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-elevated border border-border-subtle text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </span>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-600 mt-8">
            No tenes cuenta?{' '}
            <Link to="/register" className="font-medium text-accent-400 hover:text-accent-300 no-underline">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
