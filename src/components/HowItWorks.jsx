import React from 'react';
import { UploadCloud, Sparkles, Bot } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Sube tu CV',
      description: 'Arrastra y suelta tu archivo PDF o DOCX. Nuestra herramienta lee tu experiencia y habilidades de forma automática y privada.',
    },
    {
      num: '02',
      title: 'Recibe feedback',
      description: 'Obtén sugerencias detalladas basadas en estándares de reclutadores y expertos. Descubre qué palabras clave te faltan y cómo estructurar tu experiencia.',
    },
    {
      num: '03',
      title: 'Practica la entrevista',
      description: 'Nuestra IA simula un entrevistador profesional. Responde preguntas personalizadas sobre tu área de experiencia y recibe una evaluación instantánea.',
    },
  ];

  return (
    <section 
      id="como-funciona" 
      className="py-24 px-4 md:px-10 bg-white border-y border-brand-text/5 relative overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-brand-accent/5 blur-[120px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-brand-text/10">
          <div className="max-w-xl text-left">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-accent mb-3 block">
              Proceso Optimizado
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight text-brand-text">
              Tres pasos para asegurar <br />
              <span className="text-brand-accent">tu próxima oferta</span>
            </h2>
          </div>
          <p className="text-sm md:text-base text-brand-text/65 max-w-sm text-left md:text-right mt-4 md:mt-0 leading-relaxed">
            Hemos diseñado el camino más corto entre tu perfil actual y la preparación que los reclutadores de primer nivel buscan.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative bg-brand-bg/50 border border-brand-text/5 hover:border-brand-accent/30 rounded-3xl p-8 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-white flex flex-col justify-between min-h-[300px]"
            >
              <div>
                {/* Step number */}
                <div className="flex justify-between items-start mb-6">
                  <span className="font-display font-bold text-4xl text-brand-text/20 group-hover:text-brand-accent transition-colors">
                    {step.num}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-xl uppercase text-brand-text mb-3 tracking-tight group-hover:text-brand-accent transition-colors">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-brand-text/70 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Decorative bottom line */}
              <div className="w-0 h-1 bg-brand-accent rounded-full transition-all duration-300 group-hover:w-full mt-6"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
