import React from 'react';
import { Instagram, Linkedin, Twitter } from 'lucide-react';

export default function SocialSidebar() {
  const socials = [
    { icon: <Instagram size={18} />, url: 'https://instagram.com', label: 'Instagram' },
    { icon: <Linkedin size={18} />, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <Twitter size={18} />, url: 'https://twitter.com', label: 'X / Twitter' },
  ];

  return (
    <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center bg-white/40 backdrop-blur-md border border-brand-text/10 shadow-xl rounded-full py-5 px-3 gap-6 transition-all duration-300 hover:bg-white/60 hover:shadow-2xl">
      <span className="text-[10px] uppercase tracking-widest text-brand-text/40 [writing-mode:vertical-lr] rotate-180 mb-2 font-display font-medium">
        Socials
      </span>
      {socials.map((social, index) => (
        <a
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="text-brand-text/60 hover:text-brand-accent hover:scale-110 transition-all duration-200 p-1.5 rounded-full hover:bg-white shadow-sm hover:shadow-md"
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}
