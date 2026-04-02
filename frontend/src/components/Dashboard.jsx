import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CalendarDays, DoorOpen, Clock, ArrowRight, Users } from 'lucide-react';

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

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ rooms: [], reservations: [] });
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date());

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const token = localStorage.getItem('token');
    try {
      const [roomsRes, reservationsRes] = await Promise.all([
        fetch('http://localhost:3001/api/rooms', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:3001/api/reservations', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const rooms = roomsRes.ok ? await roomsRes.json() : [];
      const reservations = reservationsRes.ok ? await reservationsRes.json() : [];

      setStats({ rooms, reservations });
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  // Generate week days
  const getWeek = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay() + 1); // Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const weekDays = getWeek();
  const dayNames = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
  const todayStr = new Date().toISOString().split('T')[0];

  const activeReservations = stats.reservations.filter((r) => r.status === 'active');
  const selectedDayStr = selectedDay.toISOString().split('T')[0];
  const dayReservations = activeReservations.filter((r) => r.date?.split('T')[0] === selectedDayStr);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-accent-500/20 border-t-accent-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 px-8 py-8 max-w-6xl">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Hola, {user?.nombre || 'Usuario'}
        </h1>
        <p className="text-zinc-500 mt-1">Esto es lo que tenes para esta semana</p>
      </div>

      {/* Date Selector */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {weekDays.map((day, i) => {
          const dateStr = day.toISOString().split('T')[0];
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDayStr;

          return (
            <button
              key={i}
              onClick={() => setSelectedDay(day)}
              className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl min-w-[64px] transition-all cursor-pointer ${
                isSelected
                  ? 'bg-accent-500 text-white'
                  : isToday
                    ? 'bg-surface-elevated text-accent-400 border border-accent-500/30'
                    : 'bg-surface text-zinc-500 border border-border-subtle hover:border-zinc-600'
              }`}
            >
              <span className="text-[11px] font-medium uppercase tracking-wider">{dayNames[i]}</span>
              <span className="text-lg font-bold">{day.getDate()}</span>
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'SALAS', value: stats.rooms.length, icon: DoorOpen, color: 'accent' },
          { label: 'RESERVAS ACTIVAS', value: activeReservations.length, icon: CalendarDays, color: 'emerald' },
          { label: 'HOY', value: dayReservations.length, icon: Clock, color: 'amber' },
        ].map((s) => (
          <div key={s.label} className="bg-surface rounded-2xl border border-border-subtle p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl bg-${s.color}-500/10 text-${s.color}-400 flex items-center justify-center`}>
                <s.icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-3xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Day Reservations */}
      <div className="bg-surface rounded-2xl border border-border-subtle p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">
            Reservas — {selectedDay.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' })}
          </h2>
          <Link
            to="/reservations"
            className="text-sm font-medium text-accent-400 hover:text-accent-300 flex items-center gap-1 no-underline"
          >
            Ver todas
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {dayReservations.length === 0 ? (
          <div className="text-center py-10">
            <CalendarDays className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500">Sin reservas para este dia</p>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-accent-400 hover:text-accent-300 no-underline"
            >
              Reservar una sala
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {dayReservations.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-4 rounded-xl bg-surface-elevated border border-border-subtle"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-500/10 text-accent-400 flex items-center justify-center">
                    <DoorOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Sala #{r.room_id}</p>
                    <p className="text-sm text-zinc-500">
                      {r.start_time?.slice(0, 5)} – {r.end_time?.slice(0, 5)}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full">
                  Activa
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Rooms */}
      {stats.rooms.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Salas destacadas</h2>
            <Link
              to="/rooms"
              className="text-sm font-medium text-accent-400 hover:text-accent-300 flex items-center gap-1 no-underline"
            >
              Ver todas
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.rooms.slice(0, 3).map((room, i) => (
              <Link
                key={room.id}
                to="/rooms"
                className="group relative rounded-2xl overflow-hidden h-48 no-underline"
              >
                <img
                  src={roomImages[i % roomImages.length]}
                  alt={room.name || room.nombre}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="relative h-full flex flex-col justify-end p-5">
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-accent-300 transition-colors">
                    {room.name || room.nombre}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-white/70 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      <Users className="w-3 h-3" />
                      {room.capacity || room.capacidad} personas
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
