"use client"

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Brain, Zap, Shield, TrendingUp, Database, Sparkles, Cpu, BarChart3 } from 'lucide-react'

export default function OurAIPage() {
  return (
    <main className="min-h-screen bg-[#111111]">
      <Navbar />

      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <Brain className="w-4 h-4 text-white" />
                <span className="text-sm text-gray-300">Advanced AI Technology</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Powered by FT-Transformer
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              State-of-the-art deep learning architecture designed for precise tabular data predictions
            </p>
          </div>

          {/* Main Visual */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10 text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-white/10 rounded-full p-8">
                <Cpu className="w-20 h-20 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Feature Tokenizer + Transformer
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our AI combines feature tokenization with transformer architecture to understand complex patterns in automotive data, delivering predictions with unprecedented accuracy.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-[#0a0a0a] py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              How FT-Transformer Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Data Ingestion</h3>
                <p className="text-sm text-gray-400">
                  Vehicle features are encoded into numerical representations that capture semantic relationships
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Tokenization</h3>
                <p className="text-sm text-gray-400">
                  Each feature is transformed into tokens, similar to words in natural language processing
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Attention Mechanism</h3>
                <p className="text-sm text-gray-400">
                  Multi-head attention layers learn complex feature interactions and dependencies
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Price Prediction</h3>
                <p className="text-sm text-gray-400">
                  Final layers aggregate learned patterns to produce accurate market valuations
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Advantages */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Why FT-Transformer?
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <Shield className="w-10 h-10 text-white mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-3">Superior Accuracy</h3>
              <p className="text-gray-400 leading-relaxed">
                Outperforms traditional gradient boosting methods on tabular data, achieving state-of-the-art results on automotive pricing benchmarks.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <Brain className="w-10 h-10 text-white mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-3">Feature Learning</h3>
              <p className="text-gray-400 leading-relaxed">
                Automatically discovers non-linear relationships between features without manual feature engineering or domain expertise.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <BarChart3 className="w-10 h-10 text-white mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-3">Interpretable</h3>
              <p className="text-gray-400 leading-relaxed">
                Attention weights provide insights into which features drive pricing decisions, ensuring transparency in valuations.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="bg-gradient-to-b from-[#0a0a0a] to-[#111111] py-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              Technical Architecture
            </h2>

            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 space-y-6">
              <div className="pb-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">Model Specifications</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Architecture:</span>
                    <span className="text-white ml-2">Transformer-based</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Attention Heads:</span>
                    <span className="text-white ml-2">8-16</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Hidden Dimensions:</span>
                    <span className="text-white ml-2">256-512</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Training Data:</span>
                    <span className="text-white ml-2">100K+ vehicles</span>
                  </div>
                </div>
              </div>

              <div className="pb-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">Input Features</h3>
                <div className="flex flex-wrap gap-2">
                  {['Make & Model', 'Body Type', 'Fuel Type', 'Transmission', 'Year', 'Mileage', 'Engine Size', 'Seats', 'Color', 'Condition'].map((feature, idx) => (
                    <span key={idx} className="bg-white/10 text-white text-sm px-3 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Performance Metrics</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Prediction Accuracy</span>
                      <span className="text-white">94.2%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-white to-gray-400" style={{ width: '94.2%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Mean Absolute Error</span>
                      <span className="text-white">±$2,450</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-white to-gray-400" style={{ width: '88%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-6 lg:px-8 py-20 text-center">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
            <Sparkles className="w-12 h-12 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Experience AI-Powered Precision
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              See how FT-Transformer technology delivers accurate valuations for your luxury vehicle
            </p>
            <a 
              href="/predict"
              className="inline-flex items-center space-x-2 bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
            >
              <span>Try It Now</span>
              <Zap className="w-5 h-5" />
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
