# Multi-Agent AI Research & Decision System - Frontend

[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Modern, high-performance web dashboard for the **Multi-Agent AI Research & Decision System**. Features real-time agent telemetry via Server-Sent Events (SSE), Human-in-the-Loop (HITL) review gates, live multi-agent execution status, interactive SVG architecture visualization, and executive report views.

---

## 🌟 Key Features

- **Real-Time Agent Telemetry**: Live SSE streaming capturing thoughts, tool calls, and step-by-step agent progress.
- **Dual Execution Modes Interface**:
  - 🌐 **Web Research Interface**: Enter research queries, select provider, watch live web crawling & citation harvesting.
  - 📄 **Literature & PDF Audit Interface**: Drag-and-drop PDF research papers for deep summaries, strategic roadmaps, and audit scores.
- **Human-in-the-Loop (HITL) Review Gate**: Interactive approval modal to review verification scores, provide feedback, or steer subsequent agents before final brief compilation.
- **Interactive Visual Architecture**: Dynamic SVG diagram rendering with zoom/pan and visual hierarchy.
- **Comprehensive Evaluation Metrics**: Live observability dashboard showing factual consistency, confidence scores, and token usage.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (Node v20+ recommended)
- **npm** or **yarn** / **pnpm**
- Running **Multi-Agent Backend** (Default: `http://localhost:8000`)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/selvamanid2004-dot/multi-ai-frontend.git
cd multi-ai-frontend

# Install dependencies
npm install
```

### 2. Development

```bash
# Start local Vite development server
npm run dev
```

The frontend app will launch at [http://localhost:5173](http://localhost:5173).

### 3. Production Build

```bash
# Compile and bundle for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🐳 Docker Deployment

```bash
# Build Docker image (Nginx production build)
docker build -t multi-ai-frontend .

# Run container
docker run -p 3000:80 multi-ai-frontend
```

---

## 📄 License

MIT License.
