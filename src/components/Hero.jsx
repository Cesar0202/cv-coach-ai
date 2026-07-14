import React from 'react';
import { ArrowRight, Play, Award, Brain } from 'lucide-react';

export default function Hero() {
  const handleScrollToUpload = () => {
    const el = document.getElementById('sobre-el-proyecto');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToHow = () => {
    const el = document.getElementById('como-funciona');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="inicio" 
      className="relative min-h-screen pt-28 pb-16 px-4 md:px-10 flex flex-col justify-center overflow-hidden grid-bg"
    >
      {/* Decorative Giant Text in Background (Pixel Rise style) */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none select-none z-0">
        <h1 className="text-[12vw] font-display font-black leading-none text-white tracking-widest text-center uppercase opacity-80 whitespace-nowrap">
          CV COACH AI
        </h1>
        <h1 className="text-[10vw] font-display font-black leading-none text-transparent tracking-widest text-center uppercase opacity-20 whitespace-nowrap [-webkit-text-stroke:2px_#2563EB]">
          NEXT GEN MVP
        </h1>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 relative">
        
        {/* Left Content (Grid span 8) */}
        <div className="lg:col-span-8 flex flex-col justify-center text-left">
          <div className="inline-flex items-center bg-brand-accent/10 border border-brand-accent/20 px-3.5 py-1.5 rounded-full w-fit mb-6 animate-pulse">
            <span className="text-xs font-bold tracking-wider uppercase text-brand-accent">
              Entrenamiento con IA
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-brand-text leading-[1.05] tracking-tight mb-6 uppercase">
            Optimiza tu perfil. <br />
            <span className="text-brand-accent">Supera la entrevista.</span>
          </h2>

          <p className="text-base md:text-lg text-brand-text/75 font-normal leading-relaxed mb-8 max-w-2xl">
            CV Coach AI analiza tu currículum en segundos y simula entrevistas de trabajo interactivas. Recibe retroalimentación instantánea y mejora tus posibilidades de contratación de forma gratuita.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleScrollToUpload}
              className="bg-brand-accent text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-brand-accentHover hover:shadow-lg transition-all active:scale-95 group"
            >
              Probar gratis
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleScrollToHow}
              className="bg-white hover:bg-brand-grayLight/30 border border-brand-text/10 text-brand-text px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Play size={12} className="fill-brand-text text-brand-text" />
              Ver cómo funciona
            </button>
          </div>
        </div>

        {/* Right Content (Grid span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-10 text-left lg:border-l lg:border-brand-text/10 lg:pl-8">
          
          {/* Metric 1 */}
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <span className="text-4xl md:text-5xl font-display font-bold text-brand-text">95%</span>
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text mb-1">
              Precisión de Feedback
            </h3>
            <p className="text-xs text-brand-text/60 leading-relaxed">
              Nuestra IA evalúa tu currículum basándose en estándares de contratación de las mejores empresas del sector.
            </p>
          </div>

          {/* Metric 2 */}
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <span className="text-4xl md:text-5xl font-display font-bold text-brand-text">15m</span>
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text mb-1">
              Simulador Realista
            </h3>
            <p className="text-xs text-brand-text/60 leading-relaxed">
              Simulaciones adaptativas con preguntas basadas en tu perfil específico y nivel de experiencia.
            </p>
          </div>

          {/* Additional text decorator similar to Pixel Rise */}
          <p className="text-[10px] uppercase tracking-widest text-brand-text/40 leading-normal border-t border-brand-text/5 pt-4">
            Del primer borrador a la oferta de trabajo — nos enfocamos en que tu perfil destaque en el mercado laboral.
          </p>
        </div>

      </div>
    </section>
  );
}
