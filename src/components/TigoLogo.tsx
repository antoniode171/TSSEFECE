import React from 'react';

export const TigoLogo: React.FC<{ className?: string }> = ({ className = 'h-7' }) => {
  return (
    <svg
      viewBox="0 0 110 40"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Tigo"
    >
      {/* Curved Smile Arc above Tigo */}
      <path
        d="M 12 11 Q 55 -4 98 11"
        fill="none"
        stroke="#00A3E0"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Tigo text */}
      <text
        x="10"
        y="33"
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontSize="29"
        fontWeight="800"
        fill="#00377B"
        letterSpacing="-0.5px"
      >
        tigo
      </text>
    </svg>
  );
};
