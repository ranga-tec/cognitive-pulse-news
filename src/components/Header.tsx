import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Brain, 
  Search, 
  Menu, 
  X, 
  ExternalLink 
} from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'News', href: '/news' },
    { name: 'Tutorials', href: '/tutorials' },
    { name: 'Articles', href: '/articles' },
    { name: 'Research', href: '/research' },
    { name: 'Reviews', href: '/product-reviews' },
    { name: 'Threads', href: '/threads' },
  ]

  return (
    <header className="bg-slate-900 shadow-lg border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - AI Hub (no company branding) */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-blue-400" />
              <span className="font-bold text-xl text-white">AI Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 text-sm bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400"
                />
              </div>
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-slate-700">
            <div className="py-2 space-y-1">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full text-sm bg-slate-800 border-slate-600 text-white placeholder-gray-400"
                  />
                </div>
              </form>

              {/* Mobile Navigation Links */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}