/**
 * Frontend API Client & EventSource Stream Bridge
 * Configured with relative paths so Vite development proxy & production bundles work seamlessly.
 */

const RAW_API_URL = (import.meta.env.VITE_API_URL || '').trim();
const API_BASE = RAW_API_URL ? `${RAW_API_URL.replace(/\/$/, '')}/api/v1` : '/api/v1';

export async function getSystemHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function createTask(payload) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to create research task');
  }
  return res.json();
}

export async function uploadDocument(formData) {
  const res = await fetch(`${API_BASE}/tasks/upload-document`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to upload document');
  }
  return res.json();
}

export async function listTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function getTaskDetails(taskId) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`);
  if (!res.ok) throw new Error(`Failed to fetch task ${taskId}`);
  return res.json();
}

export async function deleteTask(taskId) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete task ${taskId}`);
  return true;
}

export async function submitHumanReview(taskId, payload) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to submit review');
  }
  return res.json();
}

export async function getDashboardMetrics() {
  const res = await fetch(`${API_BASE}/evaluation/dashboard`);
  if (!res.ok) throw new Error('Failed to load evaluation metrics');
  return res.json();
}

/**
 * Connects to the SSE endpoint for live telemetry & agent logs.
 */
export function connectTaskStream(taskId, onEvent, onError) {
  const eventSource = new EventSource(`${API_BASE}/tasks/${taskId}/stream`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onEvent({ type: 'message', data });
    } catch (e) {
      console.warn('Failed to parse SSE JSON payload', e);
    }
  };

  const registeredEvents = [
    'connected',
    'agent_started',
    'agent_action',
    'agent_completed',
    'hitl_required',
    'hitl_rejected',
    'task_completed',
    'pipeline_error'
  ];

  registeredEvents.forEach((evtName) => {
    eventSource.addEventListener(evtName, (event) => {
      try {
        const data = JSON.parse(event.data);
        onEvent({ type: evtName, data });
      } catch (e) {
        console.warn(`Failed to parse SSE payload for ${evtName}`, e);
      }
    });
  });

  eventSource.onerror = (err) => {
    if (onError) onError(err);
  };

  return () => {
    eventSource.close();
  };
}
