import React, { useState, useEffect, useRef } from 'react';
import { Cpu, AlertTriangle, ShieldCheck, ShieldAlert, Sparkles, Terminal } from 'lucide-react';
import { scanService } from '../services/api';

const RealTimeScan = () => {
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState({
    prediction: 'legitimate',
    confidence: 0.0,
    risk_level: 'Low',
    indicators: []
  });
  const [isTyping, setIsTyping] = useState(false);
  const debounceTimerRef = useRef(null);

  // Trigger analysis when input text changes (debounced)
  useEffect(() => {
    if (!inputText.trim()) {
      setAnalysis({
        prediction: 'legitimate',
        confidence: 0.0,
        risk_level: 'Low',
        indicators: []
      });
      setIsTyping(false);
      return;
    }

    setIsTyping(true);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const data = await scanService.predictEmail(inputText);
        setAnalysis(data);
      } catch (err) {
        console.error("Real-time scan API error:", err);
      } finally {
        setIsTyping(false);
      }
    }, 400); // 400ms debounce delay

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputText]);

  const getMeterColor = () => {
    if (analysis.prediction === 'phishing') {
      return analysis.confidence > 0.8 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-red-400';
    }
    return 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]';
  };

  const getCardBorder = () => {
    if (analysis.prediction === 'phishing') return 'border-red-950 glow-card-red';
    if (inputText.trim() && analysis.prediction === 'legitimate') return 'border-green-950 glow-card-green';
    return 'border-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Cpu className="text-cyan-400 h-8 w-8 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
          Real-Time Threat Sandbox
        </h1>
        <p className="text-gray-400 text-xs mt-1">Start typing content in the interactive terminal. The neural network will inspect indicators and compute hazard coefficients on-the-fly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Terminal Text Input */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-lg overflow-hidden border border-gray-800">
            {/* Terminal Header */}
            <div className="bg-gray-950 px-4 py-2 border-b border-gray-950 flex items-center justify-between text-xs font-mono text-gray-500">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-cyan-500" />
                <span>PHISHGUARD_AI_SANDBOX.EXE</span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/30"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/30"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/30"></span>
              </div>
            </div>
            {/* Terminal Input area */}
            <div className="p-4 bg-gray-950/40 relative">
              <textarea
                rows="12"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full bg-transparent text-gray-200 border-none outline-none focus:ring-0 text-sm font-mono transition resize-none leading-relaxed"
                placeholder="Type your message body draft here. E.g. 'URGENT: Click here to verify your account credentials now!'..."
              ></textarea>
              
              {isTyping && (
                <div className="absolute right-4 bottom-4 flex items-center gap-2 text-cyan-400 text-xs font-mono bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded">
                  <Sparkles className="h-3 w-3 animate-spin" />
                  <span>COMPUTING COEFFICIENTS...</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs font-mono text-gray-500">
            <span>KEYLOGGER INTERCEPTOR STATUS: ACTIVE</span>
            <span>LENGTH: {inputText.length} CHARS</span>
          </div>
        </div>

        {/* Real-time Telemetry Screen */}
        <div className="lg:col-span-1">
          <div className={`glass-panel p-6 rounded-lg border transition-all duration-300 ${getCardBorder()}`}>
            <h2 className="text-sm font-bold font-mono text-gray-400 mb-6 uppercase tracking-wider text-center border-b border-gray-800/80 pb-3">
              Telemetry Readout
            </h2>

            <div className="space-y-6 font-mono">
              {/* Threat classification indicator */}
              <div className="text-center">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">LIVE CLASS</span>
                
                {inputText.trim() ? (
                  analysis.prediction === 'phishing' ? (
                    <div className="flex flex-col items-center">
                      <ShieldAlert className="h-14 w-14 text-red-500 mb-2 filter drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
                      <span className="text-lg font-bold text-red-400">PHISHING ATTACK</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <ShieldCheck className="h-14 w-14 text-green-500 mb-2" />
                      <span className="text-lg font-bold text-green-400">LEGITIMATE</span>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="h-14 w-14 border border-gray-800 border-dashed rounded-full flex items-center justify-center text-gray-700 font-bold mb-2">
                      ?
                    </span>
                    <span className="text-sm text-gray-500 uppercase">AWAITING FEED</span>
                  </div>
                )}
              </div>

              {/* Real-time Probability Bar */}
              <div className="border-t border-gray-800/80 pt-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-400">THREAT PROBABILITY</span>
                  <span className="text-white font-extrabold">
                    {inputText.trim() 
                      ? `${(analysis.prediction === 'phishing' ? analysis.confidence * 100 : (1 - analysis.confidence) * 100).toFixed(1)}%` 
                      : '0.0%'
                    }
                  </span>
                </div>
                <div className="w-full bg-gray-900 h-2.5 rounded overflow-hidden p-[1px] border border-gray-800">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${getMeterColor()}`} 
                    style={{ 
                      width: inputText.trim() 
                        ? `${analysis.prediction === 'phishing' ? analysis.confidence * 100 : (1 - analysis.confidence) * 100}%` 
                        : '0%' 
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs border-y border-gray-800/80 py-3">
                <span className="text-gray-400">THREAT LEVEL</span>
                <span className={`text-[10px] font-bold uppercase ${analysis.prediction === 'phishing' ? 'text-red-400' : 'text-green-400'}`}>
                  {inputText.trim() ? analysis.risk_level : 'NONE'}
                </span>
              </div>

              {/* Real-time warning items list */}
              <div className="space-y-2">
                <span className="text-[9px] text-gray-500 uppercase tracking-wider block">Real-time Warning Tags</span>
                {inputText.trim() && analysis.indicators.length > 0 ? (
                  <ul className="space-y-1">
                    {analysis.indicators.map((ind, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-xs text-gray-300">
                        <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
                        <span className="truncate">{ind}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-[10px] text-gray-600 italic block">No active threats detected.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeScan;
