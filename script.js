// Task Management System
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('newTask');
const taskList = document.getElementById('taskList');
const filterAll = document.getElementById('filterAll');
const filterActive = document.getElementById('filterActive');
const filterCompleted = document.getElementById('filterCompleted');
const taskCount = document.getElementById('taskCount');
const clearCompleted = document.getElementById('clearCompleted');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
  updateActiveFilter();
});

// Form submission
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText) {
    addTask(taskText);
    taskInput.value = '';
    taskInput.focus();
  }
});

// Add new task
function addTask(text) {
  const newTask = {
    id: Date.now(),
    text,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  saveTasks();
}

// Toggle task completion
function toggleCompleted(id) {
  tasks = tasks.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
}

// Delete task
function deleteTask(id) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
  }
}

// Filter tasks
filterAll.addEventListener('click', () => {
  currentFilter = 'all';
  updateActiveFilter();
  renderTasks();
});

filterActive.addEventListener('click', () => {
  currentFilter = 'active';
  updateActiveFilter();
  renderTasks();
});

filterCompleted.addEventListener('click', () => {
  currentFilter = 'completed';
  updateActiveFilter();
  renderTasks();
});

// Clear completed tasks
clearCompleted.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all completed tasks?')) {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
  }
});

// Render tasks based on current filter
function renderTasks() {
  taskList.innerHTML = '';
  
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<p class="text-gray-500 text-center py-4">No tasks found</p>';
    return;
  }

  filteredTasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.className = `task-item bg-white p-3 rounded-lg shadow flex items-center justify-between ${task.completed ? 'opacity-75' : ''}`;
    taskElement.innerHTML = `
      <div class="flex items-center">
        <input type="checkbox" ${task.completed ? 'checked' : ''} 
               onclick="toggleCompleted(${task.id})" 
               class="mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
        <span class="${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}">${task.text}</span>
      </div>
      <button onclick="deleteTask(${task.id})" class="text-red-500 hover:text-red-700">
        <i class="fas fa-trash"></i>
      </button>
    `;
    taskList.appendChild(taskElement);
  });

  updateTaskCount();
}

// Update active filter button styling
function updateActiveFilter() {
  [filterAll, filterActive, filterCompleted].forEach(btn => {
    btn.classList.remove('font-medium', 'text-blue-500');
  });

  if (currentFilter === 'all') filterAll.classList.add('font-medium', 'text-blue-500');
  if (currentFilter === 'active') filterActive.classList.add('font-medium', 'text-blue-500');
  if (currentFilter === 'completed') filterCompleted.classList.add('font-medium', 'text-blue-500');
}

// Update task counter
function updateTaskCount() {
  const activeCount = tasks.filter(task => !task.completed).length;
  const totalCount = tasks.length;
  taskCount.textContent = `${activeCount} of ${totalCount} tasks`;
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Make functions available globally
window.toggleCompleted = toggleCompleted;
window.deleteTask = deleteTask;