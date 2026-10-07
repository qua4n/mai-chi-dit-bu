
import React from 'react';

const Background: React.FC = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 -z-10 bg-[#f6f2e9]"
    style={{
      backgroundImage: 'radial-gradient(rgba(120, 108, 93, 0.08) 0.5px, transparent 0.5px)',
      backgroundSize: '7px 7px',
    }}
  />
);

export default Background;
