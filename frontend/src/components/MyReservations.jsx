import { useEffect, useState } from 'react';
import { CalendarDays, Clock, DoorOpen, XCircle, AlertCircle, CheckCircle, Ban } from 'lucide-react';
import { API } from '../api';

const statusConfig = {
  active: {
    label: 'Activa',
    className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  cancelled: {
    label: 'Cancelada',
    className: 'bg-red-500/10 text-red-400 border border-red-500/20',
    icon: <Ban className="w-3.5 h-3.5" />,
  },
  finished: {
    label: 'Finalizada',
    className: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
};

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await fetch(`${API}/reservations`, { headers });
      if (res.ok) {
        setReservations(await res.json());
      } else {
        setError('Error al cargar reservas');
      }
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id) => {
    try {
      const res = await fetch(`${API}/reservations/${id}/cancel`, {
        method: 'PUT',
        headers,
      });
      if (res.ok) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
        );
      }
    } catch {
      // ignore
    }
  };

  const filtered =
    filter === 'all'
      ? reservations
      : reservations.filter((r) => r.status === filter);

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

  return (
    <div className="flex-1 px-8 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Mis Reservas</h1>
          <p className="text-zinc-500 mt-1">{reservations.length} reservas en total</p>
        </div>

        <div className="flex items-center gap-1 bg-surface rounded-xl border border-border-subtle p-1">
          {[
            { key: 'all', label: 'Todas' },
            { key: 'active', label: 'Activas' },
            { key: 'finished', label: 'Finalizadas' },
            { key: 'cancelled', label: 'Canceladas' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                filter === f.key
                  ? 'bg-accent-500 text-white'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-surface-elevated'
              }`}
            >
              {f.label}
            </button>
          ))}
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
          <CalendarDays className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-lg text-zinc-500">No hay reservas</p>
          <p className="text-sm text-zinc-600 mt-1">
            {filter !== 'all' ? 'Proba con otro filtro' : 'Reserva una sala para empezar'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const status = statusConfig[r.status] || statusConfig.active;

            return (
              <div
                key={r.id}
                className="bg-surface rounded-2xl border border-border-subtle p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-accent-500/30 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-accent-500/10 text-accent-400 flex items-center justify-center shrink-0">
                    <DoorOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {`Sala #${r.room_id}`}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      <span className="flex items-center gap-1.5 text-sm text-zinc-500">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formatDate(r.date)}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-zinc-500">
                        <Clock className="w-3.5 h-3.5" />
                        {r.start_time?.slice(0, 5)} – {r.end_time?.slice(0, 5)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${status.className}`}
                  >
                    {status.icon}
                    {status.label}
                  </span>

                  {r.status === 'active' && (
                    <button
                      onClick={() => cancelReservation(r.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyReservations;
