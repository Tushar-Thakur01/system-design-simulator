
<div align="center">

# 🌐 Real-Time Distributed System Simulator

**An interactive visualization tool to model, design, and stress-test high-scale system architectures.**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

[**🔴 LIVE DEMO**](https://system-design-simulator1.vercel.app/) 

---

</div>

> **System design is often taught using static whiteboards. This project brings those whiteboards to life.** > Built for software engineers, this tool visualizes how network packets traverse through Load Balancers, API Gateways, Caches, and Databases in real-time, complete with latency calculations, hit-rates, and fault injections.

<br />

## ✨ Key Features

- 🚦 **Interactive Traffic Engine:** Watch packets travel across your custom network graph. The simulation calculates traversal paths, dynamically routes traffic, and injects variable latency.
- 🏗️ **Drag & Drop Canvas:** Build your own infrastructure using a rich library of custom React Flow nodes (Load Balancers, Caches, DBs, Services).
- 📊 **Live Analytics Dashboard:** Monitor system health in real-time. Tracks metrics like **Throughput (RPS)**, **Average Latency**, and **Error Rates** using reactive charts.
- 💥 **Chaos Engineering (Kill Switch):** Test your architecture's fault tolerance by "killing" specific nodes and watching how the system handles dropped packets and failovers.
- 📚 **Pre-built Architectures:** Explore industry-standard reference architectures out of the box, including simplified models of **Netflix** and **Uber**.
- 🌗 **Adaptive Theming:** Fully responsive Dark and Light modes tailored for extended engineering sessions.

<br />

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Core Framework** | React.js (Hooks, Custom Hooks), Vite |
| **Graph / UI** | React Flow, Tailwind CSS, Lucide Icons |
| **Data Visualization** | Recharts (Histograms, Doughnut Charts) |
| **Simulation Logic** | Vanilla JavaScript (Event Loops, Interval Timers, Linear Interpolation) |
| **Deployment** | Vercel (CI/CD) |

<br />

## 🧠 Under the Hood (Engineering Highlights)

This application is built to handle heavy DOM manipulation and state updates without sacrificing frame rates. 

### 1. Decoupled Simulation Engine
The core logic lives inside a custom `useSimulation` hook. To maintain **60 FPS**, the heavy DOM state (the React Flow graph) is strictly decoupled from the rapidly changing simulation state (the moving packets). 

### 2. Algorithmic Routing & Logic
Packets are treated as independent state objects. When a packet reaches a destination node, the engine evaluates node-specific logic:
* **Caches:** Implements probabilistic hit/miss logic (e.g., 80% hit rate routes the packet back, 20% miss forces a database trip).
* **Load Balancers:** Evaluates outgoing edges and distributes traffic accordingly.

### 3. Linear Interpolation Rendering
Instead of relying on heavy animation libraries, packet movement is calculated algorithmically 20 times per second using linear interpolation between the source and target node coordinates, allowing the browser to render hundreds of concurrent packets efficiently.

<br />

## 📸 Preview


> <img src="Screenshot 2026-04-03 034004.png" width="100%" alt="Simulator Preview" />

<br />

---
<div align="center">
<i>Designed and engineered with 💡 by <b>Tushar Thakur</b></i>
</div>
