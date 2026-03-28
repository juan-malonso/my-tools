import React from 'react';

export const ImageIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19,2H5C3.897,2,3,2.897,3,4v16c0,1.103,0.897,2,2,2h14c1.103,0,2-0.897,2-2V4C21,2.897,20.103,2,19,2z M5,20V4h14l0.002,16H5z"></path>
    <path d="M10 14.586l-3-3-2 2V18h14v-5l-4-4z"></path>
  </svg>
);
