import React, { useEffect, useRef } from 'react';
import { Terminal, Shield, Zap, Info, CheckCircle, AlertOctagon } from 'lucide-react';

export default function LiveStreamConsole({ events = [], task }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const getAgentColor = (agent) => {
    if (!agent) return '#94a3b8';
    if (agent.includes('Coordinator')) return '#38bdf8';
    if (agent.includes('Research')) return '#818cf8';
    if (agent.includes('Analysis')) return '#c084fc';
    if (agent.includes('Verification')) return '#34d399';
    if (agent.includes('Human')) return '#fbbf24';
    if (agent.includes('Report') || agent.includes('Decision')) return '#f43f5e';
    return '#38bdf8';
  };

  return (
    <div className="glass-card console-card" id="live-stream-console">
      <div className="console-header">
        <div className="console-title">
          <Terminal size={16} color="#818cf8" />
          <span>Real-Time Agent Execution & Telemetry Stream</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="badge badge-running" style={{ fontSize: '0.68rem' }}>
            <Zap size={12} />
            <span>SSE Active</span>
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {events.length} Events
          </span>
        </div>
      </div>

      <div className="console-body" ref={scrollRef}>
        {events.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            <Info size={28} style={{ margin: '0 auto 0.75rem auto', opacity: 0.6 }} />
            <p>Awaiting task initiation. Launch a mission to inspect live multi-agent execution telemetry.</p>
          </div>
        ) : (
          events.map((evt, index) => {
            const timeStr = evt.timestamp
              ? new Date(evt.timestamp).toLocaleTimeString()
              : new Date().toLocaleTimeString();
            const agentName = evt.agent || 'System';
            const data = evt.data || {};

            let messageClass = 'log-msg';
            let icon = null;

            if (evt.event_type === 'agent_started') {
              messageClass += ' highlight';
            } else if (evt.event_type === 'agent_completed' || evt.event_type === 'task_completed') {
              messageClass += ' success';
              icon = <CheckCircle size={13} color="#4ade80" />;
            } else if (evt.event_type === 'hitl_required') {
              messageClass += ' warning';
              icon = <AlertOctagon size={13} color="#facc15" />;
            } else if (evt.event_type === 'pipeline_error') {
              messageClass += ' error';
            }

            return (
              <div key={index} className="log-entry">
                <span className="log-time">[{timeStr}]</span>
                <span className="log-agent" style={{ color: getAgentColor(agentName) }}>
                  [{agentName}]
                </span>
                {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
                <span className={messageClass}>
                  {data.message || JSON.stringify(data)}
                  {data.latency_ms && (
                    <span style={{ color: '#64748b', marginLeft: '0.5rem', fontSize: '0.72rem' }}>
                      ({data.latency_ms}ms)
                    </span>
                  )}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
