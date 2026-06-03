import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Menu, X, LogOut, LayoutDashboard, Mail, Globe, Cpu, UserCheck } from 'lucide-react';
import { authService } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, [location]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;
  
  const navLinkClass = (path) => `flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
    isActive(path)
      ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
      : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800/40'
  }`;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-cyan-400 font-bold text-lg tracking-wider font-mono">
              <Shield className="h-6 w-6 text-cyan-400 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              <span>PHISHGUARD <span className="text-red-500">AI</span></span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            
            {user && (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link to="/email-scan" className={navLinkClass('/email-scan')}>
                  <Mail className="h-4 w-4" />
                  Email Scan
                </Link>
                <Link to="/url-scan" className={navLinkClass('/url-scan')}>
                  <Globe className="h-4 w-4" />
                  URL Scan
                </Link>
                <Link to="/realtime-scan" className={navLinkClass('/realtime-scan')}>
                  <Cpu className="h-4 w-4" />
                  Live Scan
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className={navLinkClass('/admin')}>
                    <UserCheck className="h-4 w-4 text-red-400" />
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-xs font-mono bg-gray-900 border border-gray-800 px-2 py-1 rounded">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-950/20 border border-red-900/40 hover:bg-red-900/40 rounded transition-all duration-300 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-300 hover:text-white transition text-sm font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-cyan-500 hover:bg-cyan-600 text-gray-950 font-bold px-4 py-2 rounded text-sm transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-b border-gray-800/80 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
          >
            Home
          </Link>
          
          {user && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Dashboard
              </Link>
              <Link
                to="/email-scan"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Email Scan
              </Link>
              <Link
                to="/url-scan"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
              >
                URL Scan
              </Link>
              <Link
                to="/realtime-scan"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Live Scan
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-800"
                >
                  Admin Panel
                </Link>
              )}
            </>
          )}

          <div className="pt-4 pb-2 border-t border-gray-800">
            {user ? (
              <div className="px-3">
                <p className="text-gray-400 text-sm font-mono">{user.name}</p>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-400 bg-red-950/20 border border-red-900/40 rounded cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center text-gray-300 hover:text-white py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="text-center bg-cyan-500 text-gray-950 font-bold py-2 rounded"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
