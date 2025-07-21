import React from 'react'
import { Link } from 'react-router-dom'
import { Brain, ExternalLink, Building2, Mail, Globe } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    content: [
      { name: 'Latest News', href: '/news' },
      { name: 'Tutorials', href: '/tutorials' },
      { name: 'Research', href: '/research' },
      { name: 'Discussions', href: '/threads' },
    ],
    company: [
      { name: 'About NurAledge', href: 'https://www.nuraledge.com/about', external: true },
      { name: 'Services', href: 'https://www.nuraledge.com/services', external: true },
      { name: 'Contact', href: 'https://www.nuraledge.com/contact', external: true },
      { name: 'Careers', href: 'https://www.nuraledge.com/careers', external: true },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ]
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Branding */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-bold">AI Insights Hub</h3>
                <div className="flex items-center space-x-1 text-sm text-gray-400">
                  <Building2 className="h-3 w-3" />
                  <span>by NurAledge</span>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your premier destination for artificial intelligence insights, 
              machine learning breakthroughs, and cutting-edge technology discussions.
            </p>
            
            {/* Company Website Link */}
            <Link 
              to="https://www.nuraledge.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>www.nuraledge.com</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          {/* Content Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Content
            </h3>
            <ul className="space-y-2">
              {footerLinks.content.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              NurAledge
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors inline-flex items-center space-x-1"
                    >
                      <span>{link.name}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <Link 
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <p>© {currentYear} NurAledge. All rights reserved.</p>
              <div className="hidden md:flex items-center space-x-1">
                <span>•</span>
                <span>Powered by AI & Innovation</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <Link 
                to="mailto:contact@nuraledge.com"
                className="text-gray-400 hover:text-white transition-colors inline-flex items-center space-x-1"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm">contact@nuraledge.com</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}