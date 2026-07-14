import React from 'react';
import Navbar from './components/Navbar';
import SocialSidebar from './components/SocialSidebar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import UploadSection from './components/UploadSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-text antialiased font-sans">
      {/* Navigation and Sidebars */}
      <Navbar />
      <SocialSidebar />

      {/* Main Sections */}
      <main>
        {/* Hero Section */}
        <Hero />

        {/* How It Works Section */}
        <HowItWorks />

        {/* CV Upload Section (Main Interactive Section) */}
        <UploadSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
