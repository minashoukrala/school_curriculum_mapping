import logoImage from "@assets/images_1749436918417.png";

interface EastsideLogoProps {
  className?: string;
  size?: number;
}

export default function EastsideLogo({ className = "", size = 40 }: EastsideLogoProps) {
  return (
    <img 
      src={logoImage}
      alt="Eastside Christian School Logo"
      width={size} 
      height={size} 
      className={`${className} rounded-full`}
    />
  );
}