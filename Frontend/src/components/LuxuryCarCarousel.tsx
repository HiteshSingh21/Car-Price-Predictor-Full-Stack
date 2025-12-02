"use client"

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import Image from 'next/image'

const luxuryCars = [
  {
    id: 1,
    type: 'Sedan',
    title: 'Executive Sedan',
    description: 'Experience unparalleled luxury and performance with premium executive sedans. Perfect blend of comfort, technology, and sophisticated engineering.',
    features: ['Premium Leather', 'Advanced Safety', 'Luxury Interior', 'Smooth Performance'],
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d104fb8e-e427-49fe-915d-0af22b9577f8/generated_images/professional-studio-photograph-of-a-luxu-1391155a-20251024195443.jpg'
  },
  {
    id: 2,
    type: 'Hatchback',
    title: 'Sport Hatchback',
    description: 'Nimble and dynamic, sport hatchbacks deliver thrilling performance in a compact, versatile package. Perfect for urban adventures with style.',
    features: ['Sporty Design', 'Agile Handling', 'Modern Tech', 'Fuel Efficient'],
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d104fb8e-e427-49fe-915d-0af22b9577f8/generated_images/professional-studio-photograph-of-a-prem-b7354b91-20251024200416.jpg'
  },
  {
    id: 3,
    type: 'SUV',
    title: 'Luxury SUV',
    description: 'Commanding presence meets refined comfort. Luxury SUVs offer spacious interiors, cutting-edge technology, and unmatched versatility for any terrain.',
    features: ['Spacious Interior', 'All-Terrain', 'Premium Comfort', 'Advanced Tech'],
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d104fb8e-e427-49fe-915d-0af22b9577f8/generated_images/professional-studio-photograph-of-a-luxu-c71d6fd6-20251024195800.jpg'
  }
]

export default function LuxuryCarCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % luxuryCars.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handlePrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + luxuryCars.length) % luxuryCars.length)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % luxuryCars.length)
  }

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  const currentCar = luxuryCars[currentIndex]

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Slide Counter Badge */}
      <div className="absolute -top-3 right-6 bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold shadow-lg z-10">
        {currentIndex + 1} / {luxuryCars.length}
      </div>

      {/* Main Carousel Container - Compact & Minimalistic */}
      <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6 p-6">
          
          {/* Image Section - Left Side */}
          <div className="relative w-full md:w-2/5 flex-shrink-0">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-transparent group">
              <Image
                src={currentCar.image}
                alt={currentCar.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              {/* Type Badge */}
              <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-semibold text-white">{currentCar.type}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section - Right Side */}
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {currentCar.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {currentCar.description}
              </p>
            </div>

            {/* Features Grid - Compact */}
            <div className="grid grid-cols-2 gap-2">
              {currentCar.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                >
                  <span className="text-xs font-medium text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Navigation Controls - Bottom */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                {luxuryCars.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    className={`transition-all ${
                      idx === currentIndex
                        ? 'w-6 h-1.5 bg-white'
                        : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'
                    } rounded-full`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all group"
                  aria-label="Previous car"
                >
                  <ChevronLeft className="w-4 h-4 text-white group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={handleNext}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all group"
                  aria-label="Next car"
                >
                  <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}