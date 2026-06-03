import React, { useState } from 'react';
import { Mail, AlertTriangle, ShieldCheck, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import { scanService } from '../services/api';

const EmailScan = () => {
  const [emailText, setEmailText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    if (!emailText.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await scanService.predictEmail(emailText);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during scanning. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    if (level === 'High') return 'text-red-400 border-red-950/60 bg-red-950/20';
    if (level === 'Medium') return 'text-amber-400 border-amber-950/60 bg-amber-950/20';
    return 'text-green-400 border-green-950/60 bg-green-950/20';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Mail className="text-cyan-400 h-8 w-8 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
          Email Phishing Analyzer
        </h1>
        <p className="text-gray-400 text-xs mt-1">Paste raw email message contents to analyze psychological urgency and trigger terms using NLP models.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-lg">
            <form onSubmit={handleScan} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">Email Body Content</label>
                <textarea
                  rows="10"
                  required
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  className="w-full bg-gray-950/80 border border-gray-800 rounded p-4 text-white focus:outline-none focus:border-cyan-500 text-sm font-mono transition resize-none leading-relaxed"
                  placeholder="Paste the full email text here, including header lines if available..."
                ></textarea>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setEmailText('')}
                  className="px-4 py-2 border border-gray-800 rounded text-xs text-gray-400 hover:text-white transition cursor-pointer font-mono"
                >
                  Clear Terminal
                </button>
                <button
                  type="submit"
                  disabled={loading || !emailText.trim()}
                  className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-900 disabled:text-gray-400 text-gray-950 font-bold px-6 py-2 rounded text-xs transition duration-300 font-mono tracking-widest uppercase cursor-pointer"
                >
                  {loading ? 'PROCESSING NLP FEATURES...' : 'LAUNCH ANALYSIS'}
                </button>
              </div>
            </form>
          </div>

          {error && (
            <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded text-sm flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Prediction Results */}
        <div className="lg:col-span-1">
          {result ? (
            <div className={`glass-panel p-6 rounded-lg border transition-all duration-500 ${result.prediction === 'phishing' ? 'glow-card-red border-red-950/60' : 'glow-card-green border-green-950/60'}`}>
              <div className="text-center mb-6">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2">Analysis Outcome</span>
                
                {result.prediction === 'phishing' ? (
                  <div className="flex flex-col items-center">
                    <ShieldAlert className="h-16 w-16 text-red-500 filter drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] mb-3 animate-bounce" />
                    <span className="text-2xl font-extrabold text-red-400 uppercase tracking-wider font-mono">PHISHING VECTORS</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ShieldCheck className="h-16 w-16 text-green-500 filter drop-shadow-[0_0_10px_rgba(34,197,94,0.5)] mb-3" />
                    <span className="text-2xl font-extrabold text-green-400 uppercase tracking-wider font-mono">LEGITIMATE</span>
                  </div>
                )}
              </div>

              {/* Progress Confidence bar */}
              <div className="space-y-4 font-mono">
                <div className="border-t border-gray-800/80 pt-4 flex justify-between text-xs">
                  <span className="text-gray-400">MODEL CONFIDENCE</span>
                  <span className="text-white font-extrabold">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-900 h-2 rounded overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${result.prediction === 'phishing' ? 'bg-red-500' : 'bg-green-500'}`} 
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-xs border-y border-gray-800/80 py-3">
                  <span className="text-gray-400">THREAT LEVEL</span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold border ${getRiskColor(result.risk_level)}`}>
                    {result.risk_level}
                  </span>
                </div>

                {/* Explanation indicators */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Detected Threat Elements</span>
                  {result.indicators.length > 0 ? (
                    <ul className="space-y-2">
                      {result.indicators.map((ind, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-300">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{ind}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-950 p-3 border border-gray-900 rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>No known threat indicators parsed. Message body appears compliant.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-lg text-center border border-gray-850 flex flex-col items-center justify-center min-h-[300px]">
              <Info className="h-10 w-10 text-cyan-800 mb-3" />
              <p className="text-gray-500 text-xs font-mono">Waiting for content payload...</p>
              <p className="text-gray-600 text-[10px] mt-1 font-mono max-w-[200px]">Submit email text on the left to trigger the feature extractor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailScan;
