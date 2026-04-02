import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Users, Star, Heart, MapPin, Wifi, Monitor, Coffee,
  Projector, Speaker, CalendarDays, Clock, AlertCircle, CheckCircle, X,
} from 'lucide-react';

const roomImages = [
  '/rooms/room-1.jpg',
  '/rooms/room-2.jpg',
  '/rooms/room-3.jpg',
  '/rooms/room-4.jpg',
  '/rooms/room-5.jpg',
  '/rooms/room-6.jpg',
  '/rooms/room-7.jpg',
  '/rooms/room-8.jpg',
];

const defaultAmenities = [
  { icon: Wifi, label: 'Wi-Fi de alta velocidad' },
  { icon: Monitor, label: 'Pantalla 4K' },
  { icon: Coffee, label: 'Servicio de cafe' },
  { icon: Projector, label: 'Proyector HD' },
  { icon: Speaker, label: 'Sistema de audio' },
];

function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFav, setIsFav] = useState(false);

  const [bookingDate, setBookingDate] = useState('');
  const [bookingStart, setBookingStart] = useState('');
  const [bookingEnd, setBookingEnd] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const [ratingValue, setRatingValue] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [showRating, setShowRating] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchRoom();
    checkFavorite();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/rooms/${id}/detail`, { headers });
      if (res.ok) {
        setRoom(await res.json());
      } else {
        setError('Sala no encontrada');
      }
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/rooms/favorites/me', { headers });
      if (res.ok) {
        const favs = await res.json();
        setIsFav(favs.some((f) => (f.room_id || f.id) === parseInt(id)));
      }
    } catch {}
  };

  const toggleFavorite = async () => {
    try {
      await fetch(`http://localhost:3001/api/rooms/${id}/favorite`, {
        method: isFav ? 'DELETE' : 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
      setIsFav(!isFav);
    } catch {}
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!bookingDate || !bookingStart || !bookingEnd) {
      setBookingError('Completa todos los campos');
      return;
    }
    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess('');
    try {
      const res = await fetch('http://localhost:3001/api/reservations', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_id: parseInt(id), date: bookingDate, start_time: bookingStart, end_time: bookingEnd }),
      });
      const data = await res.json();
      if (!res.ok) { setBookingError(data.error || 'Error al crear la reserva'); return; }
      setBookingSuccess('Reserva creada exitosamente');
      fetchRoom();
      setTimeout(() => { setBookingDate(''); setBookingStart(''); setBookingEnd(''); setBookingSuccess(''); }, 2000);
    } catch {
      setBookingError('Error de conexion');
    } finally {
      setBookingLoading(false);
    }
  };

  const submitRating = async (value) => {
    try {
      await fetch(`http://localhost:3001/api/rooms/${id}/rate`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: value }),
      });
      fetchRoom();
      setShowRating(false);
      setRatingValue(0);
    } catch {}
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-accent-500/20 border-t-accent-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex-1 px-8 py-8 max-w-6xl">
        <Link to="/rooms" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors no-underline mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver a salas
        </Link>
        <div className="text-center py-20">
          <AlertCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-lg text-zinc-500">{error || 'Sala no encontrada'}</p>
        </div>
      </div>
    );
  }

  const avg = room.rating?.average ? parseFloat(room.rating.average).toFixed(1) : null;
  const count = room.rating?.count || 0;
  const imgIndex = (parseInt(id) - 1) % roomImages.length;
  const amenities = room.amenities ? JSON.parse(room.amenities) : null;
  const description = room.description || 'Sala de reuniones equipada con tecnologia de ultima generacion, disenada para maximizar la productividad y el confort de tu equipo. Ambiente premium con iluminacion regulable y aislamiento acustico.';
  const location = room.location || 'Piso principal';

  return (
    <div className="flex-1 max-w-6xl">
      {/* Hero */}
      <div className="relative h-72 sm:h-80 overflow-hidden">
        <img
          src={roomImages[imgIndex]}
          alt={room.name || room.nombre}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon/40 to-transparent" />

        <div className="absolute top-6 left-8 right-8 flex items-center justify-between">
          <Link to="/rooms" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-sm text-white/80 hover:text-white text-sm font-medium transition-colors no-underline">
            <ArrowLeft className="w-4 h-4" /> Salas
          </Link>
          <button
            onClick={toggleFavorite}
            className={`p-2.5 rounded-xl backdrop-blur-sm transition-colors cursor-pointer ${
              isFav ? 'text-red-400 bg-red-500/20' : 'text-white/60 bg-black/40 hover:text-red-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="absolute bottom-6 left-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-2">
            {room.name || room.nombre}
          </h1>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm text-white/70 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Users className="w-3.5 h-3.5" />
              {room.capacity || room.capacidad} personas
            </span>
            <span className="flex items-center gap-1.5 text-sm text-white/70 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5" />
              {location}
            </span>
            {avg && (
              <button
                onClick={() => { setShowRating(true); setRatingValue(0); setRatingHover(0); }}
                className="flex items-center gap-1.5 text-sm text-amber-400 bg-amber-500/15 px-3 py-1.5 rounded-full backdrop-blur-sm cursor-pointer hover:bg-amber-500/25 transition-colors"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {avg} ({count})
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-surface rounded-2xl border border-border-subtle p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Sobre esta sala</h2>
              <p className="text-zinc-400 leading-relaxed">{description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-surface rounded-2xl border border-border-subtle p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Equipamiento</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(amenities || defaultAmenities).map((a, idx) => {
                  const Icon = a.icon || Wifi;
                  const label = a.label || a;
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated border border-border-subtle">
                      <div className="w-9 h-9 rounded-lg bg-accent-500/10 text-accent-400 flex items-center justify-center shrink-0">
                        {typeof Icon === 'function' ? <Icon className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                      </div>
                      <span className="text-sm text-zinc-300">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Reservations */}
            <div className="bg-surface rounded-2xl border border-border-subtle p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Proximas reservas</h2>
              {room.upcoming_reservations?.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarDays className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500">No hay reservas proximas</p>
                  <p className="text-sm text-zinc-600 mt-1">Esta sala esta disponible</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {room.upcoming_reservations?.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-elevated border border-border-subtle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-500/10 text-accent-400 flex items-center justify-center">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{formatDate(r.date)}</p>
                          <p className="text-xs text-zinc-500">{r.start_time?.slice(0, 5)} – {r.end_time?.slice(0, 5)}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full">
                        Reservada
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column — Booking */}
          <div className="space-y-6">
            <div className="bg-surface rounded-2xl border border-border-subtle p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-white mb-1">Reservar esta sala</h2>
              <p className="text-sm text-zinc-500 mb-5">Selecciona fecha y horario</p>

              <form onSubmit={submitBooking} className="space-y-4">
                {bookingError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />{bookingError}
                  </div>
                )}
                {bookingSuccess && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                    <CheckCircle className="w-4 h-4 shrink-0" />{bookingSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Fecha</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none z-10" />
                    <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-elevated border border-border-subtle text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Inicio</label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none z-10" />
                      <input type="time" value={bookingStart} onChange={(e) => setBookingStart(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-elevated border border-border-subtle text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Fin</label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none z-10" />
                      <input type="time" value={bookingEnd} onChange={(e) => setBookingEnd(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-elevated border border-border-subtle text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 transition-all" />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={bookingLoading}
                  className="w-full py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                  {bookingLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Reservando...
                    </span>
                  ) : 'Confirmar reserva'}
                </button>
              </form>
            </div>

            {/* Quick rating */}
            {!avg && (
              <div className="bg-surface rounded-2xl border border-border-subtle p-6 text-center">
                <Star className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                <p className="text-sm text-zinc-500 mb-3">Se la primera persona en calificar</p>
                <button
                  onClick={() => { setShowRating(true); setRatingValue(0); setRatingHover(0); }}
                  className="px-4 py-2 text-sm font-medium text-accent-400 bg-accent-500/10 rounded-xl hover:bg-accent-500/20 transition-colors cursor-pointer"
                >
                  Calificar sala
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl border border-border-subtle shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border-subtle">
              <div>
                <h2 className="text-lg font-semibold text-white">Calificar sala</h2>
                <p className="text-sm text-zinc-500">{room.name || room.nombre}</p>
              </div>
              <button onClick={() => setShowRating(false)} className="p-2 rounded-xl text-zinc-500 hover:bg-surface-elevated hover:text-zinc-300 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onMouseEnter={() => setRatingHover(star)} onMouseLeave={() => setRatingHover(0)} onClick={() => setRatingValue(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110">
                    <Star className={`w-8 h-8 ${star <= (ratingHover || ratingValue) ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`} />
                  </button>
                ))}
              </div>
              <button onClick={() => ratingValue > 0 && submitRating(ratingValue)} disabled={ratingValue === 0}
                className="w-full py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                Enviar calificacion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomDetail;
