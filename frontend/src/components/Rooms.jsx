import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DoorOpen, Users, Star, Heart, Search, X, CalendarDays, Clock, AlertCircle, CheckCircle } from 'lucide-react';

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

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [bookingRoom, setBookingRoom] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingStart, setBookingStart] = useState('');
  const [bookingEnd, setBookingEnd] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const [ratingRoom, setRatingRoom] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [roomsRes, favsRes] = await Promise.all([
        fetch('http://localhost:3001/api/rooms', { headers }),
        fetch('http://localhost:3001/api/rooms/favorites/me', { headers }),
      ]);
      const roomsData = roomsRes.ok ? await roomsRes.json() : [];
      const favsData = favsRes.ok ? await favsRes.json() : [];
      setRooms(roomsData);
      setFavorites(favsData.map((f) => f.room_id || f.id));

      const ratingsMap = {};
      await Promise.all(
        roomsData.map(async (room) => {
          try {
            const res = await fetch(`http://localhost:3001/api/rooms/${room.id}/average`, { headers });
            if (res.ok) ratingsMap[room.id] = await res.json();
          } catch {}
        })
      );
      setRatings(ratingsMap);
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (roomId) => {
    const isFav = favorites.includes(roomId);
    try {
      await fetch(`http://localhost:3001/api/rooms/${roomId}/favorite`, {
        method: isFav ? 'DELETE' : 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
      setFavorites((prev) => isFav ? prev.filter((id) => id !== roomId) : [...prev, roomId]);
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
        body: JSON.stringify({ room_id: bookingRoom.id, date: bookingDate, start_time: bookingStart, end_time: bookingEnd }),
      });
      const data = await res.json();
      if (!res.ok) { setBookingError(data.error || 'Error al crear la reserva'); return; }
      setBookingSuccess('Reserva creada');
      setTimeout(() => { setBookingRoom(null); setBookingDate(''); setBookingStart(''); setBookingEnd(''); setBookingSuccess(''); }, 1500);
    } catch {
      setBookingError('Error de conexion');
    } finally {
      setBookingLoading(false);
    }
  };

  const submitRating = async (roomId, value) => {
    try {
      await fetch(`http://localhost:3001/api/rooms/${roomId}/rate`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: value }),
      });
      const res = await fetch(`http://localhost:3001/api/rooms/${roomId}/average`, { headers });
      if (res.ok) {
        const data = await res.json();
        setRatings((prev) => ({ ...prev, [roomId]: data }));
      }
      setRatingRoom(null);
      setRatingValue(0);
    } catch {}
  };

  const filtered = rooms.filter((r) =>
    (r.name || r.nombre || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-accent-500/20 border-t-accent-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 px-8 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Salas</h1>
          <p className="text-zinc-500 mt-1">{rooms.length} espacios disponibles</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar sala..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface border border-border-subtle text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <DoorOpen className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-lg text-zinc-500">No se encontraron salas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((room, i) => {
            const isFav = favorites.includes(room.id);
            const rating = ratings[room.id];
            const avg = rating?.average ? parseFloat(rating.average).toFixed(1) : null;
            const count = rating?.count || 0;

            return (
              <div
                key={room.id}
                className="group bg-surface rounded-2xl border border-border-subtle hover:border-accent-500/30 transition-all overflow-hidden"
              >
                {/* Image area */}
                <Link to={`/rooms/${room.id}`} className="block relative h-44 overflow-hidden no-underline cursor-pointer">
                  <img
                    src={roomImages[i % roomImages.length]}
                    alt={room.name || room.nombre}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                  <div className="absolute top-3 right-3 flex items-center gap-2" onClick={(e) => e.preventDefault()}>
                    <button
                      onClick={(e) => { e.preventDefault(); toggleFavorite(room.id); }}
                      className={`p-2 rounded-xl backdrop-blur-sm transition-colors cursor-pointer ${
                        isFav ? 'text-red-400 bg-red-500/20' : 'text-white/60 bg-white/10 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-4">
                    <h3 className="text-lg font-bold text-white tracking-tight">{room.name || room.nombre}</h3>
                  </div>
                </Link>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center gap-1.5 text-sm text-zinc-400">
                      <Users className="w-3.5 h-3.5" />
                      {room.capacity || room.capacidad} personas
                    </span>

                    <button
                      onClick={() => { setRatingRoom(room); setRatingValue(0); setRatingHover(0); }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition-colors cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {avg || '—'}
                      <span className="text-xs text-zinc-600 ml-0.5">({count})</span>
                    </button>
                  </div>

                  <button
                    onClick={() => { setBookingRoom(room); setBookingError(''); setBookingSuccess(''); }}
                    className="w-full py-2.5 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-400 transition-colors cursor-pointer text-sm uppercase tracking-wider"
                  >
                    Reservar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {bookingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl border border-border-subtle shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border-subtle">
              <div>
                <h2 className="text-lg font-semibold text-white">Reservar sala</h2>
                <p className="text-sm text-zinc-500">{bookingRoom.name || bookingRoom.nombre}</p>
              </div>
              <button onClick={() => setBookingRoom(null)} className="p-2 rounded-xl text-zinc-500 hover:bg-surface-elevated hover:text-zinc-300 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitBooking} className="p-5 space-y-4">
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
        </div>
      )}

      {/* Rating Modal */}
      {ratingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl border border-border-subtle shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border-subtle">
              <div>
                <h2 className="text-lg font-semibold text-white">Calificar sala</h2>
                <p className="text-sm text-zinc-500">{ratingRoom.name || ratingRoom.nombre}</p>
              </div>
              <button onClick={() => setRatingRoom(null)} className="p-2 rounded-xl text-zinc-500 hover:bg-surface-elevated hover:text-zinc-300 transition-colors cursor-pointer">
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
              <button onClick={() => ratingValue > 0 && submitRating(ratingRoom.id, ratingValue)} disabled={ratingValue === 0}
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

export default Rooms;
