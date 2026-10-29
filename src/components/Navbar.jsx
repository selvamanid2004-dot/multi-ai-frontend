import React from 'react';
import { Bot, Plus, Activity, History, BarChart3, ShieldCheck, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenNewTask, health }) {
  const isHealthy = health?.status === 'healthy';

  return (
    <header className="header-bar" id="app-header">
      <div className="brand-section">
        <div className="brand-icon-box">
          <Bot size={22} color="#fff" />
        </div>
        <div>
          <h1 className="brand-title">Multi-Agent AI Decision System</h1>
          <div className="brand-subtitle">Autonomous Research • Verification • Strategy</div>
        </div>
      </div>

      <nav className="nav-links" aria-label="Main Navigation">
        <button
          id="nav-tab-mission"
          className={`nav-tab ${activeTab === 'mission' ? 'active' : ''}`}
          onClick={() => setActiveTab('mission')}
        >
          <Activity size={16} />
          Active Mission
        </button>

        <button
          id="nav-tab-history"
          className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={16} />
          Mission History
        </button>

        <button
          id="nav-tab-dashboard"
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart3 size={16} />
          AI Evaluation Dashboard
        </button>
      </nav>

      <div className="header-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: isHealthy ? '#34d399' : '#fbbf24' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isHealthy ? '#10b981' : '#f59e0b',
            boxShadow: isHealthy ? '0 0 8px #10b981' : '0 0 8px #f59e0b'
          }} />
          <span>{isHealthy ? 'System Operational' : 'Connecting...'}</span>
        </div>

        <button
          id="btn-new-mission"
          className="btn-primary"
          onClick={onOpenNewTask}
        >
          <Plus size={16} />
          <span>New Mission</span>
        </button>
      </div>
    </header>
  );
}
