import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  RefreshCw, 
  Download, 
  Database, 
  Clock, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { adminService } from '../services/api';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('retrain'); // 'retrain', 'logs', 'users'
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState([]);
  
  const [retraining, setRetraining] = useState(false);
  const [retrainResult, setRetrainResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [usersData, logsData, metricsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getLogs(),
        adminService.getMetricsList()
      ]);
      
      setUsers(usersData);
      setLogs(logsData);
      setMetrics(metricsData);
    } catch (err) {
      setError('Failed to fetch administrator records. Make sure you are logged in as an administrator.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRetrain = async () => {
    setRetraining(true);
    setRetrainResult(null);
    setError('');

    try {
      const data = await adminService.retrainModel();
      setRetrainResult(data);
      // Refresh metrics list & logs
      const [metricsData, logsData] = await Promise.all([
        adminService.getMetricsList(),
        adminService.getLogs()
      ]);
      setMetrics(metricsData);
      setLogs(logsData);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during retraining.');
    } finally {
      setRetraining(false);
    }
  };

  const handleCsvExport = () => {
    // Navigate browser to download CSV file
    window.open(adminService.downloadScansCsvUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm font-mono">LOADING CONTROL CORE SYSTEM...</p>
      </div>
    );
  }

  const badgeClass = (res) => {
    if (res === 'phishing') return 'bg-red-950/40 text-red-400 border border-red-900/50';
    if (res === 'suspicious') return 'bg-amber-950/40 text-amber-400 border border-amber-900/50';
    return 'bg-green-950/40 text-green-400 border border-green-900/50';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <UserCheck className="text-red-500 h-8 w-8 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
          Core Administrative Console
        </h1>
        <p className="text-gray-400 text-xs mt-1">Authorized access only. Retrain classification weights, audit security scans, and export threat databases.</p>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded text-sm flex items-center gap-2 mb-6">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-800 mb-8 font-mono text-xs">
        <button
          onClick={() => setActiveTab('retrain')}
          className={`px-6 py-3 font-medium transition cursor-pointer flex items-center gap-2 border-b-2 ${
            activeTab === 'retrain' ? 'border-red-500 text-red-400 bg-red-950/10' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Neural Engine Retraining
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-6 py-3 font-medium transition cursor-pointer flex items-center gap-2 border-b-2 ${
            activeTab === 'logs' ? 'border-red-500 text-red-400 bg-red-950/10' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Clock className="h-4 w-4" />
          Global Audit Logs
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-medium transition cursor-pointer flex items-center gap-2 border-b-2 ${
            activeTab === 'users' ? 'border-red-500 text-red-400 bg-red-950/10' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          Operator registry ({users.length})
        </button>
      </div>

      {/* TAB CONTENT: RETRAIN */}
      {activeTab === 'retrain' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Action Trigger Card */}
          <div className="glass-panel p-6 rounded-lg glow-card-red flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-white font-bold text-lg">Retrain Phishing Classifiers</h2>
              <p className="text-gray-400 text-xs leading-relaxed max-w-xl">
                Re-load synthetic email templates and URL properties, execute preprocessing pipelines, fit new Logistic Regression, Random Forest, and XGBoost classifiers, evaluate metrics, and hot-reload weights.
              </p>
            </div>
            <button
              onClick={handleRetrain}
              disabled={retraining}
              className="w-full md:w-auto bg-red-500 hover:bg-red-600 disabled:bg-red-900 disabled:text-gray-400 text-gray-950 font-bold px-8 py-3.5 rounded text-xs transition duration-300 font-mono tracking-widest flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${retraining ? 'animate-spin' : ''}`} />
              {retraining ? 'RETRAINING NEURAL NETWORKS...' : 'TRIGGER RETRAINING CYCLE'}
            </button>
          </div>

          {/* Retrain Result Banner */}
          {retrainResult && (
            <div className="bg-green-950/30 border border-green-800/50 p-6 rounded-lg font-mono text-xs space-y-4">
              <div className="flex items-center gap-2 text-green-400 font-bold">
                <CheckCircle className="h-5 w-5" />
                <span>RETRAINING CYCLE COMPLETED & MEMORY FLUSHED SUCCESSFULLY</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                <div>
                  <span className="text-gray-500 uppercase block mb-1">BEST EMAIL MODEL SELECTED</span>
                  <span className="text-white font-extrabold">{retrainResult.best_email_model}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase block mb-1">BEST URL MODEL SELECTED</span>
                  <span className="text-white font-extrabold">{retrainResult.best_url_model}</span>
                </div>
              </div>
            </div>
          )}

          {/* Metrics comparison table */}
          <div className="glass-panel p-6 rounded-lg">
            <h3 className="text-sm font-bold font-mono text-gray-400 mb-6 uppercase tracking-wider">Metrics Analytics History</h3>
            
            <div className="overflow-x-auto">
              {metrics.length > 0 ? (
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500 text-xs font-mono uppercase">
                      <th className="py-3 px-4 font-normal">Model Type</th>
                      <th className="py-3 px-4 font-normal">Algorithm</th>
                      <th className="py-3 px-4 font-normal text-right">Accuracy</th>
                      <th className="py-3 px-4 font-normal text-right">Precision</th>
                      <th className="py-3 px-4 font-normal text-right">Recall</th>
                      <th className="py-3 px-4 font-normal text-right">F1-Score</th>
                      <th className="py-3 px-4 font-normal text-center">Status</th>
                      <th className="py-3 px-4 font-normal text-right">Trained At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/40 text-gray-300 font-mono text-xs">
                    {metrics.map((m) => (
                      <tr key={m.id} className={`hover:bg-gray-800/10 transition-colors ${m.is_active ? 'bg-cyan-950/10' : ''}`}>
                        <td className="py-3 px-4 uppercase text-cyan-400">{m.model_type} classifier</td>
                        <td className="py-3 px-4 font-bold text-white">{m.algorithm}</td>
                        <td className="py-3 px-4 text-right">{(m.accuracy * 100).toFixed(2)}%</td>
                        <td className="py-3 px-4 text-right">{(m.precision * 100).toFixed(2)}%</td>
                        <td className="py-3 px-4 text-right">{(m.recall * 100).toFixed(2)}%</td>
                        <td className="py-3 px-4 text-right font-extrabold text-white">{(m.f1_score * 100).toFixed(2)}%</td>
                        <td className="py-3 px-4 text-center">
                          {m.is_active ? (
                            <span className="inline-block px-2 py-0.5 rounded text-[8px] uppercase font-bold bg-green-950 text-green-400 border border-green-900/50">
                              ACTIVE WEIGHTS
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-[8px] uppercase font-bold bg-gray-900 text-gray-500 border border-gray-800">
                              Archived
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-500">
                          {new Date(m.trained_at).toLocaleDateString()} {new Date(m.trained_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-10 text-gray-500 font-mono text-xs">
                  No retraining metrics stored in database yet. Trigger training above.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="glass-panel p-6 rounded-lg animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-sm font-bold font-mono text-gray-400 uppercase tracking-wider">System-Wide Security Logs</h3>
            <button
              onClick={handleCsvExport}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded text-xs transition duration-300 font-mono tracking-widest flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4" />
              EXPORT LOGS TO CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            {logs.length > 0 ? (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500 text-xs font-mono uppercase">
                    <th className="py-3 px-4 font-normal">Operator</th>
                    <th className="py-3 px-4 font-normal">Type</th>
                    <th className="py-3 px-4 font-normal">Content Sample</th>
                    <th className="py-3 px-4 font-normal text-center">Threat Class</th>
                    <th className="py-3 px-4 font-normal text-right">Risk Score</th>
                    <th className="py-3 px-4 font-normal text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/40 text-gray-300 font-mono text-xs">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-800/10 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white">{log.user_name}</span>
                          <span className="text-[10px] text-gray-500">{log.user_email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-cyan-400 uppercase font-mono">{log.input_type}</td>
                      <td className="py-3 px-4 truncate max-w-sm">{log.input_content}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase font-bold ${badgeClass(log.result)}`}>
                          {log.result}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-white">{(log.risk_score * 100).toFixed(0)}%</td>
                      <td className="py-3 px-4 text-right text-gray-500">
                        {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10 text-gray-500 font-mono text-xs">
                No scans executed on the system logs.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: OPERATORS */}
      {activeTab === 'users' && (
        <div className="glass-panel p-6 rounded-lg animate-fadeIn">
          <h3 className="text-sm font-bold font-mono text-gray-400 mb-6 uppercase tracking-wider">Registered Control Licenses</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-xs font-mono uppercase">
                  <th className="py-3 px-4 font-normal">Operator ID</th>
                  <th className="py-3 px-4 font-normal">Name</th>
                  <th className="py-3 px-4 font-normal">Email Address</th>
                  <th className="py-3 px-4 font-normal">Control Role</th>
                  <th className="py-3 px-4 font-normal text-right">License Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40 text-gray-300 font-mono text-xs">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/10 transition-colors">
                    <td className="py-3 px-4 font-mono text-gray-500">#UID-00{user.id}</td>
                    <td className="py-3 px-4 font-bold text-white">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                        user.role === 'admin' 
                          ? 'bg-red-950/40 text-red-400 border border-red-900/50 shadow-[0_0_8px_rgba(239,68,68,0.15)]' 
                          : 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/50'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()} {new Date(user.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
