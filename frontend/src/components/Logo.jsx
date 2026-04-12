import React from "react";
 const Logo = () => {
  return (
    <div className="flex items-center gap-2 font-sans cursor-pointer group">
      <svg
        viewBox="0 0 100 100"
        className="w-12 h-12"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Definitions for animations and gradients */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" /> {/* Tailwind Blue 900 */}
            <stop offset="100%" stopColor="#3b82f6" /> {/* Tailwind Blue 500 */}
          </linearGradient>
        </defs>

        {/* Outer Ring with subtle rotation */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#1e3a8a"
          strokeWidth="4"
          strokeDasharray="15 10"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="10s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Main "N" Connection Node */}
        <circle cx="50" cy="50" r="18" fill="url(#logoGradient)">
          <animate
            attributeName="r"
            values="18;20;18"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Pulsing Orbitals */}
        <circle cx="50" cy="50" r="18" fill="none" stroke="#3b82f6" strokeWidth="2">
          <animate
            attributeName="r"
            values="18;35"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* Text Component
      <span 
        className="text-2xl font-bold tracking-tight"
        style={{ color: '#1e3a8a', fontFamily: 'Inter, sans-serif' }}
      >
        Connect<span style={{ color: '#3b82f6' }}>n</span>
      </span> */}
    </div>
  );
};

export default Logo