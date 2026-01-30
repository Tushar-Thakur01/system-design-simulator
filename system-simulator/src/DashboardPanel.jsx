import React from 'react';
import { BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

const COLORS = ['#10B981', '#EF4444']; 

export default function DashboardPanel({ stats, logs, theme }) {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-900/95 border-gray-700 text-white' : 'bg-white/95 border-gray-200 text-gray-800';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';
  const titleColor = isDark ? 'text-gray-400' : 'text-gray-500';

  const errorData = [
    { name: 'Success', value: 100 - (stats.errorRate || 0) },
    { name: 'Error', value: stats.errorRate || 0 },
  ];

  return (
    <div className={`absolute right-0 top-0 h-full w-80 border-l p-4 overflow-y-auto backdrop-blur-sm shadow-2xl transition-colors duration-500 ${bgColor}`}>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Activity className="text-blue-500" /> System Metrics
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="RPS" value={stats.throughput} icon={<Zap size={14} />} color="text-yellow-500" bg={cardBg} />
        <StatCard label="Latency" value={`${stats.avgLatency}ms`} icon={<Activity size={14} />} color="text-blue-500" bg={cardBg} />
        <StatCard label="Errors" value={`${stats.errorRate}%`} icon={<AlertTriangle size={14} />} color="text-red-500" bg={cardBg} />
        <StatCard label="Health" value="Good" icon={<CheckCircle size={14} />} color="text-green-500" bg={cardBg} />
      </div>

      <div className="mb-6">
        <h3 className={`text-xs uppercase font-bold mb-2 ${titleColor}`}>Latency Distribution</h3>
        <div className={`h-32 rounded p-2 ${cardBg}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.history}>
              <Bar dataKey="latency" fill="#3B82F6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex-1 min-h-[200px] flex flex-col">
        <h3 className={`text-xs uppercase font-bold mb-2 ${titleColor}`}>Live System Logs</h3>
        <div className={`flex-1 rounded p-2 font-mono text-[10px] overflow-hidden relative ${isDark ? 'bg-black' : 'bg-gray-100 border border-gray-300'}`}>
          <div className="absolute bottom-0 left-0 w-full max-h-full overflow-y-auto p-2 space-y-1">
            {logs.slice(-15).map((log, i) => (
              <div key={i} className={`truncate ${log.type === 'error' ? 'text-red-500 font-bold' : (isDark ? 'text-green-400' : 'text-green-700')}`}>
                <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log.msg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, icon, color, bg }) => (
  <div className={`${bg} p-3 rounded border`}>
    <div className={`flex items-center gap-1 text-xs ${color} mb-1 font-bold`}>
      {icon} {label}
    </div>
    <div className="text-xl font-mono font-bold">{value}</div>
  </div>
);