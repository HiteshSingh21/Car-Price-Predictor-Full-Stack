"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LuxuryCarCarousel from '@/components/LuxuryCarCarousel'
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Car3D = dynamic(() => import('@/components/Car3D'), { ssr: false })

export default function Home() {
  const [bodyTypes, setBodyTypes] = useState<string[]>([])
  const [carsByType, setCarsByType] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch body types and cars
    fetch('/cars')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          // Extract unique body types
          const types = [...new Set(data.data.map((car: any) => car.body_type).filter(Boolean))]
          setBodyTypes(types)
          
          // Group cars by body type
          const grouped = data.data.reduce((acc: any, car: any) => {
            const type = car.body_type || 'Other'
            if (!acc[type]) acc[type] = []
            if (acc[type].length < 6) acc[type].push(car)
            return acc
          }, {})
          setCarsByType(grouped)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch cars:', err)
        setLoading(false)
      })
  }, [])

  return (
    <main className="min-h-screen bg-[#111111]">
      <Navbar />

      {/* Hero Section with 3D Car */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#111111]/50 to-[#111111]" />
        
        {/* 3D Car Background */}
        <div className="absolute inset-0 opacity-35">
          <Car3D autoRotate className="w-full h-full" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm text-gray-300">AI-Powered Valuation</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
            Luxury Car Valuation,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
              Redefined.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Experience precision pricing with our FT-Transformer AI. Get instant, accurate market valuations for premium vehicles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/predict"
              className="group bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/browse"
              className="bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all border border-white/10"
            >
              Browse Cars
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-[#111111] relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Three simple steps to get your car's accurate valuation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'Enter Details',
                description: 'Select your car\'s specifications including make, model, body type, fuel type, and more.',
                step: '01'
              },
              {
                icon: Zap,
                title: 'AI Analysis',
                description: 'Our FT-Transformer AI processes thousands of data points to calculate precise market value.',
                step: '02'
              },
              {
                icon: TrendingUp,
                title: 'Get Results',
                description: 'Receive instant, accurate pricing with market insights and similar vehicle comparisons.',
                step: '03'
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="relative bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="absolute -top-4 -right-4 text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                  {item.step}
                </div>
                <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore by Class Section */}
      <section className="py-24 bg-[#0a0a0a] relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore by Class
            </h2>
            <p className="text-xl text-gray-400">
              Discover luxury vehicles across different categories
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-gray-400 mt-4">Loading vehicles...</p>
            </div>
          ) : bodyTypes.length > 0 ? (
            <Tabs defaultValue={bodyTypes[0]} className="w-full">
              <TabsList className="w-full justify-start bg-white/5 border border-white/10 p-1 mb-8 overflow-x-auto flex-nowrap">
                {bodyTypes.map(type => (
                  <TabsTrigger 
                    key={type} 
                    value={type}
                    className="px-6 py-3 text-sm font-medium text-gray-400 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg transition-all"
                  >
                    {type}
                  </TabsTrigger>
                ))}
              </TabsList>

              {bodyTypes.map(type => (
                <TabsContent key={type} value={type} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(carsByType[type] || []).slice(0, 6).map((car: any, idx: number) => (
                      <div 
                        key={idx}
                        className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all group"
                      >
                        <div className="aspect-video bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center">
                          <div className="text-4xl">🚗</div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {car.oem || 'Unknown'} {car.model || ''}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <span>{car.fuel_type || 'N/A'}</span>
                            <span>{car.transmission || 'N/A'}</span>
                          </div>
                          {car.price && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <span className="text-2xl font-bold text-white">
                                ${Number(car.price).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <LuxuryCarCarousel />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#111111] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920')] opacity-10 bg-cover bg-center" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join thousands of users who trust carify for accurate luxury car valuations.
          </p>
          <Link 
            href="/predict"
            className="inline-flex items-center space-x-2 bg-white text-black px-10 py-5 rounded-full text-lg font-semibold hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
          >
            <span>Value Your Car Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}