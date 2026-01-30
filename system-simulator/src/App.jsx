import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, { ReactFlowProvider, Background, Controls, applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { Save, Upload, Play, Pause, Sun, Moon, LayoutTemplate } from 'lucide-react';

import ServerNode from './ServerNode';
import Sidebar from './Sidebar';
import DashboardPanel from './DashboardPanel';
import { useSimulation } from './useSimulation';
import { templates } from './templates';

// Define Node Types
const nodeTypes = { 
  server: ServerNode, 
  input: ServerNode // Use our custom node even for inputs so they look consistent
};

export default function App() {
  return (
    <ReactFlowProvider>
      <SystemSimulator />
    </ReactFlowProvider>
  );
}

function SystemSimulator() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isRunning, setIsRunning] = useState(true);
  const [theme, setTheme] = useState('dark'); // Default Dark
  const [showTemplates, setShowTemplates] = useState(false);
  
  const { project } = useReactFlow();
  const { packets, stats, logs } = useSimulation(nodes, edges, isRunning);

  // Load Default Template on Start
  useEffect(() => {
    loadTemplate('default');
  }, []);

  // --- Actions ---

  const loadTemplate = (key) => {
    const template = templates[key] || templates.default;
    // Inject kill handlers and theme into nodes
    const loadedNodes = template.nodes.map(n => ({
      ...n,
      data: { ...n.data, onKill: handleKill, theme }
    }));
    setNodes(loadedNodes);
    setEdges(template.edges);
    setShowTemplates(false);
  };

  const handleKill = useCallback((id) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          const isDead = !node.data.isDead;
          return { ...node, data: { ...node.data, isDead, health: isDead ? 0 : 100 } };
        }
        return node;
      })
    );
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    // Update existing nodes with new theme
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, theme: newTheme } })));
  };

  // --- Drag & Drop ---
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/label');

      if (!type) return;

      const position = project({
        x: event.clientX - reactFlowWrapper.current.getBoundingClientRect().left,
        y: event.clientY - reactFlowWrapper.current.getBoundingClientRect().top,
      });

      const newNode = {
        id: Math.random().toString(),
        type: 'server',
        position,
        data: { label, type, health: 100, latency: 20, onKill: handleKill, theme },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, theme]
  );

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), []);

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-500`}>
      
      {/* Sidebar with Theme Prop */}
      <Sidebar theme={theme} />
      
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        
        {/* Top Bar Controls */}
        <div className="absolute top-4 left-4 z-50 flex gap-2">
          {/* Template Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowTemplates(!showTemplates)} 
              className={`p-2 rounded shadow flex items-center gap-2 font-bold ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
            >
              <LayoutTemplate size={18} /> Templates
            </button>
            
            {showTemplates && (
              <div className={`absolute top-12 left-0 w-48 rounded shadow-xl p-2 flex flex-col gap-1 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                <button onClick={() => loadTemplate('netflix')} className="text-left px-4 py-2 hover:bg-red-500 hover:text-white rounded transition text-red-500 font-bold">Netflix</button>
                <button onClick={() => loadTemplate('uber')} className="text-left px-4 py-2 hover:bg-black hover:text-white rounded transition font-bold">Uber</button>
                <button onClick={() => loadTemplate('default')} className="text-left px-4 py-2 hover:bg-blue-500 hover:text-white rounded transition font-bold">Default</button>
              </div>
            )}
          </div>

          <button onClick={() => setIsRunning(!isRunning)} className={`p-2 rounded shadow text-white transition-all ${isRunning ? 'bg-orange-500' : 'bg-green-500'}`}>
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button onClick={toggleTheme} className={`p-2 rounded shadow transition-all ${theme === 'dark' ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'}`}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          fitView
        >
          <Background color={theme === 'dark' ? '#555' : '#aaa'} gap={20} />
          <Controls className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black'} />
          
          {/* PACKET LAYER */}
          {packets.map(packet => {
            const source = nodes.find(n => n.id === packet.sourceId);
            const target = nodes.find(n => n.id === packet.targetId);
            if(!source || !target) return null;
            
            // MATH FIX: Center of node is +128px (Node width 256 / 2)
            const x = source.position.x + (target.position.x - source.position.x) * (packet.progress / 100) + 128;
            // Y needs to account for Handle position (Source bottom, Target top)
            // Source is typically at Height (approx 150px?) let's estimate offset
            const y = source.position.y + (target.position.y - source.position.y) * (packet.progress / 100) + (packet.progress < 50 ? 50 : 0);

            // Dynamic Color based on Theme
            const packetColor = theme === 'dark' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-blue-600 shadow-[0_0_10px_#2563eb]';

            return (
              <div 
                key={packet.id} 
                className={`absolute w-3 h-3 rounded-full z-50 pointer-events-none transition-transform ${packetColor}`}
                style={{ transform: `translate(${x}px, ${y}px)` }} 
              />
            );
          })}
        </ReactFlow>
      </div>

      <DashboardPanel stats={stats} logs={logs} theme={theme} />
    </div>
  );
}