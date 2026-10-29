import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OrchestrationDAG from './components/OrchestrationDAG';
import LiveStreamConsole from './components/LiveStreamConsole';
import ReportViewer from './components/ReportViewer';
import HitlReviewModal from './components/HitlReviewModal';
import NewTaskModal from './components/NewTaskModal';
import TaskHistory from './components/TaskHistory';
import EvaluationDashboard from './components/EvaluationDashboard';
import { getSystemHealth, createTask, uploadDocument, getTaskDetails, submitHumanReview, connectTaskStream, listTasks } from './api/client';
import { Sparkles, Bot, ArrowRight, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('mission'); // 'mission' | 'history' | 'dashboard'
  const [health, setHealth] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [streamEvents, setStreamEvents] = useState([]);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isHitlModalOpen, setIsHitlModalOpen] = useState(false);

  // Poll system health on mount
  useEffect(() => {
    getSystemHealth()
      .then(setHealth)
      .catch((err) => console.warn('Health check failed', err));

    // Try to load the most recent task if one exists
    listTasks()
      .then((tasks) => {
        if (tasks && tasks.length > 0) {
          loadTaskDetails(tasks[0].id);
        }
      })
      .catch((err) => console.warn('Could not list initial tasks', err));
  }, []);

  // Subscribe to SSE stream whenever currentTask is active
  useEffect(() => {
    if (!currentTask?.id) return;

    // Only stream if task is not in final state
    const isFinished = ['COMPLETED', 'FAILED', 'REJECTED'].includes(currentTask.status);
    if (isFinished && streamEvents.length > 0) return;

    const cleanup = connectTaskStream(
      currentTask.id,
      (evt) => {
        setStreamEvents((prev) => [...prev, evt]);

        // Auto-refresh task details when milestones occur
        if (['agent_completed', 'hitl_required', 'task_completed', 'pipeline_error'].includes(evt.type)) {
          loadTaskDetails(currentTask.id);
        }

        // Trigger HITL review modal when review gate reached
        if (evt.type === 'hitl_required') {
          setIsHitlModalOpen(true);
        }
      },
      (err) => {
        console.warn('SSE stream notice:', err);
      }
    );

    return () => cleanup();
  }, [currentTask?.id, currentTask?.status]);

  const loadTaskDetails = async (taskId) => {
    try {
      const details = await getTaskDetails(taskId);
      setCurrentTask(details);

      // If we don't have stream events yet, populate from task steps
      if (details.steps && details.steps.length > 0 && streamEvents.length === 0) {
        const syntheticEvents = details.steps.map((s) => ({
          agent: s.agent_name,
          event_type: 'agent_completed',
          timestamp: s.created_at,
          data: {
            message: s.logs || s.step_name,
            latency_ms: s.latency_ms,
          },
        }));
        setStreamEvents(syntheticEvents);
      }

      // Check if paused at HITL
      if (details.status === 'AWAITING_APPROVAL') {
        setIsHitlModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to load task details', err);
    }
  };

  const handleCreateTask = async (payload) => {
    const newTask = await createTask(payload);
    setStreamEvents([
      {
        agent: 'Orchestration Engine',
        event_type: 'agent_started',
        timestamp: new Date().toISOString(),
        data: { message: `Mission initiated: "${newTask.title}". Initializing agents...` },
      },
    ]);
    setCurrentTask(newTask);
    setActiveTab('mission');
  };

  const handleUploadDocument = async (formData) => {
    const newTask = await uploadDocument(formData);
    setStreamEvents([
      {
        agent: 'Orchestration Engine',
        event_type: 'agent_started',
        timestamp: new Date().toISOString(),
        data: { message: `Literature Audit initiated for: "${newTask.title}". Parsing document semantics...` },
      },
    ]);
    setCurrentTask(newTask);
    setActiveTab('mission');
  };

  const handleSubmitReview = async (reviewPayload) => {
    if (!currentTask?.id) return;
    await submitHumanReview(currentTask.id, reviewPayload);
    // Refresh
    setTimeout(() => {
      loadTaskDetails(currentTask.id);
    }, 600);
  };

  return (
    <div className="app-container" id="multi-agent-app">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewTask={() => setIsNewTaskModalOpen(true)}
        health={health}
      />

      <main className="main-layout">
        {activeTab === 'mission' && (
          <div>
            {currentTask ? (
              <div>
                {/* Active Mission Banner */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Current Mission Objective
                    </span>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                      {currentTask.title}
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                      {currentTask.query}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span className="badge badge-running" style={{ fontSize: '0.72rem' }}>
                      Status: {currentTask.status}
                    </span>
                  </div>
                </div>

                {/* Visual DAG */}
                <OrchestrationDAG
                  task={currentTask}
                  onOpenReview={() => setIsHitlModalOpen(true)}
                />

                {/* Two-column layout: Live Console & Report */}
                <div className="content-grid" style={{ marginTop: '1.5rem' }}>
                  <LiveStreamConsole
                    events={streamEvents}
                    task={currentTask}
                  />

                  <ReportViewer
                    task={currentTask}
                  />
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '6rem 2rem',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--primary), var(--cyan))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  boxShadow: '0 0 32px var(--primary-glow)'
                }}>
                  <Bot size={32} color="#fff" />
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.75rem' }}>
                  Autonomous Multi-Agent Intelligence
                </h2>
                <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Deploy specialized autonomous agents that independently conduct multi-source web research, analyze qualitative trends, audit claims with fact-checking, and synthesize publication-ready executive decision briefs.
                </p>
                <button
                  id="btn-deploy-first-mission"
                  className="btn-primary"
                  style={{ fontSize: '1rem', padding: '0.75rem 1.75rem' }}
                  onClick={() => setIsNewTaskModalOpen(true)}
                >
                  <Sparkles size={18} />
                  <span>Deploy First Research Mission</span>
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <TaskHistory
            currentTaskId={currentTask?.id}
            onSelectTask={(id) => {
              setStreamEvents([]);
              loadTaskDetails(id);
              setActiveTab('mission');
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <EvaluationDashboard />
        )}
      </main>

      {/* Modals */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onCreateTask={handleCreateTask}
        onUploadDocument={handleUploadDocument}
      />

      <HitlReviewModal
        isOpen={isHitlModalOpen}
        onClose={() => setIsHitlModalOpen(false)}
        task={currentTask}
        onSubmitReview={handleSubmitReview}
      />
    </div>
  );
}
