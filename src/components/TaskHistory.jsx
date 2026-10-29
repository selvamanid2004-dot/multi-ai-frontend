import React, { useEffect, useState } from 'react';
import { History, Trash2, ArrowRight, Clock, Bot, RefreshCw } from 'lucide-react';
import { listTasks, deleteTask } from '../api/client';

export default function TaskHistory({ onSelectTask, currentTaskId }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await listTasks();
      setTasks(data);
    } catch (e) {
      console.error('Failed to list tasks', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (e, taskId) => {
    e.stopPropagation();
    if (!window.confirm('Delete this research mission record?')) return;
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      alert(`Error deleting task: ${err.message}`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge badge-completed">Completed</span>;
      case 'AWAITING_APPROVAL':
        return <span className="badge badge-hitl">Review Required</span>;
      case 'FAILED':
        return <span className="badge badge-failed">Failed</span>;
      case 'REJECTED':
        return <span className="badge badge-failed">Rejected</span>;
      default:
        return <span className="badge badge-running">{status}</span>;
    }
  };

  return (
    <div id="task-history-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
            Mission Execution History
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Audit trail of autonomous multi-agent research runs, telemetry, and decision briefs
          </p>
        </div>

        <button className="btn-secondary" onClick={fetchTasks} style={{ fontSize: '0.82rem' }}>
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0.5rem', overflow: 'hidden' }}>
        {isLoading && tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Loading history records...
          </div>
        ) : tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
            <History size={36} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8' }}>No Previous Missions</h3>
            <p style={{ fontSize: '0.82rem' }}>Launch your first research mission to build your decision repository.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {tasks.map((t) => {
              const isSelected = t.id === currentTaskId;
              const dateStr = new Date(t.created_at).toLocaleString();

              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTask(t.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--primary)' : '3px solid transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isSelected ? 'rgba(99, 102, 241, 0.12)' : 'transparent'}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9' }}>
                        {t.title}
                      </span>
                      {getStatusBadge(t.status)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={12} /> {dateStr}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Bot size={12} /> Provider: {t.provider}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      onClick={(e) => handleDelete(e, t.id)}
                      title="Delete record"
                    >
                      <Trash2 size={13} color="#f43f5e" />
                    </button>
                    <ArrowRight size={16} color="#94a3b8" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
