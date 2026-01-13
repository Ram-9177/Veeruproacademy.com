import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  href?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ size = 'md', showText = true, href = '/', variant = 'dark' }: LogoProps) {
  const sizeMap = {
    sm: { icon: 28, font: 16, gap: 2 },
    md: { icon: 36, font: 20, gap: 3 },
    lg: { icon: 52, font: 28, gap: 4 },
  };

  const dimensions = sizeMap[size];
  const textColor = variant === 'dark' ? 'text-white' : 'text-foreground';
  const accentText = variant === 'dark' ? 'text-amber-300' : 'text-[#F59E0B]';

  return (
    <a
      href={href}
      className="group inline-flex items-center transition-all duration-200 hover:translate-y-[-1px]"
      style={{ gap: `${dimensions.gap * 4}px` }}
    >
      <div className="flex items-center gap-3">
        <span className="relative inline-flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Veeru's Pro Academy"
            width={dimensions.icon}
            height={dimensions.icon}
            className="h-auto w-auto"
            priority
          />
        </span>

        {showText && (
          <div className="flex flex-col leading-tight">
            <span
              className={`${textColor} font-black tracking-tight`}
              style={{ fontSize: `${dimensions.font}px`, lineHeight: '1.05' }}
            >
              Veeru’s <span className={`font-semibold ${accentText}`}>Pro Academy</span>
            </span>
            <span
              className={`text-[11px] uppercase tracking-[0.14em] font-semibold ${variant === 'dark' ? 'text-white/70' : 'text-muted-foreground'}`}
              style={{ marginTop: '2px' }}
            >
              Learning Platform
            </span>
          </div>
        )}
      </div>
    </a>
  );
}

export default Logo;
