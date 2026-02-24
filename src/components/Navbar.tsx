import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/Button';
interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  isLoggedIn?: boolean;
  userName?: string;
}
export function Navbar({
  onNavigate,
  currentPage,
  isLoggedIn,
  userName
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
  {
    name: 'Personal',
    page: 'personal'
  },
  {
    name: 'Business',
    page: 'business'
  },
  {
    name: 'Commercial',
    page: 'commercial'
  },
  {
    name: 'Investment & Crypto',
    page: 'investment-crypto'
  },
  {
    name: 'Inheritance',
    page: 'inheritance'
  }];

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={() => onNavigate('landing')}>

            <img
              src="/vbank.png"
              alt="Bank Vercel"
              className="h-10 w-auto" />

            <span className="ml-3 text-2xl font-serif font-bold tracking-tight text-white">
              Bank <span className="text-gradient">Vercel</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-6">
            {!isLoggedIn &&
            navLinks.map((link) =>
            <button
              key={link.name}
              onClick={() => onNavigate(link.page)}
              className={`text-sm font-medium transition-colors ${currentPage === link.page ? 'text-gradient' : 'text-gray-300 hover:text-white'}`}>

                  {link.name}
                </button>
            )}
            <button
              onClick={() => onNavigate('contact')}
              className={`text-sm font-medium transition-colors ${currentPage === 'contact' ? 'text-gradient' : 'text-gray-300 hover:text-white'}`}>

              Contact
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ?
            <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">
                  Welcome, {userName}
                </span>
                <Button
                variant="secondary"
                size="sm"
                onClick={() => onNavigate('dashboard')}>

                  Dashboard
                </Button>
              </div> :

            <>
                <Button variant="ghost" onClick={() => onNavigate('login')}>
                  Login
                </Button>
                <Button variant="primary" onClick={() => onNavigate('signup')}>
                  Sign Up
                </Button>
              </>
            }
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2">

              {isMenuOpen ?
              <X className="h-6 w-6" /> :

              <Menu className="h-6 w-6" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen &&
      <div className="md:hidden glass-panel border-b border-white/10">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {!isLoggedIn &&
          navLinks.map((link) =>
          <button
            key={link.name}
            onClick={() => {
              onNavigate(link.page);
              setIsMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2.5 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md">

                  {link.name}
                </button>
          )}
            <button
            onClick={() => {
              onNavigate('contact');
              setIsMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2.5 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md">

              Contact
            </button>
            <div className="pt-4 border-t border-white/10 mt-2 flex flex-col space-y-3">
              {isLoggedIn ?
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                onNavigate('dashboard');
                setIsMenuOpen(false);
              }}>

                  Go to Dashboard
                </Button> :

            <>
                  <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onNavigate('login');
                  setIsMenuOpen(false);
                }}>

                    Login
                  </Button>
                  <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  onNavigate('signup');
                  setIsMenuOpen(false);
                }}>

                    Sign Up
                  </Button>
                </>
            }
            </div>
          </div>
        </div>
      }
    </nav>);

}