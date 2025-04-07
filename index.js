// TASK: import helper functions from utils
// TASK: import initialData
import { getTasks, createNewTask, deleteTask } from './utils/taskFunctions.js';
import { initialData} from './initialData.js';
/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(initialData)); 
    localStorage.setItem('showSideBar', 'true')
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
  editButtons: document.querySelectorAll('edit-task-div-button-group'),
  editSaveBtn: document.getElementById('save-task-changes-btn'),
  editCancelBtn: document.getElementById('cancel-edit-btn'),
  cancelDeleteBtn: document.getElementById('delete-task-btn'),
  filterDiv: document.getElementById('filterDiv')
}

let activeBoard = "";

// Extracts unique board names from tasks
// TASK: FIX BUGS

function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"));
    activeBoard = localStorageBoard ? localStorageBoard.activeboards :boards[0];
    elements.headerBoardName.textContent = activeBoard
    styleActiveBoard(activeBoard)
    refreshTasksUI();

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
      filterAndDisplayTasksByBoard(board); // Filter and display tasks for the selected board
      activeBoard = board;
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard)); // Assigns active board
      styleActiveBoard(activeBoard); // Style the active board button
  });

  boardContainer.appendChild(boardElement); // Append the board button to the container
  });  
}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter(task => task.board === boardName); // Filter tasks by board name

  elements.columnDivs.forEach(column => {
    const status = column.getAttribute("data-status");
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4> 
                          </div>`;
    const tasksContainer = document.createElement("div")
    tasksContainer.className = "task-container";
    column.appendChild(tasksContainer);

    filteredTasks.filter(task => task.status === status).forEach(task => {
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute('data-task-id', task.id);
      taskElement.addEventListener("click", () => {
        openEditTaskModal(task);
      });

      tasksContainer.appendChild(taskElement);
    });
  });
}

function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  document.querySelectorAll('.board-btn').forEach(btn => { 
    
    btn.classList.remove('active-board-btn');
    if(btn.textContent === boardName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function addTaskToUI(task) {
  const column = document.querySelector(`.column-div[data-status="${task.status}"]`); 
  if (!column) return;

  let tasksContainer = elements.tasksContainers.values;
  if (!tasksContainer) {
    console.warn(`Task container not found for status: ${task.status}. Creating a new one.`);
    tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks-container';
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement('div');
  taskElement.className = 'task-div';
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute('data-task-id', task.id);
  taskElement.addEventListener('click', () => openEditTaskModal(task));

  tasksContainer.appendChild(taskElement); // Append the new task element to the tasks container  
  };

function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = elements.editCancelBtn;
  cancelEditBtn.addEventListener("click", () => toggleModal(false, elements.editTaskModal));  
  // Cancel adding new task event listener
  const cancelAddTaskBtn = elements.cancelAddTaskBtn;
  cancelAddTaskBtn.addEventListener('click', () => { toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Show sidebar event listener
  elements.hideSideBarBtn.addEventListener("click", () => toggleSidebar(false));
  elements.showSideBarBtn.addEventListener("click", () => toggleSidebar(true));

  // Theme switch event listener
  elements.themeSwitch.addEventListener('change', toggleTheme);

  // Show Add New Task Modal event listener
  elements.createTaskBtn.addEventListener('click', () => { toggleModal(true);
    elements.filterDiv.style.display = 'block'; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.newTaskModal.addEventListener('submit', addTask);
}

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? 'block':'none'; 
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault();
  console.log("Add Task function triggered!");

  const newTextInput = elements.newTextInput.value.trim();
  const descriptionInput = elements.descriptionInput.value.trim();
  const newSelectStatus = elements.newSelectStatus.value;

  if (!newTextInput || !descriptionInput) return;
  
  //Assign user input to the task object
    const task = {
      newTextInput,
      descriptionInput,
      newSelectStatus,
      board: activeBoard,
      
    };
    const newTask = createNewTask(task);
    if (newTask) {
      addTaskToUI(newTask);
      toggleModal(false);
      elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
      event.target.reset();
      refreshTasksUI();
    }
};

function toggleSidebar(show) {
  elements.navSideBar.style.display = show ? 'flex' : 'none';
  elements.showSideBarBtn.style.display = show ? 'none': 'block';
  localStorage.setItem('showSideBar', show);
  if (show) {
    elements.sideLogo.src = './assets/logo-light.svg';
    elements.logo.src = './assets/logo-light.svg';
  } else {
    elements.sideLogo.src = './assets/logo-dark.svg';
    elements.logo.src = './assets/logo-dark.svg';
  }
}

function toggleTheme() {
 if (this.checked) {
  // Apply light theme
  document.body.classList.add('light-theme');
  localStorage.setItem('light-theme', 'enabled')
  elements.logo.src = './assets/logo-light.svg';
 } else {
  // Apply dark theme
  document.body.classList.remove('light-theme');
  localStorage.setItem('light-theme', 'diabled')
  elements.logo.src = './assets/logo-dark.svg';
  // Revert to the default logo
 }
 localStorage.setItem('light-theme', lightThemeEnabled ? 'enable' : 'disabled');
}

function openEditTaskModal(task) {
  // Set task details in modal inputs
  elements.editInput.value = task.title;
  elements.editTextArea.value = task.description;
  elements.editSelectStatus.value = task.status;

  // Get button elements from the task modal
  toggleModal(true, elements.editTaskModal);
  elements.filterDiv.style.display = 'block'; // Show the filter overlay
  elements.editTaskModal.style.display = 'block'; // Show the edit task modal
  // Call saveTaskChanges upon click of Save Changes button
  elements.editButtons.onclick = () => {
    saveTaskChanges(task.id);
  };
  // Delete task using a helper function and close the task modal
 elements.editButtons.onclick = () => {
  const editSaveBtn= document.getElementById('save-task-changes-btn');
  const editCancelBtn = document.getElementById('cancel-edit-btn');
  const cancelDeleteBtn = document.getElementById('delete-task-btn');

  editSaveBtn.style.display = 'block';

  cancelDeleteBtn.onclick = () => {
    editSaveBtn.style.display = 'none';
  };

  editCancelBtn.onclick = () => {
    deleteTask(task.id);
    editSaveBtn.style.display = 'none';

    toggleModal(true, elements.editTaskModal);
    elements.filterDiv.style.display = 'none';
    toggleModal(false, elements.editTaskModal);

    init();
  };
 };
};

function saveTaskChanges(taskId) {
  // Get new user inputs
  let titleVal = elements.editInput.value.trim();
  let descVal = elements.editTextArea.value.trim();
  let statusVal = elements.editSelectStatus.value;

  // Create an object with the updated task details
  const updatedTask = {
    title: titleVal,
    description: descVal,
    status: statusVal,
    board: JSON.parse(localStorage.getItem("activeBoard")).board, // Get the active board from local storage
  };

  // Update task using a helper function
  updatedTask(taskId, updatedTask);

  // Close the modal and refresh the UI to reflect the changes
  toggleModal(false, elements.editTaskModal);
  elements.filterDiv.style.display = 'none';
  refreshTasksUI();
}

/*************************************************************************************************************************************************/


document.addEventListener('DOMContentLoaded', function() {
  initializeData();
  fetchAndDisplayBoardsAndTasks();
  setupEventListeners(); // Render tasks when the page loads
  init();
});


function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);

  const isLightTheme = localStorage.getItem('light-theme') === 'enabled';
  document.body.classList.toggle('light-theme', isLightTheme);
  elements.themeSwitch.checked = isLightTheme;
  elements.logo.src = isLightTheme ? './assets/logo-light.svg' : './assets/logo-dark.svg';

  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}