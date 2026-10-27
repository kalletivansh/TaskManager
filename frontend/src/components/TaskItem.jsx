import React from 'react';

const TaskItem = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const isCompleted = task.status === 'Completed';

  return (
    <div className={`task-card ${isCompleted ? 'completed' : 'pending'}`}>
      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-desc">{task.description}</p>}
        <div className="task-meta">
          <span className={`badge ${isCompleted ? 'badge-completed' : 'badge-pending'}`}>
            {task.status}
          </span>
          {task.dueDate && (
            <span className="task-due">Due: {task.dueDate}</span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          onClick={() => onToggleStatus(task)}
          className={`btn ${isCompleted ? 'btn-status-pending' : 'btn-status-completed'}`}
          title="Click to toggle status"
        >
          {isCompleted ? 'Mark Pending' : 'Mark Done'}
        </button>
        <button
          onClick={() => onEdit(task)}
          className="btn btn-secondary"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
