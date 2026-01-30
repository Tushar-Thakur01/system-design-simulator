import React from 'react';
import { Server, Database, Shuffle, Globe, Cloud } from 'lucide-react';

export default function Sidebar() {
  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  const items = [
    { type: 'Load Balancer', label: 'Load Balancer', icon: <Shuffle size={16} /> },
    { type: 'Web Server', label: 'Web Server', icon: <Globe size={16} /> },
    { type: 'Cache', label: 'Redis Cache', icon: <Server size={16} /> },
    { type: 'Database', label: 'Postgres DB', icon: <Database size={16} /> },
    { type: 'API Gateway', label: 'API Gateway', icon: <Cloud size={16} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col gap-3">
      <h3 className="font-bold text-gray-700 mb-2">Component Library</h3>
      <p className="text-xs text-gray-500 mb-4">Drag these to the canvas</p>
      
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 p-3 bg-white border border-gray-300 rounded cursor-grab hover:bg-blue-50 hover:border-blue-400 transition shadow-sm"
          onDragStart={(event) => onDragStart(event, item.type, item.label)}
          draggable
        >
          <div className="text-blue-600">{item.icon}</div>
          <span className="text-sm font-medium text-gray-700">{item.label}</span>
        </div>
      ))}
    </aside>
  );
}