import React, { useState, useEffect } from 'react';

const TaskForm = ({ currentTask, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Pending');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title || '');
      setDescription(currentTask.description || '');
      setDueDate(currentTask.dueDate || '');
      setStatus(currentTask.status || 'Pending');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('Pending');
    }
    setFormError('');
  }, [currentTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Task title is required.');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
      status
    });
  };

  return (
    <div className="form-card">
      <h2>{currentTask ? 'Edit Task' : 'Add New Task'}</h2>
      {formError && <div className="alert alert-danger">{formError}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task Title *</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Finish Sprint Report"
            required
          />
        </div>

        <div className="form-group">
          <label>Short Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add relevant notes or details..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {currentTask ? 'Update Task' : 'Add Task'}
          </button>
          {currentTask && (
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
