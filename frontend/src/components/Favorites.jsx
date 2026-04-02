import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, HeartOff, DoorOpen, Users, Star, ArrowRight, AlertCircle } from 'lucide-react';

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

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/rooms/favorites/me', { headers });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);

        const ratingsMap = {};
        await Promise.all(
          data.map(async (room) => {
            const id = room.room_id || room.id;
            try {
              const rRes = await fetch(`http://localhost:3001/api/rooms/${id}/average`, { headers });
              if (rRes.ok) ratingsMap[id] = await rRes.json();
            } catch {
              // ignore
            }
          })
        );
        setRatings(ratingsMap);
      }
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (roomId) => {
    try {
      await fetch(`http://localhost:3001/api/rooms/${roomId}/favorite`, {
        method: 'DELETE',
        headers,
      });
      setFavorites((prev) => prev.filter((f) => (f.room_id || f.id) !== roomId));
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-accent-500/20 border-t-accent-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 px-8 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Mis Favoritos</h1>
        <p className="text-zinc-500 mt-1">{favorites.length} salas guardadas</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-lg text-zinc-500">No tenes salas favoritas</p>
          <p className="text-sm text-zinc-600 mt-1 mb-6">
            Guarda tus salas preferidas para acceder rapidamente.
          </p>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-400 transition-colors no-underline text-sm"
          >
            Explorar salas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((room, i) => {
            const id = room.room_id || room.id;
            const rating = ratings[id];
            const avg = rating?.average ? parseFloat(rating.average).toFixed(1) : null;

            return (
              <div
                key={id}
                className="group bg-surface rounded-2xl border border-border-subtle hover:border-accent-500/30 transition-all overflow-hidden"
              >
                {/* Image header */}
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={roomImages[i % roomImages.length]}
                    alt={room.name || room.nombre || `Sala #${id}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => removeFavorite(id)}
                      className="p-2 rounded-xl backdrop-blur-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors cursor-pointer"
                      title="Quitar de favoritos"
                    >
                      <HeartOff className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-4">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {room.name || room.nombre || `Sala #${id}`}
                    </h3>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    {(room.capacity || room.capacidad) && (
                      <span className="flex items-center gap-1.5 text-sm text-zinc-400">
                        <Users className="w-3.5 h-3.5" />
                        {room.capacity || room.capacidad} personas
                      </span>
                    )}

                    {avg && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-medium">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {avg}
                      </div>
                    )}
                  </div>

                  <Link
                    to="/rooms"
                    className="block w-full py-2.5 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-400 transition-colors text-sm text-center no-underline uppercase tracking-wider"
                  >
                    Reservar
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Favorites;
