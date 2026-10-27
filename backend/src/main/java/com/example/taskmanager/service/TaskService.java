package com.example.taskmanager.service;

import com.example.taskmanager.dto.TaskRequest;
import com.example.taskmanager.dto.TaskResponse;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public List<TaskResponse> getAllTasksForUser(String userEmail) {
        User user = getAuthenticatedUser(userEmail);
        return taskRepository.findByUserOrderByIdDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse createTask(TaskRequest request, String userEmail) {
        User user = getAuthenticatedUser(userEmail);

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setStatus(request.getStatus() != null && !request.getStatus().isBlank() ? request.getStatus() : "Pending");
        task.setUser(user);

        Task saved = taskRepository.save(task);
        return mapToResponse(saved);
    }

    public TaskResponse updateTask(Long id, TaskRequest request, String userEmail) {
        User user = getAuthenticatedUser(userEmail);

        // Ownership check: task must belong to this authenticated user
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found or access denied with id: " + id));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            task.setStatus(request.getStatus());
        }

        Task updated = taskRepository.save(task);
        return mapToResponse(updated);
    }

    public void deleteTask(Long id, String userEmail) {
        User user = getAuthenticatedUser(userEmail);

        // Ownership check: task must belong to this authenticated user
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found or access denied with id: " + id));

        taskRepository.delete(task);
    }

    private TaskResponse mapToResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getStatus()
        );
    }
}
