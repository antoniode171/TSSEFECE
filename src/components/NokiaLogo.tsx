import React from 'react';

export const NokiaLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => {
  return (
    <svg
      viewBox="0 0 160 36"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Nokia"
    >
      <text
        x="0"
        y="28"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="30"
        fontWeight="800"
        letterSpacing="2.5px"
        fill="#124191"
      >
        NOKIA
      </text>
    </svg>
  );
};
