document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  if (taskForm) {
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = document.getElementById('task').value;
      const status = document.getElementById('status').value;
      const deadline = document.getElementById('deadline').value;

      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.push({ task, status, deadline });
      localStorage.setItem('tasks', JSON.stringify(tasks));

      taskForm.reset();
      alert('Task added!');
    });
  }

  // Load tasks into table
  const tableBody = document.getElementById('taskTableBody');
  if (tableBody) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach((taskObj, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${taskObj.task}</td>
        <td>${taskObj.status}</td>
        <td>${new Date(taskObj.deadline).toLocaleString()}</td>
        <td>
          <button class="edit">Edit</button>
          <button class="delete" data-index="${index}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Delete button
    tableBody.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete')) {
        const index = e.target.dataset.index;
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        location.reload();
      } else if (e.target.classList.contains('edit')) {
        const index = e.target.parentElement.querySelector('.delete').dataset.index;
        const task = tasks[index];
        
        // Create edit form
        const row = e.target.closest('tr');
        row.innerHTML = `
          <td><input type="text" value="${task.task}" class="edit-input"></td>
          <td>
            <select class="edit-select">
              <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="Ongoing" ${task.status === 'Ongoing' ? 'selected' : ''}>Ongoing</option>
              <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
            </select>
          </td>
          <td><input type="datetime-local" value="${task.deadline.slice(0, 16)}" class="edit-input"></td>
          <td>
            <button class="save" data-index="${index}">Save</button>
            <button class="cancel">Cancel</button>
          </td>
        `;
      } else if (e.target.classList.contains('save')) {
        const index = e.target.dataset.index;
        const row = e.target.closest('tr');
        const inputs = row.querySelectorAll('.edit-input');
        const select = row.querySelector('.edit-select');
        
        tasks[index] = {
          task: inputs[0].value,
          status: select.value,
          deadline: inputs[1].value
        };
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        location.reload();
      } else if (e.target.classList.contains('cancel')) {
        location.reload();
      }
    });
  }
});
