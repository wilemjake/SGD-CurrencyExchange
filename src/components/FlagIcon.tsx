import React from 'react';

interface FlagIconProps {
  code: string;
  className?: string;
}

export const FlagIcon: React.FC<FlagIconProps> = ({ code, className = 'w-5 h-3.5' }) => {
  const upper = code.toUpperCase();

  // Singapore Flag (SG)
  if (upper === 'SG' || upper === 'SGD') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="12" fill="#ED2939" />
        <rect y="12" width="36" height="12" fill="#FFFFFF" />
        {/* Crescent */}
        <circle cx="8" cy="6" r="3.6" fill="#FFFFFF" />
        <circle cx="9.2" cy="6" r="3.2" fill="#ED2939" />
        {/* 5 stars */}
        <g fill="#FFFFFF" transform="translate(10, 3.2) scale(0.65)">
          <polygon points="2,0 2.6,1.4 4,1.4 2.8,2.2 3.2,3.6 2,2.8 0.8,3.6 1.2,2.2 0,1.4 1.4,1.4" />
          <polygon points="0,4 0.6,5.4 2,5.4 0.8,6.2 1.2,7.6 0,6.8 -1.2,7.6 -0.8,6.2 -2,5.4 -0.6,5.4" />
          <polygon points="4,4 4.6,5.4 6,5.4 4.8,6.2 5.2,7.6 4,6.8 2.8,7.6 3.2,6.2 2,5.4 3.4,5.4" />
          <polygon points="1,8 1.6,9.4 3,9.4 1.8,10.2 2.2,11.6 1,10.8 -0.2,11.6 0.2,10.2 -1,9.4 0.4,9.4" />
          <polygon points="3,8 3.6,9.4 5,9.4 3.8,10.2 4.2,11.6 3,10.8 1.8,11.6 2.2,10.2 1,9.4 2.4,9.4" />
        </g>
      </svg>
    );
  }

  // Malaysia Flag (MY)
  if (upper === 'MY' || upper === 'MYR') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="24" fill="#CC0000" />
        <path d="M0,1.71h36M0,5.14h36M0,8.57h36M0,12h36M0,15.43h36M0,18.86h36M0,22.29h36" stroke="#FFFFFF" strokeWidth="1.71" />
        <rect width="18" height="12" fill="#000066" />
        <circle cx="9" cy="6" r="4.2" fill="#FFCC00" />
        <circle cx="10.5" cy="6" r="3.7" fill="#000066" />
        <polygon points="12,6 12.8,6.8 14,6.5 13.5,7.6 14.5,8.2 13.3,8.7 13.5,9.9 12.4,9.4 12,10.5 11.6,9.4 10.5,9.9 10.7,8.7 9.5,8.2 10.5,7.6 10,6.5 11.2,6.8" fill="#FFCC00" />
      </svg>
    );
  }

  // United States (US)
  if (upper === 'US' || upper === 'USD') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="24" fill="#B22234" />
        <path d="M0,1.85h36M0,5.54h36M0,9.23h36M0,12.92h36M0,16.62h36M0,20.31h36" stroke="#FFFFFF" strokeWidth="1.85" />
        <rect width="14.4" height="12.92" fill="#3C3B6E" />
        <circle cx="3" cy="2.5" r="0.8" fill="#FFF" />
        <circle cx="7" cy="2.5" r="0.8" fill="#FFF" />
        <circle cx="11" cy="2.5" r="0.8" fill="#FFF" />
        <circle cx="5" cy="5.5" r="0.8" fill="#FFF" />
        <circle cx="9" cy="5.5" r="0.8" fill="#FFF" />
        <circle cx="3" cy="8.5" r="0.8" fill="#FFF" />
        <circle cx="7" cy="8.5" r="0.8" fill="#FFF" />
        <circle cx="11" cy="8.5" r="0.8" fill="#FFF" />
      </svg>
    );
  }

  // European Union (EU)
  if (upper === 'EU' || upper === 'EUR') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="24" fill="#003399" />
        <circle cx="18" cy="6" r="0.9" fill="#FFCC00" />
        <circle cx="23.2" cy="7.4" r="0.9" fill="#FFCC00" />
        <circle cx="25.5" cy="12" r="0.9" fill="#FFCC00" />
        <circle cx="23.2" cy="16.6" r="0.9" fill="#FFCC00" />
        <circle cx="18" cy="18" r="0.9" fill="#FFCC00" />
        <circle cx="12.8" cy="16.6" r="0.9" fill="#FFCC00" />
        <circle cx="10.5" cy="12" r="0.9" fill="#FFCC00" />
        <circle cx="12.8" cy="7.4" r="0.9" fill="#FFCC00" />
      </svg>
    );
  }

  // United Kingdom (GB)
  if (upper === 'GB' || upper === 'GBP' || upper === 'UK') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="24" fill="#012169" />
        <path d="M0,0 L36,24 M36,0 L0,24" stroke="#FFFFFF" strokeWidth="4" />
        <path d="M0,0 L36,24 M36,0 L0,24" stroke="#C8102E" strokeWidth="2.4" />
        <path d="M18,0 V24 M0,12 H36" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M18,0 V24 M0,12 H36" stroke="#C8102E" strokeWidth="3.6" />
      </svg>
    );
  }

  // Japan (JP)
  if (upper === 'JP' || upper === 'JPY') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="24" fill="#FFFFFF" />
        <circle cx="18" cy="12" r="7" fill="#BC002D" />
      </svg>
    );
  }

  // China (CN)
  if (upper === 'CN' || upper === 'CNY') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="24" fill="#DE2910" />
        <polygon points="6,3 7,6 10,6 7.6,7.8 8.5,10.6 6,9 3.5,10.6 4.4,7.8 2,6 5,6" fill="#FFDE00" />
        <circle cx="12" cy="3.5" r="0.9" fill="#FFDE00" />
        <circle cx="14" cy="6" r="0.9" fill="#FFDE00" />
        <circle cx="14" cy="9" r="0.9" fill="#FFDE00" />
        <circle cx="12" cy="11.5" r="0.9" fill="#FFDE00" />
      </svg>
    );
  }

  // Australia (AU)
  if (upper === 'AU' || upper === 'AUD') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="24" fill="#00008B" />
        <rect width="15" height="10" fill="#012169" />
        <path d="M0,0 L15,10 M15,0 L0,10" stroke="#FFF" strokeWidth="1.8" />
        <path d="M7.5,0 V10 M0,5 H15" stroke="#FFF" strokeWidth="2.8" />
        <path d="M7.5,0 V10 M0,5 H15" stroke="#C8102E" strokeWidth="1.6" />
        {/* Southern Cross stars */}
        <circle cx="27" cy="5" r="1.1" fill="#FFF" />
        <circle cx="31" cy="9" r="1.1" fill="#FFF" />
        <circle cx="27" cy="17" r="1.1" fill="#FFF" />
        <circle cx="23" cy="11" r="1.1" fill="#FFF" />
        <circle cx="7.5" cy="17" r="2.2" fill="#FFF" />
      </svg>
    );
  }

  // Indonesia (ID)
  if (upper === 'ID' || upper === 'IDR') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="12" fill="#FF0000" />
        <rect y="12" width="36" height="12" fill="#FFFFFF" />
      </svg>
    );
  }

  // Thailand (TH)
  if (upper === 'TH' || upper === 'THB') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="4" fill="#A51931" />
        <rect y="4" width="36" height="4" fill="#F4F5F8" />
        <rect y="8" width="36" height="8" fill="#2D2A4A" />
        <rect y="16" width="36" height="4" fill="#F4F5F8" />
        <rect y="20" width="36" height="4" fill="#A51931" />
      </svg>
    );
  }

  // Hong Kong (HK)
  if (upper === 'HK' || upper === 'HKD') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="24" fill="#EC1B2D" />
        <circle cx="18" cy="12" r="5" fill="#FFF" />
        <circle cx="18" cy="12" r="3.8" fill="#EC1B2D" />
        <path d="M18,7 L19,10 M23,10 L20.5,12 M21,16 L18.5,14 M15,16 L17.5,14 M13,10 L15.5,12" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // South Korea (KR)
  if (upper === 'KR' || upper === 'KRW') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="24" fill="#FFFFFF" />
        <circle cx="18" cy="12" r="5" fill="#CD2E3A" />
        <path d="M13,12 A5,5 0 0,0 23,12 A2.5,2.5 0 0,0 18,12 A2.5,2.5 0 0,1 13,12" fill="#0047A0" />
        <circle cx="18" cy="9.5" r="2.5" fill="#CD2E3A" />
      </svg>
    );
  }

  // Taiwan (TW)
  if (upper === 'TW' || upper === 'TWD') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="24" fill="#FE0000" />
        <rect width="18" height="12" fill="#000095" />
        <circle cx="9" cy="6" r="3.6" fill="#FFFFFF" />
        <circle cx="9" cy="6" r="2.8" fill="#000095" />
        <circle cx="9" cy="6" r="1.8" fill="#FFFFFF" />
      </svg>
    );
  }

  // India (IN)
  if (upper === 'IN' || upper === 'INR') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="8" fill="#FF9933" />
        <rect y="8" width="36" height="8" fill="#FFFFFF" />
        <rect y="16" width="36" height="8" fill="#138808" />
        <circle cx="18" cy="12" r="3" stroke="#000080" strokeWidth="0.8" fill="none" />
        <circle cx="18" cy="12" r="0.7" fill="#000080" />
      </svg>
    );
  }

  // Switzerland (CH)
  if (upper === 'CH' || upper === 'CHF') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="24" fill="#D52B1E" />
        <rect x="15" y="5" width="6" height="14" fill="#FFFFFF" />
        <rect x="11" y="9" width="14" height="6" fill="#FFFFFF" />
      </svg>
    );
  }

  // Canada (CA)
  if (upper === 'CA' || upper === 'CAD') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="9" height="24" fill="#FF0000" />
        <rect x="9" width="18" height="24" fill="#FFFFFF" />
        <rect x="27" width="9" height="24" fill="#FF0000" />
        <path d="M18,5 L19.2,9 L22,7.5 L21,11 L24,12 L21,13.5 L21.5,17 L19,15.5 L18.5,19 L17.5,19 L17,15.5 L14.5,17 L15,13.5 L12,12 L15,11 L14,7.5 L16.8,9 Z" fill="#FF0000" />
      </svg>
    );
  }

  // Philippines (PH)
  if (upper === 'PH' || upper === 'PHP') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="12" fill="#0038A8" />
        <rect y="12" width="36" height="12" fill="#CE1126" />
        <polygon points="0,0 15,12 0,24" fill="#FFFFFF" />
        <circle cx="5" cy="12" r="2.2" fill="#FCD116" />
      </svg>
    );
  }

  // Vietnam (VN)
  if (upper === 'VN' || upper === 'VND') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="24" fill="#DA251D" />
        <polygon points="18,6 19.5,10.6 24,10.6 20.4,13.4 21.8,18 18,15.2 14.2,18 15.6,13.4 12,10.6 16.5,10.6" fill="#FFFF00" />
      </svg>
    );
  }

  // New Zealand (NZ)
  if (upper === 'NZ' || upper === 'NZD') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="24" fill="#00247D" />
        <rect width="14" height="9" fill="#012169" />
        <path d="M0,0 L14,9 M14,0 L0,9" stroke="#FFF" strokeWidth="1.6" />
        <path d="M7,0 V9 M0,4.5 H14" stroke="#FFF" strokeWidth="2.4" />
        <path d="M7,0 V9 M0,4.5 H14" stroke="#C8102E" strokeWidth="1.4" />
        <circle cx="26" cy="6" r="1.1" fill="#CC142B" stroke="#FFF" strokeWidth="0.5" />
        <circle cx="30" cy="10" r="1.1" fill="#CC142B" stroke="#FFF" strokeWidth="0.5" />
        <circle cx="26" cy="16" r="1.1" fill="#CC142B" stroke="#FFF" strokeWidth="0.5" />
        <circle cx="22" cy="12" r="1.1" fill="#CC142B" stroke="#FFF" strokeWidth="0.5" />
      </svg>
    );
  }

  // UAE (AE)
  if (upper === 'AE' || upper === 'AED') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="8" fill="#00732F" />
        <rect y="8" width="36" height="8" fill="#FFFFFF" />
        <rect y="16" width="36" height="8" fill="#000000" />
        <rect width="9" height="24" fill="#FF0000" />
      </svg>
    );
  }

  // Saudi Arabia (SA)
  if (upper === 'SA' || upper === 'SAR') {
    return (
      <svg className={`inline-block rounded-xs overflow-hidden shadow-xs shrink-0 ${className}`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="24" fill="#006C35" />
        <path d="M10,15 H26" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M12,10 Q18,7 24,10" stroke="#FFFFFF" strokeWidth="1" fill="none" />
      </svg>
    );
  }

  // Default fallback flag
  return (
    <div className={`inline-flex items-center justify-center rounded-xs bg-slate-200 text-[9px] font-bold text-slate-700 uppercase shadow-xs shrink-0 ${className}`}>
      {upper.slice(0, 2)}
    </div>
  );
};
