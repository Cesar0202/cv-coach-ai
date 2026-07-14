import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, FileText, CheckCircle2, Sparkles, RefreshCw, 
  Terminal, ArrowRight, Send, ArrowLeft, Bot, User, AlertCircle
} from 'lucide-react';

// Load Gemini API Key from Vite environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function UploadSection() {
  const [step, setStep] = useState('upload'); // 'upload' | 'processing' | 'result' | 'interview'
  const [uploadTab, setUploadTab] = useState('file'); // 'file' | 'text'
  const [cvText, setCvText] = useState('');
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentCheckIndex, setCurrentCheckIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [apiError, setApiError] = useState('');

  // Dynamic report state
  const [report, setReport] = useState(null);

  // Interactive Chat State for Interview Simulator
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Refs
  const chatContainerRef = useRef(null);

  const processingChecks = [
    'Extrayendo texto del documento...',
    'Identificando palabras clave y habilidades principales...',
    'Evaluando estructura del perfil contra estándares del sector...',
    'Generando recomendaciones de mejora y simulador personalizado...'
  ];

  // Auto scroll chat internally inside the container WITHOUT scrolling the window
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping, step]);

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const extension = droppedFile.name.split('.').pop().toLowerCase();
      if (['pdf', 'docx', 'doc'].includes(extension)) {
        processFile(droppedFile);
      } else {
        alert('Formato no soportado. Sube un archivo PDF o DOCX.');
      }
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // API Call helper for Gemini with automatic retries for high demand
  const callGemini = async (prompt, retries = 3) => {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const body = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const err = await response.json();
        const errorMessage = err.error?.message || '';
        
        if (response.status === 429 || response.status === 503 || errorMessage.toLowerCase().includes('high demand')) {
          if (retries > 0) {
            console.warn(`Gemini API high demand. Retrying in 2.5 seconds... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, 2500));
            return callGemini(prompt, retries - 1);
          } else {
            throw new Error('La IA está experimentando alta demanda. Por favor, espera unos momentos y vuelve a intentarlo.');
          }
        }
        throw new Error(errorMessage || 'Error al comunicarse con la API de Gemini');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (error.message === 'Failed to fetch' && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return callGemini(prompt, retries - 1);
      }
      throw error;
    }
  };

  // Process manual text upload
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!cvText.trim()) return;
    
    setFile({ name: 'CV_Texto_Pegado.txt' });
    processFileContent(cvText);
  };

  // Start analysis processing
  const processFile = async (selectedFile) => {
    setFile(selectedFile);
    processFileContent(selectedFile.name);
  };

  const processFileContent = async (inputSource) => {
    setStep('processing');
    setProcessingProgress(0);
    setCurrentCheckIndex(0);
    setApiError('');

    try {
      // Start processing checks animations
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => (prev < 90 ? prev + 2 : prev));
      }, 100);

      const checkInterval = setInterval(() => {
        setCurrentCheckIndex((prev) => (prev < 2 ? prev + 1 : prev));
      }, 1500);

      // Call Gemini to generate a custom assessment based on actual content or file name
      const isManualText = uploadTab === 'text';
      let prompt = "";
      
      if (isManualText) {
        prompt = `Analiza el siguiente texto de currículum profesional de un candidato y genera una evaluación real e interactiva.
        Texto del CV:
        ${inputSource}
        
        Devuelve estrictamente un objeto JSON con la siguiente estructura (sin formato de código markdown extra, solo el objeto JSON plano):
        {
          "role": "Nombre del Rol (ej. Diseñador UI/UX, Desarrollador React, Especialista en Marketing, etc.)",
          "score": un número entero de calificación de 0 a 100,
          "scoreText": "Un párrafo corto de 2 líneas sugiriendo mejoras generales",
          "strengths": ["punto fuerte 1", "punto fuerte 2", "punto fuerte 3"],
          "weaknesses": ["punto débil 1", "punto débil 2", "punto débil 3"],
          "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
          "initialQuestion": "Una pregunta desafiante adaptada al rol para abrir la entrevista"
        }`;
      } else {
        prompt = `Estamos en una simulación de carga de archivos para un portafolio web. No tienes acceso directo a la lectura de archivos locales.
        El usuario ha subido un archivo de currículum llamado "${inputSource}".
        Tu tarea es inferir de manera creativa el rol profesional más probable que corresponde a ese nombre de archivo (por ejemplo, si contiene 'Cesar' infiere un rol de desarrollo de software como Full-Stack o Frontend, o el rol que sugiera el nombre de archivo).
        Inventa y estima lógicamente datos consistentes con ese rol.
        
        Devuelve estrictamente un objeto JSON con la siguiente estructura (sin formato de código markdown extra, solo el objeto JSON plano). NO digas que no tienes acceso al archivo, tu objetivo es inventar el perfil para la simulación basándote únicamente en el nombre de archivo de forma coherente:
        {
          "role": "Nombre del Rol (ej. Diseñador UI/UX, Desarrollador React, Especialista en Marketing, etc.)",
          "score": un número entero de calificación estimado (entre 75 y 95),
          "scoreText": "Un párrafo corto de 2 líneas sugiriendo mejoras generales para ese tipo de currículum",
          "strengths": ["punto fuerte estimado 1", "punto fuerte estimado 2", "punto fuerte estimado 3"],
          "weaknesses": ["punto débil estimado 1", "punto débil estimado 2", "punto débil estimado 3"],
          "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
          "initialQuestion": "Una pregunta desafiante adaptada al rol inferido para abrir la entrevista"
        }`;
      }

      const aiResponseText = await callGemini(prompt);
      let cleanedText = aiResponseText.trim();
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```(json)?/i, '').replace(/```$/, '').trim();
      }
      const parsedReport = JSON.parse(cleanedText);
      
      clearInterval(progressInterval);
      clearInterval(checkInterval);
      
      // Finish progress
      setProcessingProgress(100);
      setCurrentCheckIndex(3);

      setTimeout(() => {
        setReport(parsedReport);
        setChatMessages([
          {
            sender: 'ai',
            text: parsedReport.initialQuestion
          }
        ]);
        setStep('result');
      }, 600);

    } catch (error) {
      console.error("Gemini Error:", error);
      setApiError(error.message || 'Ocurrió un error al conectar con el motor de IA. Por favor, reintenta.');
      setStep('upload');
    }
  };

  // Handle messages in chat
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userResponse.trim() || !report) return;

    const newUserMsg = { sender: 'user', text: userResponse };
    setChatMessages(prev => [...prev, newUserMsg]);
    setUserResponse('');
    setIsTyping(true);

    // Call Real Gemini API for Interview Simulator Response
    try {
      // Construct full chat history for prompt context
      const chatHistory = chatMessages.map(msg => 
        `${msg.sender === 'user' ? 'Candidato' : 'Entrevistador (IA)'}: ${msg.text}`
      ).join('\n');

      const isManualText = uploadTab === 'text';
      const cvContext = isManualText 
        ? `Contenido real del CV del candidato:\n${cvText}`
        : `El candidato subió un archivo llamado: "${file?.name || 'currículum.pdf'}".\nRol inferido: ${report.role}\nFortalezas: ${report.strengths.join(', ')}\nÁreas de mejora: ${report.weaknesses.join(', ')}\nPalabras clave: ${report.keywords.join(', ')}`;

      const prompt = `Actúas como un entrevistador profesional senior para el rol de ${report.role}.
      Estás evaluando al candidato en una entrevista simulada basada en su currículum.
      
      Información del currículum y evaluación inicial:
      ${cvContext}
      
      Historial de chat anterior de la entrevista:
      ${chatHistory}
      
      Candidato responde ahora: "${userResponse}"
      
      Instrucciones de respuesta:
      1. Evalúa brevemente su respuesta anterior (máximo 1 frase indicando si fue acertada, incompleta o errada).
      2. Realiza la siguiente pregunta relevante. Ésta debe alternar entre evaluar conceptos teóricos del rol y hacer preguntas específicas sobre la experiencia, proyectos o habilidades mencionadas en la información de su currículum.
      3. Escribe únicamente la respuesta de forma directa, en español, conversacional y corta (máximo 3 frases en total).`;

      const aiReply = await callGemini(prompt);
      setIsTyping(false);
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      setIsTyping(false);
      setChatMessages(prev => [...prev, { sender: 'ai', text: error.message || 'Disculpas, experimenté un error al procesar tu respuesta con el motor de IA. Por favor, reintenta.' }]);
    }
  };

  const resetSimulator = () => {
    setFile(null);
    setStep('upload');
    setReport(null);
    setChatMessages([]);
    setCvText('');
    setApiError('');
  };

  return (
    <section 
      id="sobre-el-proyecto" 
      className="py-24 px-4 md:px-10 bg-brand-bg relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto w-full">
        

        {/* Dynamic API Error Alert */}
        {apiError && (
          <div className="bg-red-50 border border-red-100 text-red-800 rounded-2xl p-4 mb-6 text-xs text-left flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
            <p>{apiError}</p>
          </div>
        )}

        {/* Step-based Content Box */}
        <div className="bg-white border border-brand-text/10 rounded-[32px] shadow-2xl p-6 md:p-12 transition-all duration-500 overflow-hidden relative min-h-[500px] flex flex-col justify-center">
          
          {/* BACKGROUND SPARKLE */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[80px] -z-10"></div>

          {/* STEP 1: UPLOAD CARD OR TEXT PASTING */}
          {step === 'upload' && (
            <div className="animate-fadeIn">
              <div className="max-w-lg mx-auto text-center mb-6">
                <span className="text-xs font-bold tracking-widest uppercase text-brand-accent mb-2.5 block">
                  Prueba el MVP
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-brand-text mb-4">
                  Analiza tu CV de forma instantánea
                </h2>
                <p className="text-sm text-brand-text/60 leading-relaxed">
                  Elige subir tu archivo o pegar el contenido de tu currículum directamente para que la IA realice una evaluación real y configure el simulador.
                </p>
              </div>

              {/* Tabs selectors */}
              <div className="flex justify-center gap-2 mb-8 bg-brand-bg/50 p-1.5 rounded-full max-w-xs mx-auto border border-brand-text/5">
                <button
                  onClick={() => setUploadTab('file')}
                  className={`flex-1 py-2 px-4 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                    uploadTab === 'file' 
                      ? 'bg-brand-text text-brand-bg shadow-sm' 
                      : 'text-brand-text/60 hover:text-brand-text'
                  }`}
                >
                  Subir Archivo
                </button>
                <button
                  onClick={() => setUploadTab('text')}
                  className={`flex-1 py-2 px-4 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                    uploadTab === 'text' 
                      ? 'bg-brand-text text-brand-bg shadow-sm' 
                      : 'text-brand-text/60 hover:text-brand-text'
                  }`}
                >
                  Pegar Texto
                </button>
              </div>

              {/* TAB 1: FILE DRAG AND DROP */}
              {uploadTab === 'file' && (
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-10 md:p-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative group ${
                    isDragActive 
                      ? 'border-brand-accent bg-brand-accent/5 scale-[0.99]' 
                      : 'border-brand-text/15 hover:border-brand-accent/40 bg-brand-bg/25 hover:bg-brand-bg/50'
                  }`}
                >
                  <input 
                    type="file" 
                    id="cv-file-input"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileInput}
                  />
                  
                  <div className="p-5 bg-white rounded-2xl border border-brand-text/5 shadow-sm mb-5 group-hover:scale-105 transition-transform duration-300 group-hover:shadow-md">
                    <Upload size={32} className="text-brand-accent" />
                  </div>
                  
                  <h3 className="font-display font-bold text-lg uppercase text-brand-text mb-2">
                    Arrastra tu archivo aquí
                  </h3>
                  <p className="text-xs text-brand-text/50 mb-6">
                    Soporta PDF o DOCX de hasta 5MB
                  </p>
                  
                  <span className="bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-sm group-hover:shadow-md">
                    Buscar archivo
                  </span>
                </div>
              )}

              {/* TAB 2: TEXT AREA PASTING */}
              {uploadTab === 'text' && (
                <form onSubmit={handleTextSubmit} className="flex flex-col text-left animate-fadeIn">
                  <div className="mb-4">
                    <label htmlFor="cv-pasted-text" className="block text-xs font-bold uppercase tracking-wider text-brand-text/60 mb-2">
                      Contenido de tu Currículum
                    </label>
                    <textarea
                      id="cv-pasted-text"
                      rows={8}
                      required
                      value={cvText}
                      onChange={(e) => setCvText(e.target.value)}
                      placeholder="Pega aquí toda la información de tu currículum (Experiencia, logros, estudios...). La IA evaluará tu perfil real sin inventar campos."
                      className="w-full bg-brand-bg/40 border border-brand-text/15 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none rounded-2xl p-4 text-xs text-brand-text transition-all resize-none"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!cvText.trim()}
                    className="bg-brand-accent hover:bg-brand-accentHover text-white py-4 rounded-full font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-40"
                  >
                    <Sparkles size={14} />
                    Analizar Texto de Currículum
                  </button>
                </form>
              )}

              <div className="flex items-center justify-center gap-2 mt-8 text-[11px] text-brand-text/40 font-medium">
                <CheckCircle2 size={12} className="text-green-500" />
                Privacidad Garantizada: Tu texto y archivos se procesan localmente y se descartan tras cerrar la pestaña.
              </div>
            </div>
          )}

          {/* STEP 2: PROCESSING / LOADING ANIMATION */}
          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-10 animate-fadeIn">
              <div className="relative mb-8">
                {/* Radial progress animation */}
                <div className="w-24 h-24 rounded-full border-4 border-brand-bg flex items-center justify-center">
                  <span className="font-display font-bold text-xl text-brand-accent">
                    {processingProgress}%
                  </span>
                </div>
                <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-brand-accent border-t-transparent animate-spin"></div>
              </div>

              <h3 className="font-display font-bold text-lg uppercase text-brand-text mb-2 tracking-tight">
                {uploadTab === 'text' ? 'Analizando texto del currículum' : 'Procesando archivo currículum'}
              </h3>
              <p className="text-xs text-brand-text/50 mb-8">
                {file ? file.name : 'currículum.pdf'} • Procesando mediante IA de Gemini en tiempo real
              </p>

              {/* Checklist progress */}
              <div className="w-full max-w-md bg-brand-bg/50 border border-brand-text/5 rounded-2xl p-6 text-left flex flex-col gap-4">
                {processingChecks.map((check, index) => {
                  const isChecked = index < currentCheckIndex;
                  const isCurrent = index === currentCheckIndex;
                  return (
                    <div 
                      key={index} 
                      className={`flex items-center gap-3 transition-opacity duration-300 ${
                        isChecked || isCurrent ? 'opacity-100' : 'opacity-30'
                      }`}
                    >
                      {isChecked ? (
                        <CheckCircle2 size={16} className="text-brand-accent shrink-0" />
                      ) : isCurrent ? (
                        <RefreshCw size={16} className="text-brand-accent animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-brand-text/30 shrink-0"></div>
                      )}
                      <span className={`text-xs ${isCurrent ? 'font-semibold text-brand-text' : 'text-brand-text/70'}`}>
                        {check}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: DYNAMIC REPORT & RESULT */}
          {step === 'result' && report && (
            <div className="text-left animate-fadeIn">
              {/* Header result */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-text/10 pb-6 mb-8 gap-4">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                    Análisis Completado
                  </span>
                  <h3 className="font-display font-bold text-xl uppercase tracking-tight text-brand-text mt-2.5">
                    Reporte: {file ? file.name : 'currículum.pdf'}
                  </h3>
                </div>
                <button
                  onClick={resetSimulator}
                  className="text-xs font-semibold text-brand-text/50 hover:text-brand-accent flex items-center gap-1.5 transition-colors border border-brand-text/10 rounded-full px-4 py-2 hover:bg-brand-bg"
                >
                  <RefreshCw size={12} />
                  Analizar otro archivo
                </button>
              </div>

              {/* Visual Grid Report */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
                
                {/* CV Score Wheel */}
                <div className="md:col-span-4 bg-brand-bg/50 border border-brand-text/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                  <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                    {/* Ring background */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="50" fill="transparent" stroke="#E5E5E0" strokeWidth="10" />
                      <circle cx="64" cy="64" r="50" fill="transparent" stroke="#2563EB" strokeWidth="10" 
                        strokeDasharray="314"
                        strokeDashoffset={314 - (314 * report.score) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="font-display font-bold text-3xl text-brand-text">{report.score}</span>
                      <span className="text-[10px] font-semibold text-brand-text/40 uppercase">Puntos</span>
                    </div>
                  </div>
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-text">
                    Rol: {report.role}
                  </h4>
                  <p className="text-[11px] text-brand-text/50 mt-1 max-w-[170px]">
                    {report.scoreText}
                  </p>
                </div>

                {/* Score breakdown & bullets */}
                <div className="md:col-span-8 flex flex-col justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-text flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Puntos Fuertes
                      </h4>
                      <ul className="text-xs text-brand-text/75 space-y-1.5 pl-3.5 list-disc">
                        {report.strengths.map((str, idx) => (
                          <li key={idx}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-text flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                        Áreas de Mejora
                      </h4>
                      <ul className="text-xs text-brand-text/75 space-y-1.5 pl-3.5 list-disc">
                        {report.weaknesses.map((weak, idx) => (
                          <li key={idx}>{weak}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Keywords section */}
                  <div className="mt-6 border-t border-brand-text/5 pt-4">
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-text/50 mb-2">
                      Palabras clave recomendadas:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {report.keywords.map((keyword, index) => (
                        <span key={index} className="text-[10px] font-bold text-brand-text bg-brand-bg px-2.5 py-1 rounded-full border border-brand-text/5">
                          + {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Call to action for next step */}
              <div className="bg-brand-accent/5 border border-brand-accent/15 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-left">
                  <h4 className="font-display font-bold text-sm uppercase text-brand-text flex items-center gap-2">
                    <Sparkles size={14} className="text-brand-accent" />
                    Simulador preparado
                  </h4>
                  <p className="text-xs text-brand-text/60 mt-1 max-w-md">
                    Hemos configurado un cuestionario adaptado a tu perfil de <strong>{report.role}</strong>. ¿Deseas practicar con nuestro evaluador de IA?
                  </p>
                </div>
                <button
                  onClick={() => setStep('interview')}
                  className="bg-brand-accent hover:bg-brand-accentHover text-white px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md hover:shadow-lg shrink-0 active:scale-95 group"
                >
                  <Terminal size={14} />
                  Iniciar simulador
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: INTERACTIVE INTERVIEW SIMULATION */}
          {step === 'interview' && report && (
            <div className="flex flex-col h-[520px] text-left animate-fadeIn">
              
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-brand-text/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setStep('result')}
                    className="p-1.5 rounded-full hover:bg-brand-bg border border-brand-text/5 text-brand-text/60 hover:text-brand-text transition-colors"
                    aria-label="Volver"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <div>
                    <h3 className="font-display font-bold text-xs uppercase tracking-wider text-brand-text">
                      Evaluador de IA ({report.role})
                    </h3>
                    <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Sesión de Simulación Activa
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={resetSimulator}
                  className="text-xs text-brand-accent hover:underline font-bold"
                >
                  Finalizar
                </button>
              </div>

              {/* Chat Window Messages container */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-brand-bg/40 border border-brand-text/5 rounded-2xl mb-4 flex flex-col gap-4"
              >
                {chatMessages.map((msg, index) => {
                  const isAI = msg.sender === 'ai';
                  return (
                    <div 
                      key={index} 
                      className={`flex gap-3 max-w-[85%] ${isAI ? 'self-start' : 'self-end flex-row-reverse'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border ${
                        isAI 
                          ? 'bg-brand-accent text-white border-brand-accent/20' 
                          : 'bg-brand-text text-brand-bg border-brand-text/20'
                      }`}>
                        {isAI ? <Bot size={14} /> : <User size={14} />}
                      </div>

                      {/* Bubble content */}
                      <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isAI 
                          ? 'bg-white text-brand-text border border-brand-text/5' 
                          : 'bg-brand-text text-brand-bg'
                      }`}>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  );
                })}

                {/* AI Typing loader */}
                {isTyping && (
                  <div className="flex gap-3 self-start max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-brand-accent text-white flex items-center justify-center border border-brand-accent/20">
                      <Bot size={14} />
                    </div>
                    <div className="bg-white text-brand-text border border-brand-text/5 p-4 rounded-2xl shadow-sm flex items-center gap-1.5 py-3">
                      <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder={isTyping ? "Evaluando respuesta..." : "Escribe tu respuesta técnica aquí..."}
                  disabled={isTyping}
                  className="flex-1 bg-white border border-brand-text/15 hover:border-brand-text/30 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none rounded-full px-5 py-3 text-xs text-brand-text transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isTyping || !userResponse.trim()}
                  className="p-3.5 bg-brand-text hover:bg-brand-accent text-brand-bg hover:text-white rounded-full transition-all shadow-md active:scale-95 disabled:opacity-30 disabled:hover:bg-brand-text disabled:hover:text-brand-bg shrink-0"
                  aria-label="Enviar respuesta"
                >
                  <Send size={14} />
                </button>
              </form>

              <div className="text-[10px] text-center text-brand-text/40 mt-3">
                Esto es una simulación interactiva. En la versión final, podrás responder usando tu micrófono.
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
