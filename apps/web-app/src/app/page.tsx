import React from 'react';

export default function HomePage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ borderBottom: '1px solid #21262d', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ color: '#58a6ff', margin: 0 }}>The Root Cause</h1>
        <p style={{ color: '#8b949e', margin: '0.5rem 0 0 0' }}>Civic Intelligence & Structured Problem Solving</p>
      </header>

      <section style={{ marginBottom: '3rem', textAlign: 'center', padding: '3rem 1rem', background: 'radial-gradient(circle at top, #1f2937, #0d1117)', borderRadius: '12px', border: '1px solid #21262d' }}>
        <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', color: '#f0f6fc' }}>From Outrage to Action</h2>
        <p style={{ fontSize: '1.2rem', color: '#8b949e', maxWidth: '800px', margin: '0 auto 2rem' }}>
          Stop venting on social media. Document civic problems, map their root causes, collaborate on solutions, and rally support for lawful civic action.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button style={{ backgroundColor: '#238636', color: '#ffffff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Report a Problem
          </button>
          <button style={{ backgroundColor: '#21262d', color: '#c9d1d9', border: '1px solid #30363d', padding: '0.8rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Browse Feeds
          </button>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px' }}>
          <h3 style={{ color: '#58a6ff', marginTop: 0 }}>1. Document Problems</h3>
          <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>Submit structured reports with images, EXIF verification data, and category tags.</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px' }}>
          <h3 style={{ color: '#58a6ff', marginTop: 0 }}>2. Identify Root Causes</h3>
          <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>Trace the incentives, policy loopholes, or behavioral failures behind the issues.</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px' }}>
          <h3 style={{ color: '#58a6ff', marginTop: 0 }}>3. Vote & Debate</h3>
          <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>Mandatory comments for voting ensure debates are constructives and evidence-based.</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px' }}>
          <h3 style={{ color: '#58a6ff', marginTop: 0 }}>4. Enact Solutions</h3>
          <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>Draft actionable legal and administrative blueprints, then build public mandates.</p>
        </div>
      </div>
    </main>
  );
}
