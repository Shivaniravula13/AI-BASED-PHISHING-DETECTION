import React from 'react';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-panel border-t border-gray-800/50 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
            <Shield className="h-5 w-5 text-cyan-500" />
            <span>PhishGuard AI &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-500 font-mono">
            <span>SECURE SCANNING ENGINE: v1.0.0</span>
            <span>MODEL: TF-IDF + RANDOM FOREST / XGBOOST</span>
            <span className="hidden sm:inline">PROTECTING DIGITAL IDENTITIES</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
