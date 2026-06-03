import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title 
} from 'chart.js';
import { Shield, ShieldAlert, ShieldCheck, HelpCircle, Activity, ArrowRight, Mail, Globe, Search } from 'lucide-react';
import { dashboardService } from '../services/api';

// Register ChartJS modules
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_scans: 0,
    phishing_detected: 0,
    safe_messages: 0,
    detection_accuracy: 99.7,
    recent_scans: []
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsRes = await dashboardService.getStats();
      const analyticsRes = await dashboardService.getAnalytics();
      setStats(statsRes);
      setAnalytics(analyticsRes);
    } catch (err) {
      console.error("Error loading dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm font-mono">RETRIEVING SECURITY TELEMETRY...</p>
      </div>
    );
  }

  // Chart 1: Threat distribution data
  const doughnutData = {
    labels: analytics?.threat_distribution?.map(t => t.name) || [],
    datasets: [{
      data: analytics?.threat_distribution?.map(t => t.value) || [],
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',  // Red for Phishing
        'rgba(245, 158, 11, 0.7)', // Orange for Suspicious
        'rgba(34, 197, 94, 0.7)'   // Green for Legitimate
      ],
      borderColor: [
        'rgba(239, 68, 68, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(34, 197, 94, 1)'
      ],
      borderWidth: 1
    }]
  };

  // Chart 2: Scan type distribution data
  const barData = {
    labels: analytics?.type_distribution?.map(t => t.name) || [],
    datasets: [{
      label: 'Volume',
      data: analytics?.type_distribution?.map(t => t.value) || [],
      backgroundColor: [
        'rgba(6, 182, 212, 0.6)',  // Cyan
        'rgba(59, 130, 246, 0.6)'  // Blue
      ],
      borderColor: [
        'rgba(6, 182, 212, 1)',
        'rgba(59, 130, 246, 1)'
      ],
      borderWidth: 1
    }]
  };

  // Chart 3: Trends data
  const lineData = {
    labels: analytics?.trends?.map(t => t.date) || [],
    datasets: [
      {
        label: 'Phishing',
        data: analytics?.trends?.map(t => t.Phishing) || [],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Safe Scans',
        data: analytics?.trends?.map(t => t.Safe) || [],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af', // Gray 400
          font: { family: 'Courier New, monospace', size: 11 }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(75, 85, 99, 0.1)' },
        ticks: { color: '#9ca3af', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(75, 85, 99, 0.1)' },
        ticks: { color: '#9ca3af', font: { size: 10 } }
      }
    }
  };

  const badgeClass = (res) => {
    if (res === 'phishing') return 'bg-red-950/40 text-red-400 border border-red-900/50';
    if (res === 'suspicious') return 'bg-amber-950/40 text-amber-400 border border-amber-900/50';
    return 'bg-green-950/40 text-green-400 border border-green-900/50';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Activity className="text-cyan-400 h-8 w-8 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
            Security Control Room
          </h1>
          <p className="text-gray-400 text-xs mt-1">Real-time monitoring telemetry and machine learning accuracy tracking</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Link
            to="/email-scan"
            className="flex-1 sm:flex-initial bg-cyan-500 hover:bg-cyan-600 text-gray-950 font-bold px-4 py-2 rounded text-xs transition duration-300 font-mono tracking-widest text-center"
          >
            Scan Content
          </Link>
          <button 
            onClick={fetchDashboardData} 
            className="flex-1 sm:flex-initial glass-panel hover:bg-gray-800 text-white font-medium px-4 py-2 rounded border border-gray-800 text-xs transition cursor-pointer font-mono"
          >
            Refresh Logs
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Scans Run", val: stats.total_scans, icon: <Search className="text-cyan-400" /> },
          { title: "Phishing Detected", val: stats.phishing_detected, icon: <ShieldAlert className="text-red-400" />, isPhish: true },
          { title: "Legitimate / Safe", val: stats.safe_messages, icon: <ShieldCheck className="text-green-400" /> },
          { title: "Model Accuracy", val: `${stats.detection_accuracy}%`, icon: <HelpCircle className="text-cyan-400" /> }
        ].map((card, idx) => (
          <div key={idx} className={`glass-panel p-6 rounded-lg ${card.isPhish && stats.phishing_detected > 0 ? 'glow-card-red' : 'glow-card-cyan'}`}>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">{card.title}</span>
              {card.icon}
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white font-mono">{card.val}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="glass-panel p-6 rounded-lg col-span-1">
          <h2 className="text-sm font-bold font-mono text-gray-400 mb-6 uppercase tracking-wider">Threat Types Ratio</h2>
          <div className="h-64 relative">
            <Doughnut data={doughnutData} options={{...chartOptions, cutout: '70%', maintainAspectRatio: false}} />
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-lg col-span-1">
          <h2 className="text-sm font-bold font-mono text-gray-400 mb-6 uppercase tracking-wider">Scan Distribution</h2>
          <div className="h-64 relative">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-lg col-span-1">
          <h2 className="text-sm font-bold font-mono text-gray-400 mb-6 uppercase tracking-wider">7-Day Threat Vector Trend</h2>
          <div className="h-64 relative">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="glass-panel p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold font-mono text-gray-400 uppercase tracking-wider">Recent Local Logs</h2>
          <Link to="/email-scan" className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 font-mono">
            New Scan
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {stats.recent_scans.length > 0 ? (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-xs font-mono uppercase">
                  <th className="py-3 px-4 font-normal">Input Type</th>
                  <th className="py-3 px-4 font-normal">Content Checked</th>
                  <th className="py-3 px-4 font-normal text-center">Threat Classification</th>
                  <th className="py-3 px-4 font-normal text-right">Risk Score</th>
                  <th className="py-3 px-4 font-normal text-right">Logged Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40 text-gray-300 font-mono text-xs">
                {stats.recent_scans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-800/10 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-2">
                      {scan.input_type === 'email' ? (
                        <>
                          <Mail className="h-3.5 w-3.5 text-cyan-400" />
                          <span>Email</span>
                        </>
                      ) : (
                        <>
                          <Globe className="h-3.5 w-3.5 text-blue-400" />
                          <span>URL</span>
                        </>
                      )}
                    </td>
                    <td className="py-3 px-4 truncate max-w-xs">{scan.input_content}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${badgeClass(scan.result)}`}>
                        {scan.result}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-white">
                      {(scan.risk_score * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-4 text-right text-gray-500">
                      {new Date(scan.created_at).toLocaleDateString()} {new Date(scan.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-sm font-mono">No scans logged under your operator license yet.</p>
              <Link to="/email-scan" className="mt-4 inline-block text-cyan-400 border border-cyan-800/30 bg-cyan-950/20 hover:bg-cyan-950/50 px-4 py-2 rounded text-xs font-mono">
                Initiate First Scan
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
