import { Link } from 'react-router-dom';
import { CalendarDays, Users, Star, ArrowRight, CheckCircle, Zap, Shield, Clock, Sparkles, Building2, BarChart3, Globe } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Reservas instantaneas',
    description: 'Disponibilidad en tiempo real. Sin conflictos, sin esperas. Tu sala en segundos.',
  },
  {
    icon: Users,
    title: 'Espacios premium',
    description: 'Filtra por capacidad, equipamiento y ubicacion para tu equipo.',
  },
  {
    icon: Star,
    title: 'Valoraciones',
    description: 'Califica salas, guarda favoritas y accede al instante.',
  },
  {
    icon: Shield,
    title: 'Sin conflictos',
    description: 'Sistema inteligente que previene reservas duplicadas automaticamente.',
  },
  {
    icon: Clock,
    title: 'Historial completo',
    description: 'Accede a todas tus reservas pasadas, activas y canceladas.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard intuitivo',
    description: 'Vista semanal con estadisticas y acceso rapido a tus salas.',
  },
];

const stats = [
  { value: '500+', label: 'Reservas mensuales' },
  { value: '50+', label: 'Salas premium' },
  { value: '99.9%', label: 'Uptime garantizado' },
  { value: '4.9', label: 'Calificacion promedio' },
];

const steps = [
  { step: '01', title: 'Explora salas', description: 'Navega por nuestro catalogo de salas premium con fotos, equipamiento y calificaciones.' },
  { step: '02', title: 'Elige tu horario', description: 'Selecciona fecha y hora. El sistema te muestra disponibilidad en tiempo real.' },
  { step: '03', title: 'Confirma y listo', description: 'Reserva en un click. Recibiras confirmacion instantanea.' },
];

const testimonials = [
  { name: 'Maria Garcia', role: 'Product Manager', text: 'La plataforma mas intuitiva que usamos en la empresa. Reservar una sala lleva 10 segundos.', avatar: 'MG' },
  { name: 'Lucas Rodriguez', role: 'Tech Lead', text: 'El sistema de favoritos y calificaciones nos ahorra mucho tiempo al elegir salas para el equipo.', avatar: 'LR' },
  { name: 'Sofia Martinez', role: 'HR Director', text: 'Desde que implementamos BookRoom, los conflictos de reservas bajaron a cero. Increible herramienta.', avatar: 'SM' },
];

const roomShowcase = [
  { name: 'Sala Ejecutiva', capacity: 12, image: '/rooms/room-1.jpg' },
  { name: 'Sala Creativa', capacity: 8, image: '/rooms/room-2.jpg' },
  { name: 'Sala Conferencia', capacity: 20, image: '/rooms/room-3.jpg' },
];

function Landing() {
  return (
    <div className="min-h-screen bg-carbon flex flex-col overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent-500 rounded-xl flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">BookRoom</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors no-underline">
            Iniciar sesion
          </Link>
          <Link to="/register" className="text-sm font-medium px-5 py-2.5 bg-accent-500 text-white rounded-xl hover:bg-accent-400 transition-colors no-underline">
            Comenzar
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-8 pt-16 pb-32">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-accent-500/8 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-600/5 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-medium mb-8 animate-fade-up">
            <Sparkles className="w-3.5 h-3.5" />
            Workspace Booking Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] animate-fade-up-delay-1">
            Reserva tu espacio
            <br />
            <span className="text-gradient">de trabajo ideal</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed animate-fade-up-delay-2">
            La forma mas inteligente de gestionar salas de reuniones.
            Reserva, organiza y optimiza tus espacios en tiempo real.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-delay-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-400 shadow-lg shadow-accent-500/20 hover:shadow-accent-500/30 transition-all no-underline group"
            >
              Comenzar gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-surface text-zinc-300 font-semibold rounded-xl border border-border-subtle hover:bg-surface-elevated hover:border-zinc-600 transition-all no-underline"
            >
              Iniciar sesion
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative px-8 -mt-16 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`glow-card bg-surface/80 backdrop-blur-sm rounded-2xl border border-border-subtle p-6 text-center animate-fade-up-delay-${i + 1}`}
              >
                <p className="text-3xl sm:text-4xl font-bold text-gradient mb-1">{s.value}</p>
                <p className="text-sm text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room showcase */}
      <section className="px-8 py-24 relative">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-accent-400 uppercase tracking-widest mb-3">Nuestros espacios</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Salas disenadas para <span className="text-gradient">inspirar</span>
            </h2>
            <p className="mt-3 text-zinc-500 max-w-lg mx-auto">
              Cada sala esta equipada con tecnologia de ultima generacion y disenada para maximizar la productividad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roomShowcase.map((room, i) => (
              <Link
                to="/register"
                key={room.name}
                className={`group relative rounded-2xl overflow-hidden h-72 no-underline glow-card animate-fade-up-delay-${i + 1}`}
              >
                <img
                  src={room.image}
                  alt={room.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="relative h-full flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-accent-300 transition-colors">
                    {room.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-white/70 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      <Users className="w-3 h-3" />
                      {room.capacity} personas
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="px-8 py-24 bg-surface/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-accent-400 uppercase tracking-widest mb-3">Funcionalidades</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Todo lo que necesitas
            </h2>
            <p className="mt-3 text-zinc-500 max-w-lg mx-auto">
              Herramientas poderosas para gestionar tus espacios de trabajo de forma eficiente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`glow-card p-6 bg-surface rounded-2xl border border-border-subtle hover:border-accent-500/30 transition-all group animate-fade-up-delay-${(i % 4) + 1}`}
              >
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 text-accent-400 flex items-center justify-center mb-5 group-hover:bg-accent-500/20 group-hover:scale-110 transition-all">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 py-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[150px]" />

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-accent-400 uppercase tracking-widest mb-3">Como funciona</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Simple como <span className="text-gradient">1, 2, 3</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className={`relative animate-fade-up-delay-${i + 1}`}>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-accent-500/30 to-transparent" />
                )}
                <div className="text-5xl font-black text-accent-500/15 mb-4">{s.step}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-8 py-24 bg-surface/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-accent-400 uppercase tracking-widest mb-3">Testimonios</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Lo que dicen nuestros usuarios
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`glow-card bg-surface rounded-2xl border border-border-subtle p-6 animate-fade-up-delay-${i + 1}`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-zinc-600">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands / Trust bar */}
      <section className="px-8 py-16 border-t border-border-subtle">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-medium text-zinc-700 uppercase tracking-widest mb-8">Empresas que confian en nosotros</p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-30">
            {[Building2, Globe, Sparkles, Shield, BarChart3, Zap].map((Icon, i) => (
              <div key={i} className="flex items-center gap-2 text-zinc-500">
                <Icon className="w-6 h-6" />
                <span className="text-lg font-bold tracking-tight">Brand {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-500/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-accent-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
            <CalendarDays className="w-8 h-8 text-accent-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Listo para optimizar tus espacios?
          </h2>
          <p className="text-zinc-500 text-lg mb-8 max-w-lg mx-auto">
            Unite a las empresas que ya gestionan sus salas de manera inteligente. Gratis para empezar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-400 shadow-lg shadow-accent-500/20 transition-all no-underline group"
            >
              Crear cuenta gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 text-zinc-400 font-semibold hover:text-white transition-colors no-underline"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <div className="w-7 h-7 bg-accent-500 rounded-lg flex items-center justify-center">
                <CalendarDays className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold">BookRoom</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-700">
              <span className="hover:text-zinc-400 cursor-pointer transition-colors">Terminos</span>
              <span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacidad</span>
              <span className="hover:text-zinc-400 cursor-pointer transition-colors">Contacto</span>
            </div>
            <p className="text-xs text-zinc-700">&copy; {new Date().getFullYear()} BookRoom. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
