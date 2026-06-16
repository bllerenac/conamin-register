import React, { useState, useEffect } from 'react';
import RegistrationForm from './components/RegistrationForm';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Load users from localStorage
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('sorteo_users');
    return saved ? JSON.parse(saved) : [];
  });

  // Load theme preference
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  // View state: 'registration' | 'admin'
  const [view, setView] = useState('registration');

  // Check if '?admin' is in URL query parameters
  const [isAdminParamPresent, setIsAdminParamPresent] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('admin')) {
      setIsAdminParamPresent(true);
    }
  }, []);


  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync users to localStorage
  const handleAddUser = (newUser) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('sorteo_users', JSON.stringify(updatedUsers));
  };

  const handleClearUsers = () => {
    setUsers([]);
    localStorage.removeItem('sorteo_users');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleView = () => {
    setView(prev => (prev === 'registration' ? 'admin' : 'registration'));
  };

  return (
    <div className="app-container">
      {/* Background glow graphics */}
      <div className="bg-glow-top"></div>
      <div className="bg-glow-bottom"></div>

      {/* Main Header / Navigation */}
      <header className="app-header">
        <div className="app-logo-container">
          <img src="/images/logo_extend.png" alt="Gunjop" className="logo-img" />
        </div>

        <div className="nav-actions">
          {/* Theme Switcher */}
          <button 
            onClick={toggleTheme} 
            className="btn-icon" 
            title={theme === 'light' ? 'Activar Modo Oscuro' : 'Activar Modo Claro'}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              // Moon Icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              // Sun Icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>

          {/* Admin Switcher */}
          {(isAdminParamPresent || view === 'admin') && (
            <button 
              onClick={toggleView} 
              className="btn-icon" 
              title={view === 'registration' ? 'Panel de Administración' : 'Formulario de Registro'}
              aria-label="Toggle admin view"
            >
              {view === 'registration' ? (
                // Gear Icon
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              ) : (
                // Form/Home Icon
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Glass Content Wrapper */}
      <main className="card-wrapper">
        {view === 'registration' ? (
          <RegistrationForm onAddUser={handleAddUser} users={users} />
        ) : (
          <AdminPanel users={users} onClearUsers={handleClearUsers} />
        )}
      </main>
    </div>
  );
}
