import { useState, useEffect, useRef } from 'react';
import './App.css';

interface AgentStatus {
  agentName: string;
  status: string;
  version: string;
  engine: string;
  systemTime: string;
  activeTasksCount: number;
  completedTasksCount: number;
}

interface AgentTask {
  id: string;
  title: string;
  status: string; // PENDING, RUNNING, COMPLETED, FAILED
  progress: number;
  lastUpdated: string;
}

interface LogLine {
  id: number;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  message: string;
}

// Fallback Mock Data when Backend is not running
const MOCK_STATUS: AgentStatus = {
  agentName: "Antigravity-Agent-v1",
  status: "ACTIVE",
  version: "1.0.0",
  engine: "Gemini 3.5 Flash",
  systemTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
  activeTasksCount: 2,
  completedTasksCount: 14
};

const MOCK_TASKS: AgentTask[] = [
  { id: "T-101", title: "Initialize workspace project structure", status: "COMPLETED", progress: 100, lastUpdated: "2026-06-16 15:30:22" },
  { id: "T-102", title: "Configure Vite and Vitest for React frontend", status: "RUNNING", progress: 75, lastUpdated: "2026-06-16 16:45:10" },
  { id: "T-103", title: "Build Spring Boot Maven project with REST APIs", status: "RUNNING", progress: 40, lastUpdated: "2026-06-16 16:55:00" },
  { id: "T-104", title: "Setup CI/CD and deployment workflows", status: "PENDING", progress: 0, lastUpdated: "2026-06-16 16:56:00" }
];

const AGENT_MESSAGES = [
  "Scanning workspace repository...",
  "Read CLAUDE.md guidelines for task execution.",
  "Checking for code violations against Andrej Karpathy's guidelines.",
  "Found no violations: Surgical change guideline is respected.",
  "Compiling Java backend components...",
  "Running JUnit integration tests...",
  "Tests passed: com.antigravity.agenticapp.AgenticAppApplicationTests.contextLoads()",
  "Resolving react-ts components in frontend node_modules...",
  "HMR connected to dev server.",
  "Agent state synchronized with active task queues."
];

function App() {
  const [status, setStatus] = useState<AgentStatus>(MOCK_STATUS);
  const [tasks, setTasks] = useState<AgentTask[]>(MOCK_TASKS);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(true);
  
  const logContainerRef = useRef<HTMLDivElement>(null);
  const logIdRef = useRef<number>(0);

  // Fetch from Spring Boot Backend API
  const fetchData = async () => {
    try {
      const statusRes = await fetch('/api/status');
      const tasksRes = await fetch('/api/tasks');
      if (statusRes.ok && tasksRes.ok) {
        const statusData = await statusRes.json();
        const tasksData = await tasksRes.json();
        setStatus(statusData);
        setTasks(tasksData);
        setIsConnected(true);
        addLog('INFO', 'Synchronized successfully with Spring Boot backend APIs.');
      } else {
        throw new Error('Failed to fetch API');
      }
    } catch (e) {
      // Graceful fallback to mock data
      setIsConnected(false);
      setStatus({
        ...MOCK_STATUS,
        systemTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });
      // Maintain state changes in tasks if user added any new task
      addLog('WARNING', 'Spring Boot backend is offline. Using local agent state engine.');
    }
  };

  const addLog = (level: LogLine['level'], message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    logIdRef.current += 1;
    setLogs(prev => [...prev.slice(-40), { id: logIdRef.current, timestamp, level, message }]);
  };

  // Initial setup and periodic refresh
  useEffect(() => {
    // Add initial logs
    addLog('INFO', 'Initializing Antigravity Agent Dashboard workspace...');
    addLog('SUCCESS', 'Loaded Andrej Karpathy design guidelines configuration.');
    
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom of logs when updated
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Simulate active agent log generation
  useEffect(() => {
    if (!isAgentRunning) return;

    const logTimer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * AGENT_MESSAGES.length);
      const levels: LogLine['level'][] = ['INFO', 'SUCCESS', 'INFO', 'WARNING'];
      const randomLevel = levels[Math.floor(Math.random() * levels.length)];
      addLog(randomLevel, AGENT_MESSAGES[randomIndex]);

      // Randomly increase progress of running tasks
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.status === 'RUNNING') {
            const nextProgress = Math.min(task.progress + Math.floor(Math.random() * 8) + 1, 100);
            return {
              ...task,
              progress: nextProgress,
              status: nextProgress === 100 ? 'COMPLETED' : 'RUNNING',
              lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19)
            };
          }
          return task;
        })
      );
    }, 4500);

    return () => clearInterval(logTimer);
  }, [isAgentRunning]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTaskId = `T-${100 + tasks.length + 1}`;
    const newTask: AgentTask = {
      id: newTaskId,
      title: newTaskTitle,
      status: 'PENDING',
      progress: 0,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setTasks(prev => [...prev, newTask]);
    addLog('INFO', `Enqueued new agentic task ${newTaskId}: "${newTaskTitle}"`);
    setNewTaskTitle('');
    setIsModalOpen(false);
  };

  const toggleAgent = () => {
    const nextState = !isAgentRunning;
    setIsAgentRunning(nextState);
    addLog(nextState ? 'SUCCESS' : 'WARNING', nextState ? 'Agent execution resumed.' : 'Agent execution paused.');
  };

  return (
    <div className="app-container">
      {/* Header section */}
      <div className="header-section">
        <div>
          <h1>Agentic Engineering Dashboard</h1>
          <p style={{ marginTop: '4px' }}>
            Collaborative development environment powered by{' '}
            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{status.agentName}</span>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className={`badge ${isConnected ? 'badge-completed' : 'badge-failed'}`}>
            {isConnected ? 'Backend Online' : 'Backend Offline'}
          </span>
          <button className="btn btn-secondary" onClick={fetchData}>
            Sync Node
          </button>
          <button className={`btn ${isAgentRunning ? 'btn-outline-danger' : 'btn-primary'}`} onClick={toggleAgent}>
            {isAgentRunning ? 'Pause Agent' : 'Resume Agent'}
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-label">Agent ID</div>
          <div className="stat-value" style={{ fontSize: '18px', fontFamily: 'var(--font-mono)' }}>
            {status.agentName}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Engine LLM</div>
          <div className="stat-value">{status.engine}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Tasks</div>
          <div className="stat-value">
            {tasks.filter(t => t.status === 'RUNNING' || t.status === 'PENDING').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Verifiability Target</div>
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>
            100% Tests
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Tasks */}
        <div className="panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'inline-block' }}></span>
              Execution Task Queue
            </h2>
            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setIsModalOpen(true)}>
              + Enqueue Task
            </button>
          </div>

          <div className="task-list">
            {tasks.map(task => (
              <div key={task.id} className="task-item">
                <div className="task-header">
                  <div className="task-title-group">
                    <span className="task-id">{task.id}</span>
                    <span className="task-title">{task.title}</span>
                  </div>
                  <span className={`badge badge-${task.status.toLowerCase()}`}>
                    {task.status}
                  </span>
                </div>

                <div className="task-progress-container">
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${task.progress}%`,
                        background: task.status === 'FAILED' ? 'var(--color-danger)' : 'var(--gradient-brand)'
                      }}
                    ></div>
                  </div>
                  <span className="task-progress-text">{task.progress}%</span>
                </div>

                <div className="task-footer">
                  <span>Last sync: {task.lastUpdated}</span>
                  <span>Target: Automated Test Suite</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Console Terminal logs */}
        <div className="panel console-panel">
          <h2>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)', display: 'inline-block' }}></span>
            Agent Activity Logs
          </h2>
          <p style={{ fontSize: '12px', marginBottom: '16px' }}>
            Live console stream representing autonomous system execution
          </p>

          <div className="console-output" ref={logContainerRef}>
            {logs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>Awaiting agent startup stream...</div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="console-line">
                  <span className="console-timestamp">[{log.timestamp}]</span>
                  <span className={`console-tag-${log.level.toLowerCase()}`}>
                    [{log.level}]
                  </span>{' '}
                  {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Enqueue Agent Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label" htmlFor="task-title">Task Description / Objective</label>
                <input
                  id="task-title"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Implement OAuth2 integration tests"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit to Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
