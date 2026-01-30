import { useState, useEffect } from 'react';

export const useSimulation = (nodes, edges, isRunning = true) => {
  const [packets, setPackets] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ 
    throughput: 0, 
    avgLatency: 0, 
    errorRate: 0, 
    history: [] // For the bar chart
  });

  // Helper to add log
  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, { msg, type }].slice(-20)); // Keep last 20
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setPackets((currentPackets) => {
        let newPackets = [];
        let completedRequests = 0;
        let batchLatency = 0;
        let errors = 0;

        // 1. Process Packets
        currentPackets.forEach((packet) => {
          const targetNode = nodes.find((n) => n.id === packet.targetId);
          
          if (!targetNode) return; // Node deleted

          // Logic: Move Packet
          if (packet.progress < 100) {
            newPackets.push({ ...packet, progress: packet.progress + 4 });
          } else {
            // Arrived at Node
            if (targetNode.data.isDead) {
              errors++;
              addLog(`Connection Refused: ${targetNode.data.label}`, 'error');
              return; // Packet dies
            }

            // Simulate "Random Error %" (Requirement 2)
            if (Math.random() < 0.05) { // 5% random failure chance
                errors++;
                addLog(`500 Internal Error: ${targetNode.data.label}`, 'error');
                return;
            }

            // Route to next
            const outgoingEdges = edges.filter((e) => e.source === packet.targetId);
            if (outgoingEdges.length > 0) {
              // Cache Logic
              if (targetNode.data.label.includes('Cache') && Math.random() < 0.8) {
                addLog(`Cache HIT: ${targetNode.data.label}`);
                completedRequests++;
                return; 
              }

              outgoingEdges.forEach((edge) => {
                newPackets.push({
                  id: Math.random().toString(),
                  sourceId: edge.source,
                  targetId: edge.target,
                  progress: 0,
                });
              });
              
              // Only log "Routing" occasionally to avoid spam
              if(Math.random() < 0.1) addLog(`Processed by ${targetNode.data.label}`);
              
            } else {
               // End of line (Database or final node)
               completedRequests++;
               batchLatency += targetNode.data.latency || 10;
               addLog(`Request Completed: ${targetNode.data.label}`);
            }
          }
        });

        // 2. Generate Traffic
        const userNode = nodes.find(n => n.type === 'input');
        if (userNode) {
            const userEdges = edges.filter(e => e.source === userNode.id);
            userEdges.forEach(edge => {
                if (Math.random() < 0.4) { // Traffic Rate
                    newPackets.push({
                        id: Math.random().toString(),
                        sourceId: edge.source,
                        targetId: edge.target,
                        progress: 0,
                    });
                }
            });
        }

        // 3. Update Stats
        if (completedRequests > 0 || errors > 0) {
            setStats(prev => {
                const newHistory = [...prev.history, { latency: batchLatency / (completedRequests || 1) }].slice(-20);
                return {
                    throughput: prev.throughput + completedRequests,
                    avgLatency: Math.round((prev.avgLatency + (batchLatency / (completedRequests || 1))) / 2),
                    errorRate: Math.round((errors / (completedRequests + errors)) * 100) || 0,
                    history: newHistory
                };
            });
        }

        return newPackets;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [nodes, edges, isRunning]);

  return { packets, stats, logs };
};