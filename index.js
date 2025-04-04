// TASK: import helper functions from utils
// TASK: import initialData
import {initialData} from './initialData.js';
import {getTasks, createNewTask, patchTask, putTask, deleteTask} from './utils/taskFunctions.js';

/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem('tasks') || localStorage.getItem('tasks') === 'null') {
    if (typeof initialData !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(initialData)); 
      localStorage.setItem('showSideBar', 'true')
    } else {
      console.error('Error: initialData is not defined');
    }
  } else {
    console.log('Data already exists in localStorage');
  }
}
initializeData(); // Call the function to initialize data

// TASK: Get elements from the DOM
const elements = {
  navSideBar: document.getElementById('side-bar-div'),
  sideLogo: document.getElementById('side-logo'),
  logo: document.getElementById('logo'),
  boardsNav: document.getElementById('boards-nav-links-div'),
  sideBarButton: document.getElementsByClassName('toggle-div'),
  hideSideBarBtn: document.getElementById('hide-side-bar-btn'),
  showSideBarBtn: document.getElementById('show-side-bar-btn'),
  themeSwitch: document.getElementById('switch'),
  headerName: document.getElementById('header-name'),
  headerBoardName: document.getElementById('header-board-name'),
  dropDownBtn: document.getElementById('drop-down-btn'),
  addTaskBtn: document.getElementById('add-new-task-btn'),
  editBtn: document.getElementById('edit-board-btn'),
  editBoardDiv: document.getElementsByClassName('editBtnsDiv'),
  editBtns: document.getElementById('deleteBoardBtn'),
  container: document.getElementsByClassName('card-column-main'),
  columnDiv: document.getElementsByClassName('column-div'),
  todoHead: document.getElementById('todo-head-div'),
  toDoDot: document.getElementById('todo-dot'),
  columnnHead: document.getElementById('toDoText'),
  toDoTasks: document.getElementsByClassName('tasks-container'),
  doingHead: document.getElementById('doing-head-div'),
  doingDot: document.getElementById('doing-dot'),
  doingText: document.getElementById('doingText'),
  doingTasks: document.getElementsByClassName('tasks-container'),
  doneColumn: document.getElementsByClassName('column-div'),
  doneHead: document.getElementById('done-head-div'),
  doneDot: document.getElementById('done-dot'),
  doneText: document.getElementById('doneText'),
  doneTasks: document.getElementsByClassName('tasks-container'),
  newTaskModal: document.getElementById('new-task-modal-window'),
  newInputDiv: document.getElementsByClassName('input-div'),
  modalTitleInput: document.getElementById('modal-title-input'),
  newTextInput: document.getElementById('title-input'),
  inputDiv: document.getElementsByClassName('input-div'),
  descriptionInput: document.getElementById('modal-desc-input'),
  newTextArea: document.getElementById('desc-input'),
  selectInput: document.getElementsByClassName('input-div'),
  modalSelectStatus: document.getElementById('modal-select-status'),
  newSelectStatus: document.getElementById('select-status'),
  newButtons: document.getElementsByClassName('button-group'),
  createTaskBtn: document.getElementById('create-task-btn'),
  cancelAddTaskBtn: document.getElementById('cancel-add-task-btn'),
  editTaskModal: document.getElementById('edit-task-modal-window'),
  editForm: document.getElementById('edit-task-form'),
  editTaskDiv: document.getElementById('edit-task-header'),
  editInput: document.getElementById('edit-task-title-input'),
  editBtn: document.getElementById('edit-btn'),
  editTask: document.getElementsByClassName('edit-task-div'),
  editTextArea: document.getElementById('edit-task-desc-input'),
  editDiv: document.getElementsByClassName('edit-task-div'),
  editLabel: document.getElementsByClassName('label-modal-window'),
  editSelectStatus: document.getElementById('edit-select-status'),
  editButtons: document.getElementsByClassName('edit-task-div-button-group'),
  editSaveBtn: document.getElementById('save-task-changes-btn'),
  editCancelBtn: document.getElementById('cancel-edit-btn'),
  cancelDeleteBtn: document.getElementById('delete-task-btn'),
  filterDiv: document.getElementById('filterDiv')
}

let activeBoard = ""

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {

  const tasks = getTasks();
  const boards = [...new Set(tasks.map(task => task.board).filter
  (Boolean))];

  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"));

    activeBoard = localStorageBoard ? boards[0] : (elements.headerBoardName.textContent);
    styleActiveBoard(activeBoard);
    refreshTasksUI();
  }
}

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ''; // Clears the container
  boards.forEach(board => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener("click", () => { 
      elements.headerBoardName.textContent = board;
      () => filterAndDisplayTasksByBoard(board);
      //Assign active board
      let activeBoard = board; //assigns active board
      localStorage.setItem("activeBoard", JSON.stringify({activeBoard})); // Store the active board in local storage
      styleActiveBoard(activeBoard)
    });
    boardsContainer.appendChild(boardElement); // Append the button to the container
  });

}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter(task => task.board === boardName);

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach(column => {
    const status = column.getAttribute("data-status");
    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

    const tasksContainer = document.createElement("div");
    column.appendChild(tasksContainer);

    filteredTasks.filter(task => task.status === status).forEach(task => { 
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute('data-task-id', task.id);

      // Listen for a click event on each task and open a modal
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
    
    if(btn.textContent === boardName) {
      btn.classList.add('active') 
    }
    else {
      btn.classList.remove('active'); 
    }
  });
}


function addTaskToUI(task) {
  const column = document.querySelector('.column-div[data-status="${task.status}"]'); 
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector('.tasks-container');
  if (!tasksContainer) {
    console.warn(`Tasks container not found for status: ${task.status}, creating one.`);
    tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks-container';
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement('div');
  taskElement.className = 'task-div';
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute('data-task-id', task.id);
  
  tasksContainer.appendChild(taskElement); // Append the new task element to the tasks container
  taskElement.addEventListener('click', () => {
    openEditTaskModal(task); // Open the edit task modal when clicked
  } );

  toggleModal(false, elements.newTaskModal);
  // Clear the input fields after adding the task 
}


function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  cancelEditBtn.addEventListener("click", () => toggleModal(false, elements.editTaskModal));

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById('cancel-add-task-btn');
  cancelAddTaskBtn.addEventListener('click', () => {
    toggleModal(false);
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
  elements.createTaskBtn.addEventListener('click', () => {
    toggleModal(true);
    elements.filterDiv.style.display = 'block'; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.newTaskModal.addEventListener('submit', (event) => {
    addTask(event)
  });
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

  //Assign user input to the task object
    const task = {
      title: elements.newTextInput.value,
      description: elements.descriptionInput.value,
      status: elements.modalSelectStatus.value,
      board: JSON.parse(localStorage.getItem("activeBoard")).board, // Get the active board from local storage
      
    };
    const newTask = createNewTask(task);

    if (newTask) {
      addTaskToUI(newTask);
      toggleModal(false);
      elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
      event.target.reset();
      refreshTasksUI();
    }
}


function toggleSidebar(show) {
  if (show) {
    elements.navSideBar.style.display = 'block';
  } else {
    elements.navSideBar.style.display = 'none';
    elements.showSideBarBtn.style.display = 'block';
  }
}

function toggleTheme() {
 if (this.checked) {
  // Apply light theme
  document.body.classList.add('light-theme');
  localStorage.setItem('light-theme', 'true')
  logo.src = './assets/logo-light.svg';
 } else {
  // Apply dark theme
  document.body.classList.remove('light-theme');
  localStorage.setItem('light-theme', 'false')
  logo.src = './assets/logo-dark.svg';
  // Revert to the default logo
 }
}



function openEditTaskModal(task) {

  // Set task details in modal inputs
  elements.editInput.value = task.title;
  elements.editTextArea.value = task.description;
  elements.editSelectStatus.value = task.status;

  // Get button elements from the task modal
  toggleModal(true, elements.editTaskModal); // Show the edit task modal
  elements.filterDiv.style.display = 'block'; // Show the filter overlay

  // Call saveTaskChanges upon click of Save Changes button
  elements.editSaveBtn.onclick = () => {
    saveTaskChanges(task.id);
  };

  // Delete task using a helper function and close the task modal
 elements.editDeleteBtn.onclick = () => {
  const deleteModal = document.getElementById('delete-task-modal');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

  deleteModal.style.display = 'block';

  cancelDeleteBtn.onclick = () => {
    deleteModal.style.display = 'none';
  };

  confirmDeleteBtn.onclick = () => {
    deleteTask(task.id);
    deleteModal.stylee.display = 'none';

    toggleModal(false, elements.editTaskModal);
    elements.filterDiv.style.display = 'none';

    init();
  };
 };
};

function saveTaskChanges(taskId) {
  // Get new user inputs
  let titleVal = elements.editInput.value;
  let descVal = elements.editTextArea.value;
  let statusVal = elements.editSelectStatus.value;

  // Create an object with the updated task details
  const updatedTask = {
    title: titleVal,
    description: descVal,
    status: statusVal,
    board: JSON.parse(localStorage.getItem("activeBoard")).board, // Get the active board from local storage
  };

  // Update task using a helper function
  patchTask(taskId, updatedTask);

  // Close the modal and refresh the UI to reflect the changes
  toggleModal(false, elements.editTaskModal);
  elements.filterDiv.style.display = 'none';

  refreshTasksUI();
}

/*************************************************************************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  init(); // init is called after the DOM is fully loaded
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);

  const isLightTheme = localStorage.getItem('light-theme') === 'enabled';
  document.body.classList.toggle('light-theme', isLightTheme);
  elements.themeSwitch.checked = isLightTheme;
  logo.src = isLightTheme ? './assets/logo-light.svg' : './assets/logo-dark.svg';

  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}