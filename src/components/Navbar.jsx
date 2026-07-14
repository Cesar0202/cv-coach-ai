import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '../assets/logo.svg';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: 'Inicio', id: 'inicio' },
    { name: 'Cómo funciona', id: 'como-funciona' },
    { name: 'Sobre el proyecto', id: 'sobre-el-proyecto' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Change navbar background style on scroll
      setScrolled(window.scrollY > 20);

      // Simple active section detection on scroll
      const scrollPosition = window.scrollY + 100;
      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 md:px-10 py-4 ${
        scrolled 
          ? 'bg-brand-bg/85 backdrop-blur-md border-b border-brand-text/5 py-3 shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Text (left) */}
        <a 
          href="#inicio" 
          onClick={(e) => { e.preventDefault(); handleNavClick('inicio'); }} 
          className="flex items-center group"
        >
          <span className="font-display font-bold text-xl tracking-tight text-brand-text select-none">
            CV Coach <span className="text-brand-accent">AI</span>
          </span>
        </a>

        {/* Desktop Nav Links (centered pill style) */}
        <nav className="hidden md:flex items-center bg-white/60 backdrop-blur-md px-1.5 py-1.5 rounded-full border border-brand-text/5 shadow-sm">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 select-none ${
                      isActive
                        ? 'bg-brand-text text-brand-bg shadow-sm'
                        : 'text-brand-text/70 hover:text-brand-text hover:bg-brand-text/5'
                    }`}
                  >
                    {link.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CTA Button (right) */}
        <div className="hidden md:block">
          <button 
            onClick={() => handleNavClick('sobre-el-proyecto')}
            className="bg-brand-text text-brand-bg px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase hover:bg-brand-accent hover:text-white transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
          >
            Probar Gratis
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-full hover:bg-white/80 border border-brand-text/10 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[68px] bg-brand-bg/95 backdrop-blur-md z-30 flex flex-col justify-between p-6 border-t border-brand-text/5 animate-fadeIn">
          <nav className="flex flex-col gap-4 mt-6">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full py-4 text-left px-6 rounded-2xl text-lg font-display font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-brand-text text-brand-bg shadow-md'
                      : 'text-brand-text/80 hover:bg-brand-text/5'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          <div className="mb-8 flex flex-col gap-4">
            <button
              onClick={() => handleNavClick('sobre-el-proyecto')}
              className="w-full bg-brand-accent text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-lg hover:bg-brand-accentHover transition-colors"
            >
              Probar Gratis
            </button>
            <p className="text-center text-xs text-brand-text/40">
              MVP de Portafolio • Tu CV no se almacena
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
