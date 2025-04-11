// TASK: import helper functions from utils
// TASK: import initialData
import { getTasks, createNewTask, deleteTask } from './utils/taskFunctions.js'; // Added updateTask
import { initialData } from './initialData.js';

/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  const task = localStorage.getItem('tasks');
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(initialData));
    localStorage.setItem('showSideBar', 'true');
    localStorage.setItem('activeBoard', JSON.stringify(''));
    console.log('Initialized with initialData');
  } else {
    console.log('Data already exists in localStorage');
  }
}
initializeData();

// TASK: Get elements from the DOM
const elements = {
  navSideBar: document.getElementById('side-bar-div'),
  sideLogo: document.getElementById('side-logo-div'),
  logo: document.getElementById('logo'),
  boardsNav: document.getElementById('boards-nav-links-div'),
  sideBarButton: document.querySelector('.toggle-div'),
  sideBar: document.querySelector('.side-bar-bottom'),
  hideSideBar: document.querySelector('.hide-side-bar'),
  hideSideBarBtn: document.getElementById('hide-side-bar-btn'),
  showSideBarBtn: document.getElementById('show-side-bar-btn'),
  themeSwitch: document.getElementById('switch'),
  headerName: document.querySelector('.header-name-div'),
  headerBoardName: document.getElementById('header-board-name'),
  dropDownBtn: document.getElementById('dropdownBtn'),
  addTaskBtn: document.getElementById('add-new-task-btn'),
  editBtn: document.getElementById('edit-board-btn'),
  editBoardDiv: document.querySelector('.editBtnsDiv'),
  editBtns: document.getElementById('deleteBoardBtn'),
  container: document.querySelector('.card-column-main'),
  columnDivs: document.querySelectorAll('.column-div'),
  todoHead: document.getElementById('todo-head-div'),
  toDoDot: document.getElementById('todo-dot'),
  columnHead: document.getElementById('toDoText'),
  tasksContainers: document.querySelectorAll('.tasks-container'),
  doingHead: document.getElementById('doing-head-div'),
  doingDot: document.getElementById('doing-dot'),
  doingText: document.getElementById('doingText'),
  doneColumn: document.querySelector('.column-div'),
  doneHead: document.getElementById('done-head-div'),
  doneDot: document.getElementById('done-dot'),
  doneText: document.getElementById('doneText'),
  newTaskModal: document.getElementById('new-task-modal-window'),
  newInputDiv: document.querySelector('.input-div'),
  modalTitleInput: document.getElementById('modal-title-input'),
  newTextInput: document.getElementById('title-input'),
  inputDiv: document.querySelector('.input-div'),
  descriptionInput: document.getElementById('modal-desc-input'),
  newTextArea: document.getElementById('desc-input'),
  selectInput: document.querySelector('.input-div'),
  modalSelectStatus: document.getElementById('modal-select-status'),
  newSelectStatus: document.getElementById('select-status'),
  newButtons: document.querySelector('.button-group'),
  createTaskBtn: document.getElementById('create-task-btn'),
  cancelAddTaskBtn: document.getElementById('cancel-add-task-btn'),
  editTaskModal: document.querySelector('.edit-task-modal-window'),
  editForm: document.getElementById('edit-task-form'),
  editTaskDiv: document.getElementById('edit-task-header'),
  editInput: document.getElementById('edit-task-title-input'),
  editBtn: document.getElementById('edit-btn'),
  editTask: document.querySelector('.edit-task-div'),
  editTextArea: document.getElementById('edit-task-desc-input'),
  editDiv: document.querySelector('.edit-task-div'),
  editLabel: document.querySelector('.label-modal-window'),
  editSelectStatus: document.getElementById('edit-select-status'),
  editButtons: document.querySelectorAll('.edit-task-div-button-group'), 
  editSaveBtn: document.getElementById('save-task-changes-btn'),
  editCancelBtn: document.getElementById('cancel-edit-btn'),
  cancelDeleteBtn: document.getElementById('delete-task-btn'),
  filterDiv: document.getElementById('filterDiv')
};

let activeBoard = "";

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard")) || boards[0];
    activeBoard = localStorageBoard ? localStorageBoard : boards[0];
    elements.headerBoardName.textContent = activeBoard;
    console.log('Active Board set to:', activeBoard);
    styleActiveBoard(activeBoard);
    refreshTasksUI();
  } else {
    console.log('No boards found.');
  }
};

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardContainer = elements.boardsNav;
  boardContainer.innerHTML = `<h4 id="headline-sidepanel">ALL BOARDS</h4>`; // Clear existing boards
  boards.forEach(board => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener("click", () => {
      elements.headerBoardName.textContent = board;
      activeBoard = board;
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard));
      console.log('Switched to board:', board);
      filterAndDisplayTasksByBoard(board);
      styleActiveBoard(activeBoard);
    });

    boardContainer.appendChild(boardElement);
  });
}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  console.log('Filtering tasks for board:', boardName);
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.board === boardName);

  elements.columnDivs.forEach(column => {
    const status = column.getAttribute("data-status");
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;
    const tasksContainer = document.createElement("div");
    tasksContainer.className = "tasks-container";
    column.appendChild(tasksContainer);

    filteredTasks.filter(task => task.status === status).forEach(task => {
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute('data-task-id', task.id);
      taskElement.addEventListener("click", () => {
        console.log('Opening edit modal for task:', task.title);
        openEditTaskModal(task);
      });

      tasksContainer.appendChild(taskElement);
    });
  });
}

function refreshTasksUI() {
  console.log('Refreshing UI for board:', activeBoard);
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  document.querySelectorAll('.board-btn').forEach(btn => {
    btn.classList.remove('active-board-btn');
    if (btn.textContent === boardName) {
      btn.classList.add('active');
      console.log('Styled active board:', boardName);
    } else {
      btn.classList.remove('active');
    }
  });
}

function addTaskToUI(task) {
  console.log('Adding task to UI:', task.title);
  const column = document.querySelector(`.column-div[data-status="${task.status}"]`);
  if (!column) {
    console.warn(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector('.tasks-container');
  if (!tasksContainer) {
    console.warn(`Task container not found for status: ${task.status}. Creating a new one.`);
    tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks-container';
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement('div');
  taskElement.className = 'task-div';
  taskElement.textContent = task.title;
  taskElement.setAttribute('data-task-id', task.id);
  taskElement.addEventListener('click', () => {
    console.log('Task clicked:', task.title);
    openEditTaskModal(task);
  });

  tasksContainer.appendChild(taskElement);
}

function setupEventListeners() {
  // Cancel editing task event listener
  elements.editCancelBtn.addEventListener("click", () => {
    console.log('Cancel edit clicked');
    toggleModal(false, elements.editTaskModal);
    elements.filterDiv.style.display = 'none';
  });

  // Cancel adding new task event listener
  elements.cancelAddTaskBtn.addEventListener('click', () => {
    console.log('Cancel add task clicked');
    toggleModal(false, elements.newTaskModal);
    elements.filterDiv.style.display = 'none';
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener('click', () => {
    console.log('Clicked outside modal');
    toggleModal(false);
    elements.filterDiv.style.display = 'none';
  });

  // Show sidebar event listener
  elements.hideSideBarBtn.addEventListener("click", () => toggleSidebar(false));
  elements.showSideBarBtn.addEventListener("click", () => toggleSidebar(true));

  // Theme switch event listener
  elements.themeSwitch.addEventListener('change', toggleTheme);

  // Show Add New Task Modal event listener
  elements.addTaskBtn.addEventListener('click', () => {
    console.log('Add task button clicked');
    toggleModal(true, elements.newTaskModal);
    elements.filterDiv.style.display = 'block';
  });

  // Add new task form submission event listener
  elements.newTaskModal.addEventListener('submit', (e) => addTask(e));
}

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.newTaskModal) {
  modal.style.display = show ? 'block' : 'none';
  console.log(`Toggling modal ${modal.id} to ${show ? 'visible' : 'hidden'}`);
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault();
  console.log("Add Task function triggered!");

  const title = elements.newTextInput.value.trim();
  const description = elements.newTextArea.value.trim();
  const status = elements.newSelectStatus.value;

  if (!title || !description) {
    console.warn('Title or description missing');
    return;
  }
  if (!activeBoard) {
    console.error('No active board selected');
    return;
  }

  const task = {
    title: title,
    description: description,
    status: status,
    board: activeBoard,
    id: Date.now().toString() // Simple unique ID
  };

  console.log('Task vaules:', task);
  const newTask = createNewTask(task);
  if (newTask) {
    console.log('New task created:', newTask);
    addTaskToUI(newTask);
    toggleModal(false, elements.newTaskModal);
    elements.filterDiv.style.display = 'none';
    event.target.reset();
    refreshTasksUI();
  } else {
    console.error('Failed to create new task');
  }
}

function toggleSidebar(show) {
  elements.navSideBar.style.display = show ? 'flex' : 'none';
  elements.showSideBarBtn.style.display = show ? 'none' : 'block';
  localStorage.setItem('showSideBar', show);
  if (show) {
    elements.sideLogo.src = './assets/logo-light.svg';
    elements.logo.src = './assets/logo-light.svg';
    console.log('Sidebar shown');
  } else {
    elements.sideLogo.src = './assets/logo-dark.svg';
    elements.logo.src = './assets/logo-dark.svg';
    console.log('Sidebar hidden');
  }
}

function toggleTheme() {
  if (this.checked) {
    document.body.classList.add('light-theme');
    localStorage.setItem('light-theme', 'enabled');
    elements.logo.src = './assets/logo-light.svg';
    console.log('Switched to light theme');
  } else {
    document.body.classList.remove('light-theme');
    localStorage.setItem('light-theme', 'disabled');
    elements.logo.src = './assets/logo-dark.svg';
    console.log('Switched to dark theme');
  }
}

function openEditTaskModal(task) {
  console.log('Opening edit modal for task:', task.title);
  // Set task details in modal inputs
  elements.editInput.value = task.title;
  elements.editTextArea.value = task.description;
  elements.editSelectStatus.value = task.status;

  console.log('Edit modal element:', elements.editTaskModal);
  toggleModal(true, elements.editTaskModal);
  elements.filterDiv.style.display = 'block';

  // Set up event listeners for the buttons in the edit modal
  console.log('Edit save button:', elements.editSaveBtn);
  elements.editSaveBtn.onclick = () => {
    console.log('Save button clicked for task ID:', task.id);saveTaskChanges(task.id);
  };

  elements.editCancelBtn.onclick = () => {
    console.log('Edit canceled');
    toggleModal(false, elements.editTaskModal);
    elements.filterDiv.style.display = 'none';
  };
  elements.cancelDeleteBtn.onclick = () => {
    console.log('Delete task requested:', task.title);
    deleteTask(task.id);
    toggleModal(false, elements.editTaskModal);
    elements.filterDiv.style.display = 'none';
    refreshTasksUI();
  };
}

function saveTaskChanges(taskId) {
  console.log('Saving changes for task ID:', taskId);
  const updatedTask = {
    title: elements.editInput.value.trim(),
    description: elements.editTextArea.value.trim(),
    status: elements.editSelectStatus.value,
    board: activeBoard,
    id: taskId
  };

  let tasks = getTasks();
  tasks = tasks.map(task =>
    task.id === taskId ? updatedTask : task
  );
  localStorage.setItem('tasks', JSON.stringify(tasks));

  toggleModal(false, elements.editTaskModal);
  elements.filterDiv.style.display = 'none';
  console.log('Task updated:', updatedTask);
  refreshTasksUI();
}

/*************************************************************************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  initializeData();
  fetchAndDisplayBoardsAndTasks();
  setupEventListeners();
  init();
});

function init() {
  console.log('Initializing application');
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);

  const isLightTheme = localStorage.getItem('light-theme') === 'enabled';
  document.body.classList.toggle('light-theme', isLightTheme);
  elements.themeSwitch.checked = isLightTheme;
  elements.logo.src = isLightTheme ? './assets/logo-light.svg' : './assets/logo-dark.svg';

  fetchAndDisplayBoardsAndTasks();
}