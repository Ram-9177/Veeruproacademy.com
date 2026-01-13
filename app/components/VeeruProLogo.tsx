import Image from 'next/image'

interface VeeruProLogoProps {
  className?: string
  width?: number
  height?: number
}

export function VeeruProLogo({ 
  className = "", 
  width = 60, 
  height = 60,
  showText = true
}: VeeruProLogoProps & { showText?: boolean }) {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Your Exact Logo Image */}
      <Image
        src="/veeru-pro-logo copy.jpg"
        alt="Veeru&apos;s Pro Academy"
        width={width}
        height={height}
        className="object-contain rounded-lg"
        priority
      />
      {/* Academy Name as Text - Mobile Responsive */}
      {showText && (
        <div className="ml-3 flex flex-col">
          <span className="text-lg sm:text-xl font-bold">
            <span className="text-orange-500">Veeru&apos;s</span>
            <span className="text-white"> Pro Academy</span>
          </span>
          <span className="text-xs sm:text-sm text-blue-400 -mt-1">
            Learn • Code • Succeed
          </span>
        </div>
      )}
    </div>
  )
}

export default VeeruProLogo