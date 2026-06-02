import React from 'react';

export default function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', backgroundColor: '#161b22', borderRight: '1px solid #30363d', padding: '1.5rem' }}>
        <h2 style={{ color: '#58a6ff', margin: '0 0 2rem 0', fontSize: '1.5rem' }}>TRC Admin</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a href="#" style={{ color: '#f0f6fc', textDecoration: 'none', fontWeight: 'bold' }}>Dashboard</a>
          <a href="#" style={{ color: '#8b949e', textDecoration: 'none' }}>Moderation Queue</a>
          <a href="#" style={{ color: '#8b949e', textDecoration: 'none' }}>User Management</a>
          <a href="#" style={{ color: '#8b949e', textDecoration: 'none' }}>System Health</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <header style={{ borderBottom: '1px solid #21262d', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0, color: '#f0f6fc' }}>Admin Dashboard</h1>
          <p style={{ color: '#8b949e', margin: '0.5rem 0 0 0' }}>Community & Moderation management workspace</p>
        </header>

        {/* Stats Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ backgroundColor: '#161b22', border: '1px solid #30363d', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ margin: 0, color: '#8b949e', fontSize: '0.9rem' }}>Pending Moderation</h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold', color: '#ff7b72' }}>42</p>
          </div>
          <div style={{ backgroundColor: '#161b22', border: '1px solid #30363d', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ margin: 0, color: '#8b949e', fontSize: '0.9rem' }}>Active Mandates</h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold', color: '#58a6ff' }}>12</p>
          </div>
          <div style={{ backgroundColor: '#161b22', border: '1px solid #30363d', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ margin: 0, color: '#8b949e', fontSize: '0.9rem' }}>Reports/Hr</h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold', color: '#3fb950' }}>158</p>
          </div>
        </section>

        {/* Info Box */}
        <section style={{ backgroundColor: '#161b22', border: '1px solid #30363d', padding: '1.5rem', borderRadius: '8px' }}>
          <h2 style={{ color: '#f0f6fc', marginTop: 0 }}>System Activity Log</h2>
          <p style={{ color: '#8b949e' }}>Audit trail of moderator actions and automatic flags triggered by the troll filtering system.</p>
        </section>
      </main>
    </div>
  );
}
