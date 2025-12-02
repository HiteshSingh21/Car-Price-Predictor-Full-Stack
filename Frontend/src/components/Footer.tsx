"use client"

import Link from 'next/link'
import { Car, Twitter, Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Car className="w-6 h-6 text-white" />
              <span className="text-xl font-semibold text-white tracking-tight">carify</span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              Premium AI-powered luxury car valuation platform. Get accurate market prices powered by advanced FT-Transformer technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/predict" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Predict Value
                </Link>
              </li>
              <li>
                <Link href="/browse" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/our-ai" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Our AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © 2024 carify. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="mailto:hello@carify.com"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
