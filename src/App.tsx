import React from 'react';

export default function App() {
  return (
    <div style={{background: 'black', color: 'white', minHeight: '100vh', fontFamily: 'serif'}}>
      <nav style={{position: 'fixed', top: 0, width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', letterSpacing: '0.3em', background: 'rgba(0,0,0,0.5)', zIndex: 10}}>
        <span>HOUSE OF CROMWELL</span>
        <span style={{opacity: 0.5}}>DAR ES SALAAM</span>
      </nav>
      <div style={{height: '100vh', display: 'flex', alignItems: 'flex-end', padding: '40px', background: '#111'}}>
        <div>
          <h1 style={{fontSize: '60px', lineHeight: '0.9', margin: 0}}>HOUSE OF<br/>CROMWELL</h1>
          <p style={{letterSpacing: '0.4em', fontSize: '12px', opacity: 0.6, marginTop: '10px'}}>ELEGANCE REDEFINED</p>
        </div>
      </div>
      <div style={{padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#0a0a0a'}}>
        <div style={{aspectRatio: '3/4', background: '#1a1a1a', borderRadius: '16px'}}></div>
        <div style={{aspectRatio: '3/4', background: '#1a1a1a', borderRadius: '16px'}}></div>
        <div style={{aspectRatio: '3/4', background: '#1a1a1a', borderRadius: '16px'}}></div>
        <div style={{aspectRatio: '3/4', background: '#1a1a1a', borderRadius: '16px'}}></div>
      </div>
      <footer style={{textAlign: 'center', padding: '40px', fontSize: '10px', opacity: 0.3}}>© HOUSE OF CROMWELL</footer>
    </div>
  )
}
