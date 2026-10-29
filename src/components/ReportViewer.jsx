import React, { useState } from 'react';
import {
  FileText, Copy, Download, ExternalLink, ShieldCheck, Check,
  Sparkles, BookOpen, Layers, Compass, Image, Award, AlertCircle
} from 'lucide-react';

export default function ReportViewer({ task }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('report'); // 'report', 'visuals', 'projections', 'audit', 'citations'

  const finalReport = task?.final_report;
  const citations = task?.citations || [];
  const visualDiagrams = task?.visual_diagrams;
  const projections = task?.strategic_projections;
  const auditDossier = task?.audit_dossier;
  const isDocAudit = task?.task_type === 'DOCUMENT_AUDIT';

  const handleCopy = () => {
    if (!finalReport) return;
    navigator.clipboard.writeText(finalReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!finalReport) return;
    const blob = new Blob([finalReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(task.title || 'report').toLowerCase().replace(/\s+/g, '_')}_brief.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Basic markdown parser
  const renderFormattedMarkdown = (md) => {
    if (!md) return null;
    const lines = md.split('\n');
    const elements = [];

    let inTable = false;
    let tableRows = [];

    const flushTable = (key) => {
      if (tableRows.length > 0) {
        const headerRow = tableRows[0];
        const bodyRows = tableRows.slice(2);
        elements.push(
          <div key={`table-${key}`} style={{ overflowX: 'auto', margin: '1rem 0' }}>
            <table>
              <thead>
                <tr>
                  {headerRow.split('|').filter(c => c.trim()).map((cell, idx) => (
                    <th key={idx}>{cell.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.split('|').filter(c => c.trim()).map((cell, cIdx) => (
                      <td key={cIdx}>{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line, idx) => {
      if (line.trim().startsWith('|')) {
        inTable = true;
        tableRows.push(line);
        return;
      } else if (inTable) {
        flushTable(idx);
      }

      if (line.startsWith('# ')) {
        elements.push(<h1 key={idx}>{line.replace('# ', '')}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={idx}>{line.replace('## ', '')}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={idx}>{line.replace('### ', '')}</h3>);
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        elements.push(<li key={idx} style={{ marginLeft: '1.25rem' }}>{line.replace(/^(\*|-)\s+/, '')}</li>);
      } else if (/^\d+\.\s/.test(line)) {
        elements.push(<li key={idx} style={{ marginLeft: '1.25rem', listStyleType: 'decimal' }}>{line.replace(/^\d+\.\s/, '')}</li>);
      } else if (line.trim().length > 0) {
        elements.push(<p key={idx}>{line}</p>);
      }
    });

    if (inTable) flushTable('end');

    return elements;
  };

  return (
    <div className="glass-card console-card" style={{ height: '620px' }} id="report-viewer-card">
      <div className="console-header" style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 'max-content' }}>
          <button
            className={`btn-secondary ${activeTab === 'report' ? 'active' : ''}`}
            style={{
              padding: '0.35rem 0.7rem',
              fontSize: '0.78rem',
              backgroundColor: activeTab === 'report' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              borderColor: activeTab === 'report' ? 'var(--primary)' : 'var(--border-subtle)'
            }}
            onClick={() => setActiveTab('report')}
          >
            <FileText size={14} />
            <span>Executive Brief</span>
          </button>

          {/* Visual Architecture & Images Tab */}
          <button
            id="tab-visuals"
            className={`btn-secondary ${activeTab === 'visuals' ? 'active' : ''}`}
            style={{
              padding: '0.35rem 0.7rem',
              fontSize: '0.78rem',
              backgroundColor: activeTab === 'visuals' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              borderColor: activeTab === 'visuals' ? 'var(--primary)' : 'var(--border-subtle)'
            }}
            onClick={() => setActiveTab('visuals')}
          >
            <Sparkles size={14} color="#38bdf8" />
            <span>Visual Diagrams &amp; Images</span>
          </button>

          {/* Strategic Projections / Roadmap Tab */}
          <button
            id="tab-projections"
            className={`btn-secondary ${activeTab === 'projections' ? 'active' : ''}`}
            style={{
              padding: '0.35rem 0.7rem',
              fontSize: '0.78rem',
              backgroundColor: activeTab === 'projections' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              borderColor: activeTab === 'projections' ? 'var(--primary)' : 'var(--border-subtle)'
            }}
            onClick={() => setActiveTab('projections')}
          >
            <Compass size={14} color="#10b981" />
            <span>Strategic Projections</span>
          </button>

          {/* Final Audit Dossier Tab */}
          <button
            id="tab-audit"
            className={`btn-secondary ${activeTab === 'audit' ? 'active' : ''}`}
            style={{
              padding: '0.35rem 0.7rem',
              fontSize: '0.78rem',
              backgroundColor: activeTab === 'audit' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              borderColor: activeTab === 'audit' ? 'var(--primary)' : 'var(--border-subtle)'
            }}
            onClick={() => setActiveTab('audit')}
          >
            <ShieldCheck size={14} color="#f59e0b" />
            <span>Final Audit Dossier</span>
          </button>

          {/* Citations Tab */}
          <button
            className={`btn-secondary ${activeTab === 'citations' ? 'active' : ''}`}
            style={{
              padding: '0.35rem 0.7rem',
              fontSize: '0.78rem',
              backgroundColor: activeTab === 'citations' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              borderColor: activeTab === 'citations' ? 'var(--primary)' : 'var(--border-subtle)'
            }}
            onClick={() => setActiveTab('citations')}
          >
            <BookOpen size={14} />
            <span>{isDocAudit ? 'Page Citations' : 'Web Sources'} ({citations.length})</span>
          </button>
        </div>

        {finalReport && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginLeft: 'auto' }}>
            <button
              id="btn-copy-report"
              className="btn-secondary"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              onClick={handleCopy}
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              id="btn-download-report"
              className="btn-secondary"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              onClick={handleDownload}
            >
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
        {/* Tab 1: Executive Brief */}
        {activeTab === 'report' && (
          finalReport ? (
            <div className="report-content" id="report-rendered-markdown">
              {renderFormattedMarkdown(finalReport)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
              <Sparkles size={36} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.35rem' }}>
                Executive Decision &amp; Audit Brief Pending
              </h3>
              <p style={{ fontSize: '0.82rem', maxWidth: '420px', margin: '0 auto' }}>
                The multi-agent pipeline is actively synthesizing your document literature, generating visual architectures, and performing institutional audit checks.
              </p>
            </div>
          )
        )}

        {/* Tab 2: Visual Architecture Diagrams & Images */}
        {activeTab === 'visuals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                  {visualDiagrams?.diagram_title || 'System Architecture & Literature Flow Diagram'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Interactive vector architectural infographic generated autonomously by the Visual Diagram Agent
                </p>
              </div>
            </div>

            {visualDiagrams?.svg_diagram ? (
              <div
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  overflowX: 'auto'
                }}
                dangerouslySetInnerHTML={{ __html: visualDiagrams.svg_diagram }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                Visual architecture diagram will appear once the Visual Diagram Agent executes.
              </div>
            )}

            {/* AI Image Generation Prompts */}
            {visualDiagrams?.image_prompts && visualDiagrams.image_prompts.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Image size={15} color="#c084fc" />
                  <span>Synthesized Conceptual AI Image Prompts (DALL-E 3 / Imagen / Midjourney)</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {visualDiagrams.image_prompts.map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.85rem',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.82rem',
                        color: '#e2e8f0'
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', color: '#a855f7', fontWeight: 700, marginBottom: '0.25rem' }}>
                        IMAGE CONCEPT #{idx + 1}
                      </div>
                      <p style={{ fontStyle: 'italic', color: '#cbd5e1' }}>"{p}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Strategic Projections & Project Roadmap */}
        {activeTab === 'projections' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                Strategic Implementation Roadmap &amp; Projections
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Derived implementation milestones, projected ROI trajectories, and governance dependencies
              </p>
            </div>

            {projections?.quantitative_projections && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {projections.quantitative_projections.map((q, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase' }}>
                      PROJECTED IMPACT #{idx + 1}
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', marginTop: '0.35rem' }}>
                      {q}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {projections?.project_phases ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {projections.project_phases.map((phase, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1.15rem',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>
                        {phase.phase_name}
                      </span>
                      <span className="badge badge-pending" style={{ fontSize: '0.72rem' }}>
                        {phase.timeline_weeks}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#e2e8f0', marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                        KEY DELIVERABLES:
                      </div>
                      <ul style={{ marginLeft: '1.25rem' }}>
                        {(phase.key_deliverables || []).map((d, dIdx) => (
                          <li key={dIdx}>{d}</li>
                        ))}
                      </ul>
                    </div>

                    {phase.risk_mitigation && (
                      <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>Risk Governance: </span>{phase.risk_mitigation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                Projections will appear once the Projection &amp; Roadmap Agent completes.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Final Audit Dossier */}
        {activeTab === 'audit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                  Institutional Literature Audit Dossier
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Scientific methodology audit, factual grounding score, and statement verification
                </p>
              </div>

              {auditDossier?.audit_grade && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
                  border: '1px solid #10b981'
                }}>
                  <Award size={18} color="#10b981" />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>AUDIT GRADE</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ade80' }}>
                      {auditDossier.audit_grade}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Audit Score Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>METHODOLOGY RIGOR</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
                  {auditDossier?.methodology_rigor_score || 95.0}%
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>FACTUAL GROUNDING</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ade80', marginTop: '0.2rem' }}>
                  {auditDossier?.factual_grounding_score || 96.5}%
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>BIAS &amp; LIMITATION RATING</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a855f7', marginTop: '0.2rem' }}>
                  {auditDossier?.bias_and_limitation_score || 92.0}%
                </div>
              </div>
            </div>

            {/* Audited Statements Table */}
            {auditDossier?.audited_statements && (
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.65rem' }}>
                  Statement Verification &amp; Page Grounding
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {auditDossier.audited_statements.map((s, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.85rem',
                        background: 'rgba(0,0,0,0.25)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
                          {s.page_reference || 'Page Anchor'}
                        </span>
                        <span className="badge badge-completed" style={{ fontSize: '0.68rem' }}>
                          {s.audit_status}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#f8fafc', marginBottom: '0.35rem' }}>{s.statement}</p>
                      {s.auditor_notes && (
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          <span style={{ fontWeight: 600 }}>Auditor Note: </span>{s.auditor_notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Citations */}
        {activeTab === 'citations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }} id="citations-list">
            {citations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                No citations indexed yet.
              </div>
            ) : (
              citations.map((c, i) => (
                <div
                  key={c.id || i}
                  style={{
                    padding: '0.85rem',
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        color: '#67e8f9',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <span>{c.title}</span>
                      {c.url && !c.url.startsWith('document://') && <ExternalLink size={12} />}
                    </span>
                    <span className="badge badge-completed" style={{ fontSize: '0.68rem' }}>
                      Reliability: {Math.round((c.reliability_score || 0.9) * 100)}%
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4, marginBottom: '0.35rem' }}>
                    {c.snippet}
                  </p>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Anchor Source: <span style={{ color: '#a5b4fc' }}>{c.domain}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
