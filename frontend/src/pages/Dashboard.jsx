import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'PENDING', 'COMPLETED'
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const userEmail = localStorage.getItem('userEmail') || 'User';

  const showFeedbackMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 4000);
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/tasks');
      setTasks(res.data);
    } catch (err) {
      showFeedbackMessage('Failed to load tasks from server.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // Update task
        const res = await api.put(`/api/tasks/${editingTask.id}`, taskData);
        setTasks(tasks.map((t) => (t.id === editingTask.id ? res.data : t)));
        setEditingTask(null);
        showFeedbackMessage('Task updated successfully!', 'success');
      } else {
        // Create new task
        const res = await api.post('/api/tasks', taskData);
        setTasks([res.data, ...tasks]);
        showFeedbackMessage('Task added successfully!', 'success');
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to save task. Please try again.';
      showFeedbackMessage(errorMsg, 'danger');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
      if (editingTask && editingTask.id === id) {
        setEditingTask(null);
      }
      showFeedbackMessage('Task deleted successfully!', 'success');
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to delete task. Please try again.';
      showFeedbackMessage(errorMsg, 'danger');
    }
  };

  const handleToggleStatus = async (task) => {
    const updatedStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await api.put(`/api/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: updatedStatus
      });
      setTasks(tasks.map((t) => (t.id === task.id ? res.data : t)));
      showFeedbackMessage(
        `Task marked as ${updatedStatus}!`,
        'success'
      );
    } catch (err) {
      showFeedbackMessage('Failed to change task status.', 'danger');
    }
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'PENDING') return task.status === 'Pending';
    if (filter === 'COMPLETED') return task.status === 'Completed';
    return true;
  });

  return (
    <div>
      <Navbar email={userEmail} onLogout={handleLogout} />

      <main className="dashboard-container">
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Task Create / Edit Form */}
        <TaskForm
          currentTask={editingTask}
          onSave={handleSaveTask}
          onCancel={() => setEditingTask(null)}
        />

        {/* Filter and Overview Bar */}
        <div className="filter-bar">
          <h3>
            My Tasks ({tasks.length})
          </h3>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilter('ALL')}
            >
              All ({tasks.length})
            </button>
            <button
              className={`filter-btn ${filter === 'PENDING' ? 'active' : ''}`}
              onClick={() => setFilter('PENDING')}
            >
              Pending ({tasks.filter((t) => t.status === 'Pending').length})
            </button>
            <button
              className={`filter-btn ${filter === 'COMPLETED' ? 'active' : ''}`}
              onClick={() => setFilter('COMPLETED')}
            >
              Completed ({tasks.filter((t) => t.status === 'Completed').length})
            </button>
          </div>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="empty-state">Loading your tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            No tasks found in this view. Create one above!
          </div>
        ) : (
          <div className="task-grid">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={(t) => setEditingTask(t)}
                onDelete={handleDeleteTask}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
