"use client"

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Filter, Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function BrowsePage() {
  const [cars, setCars] = useState<any[]>([])
  const [filteredCars, setFilteredCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [filters, setFilters] = useState({
    body_types: [] as string[],
    oems: [] as string[],
    fuel_types: [] as string[],
    price_range: [0, 200000] as [number, number]
  })

  const [filterOptions, setFilterOptions] = useState({
    body_types: [] as string[],
    oems: [] as string[],
    fuel_types: [] as string[]
  })

  useEffect(() => {
    fetch('/cars')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setCars(data.data)
          setFilteredCars(data.data)
          
          // Extract filter options
          setFilterOptions({
            body_types: [...new Set(data.data.map((c: any) => c.body_type).filter(Boolean))],
            oems: [...new Set(data.data.map((c: any) => c.oem).filter(Boolean))],
            fuel_types: [...new Set(data.data.map((c: any) => c.fuel_type).filter(Boolean))]
          })
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch cars:', err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = [...cars]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(car => 
        (car.oem?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (car.model?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Body type filter
    if (filters.body_types.length > 0) {
      filtered = filtered.filter(car => filters.body_types.includes(car.body_type))
    }

    // OEM filter
    if (filters.oems.length > 0) {
      filtered = filtered.filter(car => filters.oems.includes(car.oem))
    }

    // Fuel type filter
    if (filters.fuel_types.length > 0) {
      filtered = filtered.filter(car => filters.fuel_types.includes(car.fuel_type))
    }

    // Price range filter
    filtered = filtered.filter(car => {
      const price = Number(car.price) || 0
      return price >= filters.price_range[0] && price <= filters.price_range[1]
    })

    setFilteredCars(filtered)
  }, [filters, searchQuery, cars])

  const toggleFilter = (category: 'body_types' | 'oems' | 'fuel_types', value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }))
  }

  return (
    <main className="min-h-screen bg-[#111111]">
      <Navbar />

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Browse Luxury Vehicles
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            Explore our collection of premium cars
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by make or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-gray-500 h-12"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Filters</h2>
              </div>

              <div className="space-y-6">
                {/* Body Type Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Body Type</h3>
                  <div className="space-y-2">
                    {filterOptions.body_types.slice(0, 8).map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`body-${type}`}
                          checked={filters.body_types.includes(type)}
                          onCheckedChange={() => toggleFilter('body_types', type)}
                        />
                        <Label htmlFor={`body-${type}`} className="text-sm text-gray-300 cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* OEM Filter */}
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-3">Manufacturer</h3>
                  <div className="space-y-2">
                    {filterOptions.oems.slice(0, 8).map(oem => (
                      <div key={oem} className="flex items-center space-x-2">
                        <Checkbox
                          id={`oem-${oem}`}
                          checked={filters.oems.includes(oem)}
                          onCheckedChange={() => toggleFilter('oems', oem)}
                        />
                        <Label htmlFor={`oem-${oem}`} className="text-sm text-gray-300 cursor-pointer">
                          {oem}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fuel Type Filter */}
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-3">Fuel Type</h3>
                  <div className="space-y-2">
                    {filterOptions.fuel_types.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`fuel-${type}`}
                          checked={filters.fuel_types.includes(type)}
                          onCheckedChange={() => toggleFilter('fuel_types', type)}
                        />
                        <Label htmlFor={`fuel-${type}`} className="text-sm text-gray-300 cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-3">Price Range</h3>
                  <div className="space-y-4">
                    <Slider
                      min={0}
                      max={200000}
                      step={5000}
                      value={filters.price_range}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, price_range: value as [number, number] }))}
                      className="my-4"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>${filters.price_range[0].toLocaleString()}</span>
                      <span>${filters.price_range[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Car Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-20">
                <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading vehicles...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-400">
                    {filteredCars.length} {filteredCars.length === 1 ? 'vehicle' : 'vehicles'} found
                  </p>
                </div>

                {filteredCars.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-xl text-gray-400">No vehicles match your filters</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCars.map((car, idx) => (
                      <div 
                        key={idx}
                        className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all group"
                      >
                        <div className="aspect-video bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center relative overflow-hidden">
                          <div className="text-5xl group-hover:scale-110 transition-transform">🚗</div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-semibold text-white">
                              {car.oem || 'Unknown'}
                            </h3>
                            {car.model_year && (
                              <span className="text-sm text-gray-400 bg-white/10 px-2 py-1 rounded">
                                {car.model_year}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 mb-3">{car.model || 'Unknown Model'}</p>
                          
                          <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-400">
                            <div className="bg-white/5 rounded px-2 py-1">
                              <span className="block text-[10px] text-gray-500">Body</span>
                              <span className="text-white">{car.body_type || 'N/A'}</span>
                            </div>
                            <div className="bg-white/5 rounded px-2 py-1">
                              <span className="block text-[10px] text-gray-500">Fuel</span>
                              <span className="text-white">{car.fuel_type || 'N/A'}</span>
                            </div>
                            <div className="bg-white/5 rounded px-2 py-1">
                              <span className="block text-[10px] text-gray-500">Trans</span>
                              <span className="text-white">{car.transmission || 'N/A'}</span>
                            </div>
                            <div className="bg-white/5 rounded px-2 py-1">
                              <span className="block text-[10px] text-gray-500">Seats</span>
                              <span className="text-white">{car.seats || 'N/A'}</span>
                            </div>
                          </div>

                          {car.price && (
                            <div className="pt-4 border-t border-white/10">
                              <span className="text-2xl font-bold text-white">
                                ${Number(car.price).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
