import { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Dynamically import TerminalGame to avoid SSR issues
const TerminalGame = dynamic(() => import('@/components/TerminalGame'), {
  ssr: false,
  loading: () => (
    <div className="glass-panel p-6 h-96 flex items-center justify-center">
      <p className="text-gray-400">Initializing Secure Terminal...</p>
    </div>
  ),
});

// Toast notification component
function Toast({ message, type, onClose }) {
  const bgColor = type === 'success' ? 'bg-neon-green/20 border-neon-green text-neon-green' : 'bg-red-500/20 border-red-500 text-red-400';
  
  return (
    <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg border ${bgColor} shadow-lg animate-pulse`}>
      <div className="flex items-center gap-3">
        {type === 'success' ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">×</button>
      </div>
    </div>
  );
}

export default function Contact() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!email.trim() || !message.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    // Your email address
    const yourEmail = 'banbhanamarjalil@gmail.com';
    
    // Create mailto link with form data
    const subject = encodeURIComponent(`Portfolio Contact from ${email}`);
    const body = encodeURIComponent(`From: ${email}\n\nMessage:\n${message}`);
    
    // Show success message
    showToast('Opening your email client...', 'success');
    
    // Open user's email client
    setTimeout(() => {
      window.location.href = `mailto:${yourEmail}?subject=${subject}&body=${body}`;
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-midnight">
      {/* Toast notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <Navbar />
      <main className="flex-1 section-container max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Contact</h1>
        <p className="text-slate-300 mb-6">
          Let&apos;s collaborate on something memorable. I reply within 24 hours.
        </p>

        {/* WhatsApp Contact */}
        <a
          href="https://wa.me/923444432197?text=Hi%20Amar!%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 mb-8 px-5 py-3 bg-[#25D366] text-white font-semibold rounded-lg shadow-lg shadow-[#25D366]/30 hover:bg-[#128C7E] transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Chat on WhatsApp
        </a>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1" htmlFor="email">
              Your Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-3 bg-accent text-midnight font-semibold rounded-lg shadow-lg shadow-accent/30 hover:opacity-90 transition-opacity"
          >
            Send Message
          </button>
        </form>

        {/* Direct Email Link */}
        <p className="text-slate-400 mt-6 text-sm mb-12">
          Or email me directly at{' '}
          <a href="mailto:banbhanamarjalil@gmail.com" className="text-accent hover:underline">
            banbhanamarjalil@gmail.com
          </a>
        </p>

        {/* Terminal Game - Secure Channel */}
        <TerminalGame />
      </main>
      <Footer />
    </div>
  );
}
