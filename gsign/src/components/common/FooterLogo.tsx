import React from "react";

interface FooterLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const FooterLogo: React.FC<FooterLogoProps> = ({
  className = "",
  width = 200,
  height = 30,
}) => {
  return (
    <svg
      data-name="Logotype"
      id="logotype"
      viewBox="0 0 306.14 46.06"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
    >
      <defs>
        <style type="text/css">{`.cls-2{fill:#4A5761;}`}</style>
      </defs>
      <path
        className="cls-2"
        d="M203.46,45.36H189.21V38.27h13.28c5.49,0,8.31-1.42,8.42-4.89.1-3.27-1.16-4.48-5.68-6.37l-6.84-2.81c-6.71-2.74-10.31-6.27-10.31-12.86C188.08,3.16,193.33,0,204.51,0h13.05V7.09H204.78c-5.31,0-8.28.64-8.28,4.26,0,2.27,1.28,3.69,5.8,5.52l6.17,2.5c7.93,3.23,11,6.37,11,14.06C219.47,41.67,213.65,45.36,203.46,45.36Z"
      />
      <path
        className="cls-2"
        d="M22.68,7.09V45.35H14.17V7.09H0V0H36.85V7.09Z"
      />
      <path
        className="cls-2"
        d="M292,7.09V45.35h-8.51V7.09H269.29V0h36.85V7.09Z"
      />
      <path
        className="cls-2"
        d="M124,45.35l-9.93-17H106.3v17H97.8V0h12.76c10.88,0,19.74,2.27,19.74,14.17h0c0,6.87-2.9,10.7-7.7,12.76l10.63,18.42Zm-2-31.21c0-7-4.62-7-15.67-7V22h4.43C118.52,22,122,20.34,122,14.5Z"
      />
      <polygon
        className="cls-2"
        points="56.69 0 48.19 0 48.19 4.25 56.69 8.5 56.69 0"
      />
      <path
        className="cls-2"
        d="M75.13,25.36c0,9.11-2,12.91-9.19,12.91S56.7,34.5,56.7,25.39v-14l-8.5-4.25v19.8c0,13,6.27,19.17,17.75,19.17s17.69-6.19,17.69-19.18V11.34l-8.5-4.25Z"
      />
      <polygon
        className="cls-2"
        points="83.62 0 75.12 0 75.12 4.25 83.62 8.5 83.62 0"
      />
      <polygon
        className="cls-2"
        points="253.7 0 240.94 0 227.48 45.35 235.99 45.36 247.32 7.09 258.66 45.35 267.17 45.35 253.7 0"
      />
      <path
        className="cls-2"
        d="M170.08,45.35l-17-21.26V45.35h-8.5V0h8.5V21.26L170.08,0H180L161.58,22.68,180,45.35Z"
      />
    </svg>
  );
};

export default FooterLogo;
