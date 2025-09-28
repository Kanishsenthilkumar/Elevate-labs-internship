document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const taskTitleInput = document.getElementById('task-title-input');
    const taskDueDateInput = document.getElementById('task-due-date-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let tasks = [];
    let currentFilter = 'all';

    // --- Utility Functions ---

    // Format date-time for display
    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Calculate countdown string
    const getCountdownString = (dueDate) => {
        if (!dueDate) return '';
        const now = new Date();
        const targetDate = new Date(dueDate);
        const diff = targetDate.getTime() - now.getTime();

        if (diff < 0) return ''; // Already overdue, handled by 'overdue' class

        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        let countdown = [];
        if (days > 0) countdown.push(`${days}d`);
        if (hours > 0) countdown.push(`${hours}h`);
        if (minutes > 0) countdown.push(`${minutes}m`);
        if (seconds > 0 && days === 0 && hours === 0 && minutes < 5) countdown.push(`${seconds}s`); // Show seconds only if close

        return countdown.length > 0 ? `(${countdown.join(' ')})` : '';
    };


    // --- Core Functions ---

    // 1. Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeIcon.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
    }

    // 2. Task Management & Persistence
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateProgress();
        showEmptyState();
    }

    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            renderTasks();
        }
        showEmptyState();
        updateProgress();
    }

    function addTask() {
        const title = taskTitleInput.value.trim();
        const dueDateISO = taskDueDateInput.value;

        if (title === '') {
            showToast('Task title cannot be empty!', 'error');
            return;
        }

        const newTask = {
            id: Date.now(),
            title,
            completed: false,
            dueDate: dueDateISO || null,
        };

        tasks.unshift(newTask);
        saveTasks();
        taskTitleInput.value = '';
        taskDueDateInput.value = '';
        renderTasks();
        showToast('Task added successfully!', 'success');
    }

    function toggleComplete(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
            showToast(task.completed ? 'Task completed!' : 'Task marked active.', 'info');
        }
    }

    function deleteTask(id) {
        const taskElement = document.getElementById(`task-${id}`);
        taskElement.classList.add('removing');
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
            showToast('Task deleted successfully.', 'success');
        }, 500);
    }

    // 3. UI Rendering & Updates
    function renderTasks() {
        taskList.innerHTML = '';
        let filteredTasks = tasks;

        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(t => t.completed);
        } else if (currentFilter === 'overdue') {
            const now = new Date();
            filteredTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && !t.completed);
        }

        if (filteredTasks.length === 0 && tasks.length > 0) {
            const noMatchMsg = document.createElement('p');
            noMatchMsg.className = 'empty-state';
            noMatchMsg.textContent = 'No tasks match the current filter.';
            taskList.appendChild(noMatchMsg);
            emptyState.classList.add('hidden');
        } else if (filteredTasks.length === 0) {
            showEmptyState();
        } else {
            filteredTasks.forEach(task => {
                const taskCard = createTaskElement(task);
                taskList.appendChild(taskCard);
            });
            emptyState.classList.add('hidden');
        }
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-card ${task.completed ? 'completed' : ''}`;
        li.id = `task-${task.id}`;
        li.draggable = true;

        const now = new Date();
        const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
        const isOverdue = taskDueDate && taskDueDate < now && !task.completed;

        li.innerHTML = `
            <div class="checkbox" data-id="${task.id}"></div>
            <div class="task-content">
                <span class="task-title">${task.title}</span>
                <div class="task-metadata">
                    ${task.dueDate ? `<span class="due-date ${isOverdue ? 'overdue' : ''}">Due: ${formatDateTime(task.dueDate)}</span>` : ''}
                    <span class="countdown"></span>
                </div>
            </div>
            <div class="task-actions">
                <button class="action-btn delete-btn" data-id="${task.id}">🗑️</button>
            </div>
        `;

        li.querySelector('.checkbox').addEventListener('click', () => toggleComplete(task.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

        return li;
    }

    function updateProgress() {
        if (tasks.length === 0) {
            progressBar.style.width = '0%';
            progressText.textContent = '0%';
            return;
        }
        const completedCount = tasks.filter(t => t.completed).length;
        const progress = (completedCount / tasks.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
    }

    function showEmptyState() {
        if (tasks.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    }

    // 4. Filters & Events
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTasks();
        });
    });

    addTaskBtn.addEventListener('click', addTask);
    taskTitleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // 5. Drag & Drop Reordering
    let dragSrcEl = null;

    function handleDragStart(e) {
        this.classList.add('dragging');
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.id);
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDrop(e) {
        e.stopPropagation();
        const draggedId = e.dataTransfer.getData('text/plain');
        const draggedEl = document.getElementById(draggedId);
        if (dragSrcEl !== this && draggedEl) {
            const draggedTask = tasks.find(t => `task-${t.id}` === draggedId);
            const targetTask = tasks.find(t => `task-${t.id}` === this.id);

            const draggedIndex = tasks.indexOf(draggedTask);
            const targetIndex = tasks.indexOf(targetTask);

            tasks.splice(draggedIndex, 1);
            tasks.splice(targetIndex, 0, draggedTask);
            saveTasks();
            renderTasks();
        }
        return false;
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
    }

    taskList.addEventListener('dragstart', handleDragStart, false);
    taskList.addEventListener('dragover', handleDragOver, false);
    taskList.addEventListener('drop', handleDrop, false);
    taskList.addEventListener('dragend', handleDragEnd, false);

    // 6. Toast Notifications
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Initial load
    loadTasks();

    // Interval to update countdown and overdue status
    setInterval(() => {
        const now = new Date();
        document.querySelectorAll('.task-card').forEach(card => {
            const taskId = parseInt(card.id.replace('task-', ''));
            const task = tasks.find(t => t.id === taskId);

            if (!task || task.completed) return;

            const dueDateSpan = card.querySelector('.due-date');
            const countdownSpan = card.querySelector('.countdown');

            if (task.dueDate) {
                const taskDueDate = new Date(task.dueDate);

                if (taskDueDate < now && !card.classList.contains('overdue')) {
                    dueDateSpan.classList.add('overdue');
                } else if (taskDueDate >= now && card.classList.contains('overdue')) {
                    dueDateSpan.classList.remove('overdue');
                }

                countdownSpan.textContent = getCountdownString(task.dueDate);
            } else {
                if (dueDateSpan) dueDateSpan.classList.remove('overdue');
                if (countdownSpan) countdownSpan.textContent = '';
            }
        });
    }, 1000);
});