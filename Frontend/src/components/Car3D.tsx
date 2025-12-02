'use client'

interface Car3DProps {
  bodyType?: string
  autoRotate?: boolean
  className?: string
}

export default function Car3D({ bodyType, autoRotate = true, className = "" }: Car3DProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Chevrolet Headlight Background - Static */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage: "url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d104fb8e-e427-49fe-915d-0af22b9577f8/generated_images/close-up-macro-photograph-of-a-premium-c-b6a40f31-20251025120925.jpg')",
          filter: 'brightness(1.2)'
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  )
}