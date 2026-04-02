import { useEffect, useState } from 'react';
import { API } from '../api';
import {
  ShieldCheck, DoorOpen, Users, ClipboardList,
  Plus, Pencil, Trash2, X, AlertCircle, CheckCircle,
  UserCog, Ban, Search
} from 'lucide-react';

const tabs = [
  { id: 'rooms', label: 'Salas', icon: DoorOpen },
  { id: 'users', label: 'Usuarios', icon: Users },
  { id: 'reservations', label: 'Reservas', icon: ClipboardList },
];

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('rooms');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const jsonHeaders = { ...headers, 'Content-Type': 'application/json' };

  // --- Rooms ---
  const [rooms, setRooms] = useState([]);
  const [roomModal, setRoomModal] = useState(null); // null | 'create' | room object (edit)
  const [roomName, setRoomName] = useState('');
  const [roomCapacity, setRoomCapacity] = useState('');
  const [roomError, setRoomError] = useState('');
  const [roomSuccess, setRoomSuccess] = useState('');
  const [roomLoading, setRoomLoading] = useState(false);

  // --- Users ---
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  // --- Reservations ---
  const [reservations, setReservations] = useState([]);
  const [resSearch, setResSearch] = useState('');

  // --- Feedback ---
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (activeTab === 'rooms') fetchRooms();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'reservations') fetchReservations();
  }, [activeTab]);

  // Fetch functions
  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API}/rooms`, { headers });
      if (res.ok) setRooms(await res.json());
    } catch {}
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/users`, { headers });
      if (res.ok) setUsers(await res.json());
    } catch {}
  };

  const fetchReservations = async () => {
    try {
      const res = await fetch(`${API}/rooms/admin/reservations`, { headers });
      if (res.ok) setReservations(await res.json());
    } catch {}
  };

  // Room CRUD
  const openCreateRoom = () => {
    setRoomModal('create');
    setRoomName('');
    setRoomCapacity('');
    setRoomError('');
    setRoomSuccess('');
  };

  const openEditRoom = (room) => {
    setRoomModal(room);
    setRoomName(room.name || room.nombre || '');
    setRoomCapacity(room.capacity || room.capacidad || '');
    setRoomError('');
    setRoomSuccess('');
  };

  const submitRoom = async (e) => {
    e.preventDefault();
    if (!roomName || !roomCapacity) { setRoomError('Completa todos los campos'); return; }
    setRoomLoading(true);
    setRoomError('');
    try {
      const isEdit = roomModal !== 'create';
      const url = isEdit
        ? `${API}/rooms/${roomModal.id}`
        : `${API}/rooms`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ nombre: roomName, capacidad: parseInt(roomCapacity) }),
      });
      const data = await res.json();
      if (!res.ok) { setRoomError(data.error || 'Error'); return; }
      setRoomSuccess(isEdit ? 'Sala actualizada' : 'Sala creada');
      setTimeout(() => { setRoomModal(null); fetchRooms(); }, 1000);
    } catch {
      setRoomError('Error de conexion');
    } finally {
      setRoomLoading(false);
    }
  };

  const deleteRoom = async (id) => {
    try {
      await fetch(`${API}/rooms/${id}`, { method: 'DELETE', headers });
      setRooms((prev) => prev.filter((r) => r.id !== id));
      showFeedback('Sala eliminada');
    } catch {}
  };

  // User role change
  const changeRole = async (userId, newRole) => {
    try {
      const res = await fetch(`${API}/users/${userId}/role`, {
        method: 'PUT',
        headers: jsonHeaders,
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
        showFeedback(`Rol cambiado a ${newRole}`);
      }
    } catch {}
  };

  const deleteUser = async (userId) => {
    try {
      const res = await fetch(`${API}/users/${userId}`, { method: 'DELETE', headers });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        showFeedback('Usuario eliminado');
      } else {
        const data = await res.json();
        showFeedback(data.error || 'Error');
      }
    } catch {}
  };

  // Cancel reservation
  const cancelReservation = async (id) => {
    try {
      const res = await fetch(`${API}/rooms/admin/reservations/${id}/cancel`, {
        method: 'PUT',
        headers,
      });
      if (res.ok) {
        setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status: 'cancelled' } : r));
        showFeedback('Reserva cancelada');
      }
    } catch {}
  };

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 2500);
  };

  const filteredUsers = users.filter((u) =>
    (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredRes = reservations.filter((r) =>
    (r.user_name || '').toLowerCase().includes(resSearch.toLowerCase()) ||
    (r.room_name || '').toLowerCase().includes(resSearch.toLowerCase())
  );

  return (
    <div className="flex-1 px-8 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Panel de Admin</h1>
          <p className="text-zinc-500 text-sm">Gestiona salas, usuarios y reservas</p>
        </div>
      </div>

      {/* Feedback toast */}
      {feedback && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm animate-fade-up">
          <CheckCircle className="w-4 h-4" />{feedback}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mt-6 mb-8">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === id
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-zinc-500 bg-surface border border-border-subtle hover:text-zinc-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ============ ROOMS TAB ============ */}
      {activeTab === 'rooms' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-zinc-400 text-sm">{rooms.length} salas registradas</p>
            <button
              onClick={openCreateRoom}
              className="flex items-center gap-2 px-4 py-2.5 bg-accent-500 text-white text-sm font-semibold rounded-xl hover:bg-accent-400 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Nueva sala
            </button>
          </div>

          <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-5 py-3">ID</th>
                  <th className="text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-5 py-3">Nombre</th>
                  <th className="text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-5 py-3">Capacidad</th>
                  <th className="text-right text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} className="border-b border-border-subtle last:border-0 hover:bg-surface-elevated/50 transition-colors">
                    <td className="px-5 py-4 text-sm text-zinc-500">#{room.id}</td>
                    <td className="px-5 py-4 text-sm font-medium text-white">{room.name || room.nombre}</td>
                    <td className="px-5 py-4 text-sm text-zinc-400">{room.capacity || room.capacidad} personas</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditRoom(room)} className="p-2 rounded-lg text-zinc-500 hover:text-accent-400 hover:bg-accent-500/10 transition-colors cursor-pointer">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteRoom(room.id)} className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rooms.length === 0 && (
              <div className="text-center py-12 text-zinc-500">No hay salas creadas</div>
            )}
          </div>
        </div>
      )}

      {/* ============ USERS TAB ============ */}
      {activeTab === 'users' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-zinc-400 text-sm">{users.length} usuarios registrados</p>
            <div className="relative w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Buscar usuario..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface border border-border-subtle text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 transition-all text-sm"
              />
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-5 py-3">ID</th>
                  <th className="text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-5 py-3">Nombre</th>
                  <th className="text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-5 py-3">Email</th>
                  <th className="text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-5 py-3">Rol</th>
                  <th className="text-right text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-border-subtle last:border-0 hover:bg-surface-elevated/50 transition-colors">
                    <td className="px-5 py-4 text-sm text-zinc-500">#{u.id}</td>
                    <td className="px-5 py-4 text-sm font-medium text-white">{u.name}</td>
                    <td className="px-5 py-4 text-sm text-zinc-400">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        u.role === 'admin'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                      }`}>
                        {u.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => changeRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                          className="p-2 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                          title={u.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                        >
                          <UserCog className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-zinc-500">No se encontraron usuarios</div>
            )}
          </div>
        </div>
      )}

      {/* ============ RESERVATIONS TAB ============ */}
      {activeTab === 'reservations' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-zinc-400 text-sm">{reservations.length} reservas totales</p>
            <div className="relative w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="text"
                value={resSearch}
                onChange={(e) => setResSearch(e.target.value)}
                placeholder="Buscar por usuario o sala..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface border border-border-subtle text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 transition-all text-sm"
              />
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-5 py-3">ID</th>
                  <th className="text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-5 py-3">Sala</th>
                  <th className="text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-5 py-3">Usuario</th>
                  <th className="text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-5 py-3">Fecha</th>
                  <th className="text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-5 py-3">Horario</th>
                  <th className="text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-5 py-3">Estado</th>
                  <th className="text-right text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRes.map((r) => {
                  const statusStyles = {
                    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
                    finished: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
                  };
                  const statusLabels = { active: 'Activa', cancelled: 'Cancelada', finished: 'Finalizada' };

                  return (
                    <tr key={r.id} className="border-b border-border-subtle last:border-0 hover:bg-surface-elevated/50 transition-colors">
                      <td className="px-5 py-4 text-sm text-zinc-500">#{r.id}</td>
                      <td className="px-5 py-4 text-sm font-medium text-white">{r.room_name || `Sala #${r.room_id}`}</td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm text-white">{r.user_name}</p>
                          <p className="text-xs text-zinc-600">{r.user_email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-zinc-400">{r.date?.split('T')[0]}</td>
                      <td className="px-5 py-4 text-sm text-zinc-400">{r.start_time?.slice(0, 5)} – {r.end_time?.slice(0, 5)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${statusStyles[r.status] || statusStyles.active}`}>
                          {statusLabels[r.status] || r.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {r.status === 'active' && (
                          <button
                            onClick={() => cancelReservation(r.id)}
                            className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Cancelar reserva"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredRes.length === 0 && (
              <div className="text-center py-12 text-zinc-500">No hay reservas</div>
            )}
          </div>
        </div>
      )}

      {/* ============ ROOM MODAL ============ */}
      {roomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl border border-border-subtle shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border-subtle">
              <h2 className="text-lg font-semibold text-white">
                {roomModal === 'create' ? 'Nueva sala' : 'Editar sala'}
              </h2>
              <button onClick={() => setRoomModal(null)} className="p-2 rounded-xl text-zinc-500 hover:bg-surface-elevated hover:text-zinc-300 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitRoom} className="p-5 space-y-4">
              {roomError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />{roomError}
                </div>
              )}
              {roomSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                  <CheckCircle className="w-4 h-4 shrink-0" />{roomSuccess}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Nombre</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Ej: Sala Ejecutiva"
                  className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border-subtle text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Capacidad</label>
                <input
                  type="number"
                  value={roomCapacity}
                  onChange={(e) => setRoomCapacity(e.target.value)}
                  placeholder="Ej: 10"
                  min="1"
                  className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border-subtle text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={roomLoading}
                className="w-full py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {roomLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </span>
                ) : roomModal === 'create' ? 'Crear sala' : 'Guardar cambios'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
