// Initialize variables for the note-taking app
let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let clearBtn;
let noteList;

// Initialize elements if on the notes page
if (window.location.pathname === '/notes') {
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelector('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// Get notes from local storage
const getNotes = () => {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  return notes;
};

// Save note to local storage
const saveNote = (note) => {
  const notes = getNotes();
  notes.push(note);
  localStorage.setItem('notes', JSON.stringify(notes));
  console.log("Note saved to local storage:", note); // Log the saved note
};

// Render the active note
const renderActiveNote = () => {
  hide(saveNoteBtn);
  hide(clearBtn);

  // If activeNote has an id, it means it's an existing note
  if (activeNote.id) {
    show(newNoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

// Handle note save
const handleNoteSave = () => {
  // Create a note object from input fields
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
    id: Date.now() // Assign an ID based on the current time
  };
    
  console.log("Saving note:", newNote); // Log the note being saved
  saveNote(newNote);
  noteTitle.value = ''; // Clear the title field
  noteText.value = ''; // Clear the text area
  hide(saveNoteBtn); // Hide the Save button
  hide(clearBtn); // Hide the Clear Form button
  getAndRenderNotes();
  renderActiveNote();
};

// Handle note view
const handleNoteView = (e) => {
  e.preventDefault();
  const noteData = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  activeNote = noteData;
  renderActiveNote();
};

const handleNoteDelete = (e) => {
  e.stopPropagation(); // Prevent the click event from bubbling up
  const noteToDelete = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  const notes = getNotes().filter(note => note.id !== noteToDelete.id); // Filter out the deleted note
  localStorage.setItem('notes', JSON.stringify(notes)); // Update local storage
  renderNoteList(); // Re-render the note list
};

const renderNoteList = () => {
  const notes = getNotes();
  noteList.innerHTML = ''; // Clear existing notes

  if (notes.length === 0) {
    noteList.append(createLi('No saved Notes', false));
  } else {
    notes.forEach((note) => {
      const li = createLi(note.title);
      li.dataset.note = JSON.stringify(note);
      noteList.append(li);
    });
  }
};

// Create list item
const createLi = (text, delBtn = true) => {
  const liEl = document.createElement('li');
  liEl.classList.add('list-group-item');

  const spanEl = document.createElement('span');
  spanEl.classList.add('list-item-title');
  spanEl.innerText = text;
  spanEl.addEventListener('click', handleNoteView);

  liEl.append(spanEl);

  if (delBtn) {
    const delBtnEl = document.createElement('i');
    delBtnEl.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
    delBtnEl.addEventListener('click', handleNoteDelete);
    liEl.append(delBtnEl);
  }

  return liEl;
};

// Get and render notes
const getAndRenderNotes = () => {
  renderNoteList();
};

// Handle new note view
const handleNewNoteView = () => {
  activeNote = {}; // Reset activeNote
  show(saveNoteBtn);
  show(clearBtn);
  renderActiveNote(); // Render the empty fields
}; 

// Handle clear form action
const handleClearForm = () => {
  noteTitle.value = '';
  noteText.value = '';
  hide(saveNoteBtn);
  hide(clearBtn);
  activeNote = {};
  renderActiveNote();
};

// Handle input event to enable display of buttons
const handleRenderBtns = () => {
  if (noteTitle.value || noteText.value) {
    show(saveNoteBtn);
    show(clearBtn);
  } else {
    hide(saveNoteBtn);
    hide(clearBtn);
  }
};

// Event listeners
if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  clearBtn.addEventListener('click', handleClearForm);
  noteForm.addEventListener('input', handleRenderBtns);
}

