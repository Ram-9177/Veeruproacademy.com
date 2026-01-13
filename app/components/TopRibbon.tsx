import { Container } from './Container'

export function TopRibbon() {
  return (
    <div className="w-full bg-white/95 backdrop-blur-xl border-b border-gray-100/50 fixed top-0 left-0 right-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <Container className="flex items-center justify-center px-4 sm:px-6 py-2 text-center">
        <div className="flex items-center leading-tight">
          <span className="text-lg sm:text-xl font-black tracking-tight" style={{
            background: 'linear-gradient(135deg, #f08f68 0%, #eb6f7f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Veeru&apos;s
          </span>
          <span className="text-lg sm:text-xl font-black tracking-tight text-navy-800 ml-1.5">
            Pro Academy
          </span>
        </div>
      </Container>
    </div>
  );
}
