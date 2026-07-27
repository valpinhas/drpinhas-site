'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

type NavChild = {
  label: string
  url: string
}

type NavItem = {
  label: string
  url: string
  newTab?: boolean | null
  children?: NavChild[] | null
}

export function Header({ navItems, siteName, tagline }: { navItems: NavItem[]; siteName: string; tagline: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-cream-50/90 backdrop-blur-md border-b border-sage-100">
      <div className="container-wide flex items-center justify-between py-4">
        {/* Left: site name + tagline */}
        <Link href="/" className="flex flex-col">
          <span className="font-serif text-3xl md:text-4xl text-sage-800 font-semibold leading-tight">{siteName}</span>
          <span className="text-sm text-sage-500 tracking-wide">{tagline}</span>
        </Link>
      </div>

      <div className="container-wide flex items-center justify-between py-4">
        {/* Right: desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) =>
            item.children && item.children.length > 0 ? (
              <div key={item.url} className="group relative">
                <Link
                  href={item.url}
                  className="flex items-center gap-1 text-sm font-medium text-sage-700 hover:text-sage-900"
                >
                  {item.label}
                  <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </Link>
                {/* Hover dropdown */}
                <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="min-w-56 rounded-xl border border-sage-100 bg-white py-2 shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.url}
                        href={child.url}
                        className="block px-4 py-2 text-sm text-sage-700 hover:bg-sage-50 hover:text-sage-900"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.url}
                href={item.url}
                target={item.newTab ? '_blank' : undefined}
                rel={item.newTab ? 'noopener noreferrer' : undefined}
                className="text-sm font-medium text-sage-700 hover:text-sage-900"
              >
                {item.label}
              </Link>
            )
          )}
          <Link href="/contact" className="btn-primary text-sm">
            Schedule a Consultation
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-sage-700"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-sage-100 bg-cream-50">
          <div className="container-wide py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <div key={item.url}>
                <Link
                  href={item.url}
                  target={item.newTab ? '_blank' : undefined}
                  rel={item.newTab ? 'noopener noreferrer' : undefined}
                  className="text-sm font-medium text-sage-700 hover:text-sage-900 py-2 block"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && item.children.length > 0 && (
                  <div className="ml-4 mb-1 flex flex-col gap-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.url}
                        href={child.url}
                        className="text-sm text-sage-600 hover:text-sage-900 py-1.5"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/contact" className="btn-primary text-sm mt-2" onClick={() => setMobileOpen(false)}>
              Schedule a Consultation
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
