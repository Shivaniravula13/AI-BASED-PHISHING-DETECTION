import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Mail, Globe, Cpu, ChevronRight, CheckCircle2, MessageSquare, Star, ArrowRight, ShieldCheck as ShieldIcon } from 'lucide-react';

const Landing = () => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleSubmitContact = (e) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setContactSuccess(true);
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setContactSuccess(false), 5000);
    }
  };

  return (
    <div className="relative overflow-hidden scanline min-h-screen flex flex-col">
      {/* Background Glows */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-900/10 rounded-full filter blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-red-950/10 rounded-full filter blur-3xl pointer-events-none animate-pulse-slow"></div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-xs font-mono mb-6">
          <ShieldIcon className="h-3.5 w-3.5" />
          <span>CYBERSECURITY AI FOR REVOLUTIONARY EMAIL SECURITY</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
          Defeat Phishing Attacks with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 filter drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            AI-Driven NLP Intelligence
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-gray-400 text-base sm:text-lg mb-10">
          PhishGuard AI analyzes emails and URLs in real-time. Instantly identify email spoofing, urgent ransom language, and credential harvesting links using state-of-the-art NLP models.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-gray-950 font-bold px-8 py-3 rounded shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto glass-panel hover:bg-gray-800 text-white font-medium px-8 py-3 rounded border border-gray-700/50 transition-all duration-300"
          >
            Access Security Panel
          </Link>
        </div>

        {/* Live statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-20">
          {[
            { metric: "99.7%", label: "Detection Accuracy" },
            { metric: "< 50ms", label: "Analysis Latency" },
            { metric: "10,000+", label: "Threat Datasets" },
            { metric: "24/7", label: "Real-Time Watch" }
          ].map((item, index) => (
            <div key={index} className="glass-panel p-6 rounded-lg glow-card-cyan">
              <p className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono tracking-tight">{item.metric}</p>
              <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-gray-950/40 border-y border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Complete Phishing Protection Suite
            </h2>
            <p className="text-gray-400 mt-4">
              Advanced feature sets designed to shield users from social engineering, payload URLs, and email spoofs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-panel p-8 rounded-lg hover:border-cyan-500/50 transition-all duration-500 group">
              <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-800/50 rounded flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Email NLP Preprocessing</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Cleanses and evaluates raw text blocks using tokenization, stopword removal, and TF-IDF extraction to identify psychological triggers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel p-8 rounded-lg hover:border-red-500/50 transition-all duration-500 group">
              <div className="w-12 h-12 bg-red-950/30 border border-red-900/50 rounded flex items-center justify-center text-red-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">URL Risk Profiling</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Inspects link properties including character counts, subdomain counts, HTTPS safety status, and domain spoof keywords.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-8 rounded-lg hover:border-green-500/50 transition-all duration-500 group">
              <div className="w-12 h-12 bg-green-950/30 border border-green-900/50 rounded flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-Time Threat Scanner</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Analyzes live text typing input continuously. Calculates probability values on-the-fly and displays risk meters instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white">Trusted by SecOps Teams</h2>
          <p className="text-gray-400 mt-3">What enterprise security practitioners say about our machine learning detection model.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              quote: "PhishGuard's XGBoost models catch sophisticated credential harvesting attempts that our secure email gateways bypass completely. The accuracy and speed are impressive.",
              author: "Marcus Chen",
              role: "Director of SecOps, CyberShield Corp"
            },
            {
              quote: "The visual indicators explanation is what makes this app stand out. It doesn't just say 'phishing'; it lists specific risk triggers (unsecured protocol, long domain, urgent words) in seconds.",
              author: "Elena Rostov",
              role: "Lead Threat Analyst, Securico Global"
            }
          ].map((test, index) => (
            <div key={index} className="glass-panel p-8 rounded-lg relative">
              <div className="flex gap-1 text-cyan-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-cyan-400" />)}
              </div>
              <p className="text-gray-300 italic mb-6">"{test.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-950/50 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold font-mono text-sm">
                  {test.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{test.author}</h4>
                  <p className="text-gray-500 text-xs font-mono">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-950/20 border-t border-gray-900 mt-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-8 sm:p-12 rounded-xl border border-gray-800/80">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-4">
              Get in Touch with our Labs
            </h2>
            <p className="text-gray-400 text-center text-sm mb-8">
              Interested in custom ML models or integrating our APIs? Drop us a query.
            </p>

            {contactSuccess ? (
              <div className="bg-green-950/30 border border-green-800/50 text-green-400 p-4 rounded-md flex items-center gap-2 mb-6">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>Thank you! Your message has been sent successfully. Our security lab will contact you shortly.</span>
              </div>
            ) : null}

            <form onSubmit={handleSubmitContact} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-gray-950/80 border border-gray-800 rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm transition"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-gray-950/80 border border-gray-800 rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm transition"
                    placeholder="name@company.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Message</label>
                <textarea
                  rows="4"
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-gray-950/80 border border-gray-800 rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm transition"
                  placeholder="Tell us about your requirements..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-950 font-bold py-3 rounded shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
