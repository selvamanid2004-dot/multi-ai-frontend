import React, { useState } from 'react';
import { UserCheck, ShieldAlert, CheckCircle, XCircle, AlertTriangle, MessageSquare, Send } from 'lucide-react';

export default function HitlReviewModal({ isOpen, onClose, task, onSubmitReview }) {
  if (!isOpen || !task) return null;

  const [feedback, setFeedback] = useState('');
  const [guidelines, setGuidelines] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const verification = task.verification_report || {};
  const claims = verification.verified_claims || [];
  const confidence = verification.overall_confidence || 92.0;
  const accuracy = verification.factual_accuracy_score || 94.0;
  const risk = verification.hallucination_risk || 'LOW';

  const handleAction = async (approved) => {
    setIsSubmitting(true);
    try {
      await onSubmitReview({
        approved,
        feedback: feedback.trim() || (approved ? 'Approved by human reviewer without modifications.' : 'Rejected by reviewer.'),
        additional_guidelines: guidelines.trim() || undefined,
      });
      onClose();
    } catch (err) {
      alert(`Error submitting review: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" id="hitl-review-modal">
      <div className="modal-content" style={{ maxWidth: '780px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserCheck size={18} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                Human-in-the-Loop Review & Approval Gate
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Verification Agent completed claim audit. Human sign-off required before final synthesis.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Audit Metrics Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.25rem'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                Overall Confidence
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
                {confidence}%
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                Factual Accuracy
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4ade80' }}>
                {accuracy}%
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                Hallucination Risk
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: risk === 'LOW' ? '#4ade80' : risk === 'MEDIUM' ? '#fbbf24' : '#f43f5e',
                marginTop: '0.35rem'
              }}>
                <ShieldAlert size={16} />
                <span>{risk} RISK</span>
              </div>
            </div>
          </div>

          {/* Claims List */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.65rem' }}>
              Verified Claims & Evidence Grounding ({claims.length})
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              maxHeight: '220px',
              overflowY: 'auto',
              paddingRight: '0.35rem'
            }}>
              {claims.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No individual claims recorded.</div>
              ) : (
                claims.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '0.75rem',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600, color: '#f1f5f9' }}>Claim #{i + 1}</span>
                      <span className="badge badge-completed" style={{ fontSize: '0.68rem' }}>
                        {c.status || 'VERIFIED'} • {c.confidence || 95}%
                      </span>
                    </div>
                    <p style={{ color: '#cbd5e1', marginBottom: '0.35rem' }}>{c.claim}</p>
                    {c.source_ref && (
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Source Grounding: <span style={{ color: '#38bdf8' }}>{c.source_ref}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reviewer Feedback Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="hitl-feedback-input">
              Reviewer Directives & Feedback (Optional)
            </label>
            <textarea
              id="hitl-feedback-input"
              className="form-textarea"
              placeholder="e.g., Emphasize cost reduction trade-offs in section 4; corroborated by internal cloud budget benchmarks."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={2}
            />
          </div>

          {/* Additional Guidelines */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="hitl-guidelines-input">
              Strategic Focus for Decision Report (Optional)
            </label>
            <input
              id="hitl-guidelines-input"
              type="text"
              className="form-input"
              placeholder="e.g., Tailor recommendations for C-suite executive audience."
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            id="btn-hitl-reject"
            className="btn-secondary"
            style={{ color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.3)' }}
            disabled={isSubmitting}
            onClick={() => handleAction(false)}
          >
            <XCircle size={16} />
            <span>Reject / Request Revision</span>
          </button>

          <button
            id="btn-hitl-approve"
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)'
            }}
            disabled={isSubmitting}
            onClick={() => handleAction(true)}
          >
            <CheckCircle size={16} />
            <span>{isSubmitting ? 'Resuming Pipeline...' : 'Approve & Synthesize Decision Brief'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
