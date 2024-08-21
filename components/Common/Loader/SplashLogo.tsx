import React from 'react'

const SplashLogo = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        verticalAlign: 'middle',
        background:
          'radial-gradient(circle, rgba(253,126,20,1) 0%, rgba(0,0,51,1) 75%, rgba(17,17,17,1) 95%)',
      }}>
      {/* eslint-disable @next/next/no-img-element */}
      <img
        style={{ borderRadius: '50%' }}
        src="/android-chrome-512x512.png"
        alt="Universiteams"
        width={200}
        height={200}
      />
      <h1 style={{ fontFamily: 'Roboto', letterSpacing: '0.2rem', color: '#00063f' }}>
        Universiteams
      </h1>
    </div>
  )
}

export default SplashLogo
