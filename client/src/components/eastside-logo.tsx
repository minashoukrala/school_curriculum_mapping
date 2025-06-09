import logoImage from "@assets/eastside-christian-school-logo-RETINA_1749437012381.png";

interface EastsideLogoProps {
  className?: string;
  size?: number;
}

export default function EastsideLogo({
  className = "",
  size = 40,
}: EastsideLogoProps) {
  return (
    <img
      src={logoImage}
      alt="Eastside Christian School Logo"
      height={size}
      className={`${className}`}
    />
  );
}
