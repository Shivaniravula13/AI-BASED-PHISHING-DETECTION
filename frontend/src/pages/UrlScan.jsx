import React, { useState } from 'react';
import { Globe, AlertTriangle, ShieldCheck, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import { scanService } from '../services/api';

const UrlScan = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await scanService.predictUrl(url);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during URL scanning. Please check your URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMeterPosition = (pred, confidence) => {
    // Return percentage width for the risk meter needle
    if (pred === 'legitimate') return confidence * 33.3; // Safe matches 0-33.3% range
    if (pred === 'suspicious') return 33.3 + (confidence * 33.3); // Suspicious matches 33.3-66.6% range
    return 66.6 + (confidence * 33.4); // Phishing matches 66.6-100% range
  };

  const getMeterColor = (pred) => {
    if (pred === 'phishing') return 'from-red-500 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
    if (pred === 'suspicious') return 'from-amber-500 to-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.4)]';
    return 'from-green-500 to-green-600 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
  };

  const getRiskLabel = (pred) => {
    if (pred === 'phishing') return 'PHISHING SITE';
    if (pred === 'suspicious') return 'SUSPICIOUS DOMAIN';
    return 'SAFE DOMAIN';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Globe className="text-cyan-400 h-8 w-8 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
          URL Threat Inspector
        </h1>
        <p className="text-gray-400 text-xs mt-1">Submit links to extract syntax patterns, HTTPS protocol safety, length, and spoofing keywords.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-lg">
            <form onSubmit={handleScan} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">Inspect Link URL</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-gray-950/80 border border-gray-800 rounded pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 text-sm font-mono transition"
                    placeholder="example-secure-login-chase.com/verify-account"
                  />
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 h-4.5 w-4.5" />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="px-4 py-2 border border-gray-800 rounded text-xs text-gray-400 hover:text-white transition cursor-pointer font-mono"
                >
                  Clear URL
                </button>
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-900 disabled:text-gray-400 text-gray-950 font-bold px-6 py-2 rounded text-xs transition duration-300 font-mono tracking-widest uppercase cursor-pointer"
                >
                  {loading ? 'CALCULATING ENTROPY...' : 'LAUNCH ANALYSIS'}
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
            <div className={`glass-panel p-6 rounded-lg border transition-all duration-500 ${result.prediction === 'phishing' ? 'glow-card-red border-red-950/60' : result.prediction === 'suspicious' ? 'glow-card-red border-amber-950/60' : 'glow-card-green border-green-950/60'}`}>
              <div className="text-center mb-6">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2">Inspect Result</span>
                
                {result.prediction === 'phishing' ? (
                  <div className="flex flex-col items-center">
                    <ShieldAlert className="h-16 w-16 text-red-500 filter drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] mb-3 animate-pulse" />
                    <span className="text-xl font-extrabold text-red-400 uppercase tracking-wider font-mono">{getRiskLabel(result.prediction)}</span>
                  </div>
                ) : result.prediction === 'suspicious' ? (
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="h-16 w-16 text-amber-500 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] mb-3" />
                    <span className="text-xl font-extrabold text-amber-500 uppercase tracking-wider font-mono">{getRiskLabel(result.prediction)}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ShieldCheck className="h-16 w-16 text-green-500 filter drop-shadow-[0_0_10px_rgba(34,197,94,0.5)] mb-3" />
                    <span className="text-xl font-extrabold text-green-400 uppercase tracking-wider font-mono">{getRiskLabel(result.prediction)}</span>
                  </div>
                )}
              </div>

              {/* Risk Meter Gauge */}
              <div className="space-y-6 font-mono">
                <div className="border-t border-gray-800/80 pt-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">THREAT LEVEL RISK METER</span>
                    <span className="text-white font-extrabold">{(result.confidence * 100).toFixed(0)}%</span>
                  </div>
                  
                  {/* Visual risk gradient meter */}
                  <div className="relative w-full h-3.5 bg-gray-950 border border-gray-800 rounded-full p-[2px] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-amber-500 to-red-500 opacity-20"></div>
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ${getMeterColor(result.prediction)}`}
                      style={{ width: `${getMeterPosition(result.prediction, result.confidence)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[8px] text-gray-500 mt-1 uppercase">
                    <span>Safe</span>
                    <span>Suspicious</span>
                    <span>Phishing</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs border-y border-gray-800/80 py-3">
                  <span className="text-gray-400">DECISION WEIGHT</span>
                  <span className="text-white font-extrabold">{(result.confidence * 100).toFixed(1)}%</span>
                </div>

                {/* Explanation indicators */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Inspected URL Properties</span>
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
                      <span>URL structure matches compliant domain profiling benchmarks.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-lg text-center border border-gray-850 flex flex-col items-center justify-center min-h-[300px]">
              <Info className="h-10 w-10 text-cyan-800 mb-3" />
              <p className="text-gray-500 text-xs font-mono">Waiting for url payload...</p>
              <p className="text-gray-600 text-[10px] mt-1 font-mono max-w-[200px]">Submit website URL on the left to trigger the feature estimator.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UrlScan;
