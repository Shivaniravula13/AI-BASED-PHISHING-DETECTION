import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { authService } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please verify your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 scanline">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-950/10 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-xl z-10 border border-gray-800">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 font-bold text-2xl tracking-wider font-mono mb-4">
            <Shield className="h-8 w-8 text-cyan-400 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            <span>PHISHGUARD</span>
          </Link>
          <h2 className="text-xl font-bold text-white tracking-tight">Register Control License</h2>
          <p className="text-gray-400 text-xs mt-1">First registered user will be assigned full administrative role</p>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-3.5 rounded text-sm flex items-center gap-2 mb-6">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Operator Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm transition"
              placeholder="Alice Vance"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm transition"
              placeholder="operator@phishguard.ai"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Access Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded pl-4 pr-10 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm transition"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 disabled:text-gray-400 text-gray-950 font-bold py-3 rounded shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition cursor-pointer font-mono uppercase tracking-widest text-xs"
          >
            {loading ? 'Registering license...' : 'Create Control Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Login to license
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
