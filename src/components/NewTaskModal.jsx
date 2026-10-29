import React, { useState } from 'react';
import { Rocket, Sparkles, FileText, UploadCloud, Globe, X, CheckCircle2 } from 'lucide-react';

export default function NewTaskModal({ isOpen, onClose, onCreateTask, onUploadDocument }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState('research'); // 'research' or 'document'
  const [title, setTitle] = useState('');
  const [query, setQuery] = useState('');
  const [provider, setProvider] = useState('auto');
  const [requireHumanApproval, setRequireHumanApproval] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presets = [
    {
      title: 'Autonomous Multi-Agent Clinical Diagnostics',
      query: 'Evaluate multi-agent architectures for clinical decision support, medical records fact-checking, and diagnostic safety governance.'
    },
    {
      title: 'Post-Quantum Cryptography Enterprise Migration',
      query: 'Investigate NIST post-quantum cryptographic standards, algorithmic migration roadmaps, and infrastructure vulnerability risks.'
    },
    {
      title: 'Next-Gen Agentic Workflow Automation in FinTech',
      query: 'Analyze high-throughput autonomous agents for algorithmic trading compliance, real-time risk mitigation, and automated reporting.'
    }
  ];

  const handleApplyPreset = (p) => {
    setTitle(p.title);
    setQuery(p.query);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(`Literature Audit: ${file.name.replace(/\.[^/.]+$/, "")}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'document') {
        if (!selectedFile) {
          alert('Please select a PDF or literature document to audit.');
          setIsSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        if (title.trim()) formData.append('title', title.trim());
        if (query.trim()) formData.append('query', query.trim());
        formData.append('provider', provider);
        formData.append('require_human_approval', requireHumanApproval);

        await onUploadDocument(formData);
      } else {
        if (!title.trim() || !query.trim()) {
          alert('Please provide both a title and a detailed research objective.');
          setIsSubmitting(false);
          return;
        }

        await onCreateTask({
          title: title.trim(),
          query: query.trim(),
          provider,
          require_human_approval: requireHumanApproval,
          task_type: 'RESEARCH'
        });
      }

      onClose();
    } catch (err) {
      alert(`Failed to launch mission: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" id="new-task-modal">
      <div className="modal-content" style={{ maxWidth: '680px' }}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, var(--primary), var(--cyan))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Rocket size={18} color="#fff" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                  Deploy Autonomous Mission
                </h2>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Select autonomous web research or document &amp; literature audit
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              ✕
            </button>
          </div>

          <div className="modal-body">
            {/* Mode Switcher */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem'
            }}>
              <button
                type="button"
                id="btn-mode-research"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: mode === 'research' ? 'var(--primary)' : 'transparent',
                  color: mode === 'research' ? '#fff' : '#94a3b8',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setMode('research')}
              >
                <Globe size={15} />
                <span>Web Research Mission</span>
              </button>

              <button
                type="button"
                id="btn-mode-document"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: mode === 'document' ? 'var(--primary)' : 'transparent',
                  color: mode === 'document' ? '#fff' : '#94a3b8',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setMode('document')}
              >
                <FileText size={15} />
                <span>PDF &amp; Literature Audit</span>
              </button>
            </div>

            {/* Mode: Document Upload */}
            {mode === 'document' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">
                  Upload PDF, Literature Paper, or Report
                </label>
                <div style={{
                  border: '2px dashed var(--border-bright)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.75rem 1.25rem',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease'
                }}>
                  <input
                    type="file"
                    id="document-file-input"
                    accept=".pdf,.txt,.md"
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                  {selectedFile ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                      <CheckCircle2 size={24} color="#10b981" />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>
                          {selectedFile.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {(selectedFile.size / 1024).toFixed(1)} KB • Click or drop to replace
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <UploadCloud size={32} color="#818cf8" style={{ margin: '0 auto 0.5rem auto' }} />
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>
                        Drop PDF or literature report here
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                        Supports PDF, Markdown, and TXT (Generates Summary, Roadmap Projections, SVG Diagrams, and Final Audit)
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Presets (Research Mode Only) */}
            {mode === 'research' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={13} color="#38bdf8" />
                  <span>RESEARCH TOPIC PRESETS</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      className="btn-secondary"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mission Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="mission-title-input">
                {mode === 'document' ? 'Audit Subject / Paper Title' : 'Mission Subject / Title'}
              </label>
              <input
                id="mission-title-input"
                type="text"
                className="form-input"
                placeholder={mode === 'document' ? 'e.g., Clinical Trial Methodology Audit' : 'e.g., Enterprise Quantum Computing Readiness'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required={mode === 'research'}
              />
            </div>

            {/* Prompt / Custom Guidelines */}
            <div className="form-group">
              <label className="form-label" htmlFor="mission-prompt-input">
                {mode === 'document' ? 'Special Audit Focus & Projection Scope (Optional)' : 'Detailed Research Question & Scope'}
              </label>
              <textarea
                id="mission-prompt-input"
                className="form-textarea"
                placeholder={mode === 'document'
                  ? 'e.g., Focus on cross-checking clinical efficacy metrics, future rollout roadmaps, and regulatory compliance risk.'
                  : 'Describe the research hypothesis, target benchmarks, and key decisions you need answered...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={3}
                required={mode === 'research'}
              />
            </div>

            {/* AI Provider & Governance Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="provider-select">
                  AI Model Engine
                </label>
                <select
                  id="provider-select"
                  className="form-select"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                >
                  <option value="auto">Auto-Detect (Active Keys)</option>
                  <option value="openai">OpenAI (GPT-4o-mini)</option>
                  <option value="gemini">Google Gemini (1.5 Flash)</option>
                  <option value="mock">Simulation Mode (Offline)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', color: '#e2e8f0' }}>
                  <input
                    type="checkbox"
                    id="require-hitl-checkbox"
                    checked={requireHumanApproval}
                    onChange={(e) => setRequireHumanApproval(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#6366f1' }}
                  />
                  <span>Require Human Review Gate</span>
                </label>
                <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem', marginLeft: '1.5rem' }}>
                  Pauses after verification/audit for human sign-off
                </span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              id="btn-launch-mission"
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              <Rocket size={16} />
              <span>
                {isSubmitting
                  ? (mode === 'document' ? 'Ingesting Literature...' : 'Deploying Agents...')
                  : (mode === 'document' ? 'Ingest & Audit Literature' : 'Launch Autonomous Mission')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
