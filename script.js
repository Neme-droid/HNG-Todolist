document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todoForm');
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Render tasks on page load
    renderTasks();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask();
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task');
            return;
        }

        const priority = prioritySelect.value;
        const date = dateInput.value;
        const time = timeInput.value;

        const newTask = {
            id: Date.now(),
            text: taskText,
            priority,
            date,
            time,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        form.reset();
    }

    function renderTasks() {
        if (tasks.length === 0) {
            emptyState.style.display = 'block';
            taskList.innerHTML = '';
        } else {
            emptyState.style.display = 'none';
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const taskElement = createTaskElement(task);
                taskList.appendChild(taskElement);
            });
        }
    }

    function createTaskElement(task) {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;
        div.dataset.id = task.id;

        // Checkbox for completion
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            toggleComplete(task.id);
        });

        // Task info container
        const infoDiv = document.createElement('div');
        infoDiv.className = 'task-info';

        // Task text
        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;
        infoDiv.appendChild(textSpan);

        // Priority badge
        const priorityBadge = document.createElement('span');
        priorityBadge.className = `priority-badge priority-${task.priority}`;
        priorityBadge.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
        infoDiv.appendChild(priorityBadge);

        // Due date and time
        if (task.date || task.time) {
            const dueDiv = document.createElement('div');
            dueDiv.className = 'due-info';
            const datePart = task.date ? new Date(task.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
            const timePart = task.time ? new Date(`1970-01-01T${task.time}`).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '';
            dueDiv.textContent = `Due: ${datePart} ${timePart}`.trim();
            infoDiv.appendChild(dueDiv);
        }

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-button';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.title = 'Delete';
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });

        // Assemble
        div.appendChild(checkbox);
        div.appendChild(infoDiv);
        div.appendChild(deleteBtn);

        return div;
    }

    function toggleComplete(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasks();
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});