// A library of system architectures
export const templates = {
  default: {
    nodes: [
      { id: 'user', type: 'input', position: { x: 350, y: 0 }, data: { label: 'User Traffic', type: 'User' } },
      { id: 'lb', type: 'server', position: { x: 350, y: 150 }, data: { label: 'AWS ALB', type: 'Load Balancer' } },
      { id: 'web1', type: 'server', position: { x: 150, y: 350 }, data: { label: 'Web Server 01', type: 'Web Server' } },
      { id: 'web2', type: 'server', position: { x: 550, y: 350 }, data: { label: 'Web Server 02', type: 'Web Server' } },
      { id: 'db', type: 'server', position: { x: 350, y: 550 }, data: { label: 'Primary DB', type: 'Database' } },
    ],
    edges: [
      { id: 'e1', source: 'user', target: 'lb', animated: true },
      { id: 'e2', source: 'lb', target: 'web1', animated: true },
      { id: 'e3', source: 'lb', target: 'web2', animated: true },
      { id: 'e4', source: 'web1', target: 'db', animated: true },
      { id: 'e5', source: 'web2', target: 'db', animated: true },
    ]
  },
  netflix: {
    nodes: [
      { id: 'client', type: 'input', position: { x: 400, y: 0 }, data: { label: 'Netflix Client', type: 'User' } },
      { id: 'api', type: 'server', position: { x: 400, y: 150 }, data: { label: 'API Gateway (Zuul)', type: 'API Gateway' } },
      { id: 'video', type: 'server', position: { x: 150, y: 350 }, data: { label: 'Video Service', type: 'Web Server' } },
      { id: 'user', type: 'server', position: { x: 400, y: 350 }, data: { label: 'User Service', type: 'Web Server' } },
      { id: 'rec', type: 'server', position: { x: 650, y: 350 }, data: { label: 'Recommendation', type: 'Web Server' } },
      { id: 'cache', type: 'server', position: { x: 400, y: 500 }, data: { label: 'EVCache', type: 'Cache' } },
      { id: 'db', type: 'server', position: { x: 400, y: 650 }, data: { label: 'Cassandra DB', type: 'Database' } },
    ],
    edges: [
      { id: 'e1', source: 'client', target: 'api', animated: true },
      { id: 'e2', source: 'api', target: 'video', animated: true },
      { id: 'e3', source: 'api', target: 'user', animated: true },
      { id: 'e4', source: 'api', target: 'rec', animated: true },
      { id: 'e5', source: 'user', target: 'cache', animated: true },
      { id: 'e6', source: 'cache', target: 'db', animated: true },
    ]
  },
  uber: {
    nodes: [
      { id: 'rider', type: 'input', position: { x: 250, y: 0 }, data: { label: 'Rider App', type: 'User' } },
      { id: 'driver', type: 'input', position: { x: 550, y: 0 }, data: { label: 'Driver App', type: 'User' } },
      { id: 'lb', type: 'server', position: { x: 400, y: 150 }, data: { label: 'Load Balancer', type: 'Load Balancer' } },
      { id: 'dispatch', type: 'server', position: { x: 400, y: 300 }, data: { label: 'Dispatch Service', type: 'Web Server' } },
      { id: 'maps', type: 'server', position: { x: 150, y: 450 }, data: { label: 'Google Maps API', type: 'API Gateway' } },
      { id: 'db', type: 'server', position: { x: 650, y: 450 }, data: { label: 'Schemaless DB', type: 'Database' } },
    ],
    edges: [
      { id: 'e1', source: 'rider', target: 'lb', animated: true },
      { id: 'e2', source: 'driver', target: 'lb', animated: true },
      { id: 'e3', source: 'lb', target: 'dispatch', animated: true },
      { id: 'e4', source: 'dispatch', target: 'maps', animated: true },
      { id: 'e5', source: 'dispatch', target: 'db', animated: true },
    ]
  }
};