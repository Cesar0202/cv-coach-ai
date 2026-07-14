# CV Coach AI

CV Coach AI es una plataforma web interactiva diseñada para evaluar currículums profesionales y realizar simulaciones de entrevistas de trabajo en tiempo real mediante la integración de la API de Google Gemini. La aplicación proporciona retroalimentación instantánea, identificando fortalezas, áreas de mejora y palabras clave recomendadas para optimizar el perfil del candidato.

## Características principales

* **Carga e ingreso modular**: Permite arrastrar archivos en formato PDF o Word, o ingresar el texto del currículum directamente para un análisis de contenido preciso.
* **Evaluación automatizada**: Genera una puntuación y una retroalimentación detallada basada en las expectativas del mercado de reclutamiento actual.
* **Simulador de entrevistas interactivo**: Inicia un chat en vivo donde una inteligencia artificial actúa como entrevistador senior, alternando preguntas de teoría general y preguntas técnicas personalizadas sobre la experiencia y proyectos declarados en el currículum.
* **Privacidad garantizada**: Todo el procesamiento se realiza en el navegador en memoria y de forma privada; las credenciales se almacenan localmente y no se guardan registros del currículum en bases de datos externas.

## Tecnologías utilizadas

* **Frontend**: React, Vite
* **Estilos**: Tailwind CSS v4 (con PostCSS y Autoprefixer)
* **Iconografía**: Lucide React
* **Inteligencia Artificial**: Google Gemini API (modelo gemini-2.5-flash)

## Instalación y ejecución local

Siga los siguientes pasos para ejecutar el proyecto en su entorno de desarrollo local:

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Cesar0202/cv-coach-ai.git
   cd cv-coach-ai
   ```

2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Configurar las variables de entorno:
   Cree un archivo llamado `.env` en la raíz del proyecto y defina su clave de la API de Gemini:
   ```env
   VITE_GEMINI_API_KEY=su_api_key_de_gemini
   ```

4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Generar la compilación para producción:
   ```bash
   npm run build
   ```

