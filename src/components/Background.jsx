import React from 'react'

const styles = `
.bg-root {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 18% 48%, #3d2010 0%, transparent 58%),
    radial-gradient(ellipse at 82% 18%, #1e3020 0%, transparent 52%),
    radial-gradient(ellipse at 58% 82%, #2a1a08 0%, transparent 48%),
    #1a1008;
  overflow: hidden;
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(85px);
  pointer-events: none;
  animation: orbDrift var(--dur, 20s) ease-in-out infinite alternate;
  animation-delay: var(--delay, 0s);
}
.orb-1 { width:520px;height:520px;background:rgba(139,111,71,0.16);top:-12%;left:-6%;--dur:21s; }
.orb-2 { width:360px;height:360px;background:rgba(107,124,92,0.13);top:38%;right:-9%;--dur:26s;--delay:-9s; }
.orb-3 { width:290px;height:290px;background:rgba(196,113,79,0.11);bottom:8%;left:23%;--dur:18s;--delay:-6s; }
.orb-4 { width:210px;height:210px;background:rgba(154,171,138,0.09);top:13%;right:28%;--dur:23s;--delay:-13s; }
.orb-5 { width:180px;height:180px;background:rgba(92,64,51,0.12);bottom:30%;right:15%;--dur:15s;--delay:-3s; }

@keyframes orbDrift {
  0%   { transform: translate(0,0) scale(1); }
  30%  { transform: translate(28px,-38px) scale(1.07); }
  65%  { transform: translate(-18px,22px) scale(0.94); }
  100% { transform: translate(14px,8px) scale(1.03); }
}
.grain-overlay {
  position: fixed; inset: 0; z-index: 1; pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px;
}
`

export default function Background() {
  return (
    <>
      <style>{styles}</style>
      <div className="bg-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
        <div className="orb orb-5" />
      </div>
      <div className="grain-overlay" />
    </>
  )
}
