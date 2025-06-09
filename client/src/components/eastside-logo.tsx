interface EastsideLogoProps {
  className?: string;
  size?: number;
}

export default function EastsideLogo({ className = "", size = 40 }: EastsideLogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield background */}
      <path
        d="M50 5 L20 20 L20 60 C20 75 35 90 50 95 C65 90 80 75 80 60 L80 20 Z"
        fill="#1976D2"
        stroke="#0D47A1"
        strokeWidth="2"
      />
      
      {/* Cross */}
      <rect x="46" y="25" width="8" height="30" fill="white" rx="2" />
      <rect x="35" y="35" width="30" height="8" fill="white" rx="2" />
      
      {/* Open book at bottom */}
      <path
        d="M35 65 L35 75 C35 77 37 79 39 79 L48 79 L50 77 L52 79 L61 79 C63 79 65 77 65 75 L65 65 L50 68 Z"
        fill="white"
      />
      <path
        d="M35 65 L50 68 L65 65"
        stroke="#E3F2FD"
        strokeWidth="1"
        fill="none"
      />
      
      {/* School initials on shield */}
      <text
        x="50"
        y="88"
        textAnchor="middle"
        fontSize="10"
        fontWeight="bold"
        fill="white"
        fontFamily="serif"
      >
        ECS
      </text>
    </svg>
  );
}