import React from 'react';

export default function LoadingSpinner({ fullscreen = false, size = 32 }) {
  const spinner = (
    <div
      style={{
        width: size,
        height: size,
        border: `3px solid #2a2a3a`,
        borderTopColor: '#7c6aff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );

  if (fullscreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0f', flexDirection: 'column', gap: 16,
      }}>
        {spinner}
        <p style={{ color: '#606080', fontSize: 14, fontFamily: 'Sora, sans-serif' }}>Loading...</p>
      </div>
    );
  }

  return spinner;
}
