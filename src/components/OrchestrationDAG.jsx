import React from 'react';
import {
  Compass, Search, LineChart, ShieldCheck, UserCheck, FileText,
  CheckCircle2, Clock, AlertTriangle, BookOpen, Sparkles, Network
} from 'lucide-react';

export default function OrchestrationDAG({ task, onOpenReview }) {
  const currentStatus = task?.status || 'PENDING';
  const isDocAudit = task?.task_type === 'DOCUMENT_AUDIT';

  // Dynamic stages based on task type
  const researchStages = [
    {
      id: 'PLANNING',
      name: 'Coordinator',
      role: 'Query Decomposition',
      icon: Compass,
      isActive: currentStatus === 'PLANNING',
      isCompleted: ['RESEARCHING', 'ANALYZING', 'VERIFYING', 'AWAITING_APPROVAL', 'GENERATING_REPORT', 'COMPLETED'].includes(currentStatus),
    },
    {
      id: 'RESEARCHING',
      name: 'Researcher',
      role: 'Multi-Source Search',
      icon: Search,
      isActive: currentStatus === 'RESEARCHING',
      isCompleted: ['ANALYZING', 'VERIFYING', 'AWAITING_APPROVAL', 'GENERATING_REPORT', 'COMPLETED'].includes(currentStatus),
    },
    {
      id: 'ANALYZING',
      name: 'Analyst',
      role: 'Pattern & Risk Insight',
      icon: LineChart,
      isActive: currentStatus === 'ANALYZING',
      isCompleted: ['VERIFYING', 'AWAITING_APPROVAL', 'GENERATING_REPORT', 'COMPLETED'].includes(currentStatus),
    },
    {
      id: 'VERIFYING',
      name: 'Verifier',
      role: 'Fact-Check & Audit',
      icon: ShieldCheck,
      isActive: currentStatus === 'VERIFYING',
      isCompleted: ['AWAITING_APPROVAL', 'GENERATING_REPORT', 'COMPLETED'].includes(currentStatus),
    },
    {
      id: 'HITL',
      name: 'Human Review',
      role: 'Sign-Off Gate',
      icon: UserCheck,
      isActive: currentStatus === 'AWAITING_APPROVAL',
      isCompleted: task?.human_approved !== null && task?.human_approved !== undefined,
      isAwaiting: currentStatus === 'AWAITING_APPROVAL',
    },
    {
      id: 'GENERATING_REPORT',
      name: 'Decision Strategist',
      role: 'Executive Synthesis',
      icon: FileText,
      isActive: currentStatus === 'GENERATING_REPORT',
      isCompleted: currentStatus === 'COMPLETED',
    },
  ];

  const documentStages = [
    {
      id: 'SUMMARIZING',
      name: 'Literature Summarizer',
      role: 'Hierarchical Ingestion',
      icon: BookOpen,
      isActive: currentStatus === 'SUMMARIZING',
      isCompleted: ['PROJECTING', 'VISUALIZING', 'AUDITING', 'AWAITING_APPROVAL', 'GENERATING_REPORT', 'COMPLETED'].includes(currentStatus),
    },
    {
      id: 'PROJECTING',
      name: 'Project Roadmap',
      role: 'Strategic Projections',
      icon: Compass,
      isActive: currentStatus === 'PROJECTING',
      isCompleted: ['VISUALIZING', 'AUDITING', 'AWAITING_APPROVAL', 'GENERATING_REPORT', 'COMPLETED'].includes(currentStatus),
    },
    {
      id: 'VISUALIZING',
      name: 'Visual Architect',
      role: 'SVG Diagrams & Concepts',
      icon: Sparkles,
      isActive: currentStatus === 'VISUALIZING',
      isCompleted: ['AUDITING', 'AWAITING_APPROVAL', 'GENERATING_REPORT', 'COMPLETED'].includes(currentStatus),
    },
    {
      id: 'AUDITING',
      name: 'Audit Inspector',
      role: 'Methodology & Rigor Audit',
      icon: ShieldCheck,
      isActive: currentStatus === 'AUDITING',
      isCompleted: ['AWAITING_APPROVAL', 'GENERATING_REPORT', 'COMPLETED'].includes(currentStatus),
    },
    {
      id: 'HITL',
      name: 'Human Sign-Off',
      role: 'Audit Review Gate',
      icon: UserCheck,
      isActive: currentStatus === 'AWAITING_APPROVAL',
      isCompleted: task?.human_approved !== null && task?.human_approved !== undefined,
      isAwaiting: currentStatus === 'AWAITING_APPROVAL',
    },
    {
      id: 'GENERATING_REPORT',
      name: 'Audit Brief Synthesizer',
      role: 'Executive Dossier',
      icon: FileText,
      isActive: currentStatus === 'GENERATING_REPORT',
      isCompleted: currentStatus === 'COMPLETED',
    },
  ];

  const stages = isDocAudit ? documentStages : researchStages;

  return (
    <section className="dag-section" id="orchestration-dag-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
              Multi-Agent Orchestration Pipeline
            </h2>
            <span className="badge badge-completed" style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>
              {isDocAudit ? 'Document Audit Engine' : 'Autonomous Web Research Engine'}
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {isDocAudit
              ? 'Multi-agent PDF literature ingestion, strategic project roadmap, visual architecture, and rigor audit'
              : 'Autonomous asynchronous execution graph with Human-in-the-Loop decision verification'}
          </p>
        </div>

        {currentStatus === 'AWAITING_APPROVAL' && (
          <button
            id="btn-open-review-gate"
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.4)',
              animation: 'pulseAmber 1.6s infinite'
            }}
            onClick={onOpenReview}
          >
            <UserCheck size={16} />
            <span>Human Review Required — Sign Off</span>
          </button>
        )}
      </div>

      <div className="dag-container">
        {stages.map((stage) => {
          const Icon = stage.icon;
          let nodeClass = 'agent-node';
          if (stage.isAwaiting) nodeClass += ' awaiting';
          else if (stage.isActive) nodeClass += ' active';
          else if (stage.isCompleted) nodeClass += ' completed';

          return (
            <div key={stage.id} className={nodeClass} id={`dag-node-${stage.id.toLowerCase()}`}>
              <div className="agent-node-header">
                <div className="agent-icon-circle">
                  <Icon size={18} />
                </div>
                <div>
                  {stage.isCompleted ? (
                    <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', fontWeight: 600 }}>
                      <CheckCircle2 size={14} /> Ready
                    </span>
                  ) : stage.isAwaiting ? (
                    <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', fontWeight: 600 }}>
                      <AlertTriangle size={14} /> Action Required
                    </span>
                  ) : stage.isActive ? (
                    <span style={{ color: '#818cf8', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', fontWeight: 600 }}>
                      <Clock size={14} /> Active
                    </span>
                  ) : (
                    <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Queued</span>
                  )}
                </div>
              </div>

              <div>
                <div className="agent-name">{stage.name}</div>
                <div className="agent-role">{stage.role}</div>
              </div>

              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                borderBottomLeftRadius: 'var(--radius-md)',
                borderBottomRightRadius: 'var(--radius-md)',
                backgroundColor: stage.isCompleted ? '#10b981' : stage.isAwaiting ? '#f59e0b' : stage.isActive ? '#6366f1' : 'transparent',
                boxShadow: stage.isActive ? '0 0 10px #6366f1' : 'none'
              }} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
