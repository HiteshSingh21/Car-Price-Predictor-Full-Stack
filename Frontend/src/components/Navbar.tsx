"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Car } from 'lucide-react'

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="bg-[#111111]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <Car className="w-6 h-6 text-white group-hover:text-gray-300 transition-colors" />
              <span className="text-xl font-semibold text-white tracking-tight">carify</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/" 
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/predict" 
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Predict Value
              </Link>
              <Link 
                href="/browse" 
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Browse
              </Link>
              <Link 
                href="/our-ai" 
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Our AI
              </Link>
            </div>

            {/* CTA Button */}
            <Link 
              href="/predict"
              className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
