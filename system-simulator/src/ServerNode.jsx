import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Activity, Server, Database, Shuffle, Globe, Cloud, Laptop } from 'lucide-react';

const getIcon = (type) => {
  switch (type) {
    case 'Load Balancer': return <Shuffle size={20} />;
    case 'Database': return <Database size={20} />;
    case 'Cache': return <Server size={20} />;
    case 'API Gateway': return <Cloud size={20} />;
    case 'User': return <Laptop size={20} />;
    default: return <Globe size={20} />;
  }
};

const ServerNode = ({ data, id }) => {
  const { label, type, health = 100, latency = 10, isDead = false, onKill, theme = 'dark' } = data;

  // Theme Styles
  const isDark = theme === 'dark';
  const baseBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-800';
  const subText = isDark ? 'text-gray-400' : 'text-gray-500';
  const headerBg = isDark ? 'bg-gray-700' : 'bg-gray-50';
  const borderColor = isDead 
    ? 'border-red-500 ring-2 ring-red-500' 
    : isDark ? 'border-gray-600' : 'border-gray-200';

  return (
    <div className={`shadow-2xl rounded-lg border-2 w-64 transition-all duration-300 ${baseBg} ${borderColor}`}>
      
      {/* Handles - Fixed size and location */}
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !w-4 !h-4 !-top-2" />
      
      {/* Header */}
      <div className={`flex items-center justify-between p-3 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'} ${headerBg} rounded-t-lg`}>
        <div className={`flex items-center gap-2 font-bold ${textColor}`}>
          {getIcon(type)}
          <span>{label}</span>
        </div>
        <button 
          className="text-[10px] px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 uppercase font-bold tracking-wider"
          onClick={() => onKill(id)} 
        >
          {isDead ? 'REVIVE' : 'KILL'}
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Health */}
        <div className="space-y-1">
          <div className={`flex justify-between text-xs font-semibold ${subText}`}>
            <span>Health</span>
            <span>{health}%</span>
          </div>
          <div className={`w-full rounded-full h-1.5 ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${isDead ? 'bg-red-500' : 'bg-green-500'}`} 
              style={{ width: `${health}%` }}
            />
          </div>
        </div>

        {/* Latency */}
        <div className={`flex items-center justify-between text-xs font-mono p-2 rounded ${isDark ? 'bg-gray-900 text-green-400' : 'bg-gray-100 text-green-600'}`}>
          <div className="flex items-center gap-1">
            <Activity size={12} /> Latency
          </div>
          <span>{isDead ? 'TIMEOUT' : `${latency}ms`}</span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !w-4 !h-4 !-bottom-2" />
    </div>
  );
};

export default memo(ServerNode);