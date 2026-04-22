import React from 'react';

interface LogoProps {
  className?: string;
  withText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-10 w-auto", withText = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto font-sans">
        {/* Top Left: Pink #E5157A */}
        <rect x="0" y="0" width="40" height="40" rx="2" fill="#E5157A" />
        
        {/* Bottom Left: Blue #38b6ff */}
        <rect x="0" y="44" width="40" height="40" rx="2" fill="#38b6ff" />
        
        {/* Bottom Right: Yellow #FFF200 */}
        <rect x="44" y="44" width="40" height="40" rx="2" fill="#FFF200" />
        
        {/* Top Right Complex Quadrant */}
        {/* Small Yellow (Top Left of Quadrant) */}
        <rect x="44" y="0" width="18" height="18" rx="1" fill="#FFF200" />
        {/* Small Blue (Bottom Left of Quadrant) */}
        <rect x="44" y="22" width="18" height="18" rx="1" fill="#38b6ff" />
        {/* Small Pink (Bottom Right of Quadrant) */}
        <rect x="66" y="22" width="18" height="18" rx="1" fill="#E5157A" />
      </svg>
      
      {withText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="font-black text-lg md:text-xl tracking-tight text-white">
              CREATIVE
            </span>
            <span className="font-black text-lg md:text-xl tracking-tight text-[#38b6ff]">
              PRINT
            </span>
          </div>
          <span className="text-[0.55rem] md:text-[0.65rem] font-bold text-brand-gray tracking-[0.05em] uppercase mt-0.5">
            TECNOLOGIA • NFC • 3D
          </span>
        </div>
      )}
    </div>
  );
};