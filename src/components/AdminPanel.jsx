import React, { useState, useEffect } from 'react';
import Confetti from './Confetti';

export default function AdminPanel({ users, onDeleteUser }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState('database'); // 'database' | 'raffle'
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Raffle state
  const [winnerCount, setWinnerCount] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shuffleName, setShuffleName] = useState('');
  const [winners, setWinners] = useState([]);
  const [confettiActive, setConfettiActive] = useState(false);

  // Sync winners when users change (e.g. if a user is deleted)
  useEffect(() => {
    setWinners(prev => prev.filter(w => users.some(u => u.id === w.id)));
  }, [users]);

  // Clear shake effect after animation finishes
  useEffect(() => {
    if (loginError) {
      const timer = setTimeout(() => setLoginError(false), 500);
      return () => clearTimeout(timer);
    }
  }, [loginError]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (password === 'gunjop2026') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setPassword('');
    }
  };

  // Export database as JSON file
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(users, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `registros_sorteo_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };



  // Filtered users for search
  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      user.nombre.toLowerCase().includes(term) ||
      user.dni.toLowerCase().includes(term) ||
      user.correo.toLowerCase().includes(term) ||
      (user.telefono && user.telefono.toLowerCase().includes(term)) ||
      user.empresa.toLowerCase().includes(term)
    );
  });

  // Raffle Drawing Logic
  const handleRunRaffle = () => {
    if (users.length === 0) {
      alert('No hay usuarios registrados para realizar el sorteo.');
      return;
    }
    if (winnerCount > users.length) {
      alert(`No puedes seleccionar más ganadores (${winnerCount}) que el total de registrados (${users.length}).`);
      return;
    }

    setIsDrawing(true);
    setWinners([]);
    setConfettiActive(false);

    let duration = 3000; // 3 seconds shuffle animation
    let intervalTime = 70; // speed of shuffle
    let elapsed = 0;

    const shuffleInterval = setInterval(() => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      setShuffleName(randomUser.nombre);
      elapsed += intervalTime;
      
      if (elapsed >= duration) {
        clearInterval(shuffleInterval);
        
        // Select unique winners
        const pool = [...users];
        const selectedWinners = [];
        for (let i = 0; i < winnerCount; i++) {
          const randomIndex = Math.floor(Math.random() * pool.length);
          selectedWinners.push(pool.splice(randomIndex, 1)[0]);
        }
        
        setWinners(selectedWinners);
        setIsDrawing(false);
        setConfettiActive(true);
      }
    }, intervalTime);
  };

  const incrementWinners = () => {
    setWinnerCount(prev => Math.min(prev + 1, Math.max(users.length, 1)));
  };

  const decrementWinners = () => {
    setWinnerCount(prev => Math.max(prev - 1, 1));
  };

  // If not authenticated, show premium password wall
  if (!isAuthenticated) {
    return (
      <div className="admin-login-card">
        <div className={`admin-lock-icon ${loginError ? 'admin-shake' : ''}`}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h2 className="success-title">Acceso Restringido</h2>
        <p className="success-desc">Ingrese la clave de administrador para acceder a los datos e iniciar el sorteo.</p>

        <form onSubmit={handleLoginSubmit} className={`admin-login-form ${loginError ? 'admin-shake' : ''}`}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <input
              type="password"
              className={`form-input ${loginError ? 'has-error' : ''}`}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>
          <button type="submit" className="btn-primary">
            Desbloquear Panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <Confetti active={confettiActive} />

      <h1 className="form-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        Panel de Administración
      </h1>
      <p className="form-subtitle">Gestiona los participantes registrados y realiza el sorteo de forma interactiva.</p>

      {/* Tabs */}
      <div className="admin-header-tabs">
        <button
          className={`admin-tab ${activeTab === 'database' ? 'active' : ''}`}
          onClick={() => setActiveTab('database')}
        >
          Base de Datos ({users.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'raffle' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('raffle');
            setConfettiActive(false);
            setWinners([]);
          }}
        >
          Realizar Sorteo
        </button>
      </div>

      {/* Database tab content */}
      {activeTab === 'database' && (
        <div>
          <div className="db-actions">
            <input
              type="text"
              placeholder="Buscar participante..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="action-buttons-group">
              <button onClick={handleExportJSON} className="btn-secondary" disabled={users.length === 0}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Exportar JSON
              </button>
            </div>
          </div>

          <div className="table-container">
            {filteredUsers.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre y Apellidos</th>
                    <th>DNI</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Empresa</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td style={{ fontWeight: '600' }}>{user.nombre}</td>
                      <td><code>{user.dni}</code></td>
                      <td>{user.correo}</td>
                      <td>{user.telefono}</td>
                      <td>{user.empresa}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{user.fecha}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-delete-row"
                          onClick={() => onDeleteUser(user)}
                          title="Eliminar participante"
                          aria-label={`Eliminar a ${user.nombre}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-records">
                {users.length === 0 
                  ? 'No hay registros guardados. Comienza registrando datos en el formulario público.'
                  : 'No se encontraron resultados para tu búsqueda.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Raffle tab content */}
      {activeTab === 'raffle' && (
        <div className="raffle-container">
          <div className="raffle-config">
            <div className="raffle-label">Número de Ganadores:</div>
            <div className="raffle-number-selector">
              <button 
                className="btn-counter" 
                onClick={decrementWinners}
                disabled={isDrawing || winnerCount <= 1}
              >
                -
              </button>
              <div className="raffle-count-display">{winnerCount}</div>
              <button 
                className="btn-counter" 
                onClick={incrementWinners}
                disabled={isDrawing || winnerCount >= users.length}
              >
                +
              </button>
            </div>
            
            <button 
              className="btn-primary" 
              onClick={handleRunRaffle}
              disabled={isDrawing || users.length === 0}
              style={{ marginTop: '8px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              {isDrawing ? 'Sorteando...' : 'Iniciar Sorteo'}
            </button>
          </div>

          {/* Draw area */}
          {(isDrawing || winners.length > 0) && (
            <div className="raffle-draw-arena">
              {isDrawing && (
                <div style={{ textAlign: 'center' }}>
                  <div className="shuffle-animation">{shuffleName}</div>
                  <div className="shuffle-details">Seleccionando ganadores de {users.length} participantes...</div>
                </div>
              )}

              {!isDrawing && winners.length > 0 && (
                <div className="winners-stage">
                  <div className="winner-headline">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                      <path d="M4 22h16"></path>
                      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path>
                      <path d="M12 2a4 4 0 0 0-4 4v7c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V6a4 4 0 0 0-4-4z"></path>
                    </svg>
                    ¡Ganador{winners.length > 1 ? 'es' : ''} Seleccionado{winners.length > 1 ? 's' : ''}!
                  </div>
                  
                  <div className="winners-list">
                    {winners.map((winner, idx) => (
                      <div key={winner.id} className="winner-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                        <span className="winner-badge">Ganador #{idx + 1}</span>
                        <div className="winner-name">{winner.nombre}</div>
                        <div className="winner-detail"><strong>DNI:</strong> {winner.dni}</div>
                        <div className="winner-detail"><strong>Correo:</strong> {winner.correo}</div>
                        <div className="winner-detail"><strong>Teléfono:</strong> {winner.telefono}</div>
                        <div className="winner-detail"><strong>Empresa:</strong> {winner.empresa}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {users.length === 0 && (
            <p style={{ color: 'var(--danger)', marginTop: '16px', fontWeight: '500' }}>
              * Se requieren participantes registrados para realizar un sorteo.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
