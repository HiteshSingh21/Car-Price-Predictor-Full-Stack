"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Sparkles, Loader2, Car as CarIcon, Search, TrendingUp, MapPin, Calendar, Fuel, Gauge } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Dynamically import the 3D component (respects your "static image" request)
const Car3D = dynamic(() => import('@/components/Car3D'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white">Loading 3D...</div>
})

// --- Zod Schema for Form Validation ---
const formSchema = z.object({
  body: z.string().min(1, { message: "Body type is required" }),
  transmission: z.string().min(1, { message: "Transmission is required" }),
  fuel: z.string().min(1, { message: "Fuel type is required" }),
  utype: z.string().min(1, { message: "Usage type is required" }),
  engine_type: z.string().min(1, { message: "Engine type is required" }),
  drive_type: z.string().min(1, { message: "Drive type is required" }),
  steering_type: z.string().min(1, { message: "Steering type is required" }),
  state: z.string().min(1, { message: "State is required" }),
  owner_type: z.string().min(1, { message: "Owner type is required" }),
  myear: z.coerce.number().int().min(1980, "Invalid year").max(2026, "Invalid year"),
  km: z.coerce.number().int().min(0, "Kilometers must be positive"),
  no_of_cylinder: z.coerce.number().int().min(1).max(16),
  length: z.coerce.number().min(0),
  width: z.coerce.number().min(0),
  height: z.coerce.number().min(0),
  wheel_base: z.coerce.number().min(0),
  kerb_weight: z.coerce.number().min(0),
  gear_box: z.coerce.number().int().min(1).max(10),
  seats: z.coerce.number().int().min(1).max(10),
  max_torque_at: z.coerce.number().int().min(0),
});

// Type for the form data
type FormData = z.infer<typeof formSchema>;

// Type for a single car object
interface CarInfo {
  id: number;
  model: string;
  listed_price: number;
  myear: number;
  fuel: string;
  variant?: string;
  km: number;
  state: string;
  body: string;
  image_url?: string; // Added optional image_url property
}

// Type for the API prediction response
interface PredictionResponse {
  predicted_price: number | null;
  similar_cars: CarInfo[];
}

interface FetchedOptions {
  body_types?: string[];
  fuel_types?: string[];
  transmissions?: string[];
  states?: string[];
  drive_types?: string[];
  owner_types?: string[];
  steering_types?: string[];
  utypes?: string[];
}

export default function PredictPage() {
  // State for API data and loading
  const [options, setOptions] = useState({
    body_types: [] as string[],
    fuel_types: [] as string[],
    transmissions: [] as string[],
    states: [] as string[],
    drive_types: [] as string[],
    owner_types: [] as string[],
    steering_types: [] as string[],
    utypes: [] as string[],
  });
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [predicting, setPredicting] = useState(false);

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);

  const fallbackOptions = {
    body_types: ['Sedan', 'SUV', 'Hatchback', 'Truck'],
    fuel_types: ['Gasoline', 'Diesel', 'Electric', 'Hybrid'],
    transmissions: ['Automatic', 'Manual'],
    states: ['NY', 'CA', 'TX', 'FL'],
    drive_types: ['FWD', 'RWD', 'AWD'],
    owner_types: ['First', 'Second', 'Third', 'Fourth & Above'],
    steering_types: ['Power', 'Electric', 'Manual'],
    utypes: ['Used', 'New'],
  };

  // Initialize react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: "",
      transmission: "",
      fuel: "",
      utype: "Used",
      engine_type: "V6",
      drive_type: "FWD",
      steering_type: "Power",
      state: "",
      owner_type: "First",
      myear: 2020,
      km: 35000,
      no_of_cylinder: 6,
      length: 5052,
      width: 1968,
      height: 1741,
      wheel_base: 2994,
      kerb_weight: 2135,
      gear_box: 8,
      seats: 5,
      max_torque_at: 1500,
    },
  });

  const selectedBodyType = form.watch('body');

  // Fetch dropdown options from /api/cars on page load
  useEffect(() => {
    async function fetchOptions() {
      try {
        setLoadingOptions(true);
        const res = await fetch('/api/cars');
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch car options: ${res.status}`);
        }

        const fetchedOptions: FetchedOptions = await res.json();

        setOptions({
          body_types: Array.isArray(fetchedOptions.body_types) && fetchedOptions.body_types.length > 0 ? fetchedOptions.body_types : fallbackOptions.body_types,
          fuel_types: Array.isArray(fetchedOptions.fuel_types) && fetchedOptions.fuel_types.length > 0 ? fetchedOptions.fuel_types : fallbackOptions.fuel_types,
          transmissions: Array.isArray(fetchedOptions.transmissions) && fetchedOptions.transmissions.length > 0 ? fetchedOptions.transmissions : fallbackOptions.transmissions,
          states: Array.isArray(fetchedOptions.states) && fetchedOptions.states.length > 0 ? fetchedOptions.states : fallbackOptions.states,
          drive_types: Array.isArray(fetchedOptions.drive_types) && fetchedOptions.drive_types.length > 0 ? fetchedOptions.drive_types : fallbackOptions.drive_types,
          owner_types: Array.isArray(fetchedOptions.owner_types) && fetchedOptions.owner_types.length > 0 ? fetchedOptions.owner_types : fallbackOptions.owner_types,
          steering_types: Array.isArray(fetchedOptions.steering_types) && fetchedOptions.steering_types.length > 0 ? fetchedOptions.steering_types : fallbackOptions.steering_types,
          utypes: Array.isArray(fetchedOptions.utypes) && fetchedOptions.utypes.length > 0 ? fetchedOptions.utypes : fallbackOptions.utypes,
        });

      } catch (error: any) {
        console.error("Error in fetchOptions:", error);
        toast.error("Error loading options, using defaults.");
        setOptions(fallbackOptions);
      } finally {
        setLoadingOptions(false);
      }
    }
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Main Prediction Function ---
  async function onSubmit(values: FormData) {
    setPredicting(true);
    setPrediction(null);
    toast.info("Calculating valuation...");

    try {
      const predictRes = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!predictRes.ok) {
        throw new Error("Prediction API request failed");
      }

      const predictData: PredictionResponse = await predictRes.json();
      setPrediction(predictData);

      if (predictData.predicted_price !== null) {
        toast.success("Valuation complete!");
      }

    } catch (error: any) {
      console.error("Error in onSubmit:", error);
      toast.error("Prediction failed: " + error.message);
    } finally {
      setPredicting(false);
    }
  }

  const formatPrice = (price: number | null) => {
    if (price === null || isNaN(price)) return "N/A";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <Navbar />

      <div className="container mx-auto max-w-7xl px-4 py-24 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* --- LEFT COLUMN: FORM (5 cols) --- */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Valuation</h1>
              <p className="text-gray-400">Enter details to estimate vehicle value.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <fieldset className="p-5 border border-white/10 rounded-xl bg-white/5 space-y-4">
                  <legend className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-2">Core Specs</legend>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="myear" render={({ field }) => (
                      <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" {...field} className="bg-black/40 border-white/10 focus:border-white/30 transition-colors" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="km" render={({ field }) => (
                      <FormItem><FormLabel>Kilometers</FormLabel><FormControl><Input type="number" {...field} className="bg-black/40 border-white/10 focus:border-white/30 transition-colors" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/40 border-white/10 h-11">
                              <SelectValue placeholder="Select body..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {loadingOptions ? <SelectItem value="loading" disabled>Loading...</SelectItem> :
                              options.body_types.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)
                            }
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="fuel" render={({ field }) => (
                      <FormItem><FormLabel>Fuel</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}><FormControl><SelectTrigger className="bg-black/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger></FormControl><SelectContent>{options.fuel_types.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></FormItem>
                    )} />
                    <FormField control={form.control} name="transmission" render={({ field }) => (
                      <FormItem><FormLabel>Transmission</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}><FormControl><SelectTrigger className="bg-black/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger></FormControl><SelectContent>{options.transmissions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (State)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl><SelectTrigger className="bg-black/40 border-white/10"><SelectValue placeholder="Select state..." /></SelectTrigger></FormControl>
                        <SelectContent>{options.states.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </fieldset>

                {/* Advanced Fields Collapsed or Simplified */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="utype" render={({ field }) => (
                    <FormItem><FormLabel>Condition</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}><FormControl><SelectTrigger className="bg-black/20 border-white/10"><SelectValue /></SelectTrigger></FormControl><SelectContent>{options.utypes.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></FormItem>
                  )} />
                  <FormField control={form.control} name="owner_type" render={({ field }) => (
                    <FormItem><FormLabel>Owners</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}><FormControl><SelectTrigger className="bg-black/20 border-white/10"><SelectValue /></SelectTrigger></FormControl><SelectContent>{options.owner_types.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></FormItem>
                  )} />
                </div>

                {/* Hidden fields */}
                <div className="grid grid-cols-3 gap-2">
                  <FormField control={form.control} name="no_of_cylinder" render={({ field }) => (
                    <FormItem><FormLabel className="text-xs">Cylinders</FormLabel><FormControl><Input type="number" {...field} className="bg-black/20 border-white/10 h-9 text-sm" /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="seats" render={({ field }) => (
                    <FormItem><FormLabel className="text-xs">Seats</FormLabel><FormControl><Input type="number" {...field} className="bg-black/20 border-white/10 h-9 text-sm" /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="engine_type" render={({ field }) => (
                    <FormItem><FormLabel className="text-xs">Engine</FormLabel><FormControl><Input {...field} className="bg-black/20 border-white/10 h-9 text-sm" /></FormControl></FormItem>
                  )} />
                </div>

                <div className="hidden">
                  <FormField control={form.control} name="drive_type" render={({ field }) => <Input {...field} />} />
                  <FormField control={form.control} name="steering_type" render={({ field }) => <Input {...field} />} />
                  <FormField control={form.control} name="gear_box" render={({ field }) => <Input {...field} />} />
                  <FormField control={form.control} name="max_torque_at" render={({ field }) => <Input {...field} />} />
                  <FormField control={form.control} name="length" render={({ field }) => <Input {...field} />} />
                  <FormField control={form.control} name="width" render={({ field }) => <Input {...field} />} />
                  <FormField control={form.control} name="height" render={({ field }) => <Input {...field} />} />
                  <FormField control={form.control} name="wheel_base" render={({ field }) => <Input {...field} />} />
                  <FormField control={form.control} name="kerb_weight" render={({ field }) => <Input {...field} />} />
                </div>

                <Button type="submit" size="lg" className="w-full text-lg py-6 bg-white text-black hover:bg-gray-200 transition-transform active:scale-95" disabled={predicting || loadingOptions}>
                  {predicting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                  Get Valuation
                </Button>
              </form>
            </Form>
          </div>

          {/* --- RIGHT COLUMN: RESULTS (7 cols) --- */}
          <div className="lg:col-span-7 space-y-8">

            {/* 1. Hero / Prediction Card */}
            {!prediction && !predicting ? (
              <div className="h-full flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                <div className="w-full max-w-md aspect-video mb-6 rounded-xl overflow-hidden bg-gradient-to-b from-gray-800 to-black/50 flex items-center justify-center relative">
                  <Car3D bodyType={selectedBodyType} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent opacity-50"></div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Ready to Value</h2>
                <p className="text-gray-400">Fill out the specifications to see the estimated market value and similar vehicles.</p>
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-green-900/20 to-black border-green-500/30 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-32 bg-green-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <TrendingUp className="h-5 w-5" />
                    <span>Estimated Market Value</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {predicting ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-16 w-2/3 bg-white/10 rounded-lg"></div>
                      <div className="h-4 w-1/3 bg-white/5 rounded"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-6xl font-black text-white tracking-tight mb-2">
                        {formatPrice(prediction?.predicted_price || 0)}
                      </p>
                      <p className="text-gray-400">
                        Estimated range: {formatPrice((prediction?.predicted_price || 0) * 0.95)} - {formatPrice((prediction?.predicted_price || 0) * 1.05)}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 2. Similar Cars Grid */}
            {!predicting && prediction?.similar_cars && prediction.similar_cars.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-400" />
                  Similar Vehicles in Market
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prediction.similar_cars.map((car) => (
                    <div key={car.id} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl overflow-hidden transition-all duration-300 flex flex-col">
                      {/* Placeholder Image Area */}
                      <div className="aspect-video bg-gray-800 relative flex items-center justify-center overflow-hidden">
                        {car.image_url ? (
                          <img
                            src={car.image_url}
                            alt={`${car.myear} ${car.model}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <CarIcon className="h-16 w-16 text-gray-600 group-hover:scale-110 transition-transform duration-500" />
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                          <p className="text-white font-semibold truncate">{car.myear} {car.model} {car.variant}</p>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-baseline justify-between mb-4">
                          <span className="text-2xl font-bold text-white">{formatPrice(car.listed_price)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-400 mt-auto">
                          <div className="flex items-center gap-1.5">
                            <Gauge className="w-3.5 h-3.5" />
                            <span>{car.km.toLocaleString()} km</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Fuel className="w-3.5 h-3.5" />
                            <span>{car.fuel}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{car.state}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{car.myear}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!predicting && prediction?.similar_cars?.length === 0 && prediction?.predicted_price && (
              <div className="p-8 bg-white/5 rounded-xl border border-white/10 text-center">
                <p className="text-gray-400">No similar market data found near this price point.</p>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}