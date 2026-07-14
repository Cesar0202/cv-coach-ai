import React from 'react';
import { Linkedin, Github, Heart } from 'lucide-react';
import Logo from '../assets/logo.svg';

export default function Footer() {
  const socialLinks = [
    { icon: <Linkedin size={16} />, url: 'https://www.linkedin.com/in/cesar-huriarte/', label: 'LinkedIn' },
    { icon: <Github size={16} />, url: 'https://github.com/Cesar0202/', label: 'GitHub' },
  ];

  const quickLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Cómo funciona', href: '#como-funciona' },
    { name: 'Sobre el proyecto', href: '#sobre-el-proyecto' },
  ];

  return (
    <footer className="bg-brand-text text-brand-bg pt-16 pb-12 px-4 md:px-10 border-t border-brand-text relative overflow-hidden">
      {/* Subtle glow background */}
      <div className="absolute left-10 bottom-0 w-80 h-80 bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Upper footer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12 pb-12 border-b border-white/10">
          
          {/* Brand info (span 5) */}
          <div className="md:col-span-5 text-left flex flex-col gap-4">
            <div className="flex items-center">
              <span className="font-display font-bold text-lg uppercase tracking-wider text-white">
                CV Coach <span className="text-brand-accent">AI</span>
              </span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed max-w-sm">
              Una herramienta de entrenamiento inteligente diseñada para ayudar a profesionales de cualquier sector a estructurar perfiles de alto impacto y prepararse para procesos de selección.
            </p>
          </div>

          {/* Privacy Disclaimer (span 4) */}
          <div className="md:col-span-4 text-left">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-white mb-4">
              Aviso de Privacidad
            </h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Respetamos tu privacidad al 100%. <strong className="text-white/80 font-semibold">Tu currículum no se almacena</strong> de ninguna manera en bases de datos. Los archivos se analizan temporalmente en memoria para renderizar el reporte y se descartan inmediatamente después.
            </p>
          </div>

          {/* Quick links (span 3) */}
          <div className="md:col-span-3 text-left md:pl-10">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-white mb-4">
              Navegación
            </h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-xs text-white/50 hover:text-brand-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Lower footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-white/40 flex items-center gap-1.5 order-2 sm:order-1">
            © {new Date().getFullYear()} CV Coach AI. MVP para Portafolio. Creado por César con React.
          </p>

          {/* Social connections */}
          <div className="flex items-center gap-4 order-1 sm:order-2">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-white/50 hover:text-brand-accent hover:scale-105 transition-all p-2 rounded-full border border-white/10 hover:border-brand-accent/30 hover:bg-white/5 shadow-sm"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
